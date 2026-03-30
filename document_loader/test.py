from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter


# data = TextLoader("notes.txt").load()
# doc = data
# #Every notes are in docs and we can use it for further processing
# #In docs they are in the form of list of documents and each document has page_content and metadata  page_content is the content of the note and metadata is the information about the note like source and other details
# print(doc[0].page_content)



#character based splitter

splitter = CharacterTextSplitter(
    chunk_size=10, 
    chunk_overlap=3
)
data = TextLoader("notes.txt").load()
docs = data

chunks = splitter.split_documents(docs)
print(chunks)