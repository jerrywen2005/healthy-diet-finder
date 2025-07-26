from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.app.api import auth, restaurant


app = FastAPI()

# Serve Angular static files
app.mount("/static", StaticFiles(directory="static", html=True), name="static")

app.include_router(auth.router, prefix="/api/auth")
app.include_router(restaurant.router, prefix="/api/restaurant")