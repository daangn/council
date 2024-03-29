import { createHtmlTemplateFunction } from '@fastify/vite';
import * as devalue from 'devalue';
import { PassThrough, Readable } from 'node:stream';
import * as ReactDOM from 'react-dom/server';

export function createRoute({ handler, errorHandler, route }, app, config) {
  app.get(`/_getPageProps${route.path}`, async (req, reply) => {
    await app.tracer.startActiveSpan('getPageProps', async (span) => {
      span.setAttribute('getPageProps.path', `/_getPageProps${route.path}`);
      if (route.getPageProps) {
        span.setAttribute('getPageProps.exist', true);
        const pageProps = await route.getPageProps({ app, req, reply });
        if (!reply.sent) {
          reply.send(pageProps);
        }
      } else {
        span.setAttribute('getPageProps.exist', false);
        reply.send(null);
      }
      span.end();
    });
  });
  app.get(route.path, {
    handler,
    errorHandler,
    ...route,
    async preHandler(req, reply, done) {
      await app.tracer.startActiveSpan('getPageProps', async (span) => {
        span.setAttribute('getPageProps.path', route.path);
        if (route.getPageProps) {
          span.setAttribute('getPageProps.exist', true);
          req.pageProps = await route.getPageProps({ app, req, reply });
          if (reply.sent) {
            done();
          }
        } else {
          span.setAttribute('getPageProps.exist', false);
          req.pageProps = null;
        }
        span.end();
      });
    },
  });

  if (route.postAction) {
    app.post(route.path, (req, reply) => {
      return app.tracer.startActiveSpan('postAction', async (span) => {
        span.setAttribute('postAction.path', route.path);
        const result = await route.postAction({ app, req, reply });
        span.end();
        return result;
      });
    });
  }
}

export function createHtmlFunction(source, app, config) {
  const [headSource, footer] = source.split('<!-- _ELEMENT_ -->');
  const headTemplate = createHtmlTemplateFunction(headSource);
  return function ({ pageProps, stream }) {
    const head = headTemplate({
      _SSR_: `<script>window._SSR_ = ${devalue.uneval({ pageProps })}</script>`,
    });
    this.type('text/html');
    const readable = Readable.from(streamHtml(head, stream, footer)).on('error', app.log.error);
    this.send(readable);
  };
}

export function createRenderFunction({ createApp }) {
  return function (server, req, reply) {
    const pageProps = req.pageProps;
    const app = createApp({ pageProps }, req.url);
    return { pageProps, stream: toReadable(app) };
  };
}

// Helper function to prepend and append chunks the body stream
async function* streamHtml(head, body, footer) {
  yield head;
  // We first await on the stream being ready (onShellReady)
  // And then await on its AsyncIterator
  for await (const chunk of await body) {
    yield chunk;
  }
  yield footer;
}

// Helper function to get an AsyncIterable (via PassThrough)
// from the limited stream returned by renderToPipeableStream()
function toReadable(app) {
  const duplex = new PassThrough();
  return new Promise((resolve, reject) => {
    try {
      const pipeable = ReactDOM.renderToPipeableStream(app, {
        onShellReady() {
          resolve(pipeable.pipe(duplex));
        },
        onShellError(error) {
          reject(error);
        },
      });
    } catch (error) {
      resolve(error);
    }
  });
}
