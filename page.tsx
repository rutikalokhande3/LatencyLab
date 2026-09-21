"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EngineResult {
  name: string;
  totalTimeMicroseconds: number;
  averageLatencyNanoseconds: number;
  throughputOrdersPerSecond: number;
}

interface BenchmarkData {
  project: string;
  version: string;
  workload: {
    ordersProcessed: number;
    tradesExecuted: number;
  };
  baseline: EngineResult;
  comparison: EngineResult;
  analysis: {
    speedupRatio: number;
    fasterEngine: string;
  };
}

const API_URL = "http://localhost:5000/api/benchmark";

function Card({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function EngineCard({
  engine,
  accent,
}: {
  engine: EngineResult;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{engine.name}</h3>

        <span className={`rounded-full px-3 py-1 text-xs ${accent}`}>
          Engine
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-500">Latency</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {engine.averageLatencyNanoseconds.toFixed(2)} ns
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Throughput</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {(engine.throughputOrdersPerSecond / 1_000_000).toFixed(2)}M
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Execution</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {engine.totalTimeMicroseconds.toFixed(2)} μs
          </p>
        </div>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <h3 className="mb-5 text-sm font-medium text-slate-300">{title}</h3>

      <div className="h-72">{children}</div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((result: BenchmarkData) => {
        setData(result);
        setError("");
      })
      .catch(() => {
        setError(
          "Backend is not running. Start the LatencyLab backend on port 5000."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b14] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-white" />

          <p className="mt-4 text-sm text-slate-400">
            Loading benchmark data...
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b14] px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-7 text-center">
          <p className="text-lg font-semibold">Backend Connection Error</p>

          <p className="mt-2 text-sm text-slate-400">{error}</p>

          <p className="mt-4 text-xs text-slate-500">
            Run <span className="text-slate-300">node server.js</span> inside
            the LatencyLab backend folder.
          </p>
        </div>
      </main>
    );
  }

  const benchmarkData = [
    {
      name: "Vector",
      latency: data.baseline.averageLatencyNanoseconds,
      throughput:
        data.baseline.throughputOrdersPerSecond / 1_000_000,
      execution: data.baseline.totalTimeMicroseconds / 1000,
    },
    {
      name: "Map + Deque",
      latency: data.comparison.averageLatencyNanoseconds,
      throughput:
        data.comparison.throughputOrdersPerSecond / 1_000_000,
      execution: data.comparison.totalTimeMicroseconds / 1000,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <header className="border-b border-white/10 bg-[#070b14]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              LatencyLab
            </h1>

            <p className="text-xs text-slate-500">
              Low-Latency Trading Engine Lab
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="text-white">Overview</span>
            <span>Benchmark</span>
            <span>Engine</span>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              API Connected
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            {data.project} / Benchmark {data.version}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Performance Overview
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Real benchmark results delivered from the LatencyLab backend API.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Orders Processed"
            value={data.workload.ordersProcessed.toLocaleString()}
            subtitle="Benchmark workload"
          />

          <Card
            title="Trades Executed"
            value={data.workload.tradesExecuted.toLocaleString()}
            subtitle="Successful matches"
          />

          <Card
            title="Baseline Throughput"
            value={`${(
              data.baseline.throughputOrdersPerSecond / 1_000_000
            ).toFixed(2)}M`}
            subtitle="orders / second"
          />

          <Card
            title="Baseline Latency"
            value={`${data.baseline.averageLatencyNanoseconds.toFixed(2)} ns`}
            subtitle="average per order"
          />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <EngineCard
            engine={data.baseline}
            accent="bg-white/10 text-slate-300"
          />

          <EngineCard
            engine={data.comparison}
            accent="bg-amber-400/10 text-amber-300"
          />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <ChartCard title="Average Latency (ns/order)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis dataKey="name" stroke="#64748b" />

                <YAxis stroke="#64748b" />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                  }}
                />

                <Bar
                  dataKey="latency"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Throughput (Million orders/sec)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis dataKey="name" stroke="#64748b" />

                <YAxis stroke="#64748b" />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                  }}
                />

                <Bar
                  dataKey="throughput"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Execution Time (ms)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis dataKey="name" stroke="#64748b" />

                <YAxis stroke="#64748b" />

                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "10px",
                  }}
                />

                <Bar
                  dataKey="execution"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Benchmark Observation
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Under this V6 workload, the vector-based baseline completed
            the benchmark faster than the map + deque implementation.
            This demonstrates that data-structure performance is
            workload-dependent and that optimization should be validated
            with measurement.
          </p>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Matching Priority
            </p>

            <p className="mt-1 text-sm text-slate-300">
              BUY: highest price first
            </p>

            <p className="text-sm text-slate-300">
              SELL: lowest price first
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Baseline Structure
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Vector
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Comparison Structure
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Map + Deque
            </p>
          </div>
        </section>

        <footer className="border-t border-white/10 py-10 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-slate-400">
              Built with C++ • Node.js • Next.js
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Performance measured. Optimizations validated.
            </p>
            <p className="mt-4 text-xs font-medium tracking-wider text-slate-500">
              © 2026 Rutika_Lokhande · LatencyLab
            </p>
            <p className="mt-1 text-[11px] text-slate-700">
              All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}