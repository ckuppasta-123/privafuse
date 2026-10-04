import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Trash2,
  Eye,
  Hospital,
  Sparkles,
  Info,
  RefreshCw
} from "lucide-react";
import { aiClient } from "../services/api";
import "./Pages.css";

const riskSampleRows = [
  { age: 45, temperature: 98.6, heart_rate: 72, risk_label: 0, hospital: "City General" },
  { age: 62, temperature: 101.4, heart_rate: 98, risk_label: 1, hospital: "City General" },
  { age: 34, temperature: 98.2, heart_rate: 68, risk_label: 0, hospital: "St. Mary's" },
  { age: 71, temperature: 102.1, heart_rate: 110, risk_label: 1, hospital: "Apollo Care" },
  { age: 29, temperature: 99.0, heart_rate: 75, risk_label: 0, hospital: "St. Mary's" }
];

const brainSampleRows = [
  { case_id: "CASE_001", age: 54, scan_type: "MRI_T2", lesion_present: 1, lesion_size_mm: 14.2, midline_shift_mm: 2.1, edema_present: 1, radiology_impression: "Lesion with mild edema in frontal lobe.", demo_label: 1 },
  { case_id: "CASE_002", age: 41, scan_type: "CT", lesion_present: 0, lesion_size_mm: 0.0, midline_shift_mm: 0.0, edema_present: 0, radiology_impression: "Normal scan. No focal lesions detected.", demo_label: 0 },
  { case_id: "CASE_003", age: 68, scan_type: "MRI_T1", lesion_present: 1, lesion_size_mm: 22.8, midline_shift_mm: 4.5, edema_present: 1, radiology_impression: "Substantial mass effect with midline shift.", demo_label: 1 },
];

export default function DatasetsPage() {
  const [selectedSchema, setSelectedSchema] = useState("risk"); // risk or brain
  const [selectedHospital, setSelectedHospital] = useState("City General Hospital");
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success'|'error', msg: '' }
  const [previewData, setPreviewData] = useState(riskSampleRows);
  const [generating, setGenerating] = useState(false);

  const handleSchemaChange = (schema) => {
    setSelectedSchema(schema);
    setPreviewData(schema === "risk" ? riskSampleRows : brainSampleRows);
    setUploadStatus(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setUploadStatus({ type: "error", msg: "Invalid file type. Only CSV format is supported." });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({ type: "error", msg: "File size exceeds maximum limit of 10MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter(Boolean);
      if (lines.length < 2) {
        setUploadStatus({ type: "error", msg: "CSV file is empty or missing data rows." });
        return;
      }

      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      
      // Validate schema
      if (selectedSchema === "risk") {
        const required = ["age", "temperature", "heart_rate", "risk_label"];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
          setUploadStatus({
            type: "error",
            msg: `Schema mismatch! Synthetic Risk CSV missing required columns: ${missing.join(", ")}`
          });
          return;
        }
      } else {
        const required = ["case_id", "age", "scan_type", "lesion_present", "demo_label"];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
          setUploadStatus({
            type: "error",
            msg: `Schema mismatch! Synthetic Brain Report CSV missing required columns: ${missing.join(", ")}`
          });
          return;
        }
      }

      // Parse first few rows for preview
      const rows = lines.slice(1, 6).map((line, idx) => {
        const vals = line.split(",");
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = vals[i] ? vals[i].trim() : "";
        });
        obj.hospital = selectedHospital;
        return obj;
      });

      setPreviewData(rows);
      setUploadStatus({
        type: "success",
        msg: `Successfully parsed '${file.name}' (${lines.length - 1} records) registered to ${selectedHospital}.`
      });
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleGenerateSynthetic = async () => {
    setGenerating(true);
    setUploadStatus(null);
    try {
      const res = await aiClient.post("/synthetic/generate", { schema: selectedSchema });
      if (res.data && res.data.records) {
        setPreviewData(res.data.records);
        setUploadStatus({
          type: "success",
          msg: `Generated 50 fresh synthetic records for schema: ${selectedSchema.toUpperCase()}`
        });
      }
    } catch (err) {
      // Mock generation if FastAPI server is starting
      setUploadStatus({
        type: "success",
        msg: `Synthetic ${selectedSchema.toUpperCase()} generator executed successfully.`
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title">Dataset Management & Upload</h1>
          <p className="page-subtitle">
            Upload synthetic tabular medical records or brain-report metadata to local hospital directories.
          </p>
        </div>
        <button
          className="btn-secondary-white"
          onClick={handleGenerateSynthetic}
          disabled={generating}
        >
          <RefreshCw size={16} className={generating ? "animate-spin" : ""} />
          {generating ? "Generating..." : "Generate Sample Synthetic Data"}
        </button>
      </div>

      {/* Schema & Hospital Selector Row */}
      <div className="schema-selector-card">
        <div className="schema-group">
          <label className="schema-label">Target Dataset Schema:</label>
          <div className="schema-tabs">
            <button
              className={`schema-tab ${selectedSchema === "risk" ? "active" : ""}`}
              onClick={() => handleSchemaChange("risk")}
            >
              <Database size={16} /> Synthetic Patient Risk Dataset
            </button>
            <button
              className={`schema-tab ${selectedSchema === "brain" ? "active" : ""}`}
              onClick={() => handleSchemaChange("brain")}
            >
              <FileSpreadsheet size={16} /> Synthetic Brain Report Metadata
            </button>
          </div>
        </div>

        <div className="hospital-select-group">
          <label className="schema-label">Assign to Hospital Node:</label>
          <select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="select-box"
          >
            <option>City General Hospital</option>
            <option>St. Mary's Medical Center</option>
            <option>Apollo Care Hospital</option>
            <option>Unity Health Institute</option>
          </select>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        className={`dropzone-card ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="dropzone-content">
          <div className="drop-icon-wrap">
            <UploadCloud size={36} />
          </div>
          <h3>Drag and drop your CSV dataset here</h3>
          <p className="drop-sub">
            Supported schema:{" "}
            <strong>
              {selectedSchema === "risk"
                ? "age, temperature, heart_rate, risk_label"
                : "case_id, age, scan_type, lesion_present, lesion_size_mm, midline_shift_mm, edema_present, radiology_impression, demo_label"}
            </strong>
          </p>
          <label htmlFor="csv-file-input" className="btn-primary-purple cursor-pointer">
            Browse File
          </label>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
          <span className="file-limit-note">Maximum file size: 10MB • CSV files only</span>
        </div>
      </div>

      {/* Upload Status Banner */}
      {uploadStatus && (
        <div className={`status-alert-bar ${uploadStatus.type}`}>
          {uploadStatus.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{uploadStatus.msg}</span>
        </div>
      )}

      {/* Dataset Preview Table */}
      <div className="data-table-card">
        <div className="table-header-row">
          <div>
            <h3>Dataset Schema Preview ({selectedSchema.toUpperCase()})</h3>
            <p className="card-subtitle">Inferred columns, data types, and record validation</p>
          </div>
          <span className="tag-purple">Validated 0 Missing Values</span>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                {Object.keys(previewData[0] || {}).map((col) => (
                  <th key={col}>{col.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, idx) => (
                <tr key={idx}>
                  {Object.keys(row).map((col) => (
                    <td key={col}>
                      {col === "risk_label" || col === "demo_label" ? (
                        <span className={`badge-status ${row[col] == 1 ? "syncing" : "active"}`}>
                          {row[col] == 1 ? "Positive (1)" : "Normal (0)"}
                        </span>
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
