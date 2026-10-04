const fs = require("fs");
const path = require("path");

const STORE_FILE = path.join(__dirname, "../../data_store.json");

// Initial seed data
const defaultData = {
  users: [
    {
      id: "u_1",
      name: "Dr. Alex Vance",
      email: "doctor@citygeneral.org",
      passwordHash: "$2a$10$e8R6.V0wzM8vGq1lW3Y0xe5PZ7g1g.mJ/1w/6n3B0G2X4Y6Z8W0K6", // "password123"
      role: "hospital_admin",
      hospital: "City General Hospital",
      createdAt: new Date().toISOString()
    },
    {
      id: "u_2",
      name: "Central Coordinator",
      email: "admin@privafuse.org",
      passwordHash: "$2a$10$e8R6.V0wzM8vGq1lW3Y0xe5PZ7g1g.mJ/1w/6n3B0G2X4Y6Z8W0K6",
      role: "admin",
      hospital: "Central Coordinator Node",
      createdAt: new Date().toISOString()
    },
    {
      id: "u_3",
      name: "Dr. Elena Rostova",
      email: "researcher@privafuse.org",
      passwordHash: "$2a$10$e8R6.V0wzM8vGq1lW3Y0xe5PZ7g1g.mJ/1w/6n3B0G2X4Y6Z8W0K6",
      role: "researcher",
      hospital: "Healthcare Research Institute",
      createdAt: new Date().toISOString()
    }
  ],
  hospitals: [
    {
      id: "hosp_1",
      name: "City General Hospital",
      location: "North Zone (Chicago, IL)",
      contact: "Dr. Sarah Jenkins",
      email: "sarah.j@citygeneral.org",
      status: "Active",
      participating: true,
      localPath: "/data/hospitals/city_general/",
      recordsCount: 1250,
      datasets: ["hospital_a.csv", "hospital_a_brain_demo.csv"],
      lastSync: "10 mins ago"
    },
    {
      id: "hosp_2",
      name: "St. Mary's Medical Center",
      location: "South Zone (Austin, TX)",
      contact: "Dr. Robert Chen",
      email: "r.chen@stmarys.org",
      status: "Active",
      participating: true,
      localPath: "/data/hospitals/st_marys/",
      recordsCount: 980,
      datasets: ["hospital_b.csv", "hospital_b_brain_demo.csv"],
      lastSync: "25 mins ago"
    },
    {
      id: "hosp_3",
      name: "Apollo Care Hospital",
      location: "East Zone (Boston, MA)",
      contact: "Dr. Anita Patel",
      email: "anita.p@apollocare.org",
      status: "Active",
      participating: true,
      localPath: "/data/hospitals/apollo_care/",
      recordsCount: 1420,
      datasets: ["hospital_c.csv", "hospital_c_brain_demo.csv"],
      lastSync: "1 hour ago"
    },
    {
      id: "hosp_4",
      name: "Unity Health Institute",
      location: "West Zone (Seattle, WA)",
      contact: "Dr. Marcus Brody",
      email: "m.brody@unityhealth.org",
      status: "Offline",
      participating: false,
      localPath: "/data/hospitals/unity_health/",
      recordsCount: 850,
      datasets: ["hospital_d_risk.csv"],
      lastSync: "1 day ago"
    }
  ],
  datasets: [
    {
      id: "ds_1",
      filename: "hospital_a.csv",
      schema: "risk",
      hospital: "City General Hospital",
      rowCount: 1250,
      colCount: 4,
      uploadedAt: new Date().toISOString()
    },
    {
      id: "ds_2",
      filename: "hospital_a_brain_demo.csv",
      schema: "brain",
      hospital: "City General Hospital",
      rowCount: 10,
      colCount: 9,
      uploadedAt: new Date().toISOString()
    }
  ],
  trainingJobs: [
    {
      jobId: "job_101",
      round: 6,
      globalAccuracy: 94.8,
      status: "completed",
      participants: 3,
      createdAt: new Date().toISOString()
    }
  ],
  auditEvents: [
    {
      id: "aud_1",
      event: "GLOBAL_MODEL_AGGREGATED",
      description: "FedAvg round 6 completed across 3 hospital nodes.",
      user: "System Coordinator",
      timestamp: new Date().toISOString()
    }
  ]
};

function readStore() {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write JSON store:", err);
  }
}

module.exports = {
  readStore,
  writeStore
};
