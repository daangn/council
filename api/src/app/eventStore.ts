import { type Prisma } from '@prisma/client';
import { type FastifyInstance } from 'fastify';

import { type Member, type Session } from '~/core';

type Aggregate = Session.t | Member.t;

interface EventStore {
  publish<T extends Aggregate>(aggregate: T): Promise<T>;
  publishAny<T extends { [key: string]: unknown }>(obj: T): Promise<T>;
}

export async function setupEventStore(app: FastifyInstance) {
  async function publishInTransaction<T extends Aggregate>(tx: Prisma.TransactionClient, aggregate: T): Promise<T> {
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
        date: new Date(event.date),
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

    return next;
  }

  const eventStore: EventStore = {
    publish(aggregate) {
      return publishInTransaction(app.prisma, aggregate);
    },
    publishAny(obj) {
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
    },
  };

  app.decorate('eventStore', eventStore);
}

declare module 'fastify' {
  interface FastifyInstance {
    eventStore: EventStore;
  }
}
