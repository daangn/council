const { getPaths } = require('@redwoodjs/internal');

/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  schema: getPaths().generated.schema,
};
