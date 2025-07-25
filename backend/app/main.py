import os
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from backend.app.api import auth


app = FastAPI()

# Serve Angular static files
app.mount("/", StaticFiles(directory="backend/static/browser", html=True), name="static")

# API Routes
app.include_router(auth.router, prefix="/api/auth")

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    if request.url.path.startswith("/api/"):
        return {"detail": "Not Found"}
    
    # Serve Angular app
    index_path = os.path.join("backend/static/browser", "index.html")
    return FileResponse(index_path)