import {
  imageID,
  ImageSchema,
  queryImageByID,
} from "@/db/schemas/images.schema";
import { NextRequest, NextResponse } from "next/server";

type StaticParams = { params: { imageID: string } };

export const dynamic = "auto";

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
