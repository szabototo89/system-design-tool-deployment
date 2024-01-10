"use server";

import { db } from "@/db/schema";
import { SystemTechnologyEntity } from "./schema";

export const systemTechnologyQueryAll =
  SystemTechnologyEntity.queries.queryAll.bind(null, db);

export const systemTechnologyQueryByName =
  SystemTechnologyEntity.queries.queryByName.bind(null, db);

export const systemTechnologyUpdate =
  SystemTechnologyEntity.actions.update.bind(null, db);

export const systemTechnologyDelete =
  SystemTechnologyEntity.actions.delete.bind(null, db);
