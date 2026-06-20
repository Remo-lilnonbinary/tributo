"""Request models for the API. Responses are plain dicts assembled in the modules."""

from __future__ import annotations

from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4000)
    citizen: str = Field(default="citizen")  # which citizen's action plan to update


class PlanToggleRequest(BaseModel):
    citizen: str = Field(default="citizen")
    id: str


class VoiceTokenRequest(BaseModel):
    room: str = Field(default="tributo")
    identity: str | None = None
