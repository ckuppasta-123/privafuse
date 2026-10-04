import { useState } from "react";
import {
  BrainCircuit,
  Play,
  RotateCcw,
  ShieldCheck,
  Building2,
  Activity,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import "./Training.css";

const initialHospitals = [
  { name: "City General Hospital", location: "North Zone", status: "Ready" },
  { name: "St. Mary's Medical Center", location: "South Zone", status: "Ready" },
  { name: "Apollo Care Hospital", location: "East Zone", status: "Ready" },
  { name: "Unity Health Institute", location: "West Zone", status: "Ready" },
];

export default function Training() {
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(12);
  const [accuracy, setAccuracy] = useState(94.8);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [trainingResult, setTrainingResult] = useState("");

  async function startTraining() {
    setRunning(true);
    setCompleted(false);
    setError("");
    setTrainingResult("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/training/start",
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Federated learning simulation failed."
        );
      }

      setTrainingResult(
        data.result || data.message || "Training completed."
      );

      if (data.status === "completed") {
        setCompleted(true);
      }
    } catch (err) {
      setError(
        err.message || "Could not connect to the backend."
      );
    } finally {
      setRunning(false);
    }
  }

  function resetTraining() {
    setRunning(false);
    setRound(12);
    setAccuracy(94.8);
    setCompleted(false);
    setError("");
    setTrainingResult("");
  }

  return (
    <main className="training-page">
      <header className="training-header">
        <div>
          <span className="training-eyebrow">
            <BrainCircuit size={16} /> PRIVAFUSE MODEL OPERATIONS
          </span>
          <h1>Federated Learning</h1>
          <p>
            Coordinate collaborative model training while keeping hospital
            data local.
          </p>
        </div>
        <span className="training-demo-badge">SIMULATION</span>
      </header>

      <section className="training-stats">
        <article className="training-stat">
          <span className="training-icon purple-bg">
            <Building2 />
          </span>
          <p>Participating hospitals</p>
          <h2>04</h2>
          <small>Illustrative participants</small>
        </article>

        <article className="training-stat">
          <span className="training-icon blue-bg">
            <Activity />
          </span>
          <p>Training rounds</p>
          <h2>{round}</h2>
          <small>Demo round counter</small>
        </article>

        <article className="training-stat">
          <span className="training-icon green-bg">
            <CheckCircle2 />
          </span>
          <p>Demo model accuracy</p>
          <h2>{accuracy.toFixed(1)}%</h2>
          <small>Simulated value, not measured</small>
        </article>

        <article className="training-stat">
          <span className="training-icon orange-bg">
            <ShieldCheck />
          </span>
          <p>Raw patient records</p>
          <h2>0</h2>
          <small>Shared in this UI demo</small>
        </article>
      </section>

      <section className="training-content-grid">
        <article className="training-panel training-workflow">
          <div className="training-panel-title">
            <div>
              <h3>Training workflow</h3>
              <p>Illustration of a federated learning round</p>
            </div>
            <BrainCircuit size={23} color="#695ce5" />
          </div>

          <div className="workflow-steps">
            <div className="workflow-step">
              <span className="workflow-number">1</span>
              <div>
                <strong>Local training</strong>
                <p>
                  Each hospital trains a model on its own local data.
                </p>
              </div>
              <ShieldCheck size={20} color="#159b77" />
            </div>

            <div className="workflow-connector" />

            <div className="workflow-step">
              <span className="workflow-number">2</span>
              <div>
                <strong>Secure update transfer</strong>
                <p>
                  Model updates are sent for aggregation, not patient records.
                </p>
              </div>
              <ShieldCheck size={20} color="#159b77" />
            </div>

            <div className="workflow-connector" />

            <div className="workflow-step">
              <span className="workflow-number">3</span>
              <div>
                <strong>Global model aggregation</strong>
                <p>
                  A coordinator combines eligible local model updates.
                </p>
              </div>
              <BrainCircuit size={20} color="#695ce5" />
            </div>

            <div className="workflow-connector" />

            <div className="workflow-step">
              <span className="workflow-number">4</span>
              <div>
                <strong>Model distribution</strong>
                <p>
                  The updated global model is made available to participants.
                </p>
              </div>
              <CheckCircle2 size={20} color="#159b77" />
            </div>
          </div>

          <div className="training-actions">
            <button
              className="start-training-btn"
              onClick={startTraining}
              disabled={running}
            >
              <Play size={17} fill="currentColor" />
              {running ? "Training..." : "Start demo round"}
            </button>

            <button
              className="reset-training-btn"
              onClick={resetTraining}
              disabled={running}
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {running && (
            <div className="training-feedback">
              <span className="training-spinner" />
              Running federated learning simulation on the backend...
            </div>
          )}

          {completed && (
            <div className="training-success">
              <CheckCircle2 size={18} />
              Backend simulation completed successfully.
            </div>
          )}

          {error && (
            <div className="training-feedback" role="alert">
              <strong>Training error:</strong> {error}
            </div>
          )}

          {trainingResult && (
            <div className="training-feedback">
              <strong>Backend training output</strong>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginTop: "10px",
                }}
              >
                {trainingResult}
              </pre>
            </div>
          )}
        </article>

        <article className="training-panel">
          <div className="training-panel-title">
            <div>
              <h3>Hospital participation</h3>
              <p>Example federation members</p>
            </div>
            <span className="participant-count">04</span>
          </div>

          <div className="participant-list">
            {initialHospitals.map((hospital) => (
              <div className="participant-item" key={hospital.name}>
                <div className="participant-avatar">
                  <Building2 size={19} />
                </div>

                <div className="participant-details">
                  <strong>{hospital.name}</strong>
                  <span>{hospital.location}</span>
                </div>

                <span className="participant-status">
                  <span /> {hospital.status}
                </span>
              </div>
            ))}
          </div>

          <div className="privacy-note">
            <ShieldCheck size={21} />
            <div>
              <strong>Privacy by design</strong>
              <p>
                This page illustrates the workflow. Production privacy
                requires appropriate security, access controls, and
                update-protection measures.
              </p>
            </div>
          </div>

          <div className="last-round-note">
            <Clock3 size={16} />
            <span>Training history is not connected yet.</span>
          </div>
        </article>
      </section>
    </main>
  );
}
```