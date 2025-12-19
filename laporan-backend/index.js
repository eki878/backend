const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// path file json (biar aman di server)
const DATA_FILE = path.join(__dirname, "laporan.json");

// Load data
function loadLaporan() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const dataBuffer = fs.readFileSync(DATA_FILE);
    return JSON.parse(dataBuffer.toString());
  } catch (e) {
    return [];
  }
}

// Save data
function saveLaporan(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET
app.get("/laporan", (req, res) => {
  res.json(loadLaporan());
});

// POST
app.post("/laporan", (req, res) => {
  const laporan = loadLaporan();
  laporan.push(req.body);
  saveLaporan(laporan);
  res.status(201).json({ message: "Laporan disimpan" });
});

// health check (penting)
app.get("/", (req, res) => {
  res.send("API laporan berjalan");
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
