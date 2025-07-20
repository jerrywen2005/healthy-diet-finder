from backend.env import MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_SENDER
import requests

def send_verification_email(email: str, token: str):
    link = f"http://localhost:1560/verify?token={token}"  # Change to production domain later
    return requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": MAILGUN_SENDER,
            "to": [email],
            "subject": "Verify your email - Healthy Diet Finder",
            "text": f"Click to verify: {link}",
            "html": f"<p>Click <a href='{link}'>here</a> to verify your email.</p>"
        }
    )

def send_password_reset_email(email: str, token: str):
    link = f"http://localhost:1560/reset-password?token={token}"
    return requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": MAILGUN_SENDER,
            "to": [email],
            "subject": "Reset your password - Healthy Diet Finder",
            "text": f"Reset link: {link}",
            "html": f"<p>Reset your password <a href='{link}'>here</a>.</p>"
        }
    )
