import { SystemElementRelationEntity } from "@/db/entities/system-element-relation/schema";
import { db } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const InputSchema = SystemElementRelationEntity.schema.omit({
    id: true,
    createdAt: true,
  });

  const param = InputSchema.parse(await request.json());

  return Response.json(
    await SystemElementRelationEntity.actions.create(db, param),
  );
}
