import { Domain } from 'src/core';

import { type TransactionClient } from '../db';

interface CreateEventStoreImpl {
  (props: { db: TransactionClient }): Domain.eventStore;
}

export const createEventStoreImpl: CreateEventStoreImpl = ({ db }) => {
  return {
    async persist(aggregate) {
      const events = aggregate.value.events;
      if (events.length === 0) {
        return aggregate;
      }

      await db.councilEvent.createMany({
        data: events.map((event, i) => ({
          stream_id: aggregate.value.id,
          sequence: aggregate.value.seq + i,
          date: new Date(event.value.date),
          data: event,
        })),
      });

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
