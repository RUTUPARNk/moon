# server.py
from fastapi import FastAPI
import httpx, asyncio
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
import uvicorn

app = FastAPI()
CACHE = {"data": None, "ts": None}
CELESTRAK_URL = "https://celestrak.com/NORAD/elements/stations.txt"  # change dataset as desired

async def fetch_tle():
    async with httpx.AsyncClient() as client:
        r = await client.get(CELESTRAK_URL, timeout=20.0)
        r.raise_for_status()
        return r.text

@app.on_event("startup")
async def startup_fetch():
    await update_cache()

async def update_cache():
    try:
        text = await fetch_tle()
        CACHE["data"] = text
        CACHE["ts"] = datetime.utcnow()
    except Exception as e:
        print("fetch error", e)

@app.get("/satellites")
async def get_satellites():
    # refresh every hour
    if not CACHE["ts"] or (datetime.utcnow() - CACHE["ts"]) > timedelta(minutes=60):
        await update_cache()
    return JSONResponse(content={"tle": CACHE["data"]})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)