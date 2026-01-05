import { Router } from "express";

import PATHS from "@src/common/constants/PATHS";
import UserRoutes from "./UserRoutes";
import { uploadMemory } from "@src/middleware/uploadMemory";

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(PATHS.Users.Get, UserRoutes.getAll);
userRouter.post(PATHS.Users.Add,uploadMemory.single("avatar"), UserRoutes.add);
userRouter.put(PATHS.Users.Update,uploadMemory.single("avatar"), UserRoutes.update);
userRouter.delete(PATHS.Users.Delete, UserRoutes.delete);

// Add UserRouter
apiRouter.use(PATHS.Users._, userRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
