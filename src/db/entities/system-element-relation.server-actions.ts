"use server";

import { db } from "../schema";
import { SystemElementRelationEntity } from "./system-element-relation.schema";

export const queryAll = SystemElementRelationEntity.queries.queryAll.bind(
  null,
  db,
);
export const create = SystemElementRelationEntity.actions.create.bind(null, db);
