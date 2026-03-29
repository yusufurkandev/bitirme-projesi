const { Pool } = require("pg");

const pool = new Pool({
    user: "admin",
    host: "127.0.0.1",   // 🔥 localhost değil
    database: "bitirme_db",
    password: "1234",
    port: 5432,
});

pool.connect()
    .then(() => console.log("PostgreSQL bağlandı ✅"))
    .catch(err => console.error("DB bağlantı hatası ❌", err));

module.exports = pool;