import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import BaseRouter from "@src/routes";

import Paths from "@src/common/constants/PATHS";
import ENV from "@src/common/constants/ENV";
import HTTP_STATUS_CODES, {
  HttpStatusCodes,
} from "@src/common/constants/HTTP_STATUS_CODES";
import { RouteError } from "@src/common/util/route-errors";
import { NODE_ENVS } from "@src/common/constants";

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (ENV.NODE_ENV === NODE_ENVS.Dev) {
  app.use(morgan("dev"));
}

// Security
if (ENV.NODE_ENV === NODE_ENVS.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Add APIs, must be after middleware
app.use(Paths._, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NODE_ENV !== NODE_ENVS.Test.valueOf()) {
    logger.err(err, true);
  }
  let status: HttpStatusCodes = HTTP_STATUS_CODES.BadRequest;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// **** FrontEnd Content **** //
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
