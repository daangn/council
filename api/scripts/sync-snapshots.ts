import { type FastifyInstance } from 'fastify';
import { parseArgs } from 'node:util';

import { makeApp } from '~/app';
import { Member, Session } from '~/core';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    all: {
      type: 'boolean',
      default: false,
    },
  },
});

const { all } = values;
const [aggregateName] = positionals;

type ValidAggregateName = typeof validAggregateNames[number];
const validAggregateNames = ['Session', 'Member'] as const;
function validateAggregateName(name: string): name is ValidAggregateName {
  return validAggregateNames.includes(name as ValidAggregateName);
}

let app: FastifyInstance | undefined;

async function syncAggregates(aggregateName: ValidAggregateName) {
  console.group(`\nSync aggregate ${aggregateName}`);

  app ||= await makeApp({ dev: true });
  const availableIds: string[] = [];

  console.log(`\nPull streams for ${aggregateName}`);
  for await (const { id, events } of app.eventStore.pullStream(aggregateName)) {
    const result = (() => {
      switch (aggregateName) {
        case 'Session': {
          return Session.restore(id, events as Session.event[]);
        }
        case 'Member': {
          return Member.restore(id, events as Member.event[]);
        }
      }
    })()!;
    if (result.tag === 'Error' || !result.value.state) {
      throw new Error(`Failed to restore ${aggregateName}(id: ${id})`);
    }
    console.group(`\nSync snapshot for ${aggregateName}(id: ${id})`);
    await app.prisma.councilSnapshot.upsert({
      where: {
        aggregate_name_stream_id: {
          aggregate_name: aggregateName,
          stream_id: id,
        },
      },
      create: {
        aggregate_name: aggregateName,
        stream_id: id,
        sequence: events.length,
        state: result.value.state,
      },
      update: {
        sequence: events.length,
        state: result.value.state,
      },
    });
    availableIds.push(id);
    console.groupEnd();
  }

  console.log('\nCleanup invalid snapshots');
  await app.prisma.councilSnapshot.deleteMany({
    where: {
      aggregate_name: aggregateName,
      stream_id: {
        notIn: availableIds,
      },
    },
  });

  console.groupEnd();
}

if (all) {
  for (const aggregateName of validAggregateNames) {
    await syncAggregates(aggregateName);
  }
} else {
  if (!validateAggregateName(aggregateName)) {
    throw new Error(`unknown aggregate name: ${aggregateName}`);
  }
  await syncAggregates(aggregateName);
}

await app?.close();

process.exit(0);
