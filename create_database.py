#import the necessary libraries

#load the pdf

#split the pdf into chunks

#create the embeddings

#store into chroma


from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

data = PyPDFLoader("document_loader/deeplearning.pdf").load()
docs = data

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200                           

)

chunks = splitter.split_documents(docs)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

 
vector = Chroma.from_documents(
    documents=docs,
    embedding=embedding_model,
    persist_directory="chroma_db"
)

