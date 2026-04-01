<<<<<<< HEAD
# Context-AI 🚀

Context-AI is a production-grade, full-stack document analysis platform. Built with a monolithic Next.js and FastAPI architecture, it enables users to seamlessly upload documents, process them into AI-readable vector embeddings, and frictionlessly query that knowledge base in real-time.

## 🛠 Tech Stack Overview

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Framer Motion, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy (SQLite), Python 3.12, Uvicorn
- **AI / Modeling**: Mistral AI (Large Language Model), HuggingFace Sentence Transformers (Embeddings)
- **Vector Database**: ChromaDB
- **Authentication**: JWT Bearer Tokens, Bcrypt Hashing, Custom built 2-Step SMTP Email OTP Flow

---

## 🏗 Architecture & Flow

### 1. Security & Authentication
Context-AI uses a highly secure modern authentication flow:
- Upon signup, an account is flagged as unverified. 
- A raw Python **SMTP Client** interfaces with a Gmail App Password to dispatch a custom HTML-styled 6-digit OTP mapping.
- The React application seamlessly transforms the UI to catch the OTP, hitting `/api/v1/auth/verify-otp`.
- We use strict middleware to emit **HTTP 403 Forbidden** errors if a verified user's lifecycle token doesn't map to a logged-in state.
- Passwords are salted and hashed using **Passlib Bcrypt** before striking the SQLite database.

### 2. The Vector Pipeline (RAG)
Retrieval-Augmented Generation (RAG) is the core engine of Context-AI:
1. **Upload Phase**: Users upload heavily formatted PDFs through the Next.js `FormData` engine. FastAPI catches the document into temporary storage.
2. **Parsing & Chunking**: `PyPDFLoader` strips the text. A Recursive Character Text Splitter breaks it into tiny overlapping semantic chunks (to prevent context loss between pages).
3. **Embedding Generaton**: We call `sentence-transformers/all-MiniLM-L6-v2` down from HuggingFace to convert English text chunks into high-dimensional numerical vectors.
4. **Vector Storage**: The resulting vectors are natively cached into the persistent **ChromaDB** envelope located strictly inside the isolated backend directory.





<img width="1440" height="904" alt="image" src="https://github.com/user-attachments/assets/da526a28-99e7-4bf3-aa24-997a231dbcd8" />






### 3. The Query Engine
When users type a question into the beautiful dark-mode chat interface:
- FastAPI embeds their raw text question into a temporary vector.
- We run a mathematical distance search inside ChromaDB using Maximum Marginal Relevance (MMR) algorithms to fetch the most semantically relevant PDF chunks.
- We prepend these chunks into a dynamic Prompt Template and ship it exclusively to the **Mistral AI** language model.
- Mistral formulates an incredibly accurate response strictly constrained by the prompt boundary: *"Use ONLY the provided context..."*.

---

## 🏃‍♂️ How to Run

Because this is a consolidated structure, startup is extremely seamless.

1. Create a root `.env` file containing your `MISTRAL_API_KEY` and `SMTP` configs.
2. Launch the orchestrator script:
```bash
# This automatically spins up Uvicorn (FastAPI) on port :8000 and Next.js on port :3000
./start_app.sh 
```
=======
>>>>>>> edc9c70 (feat: initialize project structure with app router, UI components, and global styles)
