"use client";
import { OverviewDashboard } from "@/components/dashboard-overview";
import { DefectStats } from "@/components/defects-stats";
import { Map } from "@/components/map-section";
import { RoadStats } from "@/components/road-stats";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  return (
    <div className="p-4 flex-col">
      <OverviewDashboard />
      <div className="grid grid-cols-1 md:grid-cols-8 gap-x-3 mt-1">
        <div className="col-span-6">
          <Map />
        </div>
        <div className="col-span-2">
          <RoadStats />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mt-3">
        <div className="col-span-4 md:col-span-8">
          <DefectStats />
        </div>
      </div>
    </div>
  );
}
