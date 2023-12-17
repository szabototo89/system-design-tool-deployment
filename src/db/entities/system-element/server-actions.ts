"use server";

import { db } from "@/db/schema";
import { SystemElementEntity } from "./schema";

export const queryAll = SystemElementEntity.queries.queryAll.bind(null, db);

export const systemElementCreate = SystemElementEntity.actions.create.bind(
  null,
  db,
);
