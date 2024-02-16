/**
 * cors options to be used to configure cors
 */
module.exports = {
  origin: process.env.ORIGIN,
  methods: ["POST", "PATCH", "DELETE", "GET"],
};
