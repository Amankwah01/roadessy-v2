

import { createSupabaseServerClient } from "@/lib/db";
import DataTableClient from "./data-table-client";
import { columns } from "./columns";

export default async function DataTable() {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('road_segment_conditions')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    const rows = data ?? [];

    return <DataTableClient columns={columns} data={rows} />;
  } catch (error) {
    console.error("Database fetch error:", error);
    return <div>Failed to load data.</div>;
  }
}

