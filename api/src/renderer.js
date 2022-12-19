import { createHtmlTemplateFunction } from '@fastify/vite';
import * as devalue from 'devalue';
import { PassThrough, Readable } from 'node:stream';
import * as ReactDOM from 'react-dom/server';

export function createRoute({ handler, errorHandler, route }, scope, config) {
  scope.get(`/_getPageProps${route.path}`, async (req, reply) => {
    if (route.getPageProps) {
      reply.send(await route.getPageProps({ req }));
    } else {
      reply.send(null);
    }
  });
  scope.get(route.path, {
    handler,
    errorHandler,
    ...route,
    async preHandler(req, reply) {
      if (route.getPageProps) {
        req.pageProps = await route.getPageProps({ req });
      } else {
        req.pageProps = null;
      }
    },
  });
}

export function createHtmlFunction(source, scope, config) {
  const [headSource, footer] = source.split('<!-- _ELEMENT_ -->');
  const headTemplate = createHtmlTemplateFunction(headSource);
  return function ({ pageProps, stream }) {
    const head = headTemplate({
      _SSR_: `<script>window._SSR_ = ${devalue.uneval({ pageProps })}</script>`,
    });
    this.type('text/html');
    const readable = Readable.from(streamHtml(head, stream, footer)).on('error', scope.log.error);
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
