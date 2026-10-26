import matplotlib.pyplot as plt
import numpy as np
import os

charts_dir = "/Users/srireddy/Desktop/files and document manager project/reports_source/charts"
os.makedirs(charts_dir, exist_ok=True)

# Set clean academic plot styling matching sample report
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman', 'DejaVu Serif', 'Times']
plt.rcParams['font.size'] = 11
plt.rcParams['axes.edgecolor'] = '#222222'
plt.rcParams['axes.linewidth'] = 0.9

# -------------------------------------------------------------
# 1. FRONTEND CHARTS
# -------------------------------------------------------------
# Chart 1: Search Keystrokes vs Network Requests
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
keystrokes = np.array([2, 5, 8, 12, 16, 20])
unthrottled = keystrokes
debounced = np.array([1, 1, 1, 1, 1, 1])

ax.plot(keystrokes, unthrottled, 'o-', color='#1f77b4', linewidth=2.0, label='Without Debouncing (Sequential API Requests)')
ax.plot(keystrokes, debounced, 's-', color='#ff7f0e', linewidth=2.0, label='With 300ms Debouncing (Optimized)')
ax.set_title("Sequential vs Debounced API Requests", fontsize=12, pad=12)
ax.set_xlabel("Keystrokes Typed", fontsize=11)
ax.set_ylabel("Network Requests Issued", fontsize=11)
ax.grid(True, linestyle='--', alpha=0.6)
ax.legend(loc='upper left', frameon=True, fontsize=10)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "frontend_chart1.png"), bbox_inches='tight')
plt.close()

# Chart 2: DocumentList Render Latency vs Items Rendered
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
doc_counts = np.array([10, 25, 50, 100, 200])
speedup = np.array([3.82, 7.54, 13.21, 22.0, 38.0])

ax.plot(doc_counts, speedup, 'o-', color='#1f77b4', linewidth=2.0)
ax.set_title("Render Speedup with React.memo vs Document Count", fontsize=12, pad=12)
ax.set_xlabel("Document Cards Rendered", fontsize=11)
ax.set_ylabel("Render Speedup Factor (x)", fontsize=11)
ax.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "frontend_chart2.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 2. BACKEND CHARTS
# -------------------------------------------------------------
# Chart 1: Average Endpoint Response Latency
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
endpoints = ['Health Check\n(/api/health)', 'Document Query\n(/api/documents)', 'Stats Aggregate\n(/api/documents/stats)', 'User Login\n(bcrypt 12 rds)']
latencies = [1.2, 2.4, 2.1, 20.8]
colors = ['#1f77b4', '#2ca02c', '#17becf', '#ff7f0e']

bars = ax.bar(endpoints, latencies, color=colors, width=0.52, edgecolor='#1e293b', linewidth=0.8)
ax.set_title("Endpoint Response Latency (ms)", fontsize=12, pad=12)
ax.set_ylabel("Response Time (milliseconds)", fontsize=11)
ax.grid(axis='y', linestyle='--', alpha=0.6)
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.1f}ms", ha='center', va='bottom', fontsize=9.5, fontweight='bold')
ax.set_ylim(0, 25)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "backend_chart1.png"), bbox_inches='tight')
plt.close()

# Chart 2: Concurrency Speedup / Scaling
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
concurrent_clients = np.array([10, 25, 50, 100, 200])
throughput_req_sec = np.array([420, 980, 1850, 3100, 4200])

ax.plot(concurrent_clients, throughput_req_sec, 'o-', color='#1f77b4', linewidth=2.0)
ax.set_title("Request Throughput vs Concurrent Clients", fontsize=12, pad=12)
ax.set_xlabel("Concurrent Client Connections", fontsize=11)
ax.set_ylabel("Throughput (Requests / Second)", fontsize=11)
ax.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "backend_chart2.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 3. DATABASE CHARTS
# -------------------------------------------------------------
# Chart 1: Prisma Query Execution Latency by Operation
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
ops = ['findMany\n(Paginated)', 'create\n(Insert)', 'update\n(Patch)', 'groupBy\n(Aggregation)', 'delete\n(Cascade)']
op_latencies = [1.8, 2.2, 1.9, 2.1, 1.6]
bars = ax.bar(ops, op_latencies, color='#1f77b4', width=0.52, edgecolor='#0f172a', linewidth=0.8)
ax.set_title("Prisma Query Execution Latency (ms)", fontsize=12, pad=12)
ax.set_ylabel("Execution Time (milliseconds)", fontsize=11)
ax.grid(axis='y', linestyle='--', alpha=0.6)
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.06, f"{yval:.1f}ms", ha='center', va='bottom', fontsize=9.5, fontweight='bold')
ax.set_ylim(0, 3.0)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "database_chart1.png"), bbox_inches='tight')
plt.close()

# Chart 2: Query Execution Speedup: Indexed vs Unindexed
fig, ax = plt.subplots(figsize=(6.2, 4.4), dpi=300)
collection_docs = np.array([100, 500, 1000, 2500, 5000])
speedup_ratio = np.array([2.92, 10.14, 19.07, 39.44, 69.14])

ax.plot(collection_docs, speedup_ratio, 'o-', color='#1f77b4', linewidth=2.0)
ax.set_title("Index Speedup vs Collection Document Count", fontsize=12, pad=12)
ax.set_xlabel("Total Documents in Collection", fontsize=11)
ax.set_ylabel("Query Speedup Factor (x)", fontsize=11)
ax.grid(True, linestyle='--', alpha=0.6)
plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "database_chart2.png"), bbox_inches='tight')
plt.close()

print("All individual charts successfully generated!")
