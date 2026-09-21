#include <iostream>
#include <vector>
#include <deque>
#include <map>
#include <chrono>
#include <iomanip>
#include <algorithm>

using namespace std;
using namespace chrono;

// ============================================================
// ORDER
// ============================================================

struct Order {
    int id;
    bool isBuy;
    int price;
    int quantity;
};

// ============================================================
// VECTOR-BASED MATCHING ENGINE
// Baseline implementation
// ============================================================

class VectorMatchingEngine {

private:

    vector<Order> buyOrders;
    vector<Order> sellOrders;

    int tradeCount;

public:

    VectorMatchingEngine()
        : tradeCount(0) {
    }

    void addOrder(const Order& order) {

        if (order.isBuy) {
            buyOrders.push_back(order);
        }
        else {
            sellOrders.push_back(order);
        }

        matchOrders();
    }

    void matchOrders() {

        for (size_t i = 0;
             i < buyOrders.size();) {

            bool matched = false;

            for (size_t j = 0;
                 j < sellOrders.size();) {

                // BUY price >= SELL price
                // means a trade can happen.
                if (buyOrders[i].price >=
                    sellOrders[j].price) {

                    int quantity =
                        min(
                            buyOrders[i].quantity,
                            sellOrders[j].quantity
                        );

                    buyOrders[i].quantity -= quantity;
                    sellOrders[j].quantity -= quantity;

                    tradeCount++;

                    matched = true;

                    // SELL completely filled
                    if (sellOrders[j].quantity == 0) {

                        sellOrders.erase(
                            sellOrders.begin() + j
                        );
                    }
                    else {
                        j++;
                    }

                    // BUY completely filled
                    if (buyOrders[i].quantity == 0) {

                        buyOrders.erase(
                            buyOrders.begin() + i
                        );

                        break;
                    }
                }
                else {
                    j++;
                }
            }

            if (!matched &&
                i < buyOrders.size()) {

                i++;
            }
        }
    }

    int getTradeCount() const {
        return tradeCount;
    }
};

// ============================================================
// MAP + DEQUE MATCHING ENGINE
// Optimized price-level order book
// ============================================================

class OptimizedMatchingEngine {

private:

    // Highest BUY price first
    map<
        int,
        deque<Order>,
        greater<int>
    > buyBook;

    // Lowest SELL price first
    map<
        int,
        deque<Order>
    > sellBook;

    int tradeCount;

public:

    OptimizedMatchingEngine()
        : tradeCount(0) {
    }

    void addOrder(const Order& order) {

        if (order.isBuy) {

            buyBook[
                order.price
            ].push_back(order);

        }
        else {

            sellBook[
                order.price
            ].push_back(order);
        }

        matchOrders();
    }

    void matchOrders() {

        while (!buyBook.empty() &&
               !sellBook.empty()) {

            // Best BUY price
            map<
                int,
                deque<Order>,
                greater<int>
            >::iterator bestBuy =
                buyBook.begin();

            // Best SELL price
            map<
                int,
                deque<Order>
            >::iterator bestSell =
                sellBook.begin();

            // No price crossing
            if (bestBuy->first <
                bestSell->first) {

                break;
            }

            Order& buyOrder =
                bestBuy->second.front();

            Order& sellOrder =
                bestSell->second.front();

            int quantity =
                min(
                    buyOrder.quantity,
                    sellOrder.quantity
                );

            buyOrder.quantity -= quantity;
            sellOrder.quantity -= quantity;

            tradeCount++;

            // BUY completely filled
            if (buyOrder.quantity == 0) {

                bestBuy->second.pop_front();

                if (bestBuy->second.empty()) {

                    buyBook.erase(
                        bestBuy
                    );
                }
            }

            // SELL completely filled
            if (sellOrder.quantity == 0) {

                bestSell->second.pop_front();

                if (bestSell->second.empty()) {

                    sellBook.erase(
                        bestSell
                    );
                }
            }
        }
    }

    int getTradeCount() const {
        return tradeCount;
    }
};

// ============================================================
// ORDER GENERATOR
// ============================================================

vector<Order> generateOrders(
    int totalOrders
) {

    vector<Order> orders;

    orders.reserve(totalOrders);

    for (int i = 0;
         i < totalOrders;
         i++) {

        Order order;

        order.id = i + 1;

        // Alternate BUY / SELL
        order.isBuy =
            (i % 2 == 0);

        /*
            Multiple price levels.

            BUY:
            9950 - 9999

            SELL:
            9900 - 9949

            This creates a deeper
            and more realistic
            order-book workload.
        */

        if (order.isBuy) {

            order.price =
                9950 + (i % 50);
        }
        else {

            order.price =
                9900 + (i % 50);
        }

        order.quantity = 10;

        orders.push_back(order);
    }

    return orders;
}

// ============================================================
// BENCHMARK VECTOR ENGINE
// ============================================================

double benchmarkVectorEngine(
    const vector<Order>& orders,
    int& trades
) {

    VectorMatchingEngine engine;

    auto start =
        high_resolution_clock::now();

    for (size_t i = 0;
         i < orders.size();
         i++) {

        engine.addOrder(
            orders[i]
        );
    }

    auto end =
        high_resolution_clock::now();

    trades =
        engine.getTradeCount();

    return static_cast<double>(
        duration_cast<nanoseconds>(
            end - start
        ).count()
    );
}

// ============================================================
// BENCHMARK OPTIMIZED ENGINE
// ============================================================

double benchmarkOptimizedEngine(
    const vector<Order>& orders,
    int& trades
) {

    OptimizedMatchingEngine engine;

    auto start =
        high_resolution_clock::now();

    for (size_t i = 0;
         i < orders.size();
         i++) {

        engine.addOrder(
            orders[i]
        );
    }

    auto end =
        high_resolution_clock::now();

    trades =
        engine.getTradeCount();

    return static_cast<double>(
        duration_cast<nanoseconds>(
            end - start
        ).count()
    );
}

// ============================================================
// MAIN
// ============================================================

int main() {

    const int TOTAL_ORDERS = 50000;

    cout << "============================================\n";
    cout << "       LATENCYLAB OPTIMIZATION LAB V6\n";
    cout << "============================================\n\n";

    cout << "Generating "
         << TOTAL_ORDERS
         << " orders...\n";

    vector<Order> orders =
        generateOrders(
            TOTAL_ORDERS
        );

    // ========================================================
    // BASELINE
    // ========================================================

    int vectorTrades = 0;

    double vectorTime =
        benchmarkVectorEngine(
            orders,
            vectorTrades
        );

    // ========================================================
    // OPTIMIZED
    // ========================================================

    int optimizedTrades = 0;

    double optimizedTime =
        benchmarkOptimizedEngine(
            orders,
            optimizedTrades
        );

    // ========================================================
    // CALCULATIONS
    // ========================================================

    double vectorSeconds =
        vectorTime /
        1000000000.0;

    double optimizedSeconds =
        optimizedTime /
        1000000000.0;

    double vectorThroughput =
        TOTAL_ORDERS /
        vectorSeconds;

    double optimizedThroughput =
        TOTAL_ORDERS /
        optimizedSeconds;

    double vectorLatency =
        vectorTime /
        TOTAL_ORDERS;

    double optimizedLatency =
        optimizedTime /
        TOTAL_ORDERS;

    double speedup =
        vectorTime /
        optimizedTime;

    double throughputImprovement =
        (
            optimizedThroughput /
            vectorThroughput
        ) * 100.0;

    // ========================================================
    // BASELINE RESULTS
    // ========================================================

    cout << "\n--------------------------------------------\n";
    cout << "VECTOR ENGINE - BASELINE\n";
    cout << "--------------------------------------------\n";

    cout << fixed << setprecision(2);

    cout << "Trades           : "
         << vectorTrades
         << "\n";

    cout << "Total Time       : "
         << vectorTime / 1000.0
         << " microseconds\n";

    cout << "Avg Latency      : "
         << vectorLatency
         << " ns/order\n";

    cout << "Throughput       : "
         << vectorThroughput
         << " orders/sec\n";

    // ========================================================
    // OPTIMIZED RESULTS
    // ========================================================

    cout << "\n--------------------------------------------\n";
    cout << "MAP + DEQUE ENGINE - OPTIMIZED\n";
    cout << "--------------------------------------------\n";

    cout << "Trades           : "
         << optimizedTrades
         << "\n";

    cout << "Total Time       : "
         << optimizedTime / 1000.0
         << " microseconds\n";

    cout << "Avg Latency      : "
         << optimizedLatency
         << " ns/order\n";

    cout << "Throughput       : "
         << optimizedThroughput
         << " orders/sec\n";

    // ========================================================
    // COMPARISON
    // ========================================================

    cout << "\n--------------------------------------------\n";
    cout << "OPTIMIZATION COMPARISON\n";
    cout << "--------------------------------------------\n";

    cout << "Speedup Ratio    : "
         << speedup
         << "x\n";

    cout << "Throughput Ratio : "
         << throughputImprovement
         << "% of baseline\n";

    if (optimizedTime < vectorTime) {

        cout << "Result           : "
             << "OPTIMIZED ENGINE FASTER\n";
    }
    else {

        cout << "Result           : "
             << "BASELINE ENGINE FASTER\n";
    }

    cout << "--------------------------------------------\n";

    cout << "\nOrder Book:\n";
    cout << "  Baseline       : vector\n";
    cout << "  Optimized      : map + deque\n";

    cout << "\nMatching Priority:\n";
    cout << "  BUY            : Highest price first\n";
    cout << "  SELL           : Lowest price first\n";

    cout << "\n============================================\n";
    cout << "           LATENCYLAB COMPLETE\n";
    cout << "============================================\n";

    return 0;
}