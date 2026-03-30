from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate



# Load env variables
load_dotenv()

data = TextLoader("document_loader/notes.txt")
doc = data.load()

template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{data}")
])


model = ChatMistralAI(model="mistral-small-2506")

prompt = template.format_messages(data=doc[0].page_content)

result = model.invoke(prompt)
print(result.content)