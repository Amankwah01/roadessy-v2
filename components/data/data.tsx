import { columns, DataColumn } from "@/components/data/columns";
import { get } from "http";

async function getData(): Promise<DataColumn[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Project Alpha",
      date_uploaded: "2023-10-01",
      total_distance: 120.5,
      user: "John Doe",
      road_type: "Highway",
      status: "processing",
      ave_iri: 5.2,
      ave_speed: 65.0,
    },
    {
      id: "728ed52a",
      name: "Project Alpha",
      date_uploaded: "2023-10-01",
      total_distance: 120.5,
      user: "John Doe",
      road_type: "Highway",
      status: "processing",
      ave_iri: 5.2,
        ave_speed: 65.0,
    },
    // ...
  ];
}

export default getData;