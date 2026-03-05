from __future__ import annotations

import re

CRISIS_RESPONSE = (
    "I am really glad you reached out. I cannot provide coaching for self-harm or suicide. "
    "If you might act on these thoughts, call or text 988 in the U.S. right now, or call 911 if you are in immediate danger. "
    "If you are outside the U.S., contact your local emergency service now."
)


SELF_HARM_PATTERNS = [
    r"\bkill myself\b",
    r"\bsuicide\b",
    r"\bself[- ]?harm\b",
    r"\bhurt myself\b",
    r"\bend my life\b",
    r"\bwant to die\b",
]


def detect_self_harm(text: str) -> bool:
    lowered = text.lower()
    return any(re.search(pattern, lowered) for pattern in SELF_HARM_PATTERNS)
