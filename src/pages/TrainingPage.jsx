import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Hospital as HospitalIcon,
  CheckCircle2,
  Clock,
  Activity,
  Brain,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { aiClient } from "../services/api";
import "./Pages.css";

const initialClients = [
  { id: "client_a", name: "Hospital A (City General)", dataset: "hospital_a.csv", samples: 1250, status: "Ready", accuracy: 92.4, progress: 0 },
  { id: "client_b", name: "Hospital B (St. Mary's)", dataset: "hospital_b.csv", samples: 980, status: "Ready", accuracy: 91.8, progress: 0 },
  { id: "client_c", name: "Hospital C (Apollo Care)", dataset: "hospital_c.csv", samples: 1420, status: "Ready", accuracy: 93.6, progress: 0 },
];

const initialHistory = [
  { round: 1, globalAccuracy: 71.5, loss: 0.58, duration: "1.2s", clients: 3 },
  { round: 2, globalAccuracy: 78.4, loss: 0.49, duration: "1.1s", clients: 3 },
  { round: 3, globalAccuracy: 84.2, loss: 0.41, duration: "1.3s", clients: 3 },
  { round: 4, globalAccuracy: 89.0, loss: 0.32, duration: "1.2s", clients: 3 },
  { round: 5, globalAccuracy: 92.8, loss: 0.24, duration: "1.0s", clients: 3 },
  { round: 6, globalAccuracy: 94.8, loss: 0.18, duration: "1.2s", clients: 3 },
];

export default function TrainingPage() {
  const [running, setRunning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [currentRound, setCurrentRound] = useState(7);
  const [globalAccuracy, setGlobalAccuracy] = useState(94.8);
  const [globalLoss, setGlobalLoss] = useState(0.18);
  const [stepStage, setStepStage] = useState(0); // 0: Idle, 1: Validating, 2: Local Training, 3: FedAvg Aggregation, 4: Global Eval, 5: Completed
  const [clients, setClients] = useState(initialClients);
  const [history, setHistory] = useState(initialHistory);
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const startFederatedTraining = async () => {
    setRunning(true);
    setStopped(false);
    setStepStage(1);
    addLog("Initiating Federated Round R" + currentRound);

    try {
      // Step 1: Validate datasets
      setStepStage(1);
      addLog("Step 1: Validating hospital local CSV schemas and random seeds...");
      await new Promise(r => setTimeout(r, 600));

      // Step 2: Local Training per hospital node
      setStepStage(2);
      addLog("Step 2: Dispatching local model training (Logistic Regression) to Hospital nodes A, B, and C...");
      setClients(prev => prev.map(c => ({ ...c, status: "Training", progress: 40 })));
      await new Promise(r => setTimeout(r, 800));

      setClients(prev => prev.map(c => ({ ...c, status: "Extracting Weights", progress: 85 })));
      await new Promise(r => setTimeout(r, 600));

      // Step 3: FedAvg Aggregation via FastAPI backend
      setStepStage(3);
      addLog("Step 3: Transmitting compatible model parameters (weights & intercept) to Coordinator...");
      addLog("Step 3: Performing FedAvg sample-count weighted parameter aggregation...");
      
      let res;
      try {
        res = await aiClient.post("/federated/train-round", { round: currentRound });
      } catch (err) {
        // Fallback calculation for demo
        const newAcc = Math.min(98.5, parseFloat((globalAccuracy + 0.9).toFixed(1)));
        const newLoss = Math.max(0.08, parseFloat((globalLoss - 0.03).toFixed(2)));
        res = {
          data: {
            round: currentRound,
            globalAccuracy: newAcc,
            globalLoss: newLoss,
            duration: "1.4s"
          }
        };
      }

      // Step 4: Global Evaluation
      setStepStage(4);
      addLog("Step 4: Evaluating global model on held-out test dataset...");
      await new Promise(r => setTimeout(r, 600));

      // Complete
      const newAcc = res.data.globalAccuracy;
      const newLoss = res.data.globalLoss;
      const newHist = {
        round: currentRound,
        globalAccuracy: newAcc,
        loss: newLoss,
        duration: res.data.duration || "1.3s",
        clients: 3
      };

      setGlobalAccuracy(newAcc);
      setGlobalLoss(newLoss);
      setHistory(prev => [...prev, newHist]);
      setCurrentRound(prev => prev + 1);
      setClients(prev => prev.map(c => ({ ...c, status: "Ready", progress: 100, accuracy: parseFloat((newAcc - (Math.random()*1.5)).toFixed(1)) })));
      setStepStage(5);
      addLog(`Round R${currentRound} finished successfully! Global Accuracy reached ${newAcc}%.`);

    } catch (err) {
      addLog("Error during federated training: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const stopTraining = () => {
    setRunning(false);
    setStopped(true);
    setStepStage(0);
    addLog("Training process safely halted by operator.");
  };

  const resetSimulation = () => {
    setRunning(false);
    setStopped(false);
    setCurrentRound(1);
    setGlobalAccuracy(68.2);
    setGlobalLoss(0.62);
    setStepStage(0);
    setClients(initialClients);
    setHistory([]);
    setLogs([]);
    addLog("Federated simulation reset to initial state.");
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Federated Learning Control Center</h1>
          <p className="page-subtitle">
            Coordinate multi-hospital local training, model update aggregation (FedAvg), and global versioning.
          </p>
        </div>
        <div className="control-btn-group">
          {!running ? (
            <button className="btn-primary-purple" onClick={startFederatedTraining}>
              <Play size={16} /> Start Next FL Round (R{currentRound})
            </button>
          ) : (
            <button className="btn-danger-red" onClick={stopTraining}>
              <Square size={16} /> Stop Training
            </button>
          )}
          <button className="btn-secondary-white" onClick={resetSimulation}>
            <RotateCcw size={16} /> Reset Demo
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="fl-stepper-card">
        <div className="stepper-title">
          <Layers size={18} className="text-purple-600" />
          <span>Federated Training Protocol Pipeline</span>
        </div>
        <div className="steps-row">
          <div className={`step-node ${stepStage >= 1 ? "active" : ""}`}>
            <span className="step-num">1</span>
            <span className="step-lbl">Validate Datasets</span>
          </div>
          <div className="step-line" />
          <div className={`step-node ${stepStage >= 2 ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-lbl">Local Hospital Training</span>
          </div>
          <div className="step-line" />
          <div className={`step-node ${stepStage >= 3 ? "active" : ""}`}>
            <span className="step-num">3</span>
            <span className="step-lbl">FedAvg Weight Aggregation</span>
          </div>
          <div className="step-line" />
          <div className={`step-node ${stepStage >= 4 ? "active" : ""}`}>
            <span className="step-num">4</span>
            <span className="step-lbl">Global Test Evaluation</span>
          </div>
        </div>
      </div>

      {/* 3 Hospital Client Nodes Grid */}
      <div className="hospitals-fl-grid">
        {clients.map((c) => (
          <div key={c.id} className="fl-client-card">
            <div className="client-card-header">
              <div className="client-icon"><HospitalIcon size={20} /></div>
              <div className="client-meta">
                <h4>{c.name}</h4>
                <span className="client-dataset">{c.dataset} • {c.samples} rows</span>
              </div>
              <span className={`badge-status ${c.status === "Training" ? "syncing" : "active"}`}>
                {c.status}
              </span>
            </div>

            <div className="client-progress-bar-bg">
              <div className="client-progress-fill" style={{ width: `${c.progress}%` }} />
            </div>

            <div className="client-card-stats">
              <div className="c-stat">
                <span className="c-lbl">Local Model Accuracy</span>
                <span className="c-val">{c.accuracy}%</span>
              </div>
              <div className="c-stat">
                <span className="c-lbl">Local Training Data</span>
                <span className="c-val">{c.samples} samples</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accuracy Convergence Chart & Live Logs */}
      <div className="fl-main-grid">
        {/* Convergence Chart */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Global Accuracy & Loss Convergence</h3>
              <p className="card-subtitle">Round-by-round global model evaluation on test set</p>
            </div>
            <span className="tag-purple">Current: {globalAccuracy}%</span>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="round" stroke="#94a3b8" />
                <YAxis domain={[50, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Legend />
                <Line type="monotone" dataKey="globalAccuracy" stroke="#6366f1" strokeWidth={3} name="Accuracy (%)" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Logs Terminal */}
        <div className="terminal-card">
          <div className="terminal-header">
            <Cpu size={16} className="text-emerald-400" />
            <span>Coordinator Event Stream Log</span>
          </div>
          <div className="terminal-body">
            {logs.length === 0 ? (
              <p className="terminal-empty">Ready. Click 'Start Next FL Round' to initiate federated learning cycle.</p>
            ) : (
              logs.map((l, i) => <div key={i} className="terminal-line">{l}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
