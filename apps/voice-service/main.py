import asyncio
import hashlib
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
import edge_tts
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(
    title="CODEQUEST Voice Service",
    version="2.0.0",
    description="Edge-TTS Character Voice & Subtitle Generation Microservice for CODEQUEST",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage Configuration: Supabase Storage (No Credit Card) & Optional S3/R2
SUPABASE_URL = os.getenv("SUPABASE_URL") # e.g. https://ysfrvdusuzrjiqnbmfxm.supabase.co
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # anon/service key
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "codequest-assets")

R2_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "codequest-assets")
R2_PUBLIC_DOMAIN = os.getenv("R2_PUBLIC_DOMAIN") # e.g. https://pub-xxxx.r2.dev

s3_client = None
if R2_ENDPOINT_URL and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY:
  try:
    import boto3

    s3_client = boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT_URL,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    )
    print("Cloudflare R2 Object Storage connected.")
  except Exception as e:
    print(f"Notice: R2 client initialization deferred: {e}")

# Preconfigured Character Voice Profiles
VOICE_PROFILES: Dict[str, dict] = {
    "aria": {
        "characterId": "aria",
        "name": "ARIA",
        "provider": "edge-tts",
        "voiceId": "en-US-AriaNeural",
        "language": "en-US",
        "rate": "+0%",
        "pitch": "+2Hz",
        "volume": "+0%",
        "personality": "Friendly, precise, and supportive AI companion.",
        "preferredStyle": "empathetic",
    },
    "kael": {
        "characterId": "kael",
        "name": "KAEL",
        "provider": "edge-tts",
        "voiceId": "en-US-GuyNeural",
        "language": "en-US",
        "rate": "+5%",
        "pitch": "+0Hz",
        "volume": "+0%",
        "personality": "Energetic, bold explorer.",
        "preferredStyle": "adventurous",
    },
    "orion": {
        "characterId": "orion",
        "name": "ORION",
        "provider": "edge-tts",
        "voiceId": "en-US-ChristopherNeural",
        "language": "en-US",
        "rate": "-5%",
        "pitch": "-4Hz",
        "volume": "+0%",
        "personality": "Experienced, grounded systems mentor.",
        "preferredStyle": "authoritative",
    },
    "nyx": {
        "characterId": "nyx",
        "name": "NYX",
        "provider": "edge-tts",
        "voiceId": "en-GB-SoniaNeural",
        "language": "en-GB",
        "rate": "-2%",
        "pitch": "-2Hz",
        "volume": "-5%",
        "personality": "Mysterious, sharp, enigmatic antagonist.",
        "preferredStyle": "whispering",
    },
    "echo": {
        "characterId": "echo",
        "name": "ECHO",
        "provider": "edge-tts",
        "voiceId": "en-US-EricNeural",
        "language": "en-US",
        "rate": "+8%",
        "pitch": "+10Hz",
        "volume": "-2%",
        "personality": "Fastidious robotic utility drone.",
        "preferredStyle": "robotic",
    },
}


class SubtitleCue(BaseModel):
  startMs: int
  endMs: int
  text: str


class SynthesizeRequest(BaseModel):
  characterId: str = "aria"
  text: str
  voiceId: Optional[str] = None
  rate: Optional[str] = None
  pitch: Optional[str] = None
  volume: Optional[str] = None


class SynthesizeResponse(BaseModel):
  audioId: str
  audioUrl: str
  contentHash: str
  characterId: str
  text: str
  durationMs: int
  subtitles: List[SubtitleCue]
  cached: bool


def compute_content_hash(
    text: str, voice: str, rate: str, pitch: str, volume: str
) -> str:
  data = f"{text}|{voice}|{rate}|{pitch}|{volume}".encode("utf-8")
  return hashlib.sha256(data).hexdigest()[:16]


@app.get("/health")
def health_check():
  return {"status": "ok", "service": "codequest-voice-service", "version": "2.0"}


@app.get("/profiles")
def get_voice_profiles():
  return list(VOICE_PROFILES.values())


@app.get("/voices")
async def list_available_voices():
  try:
    voices = await edge_tts.list_voices()
    return [
        {
            "name": v.get("Name"),
            "shortName": v.get("ShortName"),
            "gender": v.get("Gender"),
            "locale": v.get("Locale"),
        }
        for v in voices
        if "en-" in v.get("Locale", "")
    ]
  except Exception as e:
    return [{"error": str(e), "message": "Failed to fetch live Edge-TTS voices"}]


@app.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize_voice(req: SynthesizeRequest):
  profile = VOICE_PROFILES.get(req.characterId.lower(), VOICE_PROFILES["aria"])
  voice = req.voiceId or profile["voiceId"]
  rate = req.rate or profile["rate"]
  pitch = req.pitch or profile["pitch"]
  volume = req.volume or profile["volume"]

  content_hash = compute_content_hash(req.text, voice, rate, pitch, volume)
  audio_filename = f"{req.characterId}_{content_hash}.mp3"
  meta_filename = f"{req.characterId}_{content_hash}.json"

  audio_path = CACHE_DIR / audio_filename
  meta_path = CACHE_DIR / meta_filename

  # Check disk cache
  if audio_path.exists() and meta_path.exists():
    try:
      with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
      return SynthesizeResponse(
          audioId=f"{req.characterId}_{content_hash}",
          audioUrl=f"/audio/{audio_filename}",
          contentHash=content_hash,
          characterId=req.characterId,
          text=req.text,
          durationMs=meta.get("durationMs", 3000),
          subtitles=[SubtitleCue(**cue) for cue in meta.get("subtitles", [])],
          cached=True,
      )
    except Exception:
      pass  # Fall through to regenerate if metadata corrupted

  # Synthesize via Edge-TTS
  communicate = edge_tts.Communicate(
      text=req.text, voice=voice, rate=rate, pitch=pitch, volume=volume
  )

  subtitles: List[SubtitleCue] = []
  last_offset = 0

  try:
    with open(audio_path, "wb") as audio_file:
      async for chunk in communicate.stream():
        if chunk["type"] == "audio":
          audio_file.write(chunk["data"])
        elif chunk["type"] in ("WordBoundary", "SentenceBoundary"):
          start_ms = chunk["offset"] // 10000  # 100-nanosecond units to ms
          duration_ms = chunk["duration"] // 10000
          end_ms = start_ms + duration_ms
          last_offset = max(last_offset, end_ms)
          subtitles.append(
              SubtitleCue(startMs=start_ms, endMs=end_ms, text=chunk["text"])
          )

    # If word boundaries empty, estimate duration by word count
    estimated_duration = max(
        last_offset, int(len(req.text.split()) * 350) + 1000
    )

    meta_data = {
        "durationMs": estimated_duration,
        "subtitles": [s.model_dump() for s in subtitles],
    }

    with open(meta_path, "w", encoding="utf-8") as f:
      json.dump(meta_data, f)

    # If Supabase Storage is configured (100% Free / No Card), upload to bucket
    if SUPABASE_URL and SUPABASE_KEY and SUPABASE_BUCKET:
      try:
        import urllib.request
        upload_endpoint = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/{SUPABASE_BUCKET}/audio/{audio_filename}"
        with open(audio_path, "rb") as f:
          file_bytes = f.read()
        req_obj = urllib.request.Request(
            upload_endpoint,
            data=file_bytes,
            headers={
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "audio/mpeg",
                "x-upsert": "true",
            },
            method="POST",
        )
        with urllib.request.urlopen(req_obj) as response:
          if response.status in (200, 201):
            audio_public_url = f"{SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{SUPABASE_BUCKET}/audio/{audio_filename}"
      except Exception as sb_err:
        print(f"Supabase Storage upload notice: {sb_err}")

    # If Cloudflare R2 is configured, upload to bucket
    audio_public_url = f"/audio/{audio_filename}"
    if s3_client and R2_BUCKET_NAME:
      try:
        s3_client.upload_file(
            str(audio_path),
            R2_BUCKET_NAME,
            f"audio/{audio_filename}",
            ExtraArgs={"ContentType": "audio/mpeg"},
        )
        if R2_PUBLIC_DOMAIN:
          audio_public_url = f"{R2_PUBLIC_DOMAIN.rstrip('/')}/audio/{audio_filename}"
      except Exception as r2_err:
        print(f"R2 upload notice (using local endpoint fallback): {r2_err}")

    return SynthesizeResponse(
        audioId=f"{req.characterId}_{content_hash}",
        audioUrl=audio_public_url,
        contentHash=content_hash,
        characterId=req.characterId,
        text=req.text,
        durationMs=estimated_duration,
        subtitles=subtitles,
        cached=False,
    )

  except Exception as e:
    # Error fallback: create a graceful empty response or mock audio
    raise HTTPException(
        status_code=500, detail=f"Voice synthesis error: {str(e)}"
    )


@app.get("/audio/{filename}")
def get_cached_audio(filename: str):
  file_path = CACHE_DIR / filename
  if not file_path.exists():
    raise HTTPException(status_code=404, detail="Audio file not found")
  return FileResponse(file_path, media_type="audio/mpeg")


if __name__ == "__main__":
  import uvicorn

  uvicorn.run(app, host="0.0.0.0", port=8001)
