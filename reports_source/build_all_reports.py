#!/usr/bin/env python3
"""
Master Build Script for FileHub Academic Reports
Generates all charts and builds the 3 final PDF deliverables:
- FileHub_Frontend_Report.pdf
- FileHub_Backend_Report.pdf
- FileHub_Database_Report.pdf
"""

import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

print("="*60)
print("🚀 Building All FileHub Academic Project Reports")
print("="*60)

# 1. Generate Charts
print("\n[1/4] Generating academic performance charts...")
subprocess.run([sys.executable, os.path.join(BASE_DIR, "create_charts.py")], check=True)

# 2. Build Frontend Report
print("\n[2/4] Building FileHub_Frontend_Report.pdf...")
frontend_pdf = os.path.join(PROJECT_DIR, "FileHub_Frontend_Report.pdf")
from build_frontend_report import build_frontend_report
p1 = build_frontend_report(frontend_pdf)

# 3. Build Backend Report
print("\n[3/4] Building FileHub_Backend_Report.pdf...")
backend_pdf = os.path.join(PROJECT_DIR, "FileHub_Backend_Report.pdf")
from build_backend_report import build_backend_report
p2 = build_backend_report(backend_pdf)

# 4. Build Database Report
print("\n[4/4] Building FileHub_Database_Report.pdf...")
database_pdf = os.path.join(PROJECT_DIR, "FileHub_Database_Report.pdf")
from build_database_report import build_database_report
p3 = build_database_report(database_pdf)

print("\n" + "="*60)
print("✅ ALL THREE REPORTS GENERATED SUCCESSFULLY!")
print(f"1. Frontend Report: {frontend_pdf} ({p1} pages)")
print(f"2. Backend Report:  {backend_pdf} ({p2} pages)")
print(f"3. Database Report: {database_pdf} ({p3} pages)")
print("="*60)
