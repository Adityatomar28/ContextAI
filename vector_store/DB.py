from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mistralai import ChatMistralAI
from dotenv import load_dotenv

load_dotenv()

from langchain_core.documents import Document

# Sample docs
docs = [
    Document(page_content="Python is widely used in Artificial Intelligence.", metadata={"source": "AI_book"}),
    Document(page_content="Pandas is used for data analysis in Python.", metadata={"source": "DataScience_book"}),
    Document(page_content="Neural networks are used in deep learning.", metadata={"source": "DL_book"}),
]

# ✅ Embeddings (NOT Mistral)
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Vector store
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=embedding_model,
    persist_directory="chroma-db"
)

# Search
result = vectorstore.similarity_search("what is used for data analysis?", k=2)

for r in result:
    print(r.page_content)
    print(r.metadata)

# Retriever
retriever = vectorstore.as_retriever()

retrieved_docs = retriever.invoke("Explain deep learning")

# Mistral for answering
model = ChatMistralAI(model="mistral-small-2506")

context = "\n".join([d.page_content for d in retrieved_docs])

response = model.invoke(f"Answer based on context:\n{context}")

print(response.content)