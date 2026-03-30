from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_mistralai import ChatMistralAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate


load_dotenv()

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


vector_store = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model,
    
    
)
retriever = vector_store.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k":3,
        "fetch_k":10,
        "lambda_mult":0.5
        
    
    }
)

llm = ChatMistralAI(model="mistral-small-2506")

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a helpful AI assistant.

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

print("Rag system created ")

print("press 0 to exit ")

while True:
    query = input("You : ")
    if query == "0":
        break 
    
    docs = retriever.invoke(query)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )
    
    final_prompt = prompt.invoke({
        "context" :context,
        "question": query
    })
    
    response = llm.invoke(final_prompt)

    print(f"\n AI: {response.content}")
    






































# from annotated_types import doc
# from dotenv import load_dotenv
# from langchain_mistralai import ChatMistralAI
# from langchain_community.document_loaders import TextLoader
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter



# # Load env variables
# load_dotenv()

# # Load the document
# # data = TextLoader("document_loader/notes.txt")
# # doc = data.load()

# # template = ChatPromptTemplate.from_messages([
# #     ("system", "You are a helpful assistant."),
# #     ("human", "{data}")
# # ])


# # model = ChatMistralAI(model="mistral-small-2506")

# # prompt = template.format_messages(data=doc[0].page_content)

# # result = model.invoke(prompt)
# # print(result.content)


# #For PDF file
# data = PyPDFLoader("document_loader/deeplearning.pdf")
# docs = data.load()

# splitter = RecursiveCharacterTextSplitter(
#     chunk_size=1000,
#     chunk_overlap=200
# )
# chunks = splitter.split_documents(docs)


# template = ChatPromptTemplate.from_messages(
#     [("system", "You are a AI that summarizes text."),
#     ("human", "{data}")]
# )


# model = ChatMistralAI(model="mistral-small-2506")

# prompt = template.format_messages(data=docs[15].page_content)

# result = model.invoke(prompt)
# print(result.content)