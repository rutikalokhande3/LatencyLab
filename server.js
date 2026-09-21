const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Actual LatencyLab V6 benchmark results
const benchmark = {
  project: "LatencyLab",
  version: "V6",
  workload: {
    ordersProcessed: 50000,
    tradesExecuted: 25000
  },

  baseline: {
    name: "Vector Engine",
    totalTimeMicroseconds: 4997,
    averageLatencyNanoseconds: 99.94,
    throughputOrdersPerSecond: 10006003.60
  },

  comparison: {
    name: "Map + Deque Engine",
    totalTimeMicroseconds: 47091,
    averageLatencyNanoseconds: 941.82,
    throughputOrdersPerSecond: 1061774.01
  },

  analysis: {
    speedupRatio: 0.11,
    fasterEngine: "Vector Engine"
  }
};

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "LatencyLab Backend",
    status: "online"
  });
});

// Benchmark API
app.get("/api/benchmark", (req, res) => {
  res.json(benchmark);
});

app.listen(PORT, () => {
  console.log("================================");
  console.log("       LATENCYLAB BACKEND");
  console.log("================================");
  console.log(`API running on http://localhost:${PORT}`);
  console.log("");
});