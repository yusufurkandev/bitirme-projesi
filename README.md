# Bitirme Projesi - Kişiselleştirilmiş Rota Uygulaması

## 🚀 Kullanılan Teknolojiler
- Node.js
- Express.js
- PostgreSQL
- Docker
- JWT Authentication

## 📌 Özellikler
- Kullanıcı kayıt sistemi (Register)
- Kullanıcı giriş sistemi (Login)
- JWT ile kimlik doğrulama
- PostgreSQL veritabanı
- Docker ile container yapısı

## ⚙️ Kurulum

### 1. Backend
cd backend
npm install
node index.js

### 2. Docker DB
cd docker
docker compose up -d

## 🔐 API Endpointleri

- POST /register
- POST /login
- GET /profile (token gerekli)
