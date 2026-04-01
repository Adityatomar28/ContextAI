import os
import shutil
from typing import List
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mistralai import ChatMistralAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = Chroma(
    persist_directory=settings.CHROMA_PERSIST_DIR,
    embedding_function=embedding_model,
)

retriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,
        "fetch_k": 10,
        "lambda_mult": 0.5
    }
)

llm = ChatMistralAI(model="mistral-small-2506", mistral_api_key=settings.MISTRAL_API_KEY)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a helpful AI study assistant named Context-AI.

Use ONLY the provided context to answer the question.

If the answer is not present in the context,
say: "I could not find the answer in the document."
"""
        ),
        (
            "human",
            """Context:
{context}

Question:
{question}
"""
        )
    ]
)

def process_pdf(file_path: str):
    data = PyPDFLoader(file_path).load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200                           
    )
    chunks = splitter.split_documents(data)
    
    # Add to chromadb
    vector_store.add_documents(documents=chunks)
    return len(chunks)

def chat_with_docs(query: str, history: List[dict] = None) -> str:
    if not settings.MISTRAL_API_KEY:
        return "Please configure your MISTRAL_API_KEY to chat."
        
    docs = retriever.invoke(query)
    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )
    
    final_prompt = prompt.invoke({
        "context": context,
        "question": query
    })
    
    try:
        response = llm.invoke(final_prompt)
        return response.content
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"
