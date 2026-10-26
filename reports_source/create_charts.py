import matplotlib.pyplot as plt
import numpy as np
import os

charts_dir = "/Users/srireddy/Desktop/files and document manager project/reports_source/charts"
os.makedirs(charts_dir, exist_ok=True)

# Set common academic plot styling
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman', 'DejaVu Serif', 'Times']
plt.rcParams['font.size'] = 10
plt.rcParams['axes.edgecolor'] = '#333333'
plt.rcParams['axes.linewidth'] = 0.8

# -------------------------------------------------------------
# 1. FRONTEND CHARTS
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8.5, 3.6), dpi=300)

# Chart A: Search Keystrokes vs Network Requests
keystrokes = np.array([2, 5, 8, 12, 16, 20])
unthrottled_requests = keystrokes
debounced_requests = np.array([1, 1, 1, 1, 1, 1])

ax1.plot(keystrokes, unthrottled_requests, 'o-', color='#dc2626', linewidth=1.8, label='Without Debounce (Raw)')
ax1.plot(keystrokes, debounced_requests, 's-', color='#2563eb', linewidth=1.8, label='With 300ms Debounce')
ax1.set_title("Search Input vs API Requests", fontsize=11, fontweight='bold', pad=10)
ax1.set_xlabel("Characters Typed", fontsize=9.5)
ax1.set_ylabel("HTTP Requests Issued", fontsize=9.5)
ax1.grid(True, linestyle='--', alpha=0.5)
ax1.legend(loc='upper left', frameon=True, fontsize=8.5)

# Chart B: Re-render Duration vs Document Count (React.memo)
doc_counts = np.array([10, 25, 50, 100, 200])
unmemoized_render_ms = np.array([4.2, 9.8, 18.5, 35.2, 68.4])
memoized_render_ms = np.array([1.1, 1.3, 1.4, 1.6, 1.8])

ax2.plot(doc_counts, unmemoized_render_ms, '^--', color='#d97706', linewidth=1.8, label='Default Component')
ax2.plot(doc_counts, memoized_render_ms, 'd-', color='#16a34a', linewidth=1.8, label='React.memo + useCallback')
ax2.set_title("DocumentList Render Latency", fontsize=11, fontweight='bold', pad=10)
ax2.set_xlabel("Document Cards Rendered", fontsize=9.5)
ax2.set_ylabel("Render Time (ms)", fontsize=9.5)
ax2.grid(True, linestyle='--', alpha=0.5)
ax2.legend(loc='upper left', frameon=True, fontsize=8.5)

plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "frontend_perf.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 2. BACKEND CHARTS
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8.5, 3.6), dpi=300)

# Chart A: Endpoint Response Latency
endpoints = ['Health Check\n(/api/health)', 'Document Query\n(/api/documents)', 'Stats Aggregate\n(/api/documents/stats)', 'User Login\n(bcrypt 12 rds)']
latencies = [1.2, 2.4, 2.1, 20.8]
colors = ['#2563eb', '#3b82f6', '#60a5fa', '#f59e0b']

bars = ax1.bar(endpoints, latencies, color=colors, width=0.55, edgecolor='#1e293b', linewidth=0.7)
ax1.set_title("Average Endpoint Response Latency", fontsize=11, fontweight='bold', pad=10)
ax1.set_ylabel("Response Latency (ms)", fontsize=9.5)
ax1.grid(axis='y', linestyle='--', alpha=0.5)
for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.5, f"{yval:.1f}ms", ha='center', va='bottom', fontsize=8.5, fontweight='bold')
ax1.set_ylim(0, 25)

# Chart B: Latency vs Concurrency
concurrent_users = np.array([5, 10, 25, 50, 100])
latency_ms = np.array([2.5, 3.1, 4.8, 8.2, 15.6])

ax2.plot(concurrent_users, latency_ms, 'o-', color='#7c3aed', linewidth=2)
ax2.set_title("API Response Time vs Concurrency", fontsize=11, fontweight='bold', pad=10)
ax2.set_xlabel("Concurrent Client Requests", fontsize=9.5)
ax2.set_ylabel("Average Latency (ms)", fontsize=9.5)
ax2.grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "backend_perf.png"), bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# 3. DATABASE CHARTS
# -------------------------------------------------------------
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(8.5, 3.6), dpi=300)

# Chart A: Prisma Query Execution Time by Operation
ops = ['findMany\n(Paginated)', 'create\n(Insert)', 'update\n(Patch)', 'groupBy\n(Aggregation)', 'delete\n(Remove)']
op_latencies = [1.8, 2.2, 1.9, 2.1, 1.6]
bars = ax1.bar(ops, op_latencies, color='#0284c7', width=0.55, edgecolor='#0f172a', linewidth=0.7)
ax1.set_title("Prisma Query Execution Latency", fontsize=11, fontweight='bold', pad=10)
ax1.set_ylabel("Execution Time (ms)", fontsize=9.5)
ax1.grid(axis='y', linestyle='--', alpha=0.5)
for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.08, f"{yval:.1f}ms", ha='center', va='bottom', fontsize=8.5, fontweight='bold')
ax1.set_ylim(0, 3.2)

# Chart B: Indexed userId Query vs Unindexed Collection Scan
docs = np.array([100, 500, 1000, 2500, 5000])
unindexed_scan = np.array([3.5, 14.2, 28.6, 71.0, 145.2])
indexed_lookup = np.array([1.2, 1.4, 1.5, 1.8, 2.1])

ax2.plot(docs, unindexed_scan, 'x--', color='#dc2626', linewidth=1.8, label='Full Collection Scan')
ax2.plot(docs, indexed_lookup, 's-', color='#16a34a', linewidth=1.8, label='Indexed userId (B-Tree)')
ax2.set_title("Query Latency vs Collection Size", fontsize=11, fontweight='bold', pad=10)
ax2.set_xlabel("Total Documents in Collection", fontsize=9.5)
ax2.set_ylabel("Execution Time (ms)", fontsize=9.5)
ax2.grid(True, linestyle='--', alpha=0.5)
ax2.legend(loc='upper left', frameon=True, fontsize=8.5)

plt.tight_layout()
plt.savefig(os.path.join(charts_dir, "database_perf.png"), bbox_inches='tight')
plt.close()

print("All charts successfully generated in:", charts_dir)
