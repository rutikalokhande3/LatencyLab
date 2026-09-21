#include <iostream>
#include <chrono>
#include <iomanip>

using namespace std;
using namespace chrono;

struct Order {
    int id;
    bool isBuy;
    double price;
    int quantity;
};

class BenchmarkEngine {
private:
    long long processedOrders;
    long long executedTrades;

public:
    BenchmarkEngine() {
        processedOrders = 0;
        executedTrades = 0;
    }

    void processOrder(const Order& order) {

        // Simulated order processing
        if (order.isBuy) {
            processedOrders++;
        } else {
            processedOrders++;

            // Simulated matching
            if (order.price <= 100.20) {
                executedTrades++;
            }
        }
    }

    long long getProcessedOrders() {
        return processedOrders;
    }

    long long getExecutedTrades() {
        return executedTrades;
    }
};

int main() {

    const int TOTAL_ORDERS = 1000000;

    BenchmarkEngine engine;

    cout << "============================================\n";
    cout << "          LATENCYLAB BENCHMARK\n";
    cout << "============================================\n\n";

    cout << "Generating "
         << TOTAL_ORDERS
         << " orders...\n\n";

    auto start = high_resolution_clock::now();

    for (int i = 0; i < TOTAL_ORDERS; i++) {

        Order order;

        order.id = i + 1;
        order.isBuy = (i % 2 == 0);
        order.price = 100.00 + (i % 50) * 0.01;
        order.quantity = 100;

        engine.processOrder(order);
    }

    auto end = high_resolution_clock::now();

    auto duration =
        duration_cast<microseconds>(end - start);

    double totalSeconds =
        duration.count() / 1000000.0;

    double averageLatency =
        (double)duration.count() / TOTAL_ORDERS;

    double throughput =
        TOTAL_ORDERS / totalSeconds;

    cout << "--------------------------------------------\n";
    cout << "PERFORMANCE RESULTS\n";
    cout << "--------------------------------------------\n";

    cout << "Orders Processed : "
         << engine.getProcessedOrders()
         << "\n";

    cout << "Trades Executed  : "
         << engine.getExecutedTrades()
         << "\n";

    cout << "Execution Time   : "
         << duration.count()
         << " microseconds\n";

    cout << fixed << setprecision(4);

    cout << "Average Latency  : "
         << averageLatency
         << " microseconds/order\n";

    cout << "Throughput       : "
         << throughput
         << " orders/second\n";

    cout << "============================================\n";

    return 0;
}