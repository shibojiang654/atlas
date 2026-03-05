from __future__ import annotations

import os

from openai import OpenAI


def generate_answer(system: str, user: str, context: str) -> str:
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system},
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nUser question/request:\n{user}"
            }
        ],
        temperature=0.2
    )
    return response.choices[0].message.content or ""
