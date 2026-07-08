import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export const excludePassword = (user: User): SafeUser => {
  const { password: _password, ...safeUser } = user;

  return safeUser;
};
