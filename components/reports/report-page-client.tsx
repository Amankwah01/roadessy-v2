// ./app/reports/ReportPageClient.tsx

"use client"; // <<< CRITICAL: This directive makes this file a Client Component

import dynamic from "next/dynamic";
import React from "react";
import New from "@/components/reports/report-page-client";

// --- Use Dynamic Import for PDFViewer within the Client Component ---
// We can now use ssr: false here, or often, you don't even need ssr: false
// if the whole file is already client-side, but it's safer to keep it.
const PDFViewerComponent = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false, // ssr: false is now allowed because the parent is a Client Component
    loading: () => (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading the PDF Viewer...</p>
      </div>
    ),
  }
);

export default function ReportPageClient() {
  return (
    // Set container to full viewport height minus any header/footer
    <div className="grid grid-cols-12 px-3 py-1 w-full h-screen">
      <div
        className="z-1000 col-span-12 pt-5"
        style={{ height: "calc(100vh - 20px)" }}
      >
        <PDFViewerComponent style={{ width: "100%", height: "100%" }}>
          <New />
        </PDFViewerComponent>
      </div>
    </div>
  );
}
