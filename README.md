# PrivaFuse — AI-Powered Privacy-Preserving Healthcare & Brain Report Analysis Platform

**PrivaFuse** is an enterprise-grade academic demonstration platform designed for privacy-preserving healthcare analytics, federated model training, synthetic brain-report metadata evaluation, and geospatial disease surveillance.

---

## 🌟 Key Architecture & Capabilities

1. **Federated Learning (`FedAvg`)**:
   - Enables multiple participating hospital nodes to train local models on private CSV datasets without sending raw patient records to a central coordinator.
   - Central coordinator receives parameter weights & intercepts, aggregates them using sample-count weighted `FedAvg`, and updates the global model.

2. **Brain Report Analysis Module**:
   - Analyzes synthetic tabular clinical metadata and artificial report impressions.
   - Runs a Scikit-Learn Logistic Classification pipeline on held-out test sets.
   - Visualizes Confusion Matrix, Precision, Recall, and F1 metrics.

3. **Geospatial Disease Surveillance**:
   - Interactive regional surveillance map with risk pins for North, South, East, and West Zones.
   - Outbreak risk scores, disease category filters, and user-configurable alert threshold triggers.

4. **Hospital & Dataset Management**:
   - Drag-and-drop CSV uploader supporting both **Synthetic Risk** (`age, temperature, heart_rate, risk_label`) and **Synthetic Brain Report** (`case_id, age, scan_type, lesion_present, lesion_size_mm, midline_shift_mm, edema_present, radiology_impression, demo_label`) schemas.
   - Hospital node registry with logical directory assignment and model participation toggles.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, React Router v7, Recharts, Lucide React, Axios, Tailwind CSS v4.
- **Node.js Express Backend**: Express.js, JWT Authentication, Bcrypt password hashing, Multer file upload, Mongoose DB with automatic JSON file fallback.
- **Python FastAPI AI Engine**: Python 3.12, FastAPI, Scikit-Learn, Pandas, NumPy, Uvicorn.
- **Data Storage**: Synthetic CSV files (`datasets/synthetic/`), local filesystem uploads, persistent JSON/MongoDB store.

---

## 🚀 Quickstart & Windows PowerShell Startup Commands

### Prerequisites
- Node.js v18+
- Python 3.10+
- Windows PowerShell

---

### Step 1: Start Node.js Express Backend (Port 5000)
Open PowerShell Terminal 1:
```powershell
cd c:\Users\HP\Desktop\priva-fuse-frontend
node backend-node/src/server.js
```
*Health Check*: `http://localhost:5000/api/health`

---

### Step 2: Start Python FastAPI AI Engine (Port 8000)
Open PowerShell Terminal 2:
```powershell
cd c:\Users\HP\Desktop\priva-fuse-frontend\backend-ai
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Check*: `http://127.0.0.1:8000/api/health`

---

### Step 3: Start React Vite Frontend (Port 5173)
Open PowerShell Terminal 3:
```powershell
cd c:\Users\HP\Desktop\priva-fuse-frontend
npm.cmd run dev
```
Open browser at: `http://localhost:5173`

---

## 📊 Default Demo Accounts

- **Hospital Admin**: `doctor@citygeneral.org` / `password123`
- **Central Coordinator**: `admin@privafuse.org` / `password123`
- **Researcher**: `researcher@privafuse.org` / `password123`

---

## 🔒 Privacy & Compliance Limitations Notice

> [!WARNING]
> PrivaFuse is an academic demonstration platform. Standard model parameter updates are transmitted over REST APIs and require Transport Layer Security (TLS), access control tokens, and secure aggregation in production. This system is not HIPAA-certified or intended for real clinical diagnosis.
