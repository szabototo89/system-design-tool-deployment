import { text } from "drizzle-orm/sqlite-core";
import { UserSchema, UsersTable } from "../entities/users/tables";

export const createdByUserPattern = {
  forTable() {
    return {
      createdBy: text("created_by")
        .notNull()
        .default("")
        .references(() => UsersTable.id),
    };
  },
  forSchema() {
    return {
      createdBy: UserSchema.shape.id,
    };
  },
};
