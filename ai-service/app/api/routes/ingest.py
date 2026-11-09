from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional
from app.core.security import require_api_key
from app.services.ingestion.pipeline import process_and_ingest_pdf

router = APIRouter(prefix="/api/ingest", tags=["ingestion"])

@router.post("", dependencies=[Depends(require_api_key)])
async def ingest_document(
    file: UploadFile = File(...),
    documentId: str = Form(...),
    kind: str = Form(...),
    patientId: Optional[str] = Form(None)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF ingestion is currently supported in this pipeline.")
    
    try:
        contents = await file.read()
        result = process_and_ingest_pdf(
            file_bytes=contents,
            document_id=documentId,
            kind=kind,
            patient_id=patientId
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


