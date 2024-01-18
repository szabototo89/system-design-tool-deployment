import { db } from "../../schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { UsersTable, UserSchema, UserWithPassword } from "./tables";

export const userQuery = {
  async findUserByEmailAndPassword(email: string, password: string) {
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(
        and(eq(UsersTable.email, email), eq(UsersTable.password, password)),
      );

    return UserSchema.optional().parse(user);
  },

  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.email, email));

    return UserSchema.optional().parse(user);
  },
};

export const userAction = {
  async registerUser(
    user: Pick<UserWithPassword, "name" | "email" | "password">,
  ) {
    return db
      .insert(UsersTable)
      .values({
        id: uuid(),
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .returning();
  },
};
