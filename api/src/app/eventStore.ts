import { type FastifyInstance } from 'fastify';
import { type CouncilAggregate, type CouncilEventStore } from '~/core/Council_Domain.gen';

export async function setupEventStore(app: FastifyInstance) {
  const eventStore: CouncilEventStore = {
    async persist(aggregate) {
      const events = aggregate.VAL.events;
      if (events.length === 0) {
        app.log.debug('events is empty, no effects');
        return aggregate;
      }

      const next = {
        ...aggregate,
        VAL: {
          ...aggregate.VAL,
          seq: aggregate.VAL.seq + events.length,
          events: [],
        },
      } as CouncilAggregate;

      if (!next.VAL.state) {
        throw new Error(`Couldn't commit uninitialized aggregate ${aggregate.NAME}(${aggregate.VAL.id})`);
      }

      await app.prisma.$transaction([
        app.prisma.councilEvent.createMany({
          data: aggregate.VAL.events.map((event, i) => ({
            aggregate_name: aggregate.NAME,
            stream_id: aggregate.VAL.id,
            sequence: aggregate.VAL.seq + i + 1,
            data: event,
            date: new Date(event.date),
          })),
        }),

        // Sync snapshot
        app.prisma.councilSnapshot.upsert({
          where: {
            aggregate_name_stream_id: {
              aggregate_name: next.NAME,
              stream_id: next.VAL.id,
            },
          },
          create: {
            aggregate_name: next.NAME,
            stream_id: next.VAL.id,
            sequence: next.VAL.seq,
            state: next.VAL.state,
          },
          update: {
            sequence: next.VAL.seq,
            state: next.VAL.state,
          },
        }),
      ]);

      app.log.debug('commited %o', next);
      app.log.debug('seq %d -> %d', aggregate.VAL.seq, next.VAL.seq);

      return next;
    },
  };

  app.decorate('eventStore', eventStore);
}

declare module 'fastify' {
  interface FastifyInstance {
    eventStore: CouncilEventStore;
  }
}
