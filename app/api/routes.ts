// Generic API route at /api — server-only
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const result = await pool.query(
      "SELECT * FROM road_roughness_data LIMIT 100"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body?.name;
    if (!name) {
      return NextResponse.json(
        { error: "Missing 'name' in body" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO your_table_name (name) VALUES ($1) RETURNING *",
      [name]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
