import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { Resource } from '@opentelemetry/resources';
import * as otel from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { type FastifyInstance } from 'fastify';

import { env } from '~/env';

export async function setupOTEL(app: FastifyInstance): Promise<void> {
  const traceExporter = env.ZIPKIN_ENDPOINT
    ? new ZipkinExporter({
        url: env.ZIPKIN_ENDPOINT,
      })
    : undefined;

  const sdk = new otel.NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'Council',
    }),
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fastify': {
          enabled: true,
          requestHook: (span, info) => {
            span.setAttribute('http.method', info.request.method);
            span.setAttribute('http.url', info.request.url);
          },
        },
        '@opentelemetry/instrumentation-pino': {
          enabled: true,
        },
        '@opentelemetry/instrumentation-fs': {
          enabled: true,
          requireParentSpan: true,
        },
      }),
    ],
  });

  await sdk.start();

  const tracerProvider = otel.api.trace.getTracerProvider();
  const tracer = tracerProvider.getTracer('council');

  app
    .decorate('tracerProvider', tracerProvider)
    .decorate('tracer', tracer)
    .addHook('onClose', async () => {
      await sdk.shutdown();
    });
}

declare module 'fastify' {
  interface FastifyInstance {
    tracerProvider: otel.api.TracerProvider;
    tracer: otel.api.Tracer;
  }
}
