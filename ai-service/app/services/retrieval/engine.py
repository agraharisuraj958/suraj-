from typing import List, Dict, Any, Optional
from qdrant_client.http import models
from app.core.qdrant import get_qdrant_client
from app.core.config import settings
from fastembed import TextEmbedding
from rank_bm25 import BM25Okapi

qdrant = get_qdrant_client()
embedding_model = TextEmbedding(model_name=settings.EMBEDDING_MODEL)

def hybrid_search(query: str, patient_id: Optional[str] = None, top_k: int = 4) -> List[Dict[str, Any]]:
    # 1. Embed the user's query
    query_vector = list(embedding_model.embed([query]))[0].tolist()

    # 2. Build RBAC metadata filter (Global Guidelines OR Specific Patient Records)
    should_conditions = [
        models.FieldCondition(key="kind", match=models.MatchValue(value="GUIDELINE"))
    ]
    if patient_id:
        should_conditions.append(
            models.FieldCondition(key="patientId", match=models.MatchValue(value=patient_id))
        )

    filter_obj = models.Filter(should=should_conditions)

    # 3. Dense Retrieval: Fetch top 20 candidates for reranking using the new query_points API
    search_response = qdrant.query_points(
        collection_name=settings.QDRANT_COLLECTION,
        query=query_vector,
        query_filter=filter_obj,
        limit=20
    )
    
    search_results = search_response.points

    if not search_results:
        return []

    # 4. Sparse Retrieval (BM25) over the candidates
    chunks = [hit.payload["text"] for hit in search_results]
    tokenized_corpus = [chunk.lower().split() for chunk in chunks]
    bm25 = BM25Okapi(tokenized_corpus)
    tokenized_query = query.lower().split()
    bm25_scores = bm25.get_scores(tokenized_query)

    # 5. Reciprocal Rank Fusion (RRF) combining Vector & BM25
    dense_ranks = {hit.id: rank for rank, hit in enumerate(search_results)}
    bm25_ranked_indices = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)
    bm25_ranks = {search_results[i].id: rank for rank, i in enumerate(bm25_ranked_indices)}

    k_rrf = 60
    rrf_scores = []
    for hit in search_results:
        dense_score = 1.0 / (k_rrf + dense_ranks[hit.id])
        sparse_score = 1.0 / (k_rrf + bm25_ranks[hit.id])
        rrf_scores.append((dense_score + sparse_score, hit))

    # Sort by combined RRF score and take top_k
    rrf_scores.sort(key=lambda x: x[0], reverse=True)

    return [
        {
            "documentId": hit.payload.get("documentId"),
            "page": hit.payload.get("page", 1),
            "text": hit.payload.get("text", ""),
            "score": score
        }
        for score, hit in rrf_scores[:top_k]
    ]