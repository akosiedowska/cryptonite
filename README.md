# Cryptonite

## Contents

- [Live demo](#live-demo)
- [Sign in](#sign-in)
- [Project description](#project-description)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Screenshots](#screenshots)

## Live demo

<b> [Link to the live demo](https://cryptonite-lemon.vercel.app/)</b> <br>

## Sign in

To test the app you can log in in with username:

```
user
```

and password: 

```
user123
```

or create a new account

## Project description

Cryptonite is a cryptocurrency trading simulator, where you can:
- buy & sell crypto
- check you portfolio (with up-to-date values)
- check market data (data is refreshed every 10s, using CoinGecko API)
- list your favourite coins
- view transaction history
- manage your account (change password, username, email)

## Tools

built with:
- ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
- ![NgRx](https://img.shields.io/badge/ngrx-BA2BD2.svg?style=for-the-badge&logo=ngrx&logoColor=white)
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
- ![Angular Material](https://img.shields.io/badge/Angular%20Material-%23007ACC.svg?style=for-the-badge&logo=angular&logoColor=white)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [PostgreSQL](https://www.postgresql.org/)

### 1. Clone the repository

```bash
git clone https://gitlab2.eleks.com/a.kosiedowska/cryptonite.git
cd cryptonite
```

### 2. Install dependencies

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Configure environment variables

Copy the example files and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 4. Set up the database

Create the database, run the migrations and seed the wallet data:

```bash
createdb cryptonite
cd backend
npx knex migrate:latest
npm run wallet
```

### 5. Run the app

Backend (from `backend/`):

```bash
npm run dev
```

Frontend (from `frontend/`):

```bash
npm start
```

The app is then available at `http://localhost:4200` and the API at `http://localhost:8080`.

## Screenshots

<img src='./frontend/public/Screenshot_1.png' width="500" alt="screenshot"/> <br>
<img src='./frontend/public/Screenshot_2.png' width="500" alt="screenshot"/> <br>
<img src='./frontend/public/Screenshot_3.png' width="500" alt="screenshot"/> <br>
<img src='./frontend/public/Screenshot_4.png' width="500" alt="screenshot"/> <br>
<img src='./frontend/public/Screenshot_5.png' width="500" alt="screenshot"/> <br>
<img src='./frontend/public/Screenshot_6.png' width="500" alt="screenshot"/> <br>











