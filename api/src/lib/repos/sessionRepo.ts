import { type CouncilEvent } from '@prisma/client';

import { Session, SessionRepository } from 'src/core';

import { db } from '../db';

export const sessionRepo: SessionRepository.t = {
  async eventStream({ id, seq }) {
    const events = await db.councilEvent.findMany({
      where: {
        is_deleted: false,
        stream_id: id,
        sequence: { gte: seq },
      },
      orderBy: {
        sequence: 'asc',
      },
    });
    const lastEvents = events.at(-1);
    const lastSeq = lastEvents?.sequence ?? 0;

    return [events.map(mapDataToEvent), Number(lastSeq)];
  },
  async save({ id, events, seq }) {
    await db.councilEvent.createMany({
      data: events.map((event, i) => ({
        stream_id: id,
        sequence: seq + i + 1,
        date: event.value.date,
        data: event,
      })),
    });
  },
};

function mapDataToEvent(event: CouncilEvent): Session.event {
  return event.data as Session.event;
}
