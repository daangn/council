import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { Resource } from '@opentelemetry/resources';
import * as otel from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { type FastifyInstance } from 'fastify';

import { env } from '~/env';

export async function setupOTEL(app: FastifyInstance): Promise<void> {
  const traceExporter = env.ZIPKIN_ENDPOINT
    ? new ZipkinExporter({
        url: env.ZIPKIN_ENDPOINT,
      })
    : new ConsoleSpanExporter();

  const sdk = new otel.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'Council',
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdk.start();
  app.addHook('onClose', async () => {
    await sdk.shutdown();
  });
}
