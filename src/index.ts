import logger from "jet-logger";

import ENV from "@src/common/constants/ENV";
import server from "./server";

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG =
  "Express server started on port: " + ENV.PORT.toString();

/******************************************************************************
                                  Run
******************************************************************************/

// Start the server
server.listen(ENV.PORT, (err) => {
  if (!!err) {
    logger.err(err.message);
  } else {
    logger.info(SERVER_START_MSG);
  }
});
