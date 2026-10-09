# OmniRAG Enterprise: Next-Gen Multi-Source RAG Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF4F00?style=for-the-badge&logo=chroma&logoColor=white)
![LLaMA 3.3](https://img.shields.io/badge/LLaMA_3.3-0466C8?style=for-the-badge&logo=meta&logoColor=white)
![ONNX](https://img.shields.io/badge/ONNX-005CED?style=for-the-badge&logo=onnx&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<div align="center">
  <img src="frontend/public/logo.png" alt="OmniRAG Logo" width="200" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
  <p><i>State-of-the-art Hybrid Search, Ultra-Lightweight ONNX Embeddings, and Agentic Routing in one premium workspace.</i></p>
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
| [🎯 Logic Flow](#-strategic-logic-flow) | Hybrid search architecture |
| [🚀 Quick Start](#-quick-start) | Setup and deployment instructions |
| [🌟 Key Features](#-key-features) | Standout functionalities |
| [💼 Use Cases](#-use-cases) | Practical applications |
| [👋 Connect](#-socials) | Social links |

---

## ⚠️ The Problem
Enterprise data is fragmented across PDFs, CSVs, and raw source code. Standard RAG pipelines rely purely on local semantic similarity, which fails catastrophically on exact keyword searches (like IDs or names) and demands massive server RAM (1GB+) to run PyTorch embeddings locally — making free-tier cloud deployment impossible.

## 💡 The Solution: OmniRAG Enterprise
A comprehensive, full-stack AI workspace architected for **zero-crash, low-memory deployments**. It orchestrates an intelligent **Hybrid Retrieval Pipeline** by combining exact keyword matching (BM25) with dense vector semantics. By swapping out heavy PyTorch models for the **ONNX Runtime**, it generates powerful sentence embeddings locally using less than 100MB of RAM — completely immune to network glitches and comfortably running on 512MB free-tier cloud servers!

### 🛠️ The Tech Stack
* **Frontend:** React + Vite (Premium Glassmorphism UI)
* **Backend:** FastAPI (Python)
* **Vector Database:** ChromaDB
* **LLM Engine:** Meta LLaMA 3.3 (via Groq API for ultra-fast inference)
* **Embeddings:** ONNX Runtime (Ultra-lightweight local processing — no PyTorch needed)
* **Retrieval Algorithms:** BM25 (Lexical) + Dense Semantic Embeddings (Hybrid Fusion)

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
Drag and drop PDFs, CSVs, or `.js`/`.py` code files. The system intelligently routes the file to the correct chunking algorithm (Semantic Chunking for prose, Fixed/AST Chunking for code) and indexes it into ChromaDB.

### 2. Low-Memory Hybrid Retrieval Engine
When a query is received, the system forks the search into two parallel paths:
* **Lexical Path (BM25):** Searches for exact keyword matches on the local server.
* **Semantic Path (ONNX):** Generates dense vectors entirely locally using the ONNX framework, completely bypassing heavy PyTorch dependencies and external API rate limits.

### 3. Agentic Synthesis & Routing
The results are merged, ranked, and passed to a dynamic router. The system automatically detects if you are asking a specific QA question, asking for a full-document summary, or just chatting, and directs the context to the correct LLaMA 3.3 Agent.

---

## 🚀 Quick Start

### Option 1: Render Deployment (Recommended — Free Tier!)
Because OmniRAG uses the lightweight ONNX framework, it runs comfortably on Render's 512MB Free Tier.
1. Create a new **Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Render auto-detects the `Dockerfile` and sets the runtime to **Docker**.
4. (Optional) Add your `.env` (with your Groq key) as a **Secret File** under **Advanced** settings.
5. Click **Create Web Service** and watch it go live!

### Option 2: Local Development
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/manas-shukla-101/OmniRAG.git
   cd OmniRAG
   ```
2. **Install Backend Dependencies:**
   ```bash
   python -m venv .venv
   .venv\Scriptsctivate  # Windows
   pip install -r requirements.txt
   ```
3. **Run the Server:**
   ```bash
   python server.py
   ```
4. Access the gorgeous UI at `http://localhost:8000`.

---

## 🌟 Key Features

- **ONNX ML Architecture:** Runs powerful embedding models locally using a fraction of the RAM — completely immune to 3rd-party API downtimes or OOM crashes.
- **Dynamic Agentic Routing:** Intelligently switches between QA, summarization, and retrieval based on query intent.
- **Map-Reduce Summarizer:** Synthesizes massive knowledge bases into concise executive briefs.
- **Glassmorphic UI:** A visually stunning, highly interactive frontend with micro-animations.
- **Rate Limiting & API Gating:** Users get 3 free trials, with file upload locked until their own Groq API keys are provided.

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
