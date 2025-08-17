# 🍵 TEA on-chain – Spill the Tea, Not Your Data

Welcome to **TEA** — the on-chain safety net that helps women share red flags about men *without* giving up their privacy.  
Think of it as “are we dating the same guy?” meets crypto security — but without the creepy data leaks.  

---

## 🚨 The Problem

Dating today is… tricky. The stats say it all:

- **91% of single women in the U.S.** worry about safety when dating.  
- **44% have felt unsafe** on a date (and **78%** of those unsafe dates started online).  
  👉 [Source](https://www.datingnews.com/industry-trends/single-women-dating-safety-statistics/?utm_source=chatgpt.com)

- **70% of women** snoop online before meeting a guy (versus only 45% of men 🤔).  
- **40% actually find sketchy stuff** (fake jobs, catfish pics, etc.)  
  👉 [Source](https://www.security.org/safety-while-dating/?utm_source=chatgpt.com)

Other apps tried to solve this (looking at you, viral “Tea” ☕), but fell short with **data leaks** and **malicious trolls**.  
👉 [Case in point](https://www.bbc.com/news/articles/c7vl57n74pqo)

---

## ✨ Our Spill-Proof Solution

- **Women-only red flag reports**  
  Share the tea without spilling your personal info (seriously, check the code).  

- **Staking = Skin in the Game**  
  Post garbage, lose your stake. Post truth, protect the community.  

- **Web2-smooth, Web3-strong**  
  - No crypto knowledge needed.  
  - No wallets to manage.  
  - No scary signing pop-ups.  
  - On/off-ramp with ease.  

- **TL;DR**: It gives the benefits of decentralization without the friction of blockchain. 

---

## 📜 Contracts

### Demo (Arbitrum Sepolia)
- 👩 **User**: `0x1f670b6db6cacfb6bb37e42831e6080debc928a6`  
  [View on Arbiscan](https://sepolia.arbiscan.io/address/0x1f670b6db6cacfb6bb37e42831e6080debc928a6)  
- 🛡️ **Admin**: `0x6DcdF2D57F55953ee170373bdb41b749a645C91e`
### (Arbitrum Sepolia)
- 💰 **Staking Contract**: `0x3Ff6Ca942eE9B5336433E884117C94Cd39058fA2`  
- 💵 **PYUSD**: `0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1`  

### Production (Arbitrum)
- 🚀 **Staking Contract**: *Coming soon*  
- 💵 **PYUSD**: `0x46850ad61c2b7d64d08c9c754f45254596696984`  

---

## 🔄 User Flow (aka How to Spill Safely)

1. ✉️ Log in with a magic link (Dynamic).  
2. 🪪 Pass KYC with Fern.  
3. 🕵️ Verify “yes, I’m female” via ZK proof (privacy FTW).  
4. 💸 Onramp funds.  
5. 🪙 Stake **$20 PYUSD** — slashable if you act sus.  
6. ☕ Leave reviews or check others’ TEA.  
7. 🏦 Unstake + cash out when you’re done.  

---

## Stack

### Frontend
- **Next.js app**  
- **Dynamic** – embedded wallet + magic link sign-in  
- **Viem** – contract reads/writes  

### Encryption
- **Google Gemini API (OCR)** – extract structured data (e.g., gender) from driver’s licenses.  
- **snarkjs ZK circuit** – verify “Sex/Gender = Female” without exposing personal data.  
- **Privacy-preserving design** – no photos, names, or IDs stored.  

### Backend
- **MongoDB** database  
- **Next.js API routes**  
- **Fern** – onramp/offramp logic  
- **Remix-deployed contracts** for staking  

---
## **Future Additions**
Advanced reporting & flagging logic
Paymaster – gasless transactions
Background check scraping integrations

## **License**
MIT License

## 🚀 Quickstart

```bash
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev



