import pool, { safeQuery } from "@/lib/db";
import DataTableClient from "./data-table-client";
import { columns } from "./columns";

export default async function DataTable() {
  try {
    const res: any = await safeQuery(
      "SELECT * FROM road_segment_conditions ORDER BY id ASC",
    );
    const rows = (res.rows ?? []) as any[];

    return <DataTableClient columns={columns} data={rows} />;
  } catch (error) {
    console.error("Database fetch error:", error);
    return <div>Failed to load data.</div>;
  }
}
