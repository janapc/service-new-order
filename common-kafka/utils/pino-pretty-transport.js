module.exports = (opts) =>
  require("pino-pretty")({
    ...opts,
    ignore: "pid,hostname",

    customPrettifiers: {
      time: (timestamp) => `${timestamp}`,
    },
  });
