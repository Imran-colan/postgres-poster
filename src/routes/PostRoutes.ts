import HTTP_STATUS_CODES from "@src/common/constants/HTTP_STATUS_CODES";
import UserService from "@src/services/UserService";
import { IReq, IRes } from "./common/types";

async function post(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HTTP_STATUS_CODES.Ok).json({ users });
}
