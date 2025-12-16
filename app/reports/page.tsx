// ./app/reports/page.tsx

import React from "react";
import ReportPageClient from "@/components/reports/report-page-client"; // Import the new client component

// This file remains a Server Component by default,
// which is why it can't contain "use client" logic or dynamic with ssr: false.
export default function ReportPage() {
  return (
    // Simply render the client-side component where all the PDF logic resides
    <ReportPageClient />
  );
}
