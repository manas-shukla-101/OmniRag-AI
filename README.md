# OmniRAG Enterprise: Next-Gen Multi-Source RAG Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF4F00?style=for-the-badge&logo=chroma&logoColor=white)
![LLaMA 3.3](https://img.shields.io/badge/LLaMA_3.3-0466C8?style=for-the-badge&logo=meta&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<div align="center">
  <img src="frontend/public/logo.png" alt="OmniRAG Logo" width="200" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
  <p><i>State-of-the-art Hybrid Search, Serverless Neural Reranking, and Agentic Routing in one premium workspace.</i></p>
</div>

> Here is the live OmniRag-AI: https://omnirag-ai.onrender.com/
---

## 📑 Table of Contents

| Section | Description |
|---------|-------------|
| [🧠 Overview](#-omnirag-enterprise-next-gen-multi-source-rag-assistant) | Project introduction and badges |
| [⚠️ Problem](#-the-problem) | The challenge of fragmented enterprise data |
| [💡 Solution](#-the-solution-omnirag-enterprise) | How OmniRAG solves hallucination and retrieval |
| [🛠️ Tech Stack](#-the-tech-stack) | Core technologies and models used |
| [🎯 Logic Flow](#-strategic-logic-flow) | Hybrid search and reranking architecture |
| [🚀 Quick Start](#-quick-start) | Setup and deployment instructions |
| [🌟 Key Features](#-key-features) | Standout functionalities |
| [💼 Use Cases](#-use-cases) | Practical applications |
| [👋 Connect](#-socials) | Social links |

---

## ⚠️ The Problem
Enterprise data is fragmented across PDFs, CSVs, and raw source code. Standard RAG pipelines rely purely on local semantic similarity, which fails catastrophically on exact keyword searches (like IDs or names) and demands massive server RAM (1GB+) to run PyTorch embeddings locally.

## 💡 The Solution: OmniRAG Enterprise
A comprehensive, full-stack AI workspace architected for **zero-footprint serverless deployments**. It orchestrates an intelligent **Hybrid Retrieval Pipeline** by combining exact keyword matching (BM25) with dense vector semantics via the **Hugging Face Inference API**, completely offloading the heavy ML processing. It then passes the results through a Serverless Cross-Encoder Neural Reranker to guarantee pinpoint accuracy while comfortably running on 512MB free-tier cloud servers!

### 🛠️ The Tech Stack
* **Frontend:** React + Vite (Premium Glassmorphism UI)
* **Backend:** FastAPI (Python)
* **Vector Database:** ChromaDB 
* **LLM Engine:** Meta LLaMA 3.3 (via Groq API for ultra-fast inference)
* **Embeddings & Reranking:** Hugging Face Inference API (Serverless offloading)
* **Retrieval Algorithms:** BM25 (Lexical) + Dense Semantic Embeddings + Cross-Encoder Reranking

---

## 🎥 Application Demo

### The Home Page (Secure API Onboarding)
<div align="center">
  <img src="docs/home.png" alt="Home Page" width="800" style="border-radius: 12px; border: 1px solid #333;">
</div>

### The Chat Workspace (Live RAG)
<div align="center">
  <img src="docs/workspace.png" alt="Chat Workspace" width="800" style="border-radius: 12px; border: 1px solid #333;">
</div>

---

## 🎯 Strategic Logic Flow

### 1. Multi-Source Ingestion
Drag and drop PDFs, CSVs, or `.js`/`.py` code files. The system intelligently routes the file to the correct chunking algorithm.

### 2. Zero-Footprint Hybrid Retrieval Engine
When a query is received, the system forks the search:
* **Lexical Path (BM25):** Searches for exact keyword matches.
* **Semantic Path (Hugging Face API):** Pings the Hugging Face Inference API to generate dense vectors without spiking local server RAM.

### 3. Serverless Neural Reranking (The Accuracy Edge)
The results from both paths are merged and passed to a **Cross-Encoder Model** (also hosted on Hugging Face). The API scores the exact relevance of each chunk against the user's prompt, filtering out noise and presenting only the absolute highest-confidence data to the LLM.

---

## 🚀 Quick Start

### Option 1: Render / Docker Deployment (Recommended)
Because OmniRAG uses serverless API offloading, it is lightweight enough to deploy on Render's 512MB Free Tier!
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Select the **Docker** runtime (Render will automatically detect the `Dockerfile`).
4. (Optional) Add your `.env` as a Secret File.
5. Deploy and watch your server boot instantly!

### Option 2: Local Development
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/manas-shukla-101/OmniRAG.git
   cd OmniRAG
   ```
2. **Install Backend Dependencies:**
   ```bash
   python -m venv .venv
   source .venv/Scripts/activate  # (Windows)
   pip install -r requirements.txt
   ```
3. **Run the Server:**
   ```bash
   python server.py
   ```
4. Access the gorgeous UI at `http://localhost:8000`.

---

## 🌟 Key Features

- **Dynamic Agentic Routing:** Intelligently routes queries based on context.
- **Serverless ML Architecture:** Offloads embeddings and reranking to Hugging Face to eliminate OOM (Out of Memory) crashes.
- **Map-Reduce Summarizer:** Synthesizes massive knowledge bases into concise executive briefs.
- **Glassmorphic UI:** A visually stunning, highly interactive frontend.
- **Dynamic API Key Configuration:** Securely supply your own Hugging Face and Groq keys directly from the UI.

## 💼 Use Cases

- **Codebase Onboarding:** Upload a massive repo and chat with your code.
- **Financial Analysis:** Ingest CSV datasets and ask complex comparative questions.
- **Legal Document Review:** Upload contracts (PDFs) and extract exact clauses without hallucinations.
- **Enterprise Internal Wikis:** A centralized brain for company knowledge.

---

**Designed and Developed with ❤️ by Manas Shukla**

---

## 🌐 Socials:
[![Portfolio](https://img.shields.io/badge/Portfolio-Website-blue)](https://manas-shukla-portfolio.framer.website) [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/manas_shukla_101) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/manas-shukla-006774370) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:shuklamanas8928@gmail.com)
