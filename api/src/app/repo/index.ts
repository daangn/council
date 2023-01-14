import { type FastifyInstance } from 'fastify';

interface Injectable<T extends object> {
  (app: FastifyInstance): T;
}

type InjectableModule<T extends object> = { default: Injectable<T> };

const modules = import.meta.glob<true, string, InjectableModule<object>>(['./*.ts'], { eager: true });

export async function setupRepo(app: FastifyInstance) {
  const deps = {};
  for (const [_, module] of Object.entries(modules)) {
    Object.assign(deps, module.default(app));
  }
  app.decorate('repo', deps);
}
