// Polyfill for optional @yaacovcr/transform dependency
// Apollo Server uses this for incremental delivery features we don't need
module.exports = {
  transformSchema: (schema) => schema,
};
