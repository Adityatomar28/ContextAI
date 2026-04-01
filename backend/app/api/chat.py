import os
import shutil
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from app.api import deps
from app.models.user import User
from app.services.rag_service import process_pdf, chat_with_docs
from app.models.schemas import ChatRequest, ChatResponse

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    os.makedirs("/tmp/uploads", exist_ok=True)
    temp_path = f"/tmp/uploads/{file.filename}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        chunks_added = process_pdf(temp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")
    finally:
        os.remove(temp_path)
        
    return {"message": "Document uploaded and processed successfully", "chunks": chunks_added}

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(deps.get_current_user)
):
    try:
        response = chat_with_docs(request.query, request.history)
        return {"reply": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
