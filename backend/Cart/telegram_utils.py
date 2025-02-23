import os
import json
import logging
import requests
from dotenv import load_dotenv

load_dotenv()  

logger = logging.getLogger(__name__)

DISSTORE_TELEGRAM_BOT_TOKEN = os.environ.get("DISSTORE_TELEGRAM_BOT_TOKEN")
ADMIN_CHAT_ID = os.environ.get("ADMIN_CHAT_ID") 

def send_telegram_message(text: str, reply_markup: dict = None) -> None:
    if DISSTORE_TELEGRAM_BOT_TOKEN and ADMIN_CHAT_ID:
        url = f"https://api.telegram.org/bot{DISSTORE_TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": ADMIN_CHAT_ID,
            "text": text,
            "parse_mode": "HTML",
        }
        if reply_markup:
            data["reply_markup"] = json.dumps(reply_markup)
        try:
            response = requests.post(url, data=data)
            response.raise_for_status()
            logger.info("Telegram message sent successfully")
        except Exception as e:
            logger.error("Ошибка отправки сообщения в Telegram: %s", e)
    else:
        logger.error("Telegram Bot Token или Chat ID не заданы.")

def send_telegram_photo(photo_url: str, caption: str) -> None:
    if DISSTORE_TELEGRAM_BOT_TOKEN and ADMIN_CHAT_ID:
        url = f"https://api.telegram.org/bot{DISSTORE_TELEGRAM_BOT_TOKEN}/sendPhoto"
        data = {
            "chat_id": ADMIN_CHAT_ID,
            "photo": photo_url,
            "caption": caption,
            "parse_mode": "HTML",
        }
        print(response.json(), data)
        try:
            response = requests.post(url, data=data)
            response.raise_for_status()
            logger.info("Telegram photo sent successfully")
        except Exception as e:
            logger.error("Ошибка отправки фото в Telegram: %s", e)
    else:
        logger.error("Telegram Bot Token или Chat ID не заданы.")
