import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const records = advocateData;

  return Response.json({ advocates: records });
}
