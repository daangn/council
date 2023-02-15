import { type Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

import { type Member, type Session } from '~/core';

export type Aggregate = Session.t | Member.t;

interface EventStore {
  pull<T extends Aggregate>(aggregateName: T['_RE'], id: string): Promise<T['events']>;
  pullAll<T extends Aggregate>(aggregateName: T['_RE']): Promise<Record<string, T['events']>>;
  pullStream<T extends Aggregate>(aggregateName: T['_RE']): AsyncGenerator<{ id: string; events: T['events'] }, void>;

  publish<T extends Aggregate>(aggregate: T): Promise<T>;
  publishAny<T extends { [key: string]: unknown }>(obj: T): Promise<T>;
}

export async function setupEventStore(app: FastifyInstance) {
  async function publishInTransaction<T extends Aggregate>(tx: Prisma.TransactionClient, aggregate: T): Promise<T> {
    const span = app.tracer.startSpan('publishInTransaction', {
      attributes: {
        'aggregate.name': aggregate._RE,
        'aggregate.id': aggregate.id,
      },
    });

    const events = aggregate.events;
    if (events.length === 0) {
      app.log.debug('events is empty, no effects');
      return aggregate;
    }

    const next: T = {
      ...aggregate,
      seq: aggregate.seq + events.length,
      events: [],
    };
    if (!next.state) {
      throw new Error(`Couldn't commit uninitialized aggregate ${aggregate._RE}(${aggregate.id})`);
    }

    await tx.councilEvent.createMany({
      data: events.map((event, i) => ({
        aggregate_name: aggregate._RE,
        stream_id: aggregate.id,
        sequence: aggregate.seq + i + 1,
        data: event,
        date: new Date(event.value.date),
      })),
    });

    // Sync snapshot
    await tx.councilSnapshot.upsert({
      where: {
        aggregate_name_stream_id: {
          aggregate_name: next._RE,
          stream_id: next.id,
        },
      },
      create: {
        aggregate_name: next._RE,
        stream_id: next.id,
        sequence: next.seq,
        state: next.state,
      },
      update: {
        sequence: next.seq,
        state: next.state,
      },
    });

    app.log.debug('aggregate commited %o', next);

    app.log.debug('seq %d -> %d', aggregate.seq, next.seq);
    span.setAttribute('aggregate.prev', aggregate.seq);
    span.setAttribute('aggregate.next', next.seq);

    span.end();

    return next;
  }

  const eventStore: EventStore = {
    async pull<T extends Aggregate>(aggregateName: T['_RE'], streamId: string) {
      const councilEvents = await app.prisma.councilEvent.findMany({
        select: {
          data: true,
        },
        where: {
          aggregate_name: aggregateName,
          stream_id: streamId,
          is_deleted: false,
        },
        orderBy: {
          sequence: 'asc',
        },
      });
      return councilEvents.map((event) => event.data) as T['events'];
    },
    async pullAll<T extends Aggregate>(aggregateName: T['_RE']) {
      const councilEvents = await app.prisma.councilEvent.findMany({
        select: {
          stream_id: true,
          data: true,
        },
        where: {
          aggregate_name: aggregateName,
          is_deleted: false,
        },
        orderBy: {
          sequence: 'asc',
        },
      });
      const eventsMap: Record<string, T['events']> = {};
      for (const event of councilEvents) {
        eventsMap[event.stream_id] ||= [];
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        eventsMap[event.stream_id].push(event.data as any);
      }
      return eventsMap;
    },
    async *pullStream<T extends Aggregate>(aggregateName: T['_RE']) {
      const allStream = await app.prisma.councilEvent.findMany({
        distinct: ['stream_id'],
        select: {
          stream_id: true,
        },
        where: {
          aggregate_name: aggregateName,
          is_deleted: false,
        },
        orderBy: {
          sequence: 'asc',
        },
      });
      for (const eventStream of allStream) {
        const councilEvents = await app.prisma.councilEvent.findMany({
          select: {
            data: true,
          },
          where: {
            stream_id: eventStream.stream_id,
            is_deleted: false,
          },
          orderBy: {
            sequence: 'asc',
          },
        });
        const events = councilEvents.map((event) => event.data) as T['events'];
        yield { id: eventStream.stream_id, events };
      }
      return;
    },
    publish(aggregate) {
      return publishInTransaction(app.prisma, aggregate);
    },
    publishAny(obj) {
      return app.tracer.startActiveSpan('publishAny', async (span) => {
        try {
          return app.prisma.$transaction(async (tx) => {
            const result: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(obj)) {
              if (value && typeof value === 'object' && '_RE' in value) {
                result[key] = await publishInTransaction(tx, value as Aggregate);
              } else {
                result[key] = value;
              }
            }
            return result as typeof obj;
          });
        } finally {
          span.end();
        }
      });
    },
  };

  app.decorate('eventStore', eventStore);
}

declare module 'fastify' {
  interface FastifyInstance {
    eventStore: EventStore;
  }
}
