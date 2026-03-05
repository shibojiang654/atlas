from __future__ import annotations

import os
from typing import List

from openai import OpenAI


def embed_texts(texts: list[str]) -> List[List[float]]:
    if not texts:
        return []

    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.embeddings.create(model="text-embedding-3-small", input=texts)
    return [item.embedding for item in response.data]
