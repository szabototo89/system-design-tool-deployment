import { NextRequest, NextResponse } from "next/server";
import { imageID, imageQuery } from "@/db/entities/images/entity";

type StaticParams = { params: { imageID: string } };

export const dynamic = "error";

export async function GET(_request: NextRequest, { params }: StaticParams) {
  const image = await imageQuery.queryByID(imageID(params.imageID));
  //@ts-ignore Not sure how to resolve this error
  const file = new Blob([image.fileContent]);

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
