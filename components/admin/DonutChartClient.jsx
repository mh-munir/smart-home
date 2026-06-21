"use client";

import dynamic from "next/dynamic";
import React from "react";

const DonutChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.DonutChart),
  {
    ssr: false,
    loading: () => <div className="h-48 w-48 bg-gray-100 rounded-full animate-pulse" />,
  }
);

export default function DonutChartClient({ percentage }) {
  return <DonutChart percentage={percentage} />;
}
