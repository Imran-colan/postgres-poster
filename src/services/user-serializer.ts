// src/services/user-serializer.ts

import { IUser } from "@src/models/User";

export function serializeUser(user: IUser) {
  return {
    ...user,
    avatar: user.avatar
      ? Buffer.from(user.avatar).toString("base64")
      : null,
  };
}

export function serializeUsers(users: IUser[]) {
  return users.map(serializeUser);
}
