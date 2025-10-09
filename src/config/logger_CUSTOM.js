import winston from "winston";
import config from "./config.js";

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    http: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    debug: "magenta",
  },
};

winston.addColors(customLevelsOptions.colors);

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./backend.log",
      format: winston.format.simple(),
    }),
  ],
});

const prodLogger = winston.createLogger({
  //Levels
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({
      filename: "./backend.log",
      level: "warning",
    }),
  ],
});

export const logger =
  config.environment === "production" ? prodLogger : devLogger;
logger.info(
  `Logger Mode: ${config.environment === "production" ? "Prod" : "dev"}`
);

export const addLogger = (req, res, next) => {
  if (config.environment === "production") {
    req.logger = prodLogger;
    req.logger.http(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - ${
        req.method
      } en ${req.url}`
    );
  } else {
    req.logger = devLogger;
    req.logger.http(
      `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - ${
        req.method
      } en ${req.url}`
    );
  }
  next();
};
