from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from chromadb import ChromaClient
import asyncio
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


chroma_client = ChromaClient(persist_directory="./chroma_storage")
embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
@app.post("/ingest/")
async def ingest_document(file: UploadFile):
    content = await file.read()
    text = content.decode("utf-8")

    embedding = embedding_model.encode(text, show_progress_bar=False)

    chroma_client.ingest({"document": text, "embedding": embedding})

    return {"message": "Document ingested successfully"}

class QueryRequest(BaseModel):
    query_text: str

@app.post("/query/")
async def query_documents(query: QueryRequest):
    query_embedding = embedding_model.encode(query.query_text, show_progress_bar=False)

    results = chroma_client.query(query_embedding)

    return {"results": results}

