import os
from dotenv import load_dotenv

def get_env(key: str) -> str:
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"{key} is not set in your environment!")
    return value

JWT_SECRET = get_env("JWT_SECRET")
DATABASE_URL = get_env("DATABASE_URL")
OPENAI_API_KEY = get_env("OPENAI_API_KEY")
NUTRITIONIX_APP_ID = get_env("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = get_env("NUTRITIONIX_API_KEY")
GOOGLE_MAPS_API_KEY = get_env("GOOGLE_MAPS_API_KEY")