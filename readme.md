# 💳 Virtual ATM Banking System

A modern, interactive **Virtual ATM Web Application** designed for seamless deployment on **Vercel** and **GitHub**, featuring realistic digital banking, fund transfers, and live transaction statements.

---

## 🌟 Key Features

- **Realistic Virtual Debit Card**: Live card chip, masked card number, cardholder name, and animated real-time balance.
- **Secure Authentication**: PIN-based login and new account creation with duplicate account prevention.
- **Instant Cash Deposit**: Quick-add cash chips (`+₹500`, `+₹1,000`, `+₹2,000`, `+₹5,000`) and custom amounts with immediate balance credit.
- **Cash Withdrawal**: Overdraft prevention ensuring accounts cannot be overdrawn (`Insufficient Balance!` guard).
- **Inter-Account Fund Transfer**: Send money directly between accounts with real-time recipient verification and double-entry transaction records.
- **Interactive Mini Statement**: Complete filterable transaction ledger (Deposits, Withdrawals, Transfers) with timestamps, transaction IDs, and resulting balances.
- **Evaluator Quick-Test Dropdown**: 1-click login selector for teachers and evaluators to test all pre-seeded accounts instantly.
- **Persistent Storage**: Changes, new accounts, and transactions persist seamlessly in the browser.

---

## 👥 Pre-Loaded Test Accounts

The system comes pre-loaded with the original 7 customer accounts and 28 transaction records:

| Account No | Account Holder | PIN | Initial Balance |
| :--- | :--- | :--- | :--- |
| **989555** | Ketki Gaikwad | `9988` | ₹51,900.00 |
| **989666** | Om Nanaware | `9988` | ₹50,900.00 |
| **989777** | Raj Jaiswar | `0707` | ₹11,500.00 |
| **989888** | Prachee Wakode | `9988` | ₹0.00 |
| **123456789** | Om Nanaware | `9988` | ₹8,000.00 |
| **989000** | Aryan Sawaisraje | `456` | ₹11,250.00 |
| **666666** | Om Nanaware | `456` | ₹1,250.00 |

*(You can also click **"Open New Account"** to create any custom account!)*

---

## 🚀 Deploying to Vercel (Zero Errors, 1-Click)

This project is rebuilt with native web standards (`index.html`, `css/style.css`, `js/app.js`, `vercel.json`), ensuring **100% error-free instant deployment on Vercel**:

### Method 1: Deploy via Vercel Dashboard
1. Push this repository to your **GitHub** account (instructions below).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Leave all build settings as default (Framework Preset: **Other**, Build Command: **None**).
5. Click **Deploy**!
6. Your ATM is live globally with an HTTPS URL in ~5 seconds!

### Method 2: Deploy via Vercel CLI
```bash
npx vercel
```

---

## 🐙 Push to Your GitHub Account

1. Create a new repository on your GitHub account (e.g. `virtual-atm`) at [github.com/new](https://github.com/new).
2. In your local project directory, update the remote to your repository:
   ```bash
   git remote set-url origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   ```
3. Push the commits:
   ```bash
   git push -u origin main
   ```

---

## 💻 Running Locally

### Option A: Open directly in Browser
Simply double-click `index.html` or open it in any modern web browser.

### Option B: Local Web Server
Using Python:
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Using Node.js:
```bash
npx serve .
```

### Option C: Python Streamlit (Preserved)
The original Streamlit implementation is also preserved:
```bash
pip install -r requirements.txt
streamlit run app.py
```

---

## 📁 Project Architecture

```text
├── index.html          # Main HTML5 entry point for Vercel
├── vercel.json         # Vercel deployment configuration & security headers
├── css/
│   └── style.css       # Responsive dark-theme ATM banking UI
├── js/
│   ├── data.js         # Pre-loaded customer accounts & transaction ledger
│   └── app.js          # Core ATM engine, validation, and UI controller
├── app.py              # Original Streamlit application (preserved)
├── atm.py              # Original ATM OOP module (preserved)
├── database.py         # Original SQLite initialization (preserved)
├── atm.db              # Original SQLite database file (preserved)
├── requirements.txt    # Streamlit dependencies
└── README.md           # Documentation
```
