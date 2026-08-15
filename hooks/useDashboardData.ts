"use client";

import { useState, useEffect } from "react";

export interface Metric {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  inverse?: boolean;
}

export interface DashboardData {
  metrics: Metric[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        metrics: [
          { title: "Subs", value: "12.5k", change: "+4.2%", positive: true },
          { title: "Rev", value: "$3.4k", change: "+12.5%", positive: true },
          { title: "Open Rate", value: "48.2%", change: "-1.2%", positive: false },
          { title: "Views", value: "142k", change: "+8.4%", positive: true },
          { title: "Churn Rate", value: "2.4%", change: "-0.3%", positive: false, inverse: true },
        ],
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
