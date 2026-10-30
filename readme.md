# 💳 Virtual ATM System

A modern, interactive Virtual ATM web application built with **Python**, **Streamlit**, and **SQLite**.

---

## ✨ Features

- **User Authentication**: Secure Account Creation (Sign Up) and PIN-based Login.
- **Deposit**: Instant deposit into account balance with real-time balance update.
- **Withdrawal**: Balance validation to prevent overdrafts.
- **Fund Transfer**: Transfer funds between registered account numbers with automatic balance checks.
- **Mini Statement**: View recent transaction history (type, date, amount, and resulting balance).
- **Session Management**: Secure logout and session clearing.

---

## 🛠️ Tech Stack

- **Frontend & UI**: [Streamlit](https://streamlit.io/)
- **Backend Logic**: Python (Object-Oriented ATM module)
- **Database**: SQLite3 (`atm.db`)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have **Python 3.9+** installed on your machine.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Application
```bash
streamlit run app.py
```
The app will automatically open in your default browser at `http://localhost:8501`.

---

## 🌐 Deployment Guide

### Option 1: Streamlit Community Cloud (Recommended - Free & 1-Click)
Streamlit apps require an active Python process and WebSockets, making **Streamlit Community Cloud** the native and zero-configuration platform for deployment:

1. Push this repository to your **GitHub** account.
2. Go to [share.streamlit.io](https://share.streamlit.io/) and sign in with GitHub.
3. Click **"New app"**.
4. Select your repository, branch (`main`), and set the main file path to `app.py`.
5. Click **"Deploy!"** — your app is live on a public URL with auto-updates on every `git push`.

### Option 2: Render / Railway / Cloud VM
You can also deploy to platforms like [Render](https://render.com) or [Railway](https://railway.app):
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `streamlit run app.py --server.port $PORT --server.address 0.0.0.0`

---

## 📁 Project Structure

```text
├── app.py              # Main Streamlit web application & UI
├── atm.py              # ATM business logic (OOP class)
├── database.py         # SQLite database schema & initialization
├── atm.db              # SQLite database file
├── requirements.txt    # Project dependencies
└── README.md           # Documentation
```
