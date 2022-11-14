import { type Config } from 'jest';

const config: Config = {
  rootDir: '.',
  projects: ['<rootDir>/{*,!(node_modules)/**/}/jest.config.js'],
};

export default config;
