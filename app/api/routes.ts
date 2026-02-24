// Generic API route at /api — server-only
import { createSupabaseServerClient } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from("road_roughness_data")
      .select("*")
      .limit(100);

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  try {
    const body = await req.json();
    const name = body?.name;
    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' in body" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("your_table_name")
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
