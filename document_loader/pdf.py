from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import TokenTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter


data = PyPDFLoader("nodejs.pdf").load()
docs = data
#Every notes are in docs and we can use it for further processing
#In docs they are in the form of list of documents and each document has page_content and metadata  page_content is the content of the note and metadata is the information about the note like source and other details

#Length is 125 which means in a list there is 125 documents and each document is a page of the pdf and we can use it for further processing and contains metadata and page_content
# print(len(docs))

# print(docs[12])

#Using Token based splitter (tiktoken is the tokenizer used by openai models and it is used to split the text into tokens and each token is a word or a part of a word and it is used to split the text into chunks based on the number of tokens)

# splitter = TokenTextSplitter(
#     chunk_size=1000,
#     chunk_overlap=10,
   
# )
# chunks = splitter.split_documents(docs)
# print(chunks)


#Recursive character based splitter 


splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=10
   
)
chunks = splitter.split_documents(docs)
print(chunks)