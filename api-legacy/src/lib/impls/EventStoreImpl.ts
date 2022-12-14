import { Domain } from 'src/core';

import { type TransactionClient } from '../db';

interface CreateEventStoreImpl {
  (props: { db: TransactionClient }): Domain.eventStore;
}

export const createEventStoreImpl: CreateEventStoreImpl = ({ db }) => {
  const snapshotPer = 20;
  const snapshotLifeTracker = new Map<string, number>();

  return {
    async persist(aggregate) {
      const streamId = aggregate.value.id;
      const sequence = aggregate.value.seq;
      const events = aggregate.value.events;
      if (events.length === 0) {
        return aggregate;
      }

      let life = snapshotLifeTracker.get(streamId) ?? 0;
      life += events.length;

      await db.councilEvent.createMany({
        data: events.map((event, i) => ({
          stream_id: streamId,
          sequence: sequence + i + 1,
          date: new Date(event.value.date),
          data: event,
        })),
      });

      if (life >= snapshotPer) {
        await db.councilSnapshot.create({
          data: {
            aggregate_name: aggregate.tag,
            stream_id: streamId,
            sequence: sequence + events.length,
            data: aggregate.value,
          },
        });
        snapshotLifeTracker.set(streamId, 0);
      } else {
        snapshotLifeTracker.set(streamId, life);
      }

      return {
        ...aggregate,
        value: {
          ...aggregate.value,
          seq: aggregate.value.seq + events.length,
          events: [],
        },
      } as Domain.aggregate;
    },
  };
};
