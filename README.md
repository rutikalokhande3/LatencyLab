# ⚡ LatencyLab

### Low-Latency Trading Engine & Performance Benchmarking Lab

LatencyLab is a simulated trading-engine project built to explore order matching, order-book design, latency measurement, throughput benchmarking, and performance trade-offs between different data structures.

The project combines a C++ matching engine with a Node.js backend and a Next.js performance dashboard.

> **Note:** LatencyLab is an educational/simulated project. It is not connected to any real financial exchange or trading system.

---

## 🚀 Project Overview

The core of LatencyLab is a C++ order matching engine that processes buy and sell orders according to price priority and executes trades when compatible orders are available.

The project also experiments with different data structures for implementing the matching process and measures their performance under the same workload.

The benchmark results are exposed through a Node.js API and visualized through a Next.js dashboard.

### Architecture

```text
              ┌──────────────────────┐
              │   C++ Matching Engine │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Benchmarking Engine │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Node.js / Express  │
              │        REST API      │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Next.js Dashboard  │
              │  Recharts + Tailwind │
              └──────────────────────┘
```

---

## 🔧 Features

### C++ Matching Engine

* Buy and sell order processing
* Price-priority matching
* Trade execution
* Order quantity management
* Multiple order-book implementations
* Benchmark workload generation

### Performance Benchmarking

* Orders processed measurement
* Trades executed measurement
* Average latency measurement
* Throughput measurement
* Total execution-time measurement
* Data-structure performance comparison

### Backend

* Node.js
* Express.js
* CORS support
* REST API
* Benchmark result endpoint

### Dashboard

* Next.js
* TypeScript
* Tailwind CSS
* Recharts
* API-connected benchmark data
* Latency visualization
* Throughput visualization
* Execution-time visualization
* Engine comparison

---

## 🧪 Benchmark V6

The V6 benchmark uses:

```text
Orders Processed : 50,000
Trades Executed  : 25,000
```

### Vector Engine — Baseline

```text
Average Latency : 99.94 ns/order
Throughput      : 10.01M orders/sec
Total Time      : 4.997 ms
```

### Map + Deque Engine

```text
Average Latency : 941.82 ns/order
Throughput      : 1.06M orders/sec
Total Time      : 47.091 ms
```

### Benchmark Observation

Under this specific workload, the vector-based implementation performed faster than the Map + Deque implementation.

This project demonstrates why performance optimization should be validated through measurement rather than assumptions. Different data structures can behave differently depending on workload characteristics and implementation overhead.

---

## 🧠 What I Explored

LatencyLab was built to explore practical systems and performance concepts including:

* Order matching
* Order-book design
* Price-priority matching
* Data-structure trade-offs
* Latency measurement
* Throughput measurement
* Benchmark design
* Performance analysis
* API integration
* Performance visualization

---

## 🛠️ Tech Stack

### Core Engine

* C++
* STL
* Vectors
* Maps
* Deques
* High-resolution timing

### Backend

* Node.js
* Express.js
* REST API
* CORS

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Recharts

---

## 📁 Project Structure

```text
LatencyLab/
│
├── engine/
│   ├── matching_engine.cpp
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── dashboard/
│   ├── app/
│   │   └── page.tsx
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ▶️ Running the Project

### 1. Run the C++ Engine

Open the engine directory:

```bash
cd engine
```

Compile the C++ benchmark using your installed C++ compiler.

For MinGW:

```bash
g++ matching_engine.cpp -o latencylab
```

Run:

```bash
latencylab
```

---

### 2. Start the Backend

```bash
cd backend
npm install
node server.js
```

The API runs at:

```text
http://localhost:5000
```

Benchmark endpoint:

```text
http://localhost:5000/api/benchmark
```

---

### 3. Start the Dashboard

Open another terminal:

```bash
cd dashboard
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The dashboard fetches benchmark data from the backend API and visualizes the results.

---

## 📊 Dashboard

The dashboard provides visual comparisons for:

* Average latency
* Throughput
* Execution time
* Baseline vs comparison engine

It also displays the current benchmark workload and matching-engine information.

---

## 📈 Key Learning

One of the main takeaways from this project was that an implementation that looks theoretically more optimized does not necessarily perform better for every workload.

The V6 benchmark provided a practical way to compare implementations using actual measurements.

This shifted the focus from:

```text
"Which data structure sounds faster?"
```

to:

```text
"Which implementation performs better under this workload?"
```

---

## ⚠️ Disclaimer

LatencyLab is a simulated and educational project created for learning and experimentation with matching engines, benchmarking, and performance engineering.

It does not execute real financial trades, connect to a financial exchange, or represent the internal architecture of any real trading firm or exchange.

---

## 👩‍💻 Author

**Rutika_Lokhande**

Built as a personal systems and performance-engineering project.

---

## ⭐ Future Exploration

Possible future experiments include:

* More realistic order-book workloads
* Larger benchmark sizes
* Additional data structures
* Improved benchmark methodology
* More detailed latency distributions
* WebSocket-based live updates
* Additional engine implementations
* Multi-threaded performance experiments

---

## 📜 License

This project is intended for educational and personal experimentation.
