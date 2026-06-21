"use client";

import dynamic from "next/dynamic";
import React from "react";

const LineChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.LineChart),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
  }
);

export default function LineChartClient({ data }) {
  return <LineChart data={data} />;
}
