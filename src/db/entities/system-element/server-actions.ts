"use server";

import { db } from "@/db/schema";
import { SystemElementEntity } from "./schema";

export const systemElementQueryAll = SystemElementEntity.queries.queryAll.bind(
  null,
  db,
);

export const systemElementQueryById =
  SystemElementEntity.queries.queryById.bind(null, db);

export const systemElementCreate = SystemElementEntity.actions.create.bind(
  null,
  db,
);

export const systemElementUpdate = SystemElementEntity.actions.update.bind(
  null,
  db,
);

export const systemElementUpdateParent =
  SystemElementEntity.actions.updateParent.bind(null, db);

export const systemElementDelete = SystemElementEntity.actions.delete.bind(
  null,
  db,
);
