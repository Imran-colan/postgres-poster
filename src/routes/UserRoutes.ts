import HTTP_STATUS_CODES from "@src/common/constants/HTTP_STATUS_CODES";
import UserService from "@src/services/UserService";
import User from "@src/models/User";

import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";
import z from "zod";

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  add: parseReq({ user: User.createSchema }),
  update: parseReq({ user: User.schema }),
  delete: parseReq({ id: z.coerce.number().int() }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  const formattedUsers = users.map((u) => ({
    ...u,
    avatar: u.avatar
      ? `data:${u.avatarMime};base64,${Buffer.from(u.avatar).toString("base64")}`
      : null,
  }));
  res.status(HTTP_STATUS_CODES.Ok).json({ users: formattedUsers });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  let userData = req.body;
  if (req.file) {
    userData.avatar = req.file.buffer as Uint8Array<ArrayBuffer>;
    userData.avatarMime = req.file.mimetype;
  }
  const { user } = Validators.add({ user: userData });
  const addedUser = await UserService.addOne(user);
  res.status(HTTP_STATUS_CODES.Created).json({ user: addedUser }).end();
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  if (req.file) {
    user.avatar = req.file.buffer as unknown as Uint8Array<ArrayBuffer>;
    user.avatarMime = req.file.mimetype;
  }
  const updatedUser = await UserService.updateOne(user);
  res.status(HTTP_STATUS_CODES.Ok).json({ user: updatedUser }).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  const deletedUser = await UserService.delete(id);
  res.status(HTTP_STATUS_CODES.Ok).json({ user: deletedUser }).end();
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
