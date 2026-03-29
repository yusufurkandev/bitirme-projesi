const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecretkey";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API çalışıyor 🚀");
});

// ✅ BURASI YENİ
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB bağlantı hatası");
    }
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔐 Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Kayıt hatası");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Kullanıcı bulunamadı");
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send("Şifre yanlış");
        }

        // 🔥 TOKEN OLUŞTUR
        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Giriş başarılı",
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Login hatası");
    }
});

app.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Gizli veri",
        user: req.user
    });
});

app.listen(3000, () => {
    console.log("Server 3000 portunda çalışıyor");
});

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