import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  const data = advocateData;

  return Response.json({ data });
}
