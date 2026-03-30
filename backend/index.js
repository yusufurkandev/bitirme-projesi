const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const places = require("./data/places.json");

const SECRET_KEY = "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API çalışıyor 🚀");
});

// ✅ DB TEST
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB bağlantı hatası");
  }
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );

    res.json({
      success: true,
      message: "Kayıt başarılı",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Kayıt hatası"
    });
  }
});

// ✅ LOGIN (TEK VE DOĞRU OLAN)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Şifre yanlış"
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Giriş başarılı",
      token: token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login hatası"
    });
  }
});

// ✅ AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token yok");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Geçersiz token");
  }
}

// ✅ PROTECTED ROUTE
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Gizli veri",
    user: req.user
  });
});

app.post("/generate-route", (req, res) => {
  const { traveler, trip, duration } = req.body;

  let filtered = places.filter(p => p.category === trip);

  filtered = filtered.filter(p => p.tags.includes(traveler));

  let maxTime = 180;

  if (duration === "1day") maxTime = 180;
  if (duration === "2day") maxTime = 360;
  if (duration === "3plus") maxTime = 600;

  let total = 0;
  let route = [];

  for (let place of filtered) {
    if (total + place.duration <= maxTime) {
      route.push(place);
      total += place.duration;
    }
  }

  res.json({
    success: true,
    route,
    totalTime: total
  });
});

// ✅ SERVER
app.listen(3000, "0.0.0.0", () => {
  console.log("Server 3000 portunda çalışıyor");
});