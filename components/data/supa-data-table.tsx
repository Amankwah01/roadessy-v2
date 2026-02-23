
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import DataTableClient from "./data-table-client";
import { columns } from "./columns";

export default async function DataTable() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    console.log("Fetching data from Supabase...");

    const { data: rows, error } = await supabase
      .from("iri_sample")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Fetched rows:", rows?.length || 0);

    if (!rows || rows.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          No data available. The table is empty.
        </div>
      );
    }

    return <DataTableClient columns={columns} data={rows} />;
  } catch (error) {
    console.error("Database fetch error:", error);
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load data: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}
