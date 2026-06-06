import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to local fallback JSON database
const LOCAL_DB_PATH = path.join(process.cwd(), "src", "data", "local_rankings.json");

// Ensure folder and file exist
if (!fs.existsSync(LOCAL_DB_PATH)) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([
    { id: 'h1', player_name: '영주 반 케일런 (Lord Kaelen)', score: 7850, stage: 30, survived: true, play_time: 1450, created_at: '2026-06-01T12:00:00Z' },
    { id: 'h2', player_name: '흑조 가문 실라 (Shilla Crow)', score: 6420, stage: 27, survived: false, play_time: 1210, created_at: '2026-06-03T14:30:00Z' },
    { id: 'h3', player_name: '구원의 사제 마리우스 (Marius)', score: 5900, stage: 30, survived: true, play_time: 1890, created_at: '2026-06-04T09:12:00Z' },
    { id: 'h4', player_name: '바람의 방랑자 티모시 (Timothy)', score: 4350, stage: 21, survived: false, play_time: 980, created_at: '2026-06-05T15:24:00Z' },
    { id: 'h5', player_name: '심연의 잠수부 바일라 (Vayla)', score: 3200, stage: 15, survived: false, play_time: 670, created_at: '2026-06-05T20:18:00Z' }
  ], null, 2));
}

// Supabase helper
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== "your_database_url" && supabaseAnonKey !== "your_database_key") {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
} else {
  console.log("Supabase URL or Key not set. Using local file-system fallback rankings database.");
}

// GET rankings
app.get("/api/rankings", async (req, res) => {
  try {
    if (supabase) {
      console.log("Fetching rankings from Supabase...");
      const { data, error } = await supabase
        .from("rankings")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);
      if (!error && data) {
        return res.json(data);
      }
      console.warn("Supabase query failed, falling back to local database:", error);
    }

    // Fallback
    const fileData = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    const rankings = JSON.parse(fileData);
    // Sort descending by score
    rankings.sort((a: any, b: any) => b.score - a.score);
    res.json(rankings.slice(0, 10));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST ranking
app.post("/api/rankings", async (req, res) => {
  try {
    const { player_name, score, stage, survived, play_time } = req.body;
    if (!player_name || score === undefined) {
      return res.status(400).json({ error: "Missing player_name or score" });
    }

    const newRecord = {
      id: `rank_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      player_name,
      score: Number(score),
      stage: Number(stage || 1),
      survived: Boolean(survived),
      play_time: Number(play_time || 0),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      console.log("Inserting ranking to Supabase...");
      const { data, error } = await supabase
        .from("rankings")
        .insert([newRecord])
        .select();
      if (!error && data) {
        return res.json({ success: true, data: data[0] });
      }
      console.warn("Supabase insert failed, falling back to local database:", error);
    }

    // Fallback
    const fileData = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    const rankings = JSON.parse(fileData);
    rankings.push(newRecord);
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(rankings, null, 2));

    res.json({ success: true, data: newRecord });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Path to personal campaigns storage
const CAMPAIGNS_DB_PATH = path.join(process.cwd(), "src", "data", "personal_campaigns.json");

// Ensure folder and file exist for personal campaigns
if (!fs.existsSync(CAMPAIGNS_DB_PATH)) {
  fs.mkdirSync(path.dirname(CAMPAIGNS_DB_PATH), { recursive: true });
  fs.writeFileSync(CAMPAIGNS_DB_PATH, JSON.stringify({}, null, 2));
}

// POST campaign save
app.post("/api/campaign/save", async (req, res) => {
  try {
    const { player_name, player_code, stage, stats, deck, elapsed_seconds } = req.body;
    if (!player_name || !player_code) {
      return res.status(400).json({ error: "Missing player_name or player_code" });
    }
    const key = `${player_name.trim()}_${player_code.trim()}`;
    const fileData = fs.readFileSync(CAMPAIGNS_DB_PATH, "utf-8");
    const campaigns = JSON.parse(fileData);
    
    campaigns[key] = {
      player_name,
      player_code,
      stage: Number(stage || 1),
      stats,
      deck,
      elapsed_seconds: Number(elapsed_seconds || 0),
      updated_at: new Date().toISOString()
    };
    
    fs.writeFileSync(CAMPAIGNS_DB_PATH, JSON.stringify(campaigns, null, 2));
    res.json({ success: true, message: "Campaign saved successfully", key });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET campaign load
app.get("/api/campaign/load", async (req, res) => {
  try {
    const { player_name, player_code } = req.query;
    if (!player_name || !player_code) {
      return res.status(400).json({ error: "Missing player_name or player_code parameters" });
    }
    const key = `${String(player_name).trim()}_${String(player_code).trim()}`;
    const fileData = fs.readFileSync(CAMPAIGNS_DB_PATH, "utf-8");
    const campaigns = JSON.parse(fileData);
    
    if (campaigns[key]) {
      return res.json({ success: true, found: true, data: campaigns[key] });
    } else {
      return res.json({ success: true, found: false });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware integration
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
