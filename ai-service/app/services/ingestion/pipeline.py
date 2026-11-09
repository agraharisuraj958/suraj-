import io
from typing import Optional, List, Dict, Any
from pypdf import PdfReader
from fastembed import TextEmbedding
from qdrant_client.http import models  # Import Qdrant models
import uuid
from app.core.qdrant import get_qdrant_client
from app.core.config import settings

# Initialize FastEmbed locally (No PyTorch/OpenAI API required for embeddings)
embedding_model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)
qdrant = get_qdrant_client()

# Ensure the collection exists
if not qdrant.collection_exists(settings.QDRANT_COLLECTION):
    qdrant.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )

def chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> List[str]:
    """Basic sliding window chunker."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk)
        i += (chunk_size - overlap)
    return chunks

def process_and_ingest_pdf(
    file_bytes: bytes, 
    document_id: str, 
    kind: str, 
    patient_id: Optional[str] = None
) -> Dict[str, Any]:
    
    # 1. Idempotent cleanup: Delete old chunks using strict Qdrant models
    qdrant.delete(
        collection_name=settings.QDRANT_COLLECTION,
        points_selector=models.Filter(
            must=[
                models.FieldCondition(
                    key="documentId",
                    match=models.MatchValue(value=document_id)
                )
            ]
        )
    )

    # 2. Extract text per page
    reader = PdfReader(io.BytesIO(file_bytes))
    all_chunks = []
    payloads = []
    
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()
        if not text:
            continue
            
        page_chunks = chunk_text(text)
        for chunk_idx, chunk_text_data in enumerate(page_chunks):
            all_chunks.append(chunk_text_data)
            payloads.append({
                "documentId": document_id,
                "page": page_num + 1,
                "chunkIndex": chunk_idx,
                "kind": kind,
                "patientId": patient_id,
                "text": chunk_text_data
            })

    if not all_chunks:
        raise ValueError("No extractable text found in PDF. Make sure it is not just scanned images.")

    # 3. Embed text via fastembed
    embeddings = list(embedding_model.embed(all_chunks))

    # 4. Upsert to Qdrant
    points = [
        models.PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding.tolist(),
            payload=payload
        )
        for embedding, payload in zip(embeddings, payloads)
    ]
    
    qdrant.upsert(
        collection_name=settings.QDRANT_COLLECTION,
        points=points
    )

    return {
        "document_id": document_id,
        "pages_processed": len(reader.pages),
        "chunks_indexed": len(points)
    }