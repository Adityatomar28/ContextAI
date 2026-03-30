from annotated_types import doc
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter



# Load env variables
load_dotenv()

# Load the document
# data = TextLoader("document_loader/notes.txt")
# doc = data.load()

# template = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful assistant."),
#     ("human", "{data}")
# ])


# model = ChatMistralAI(model="mistral-small-2506")

# prompt = template.format_messages(data=doc[0].page_content)

# result = model.invoke(prompt)
# print(result.content)


#For PDF file
data = PyPDFLoader("document_loader/deeplearning.pdf")
docs = data.load()




template = ChatPromptTemplate.from_messages(
    [("system", "You are a AI that summarizes text."),
    ("human", "{data}")]
)


model = ChatMistralAI(model="mistral-small-2506")

prompt = template.format_messages(data=docs[15].page_content)

result = model.invoke(prompt)
print(result.content)