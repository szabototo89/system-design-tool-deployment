import { imageID, ImageSchema, queryImageByID } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

type StaticParams = { params: { imageID: string } };

export const dynamic = "error";

export async function GET(_request: NextRequest, { params }: StaticParams) {
  const image = await queryImageByID(imageID(params.imageID));
  const file = new Blob([image.fileContent]);

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
