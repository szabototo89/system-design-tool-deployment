import { SystemElementRelationEntity } from "@/db/entities/system-element-relation/schema";
import { SystemElementEntity } from "@/db/entities/system-element/schema";
import { db } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return Response.json(await SystemElementEntity.queries.queryAll(db));
}
