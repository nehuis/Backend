import winston from "winston";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({ filename: "./backend.log", level: "warn" }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger;

  req.logger.info(
    `${new Date().toLocaleDateString()} - ${logger.info} - ${req.method} en ${
      req.url
    }`
  );

  next();
};
