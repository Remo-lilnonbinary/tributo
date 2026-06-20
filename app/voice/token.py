"""Mint short-lived LiveKit room access tokens for the browser client.

Kept dependency-light: only needs `livekit-api`. Raises VoiceUnavailable if voice isn't
configured/installed, so the API can return a clean 503 rather than crashing.
"""

from __future__ import annotations

from ..config import get_settings


class VoiceUnavailable(RuntimeError):
    pass


def create_token(room: str = "tributo", identity: str | None = None) -> dict:
    s = get_settings()
    if not s.voice_configured:
        raise VoiceUnavailable(
            "Voice is not configured. Set LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET."
        )
    try:
        from livekit import api
    except Exception as exc:  # package not installed
        raise VoiceUnavailable(
            "LiveKit SDK not installed. Install the voice extra: uv sync --extra voice"
        ) from exc

    identity = identity or "citizen"
    token = (
        api.AccessToken(s.livekit_api_key, s.livekit_api_secret)
        .with_identity(identity)
        .with_name(identity)
        .with_grants(api.VideoGrants(room_join=True, room=room))
        .to_jwt()
    )
    return {"token": token, "url": s.livekit_url, "room": room, "identity": identity}
