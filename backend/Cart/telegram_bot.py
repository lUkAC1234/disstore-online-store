import os
import logging
from dotenv import load_dotenv
load_dotenv() 

import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CallbackQueryHandler, CommandHandler
from .models import Order, OrderStatus  
from django.core.exceptions import ObjectDoesNotExist

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

ADMIN_CHAT_ID = os.environ.get("ADMIN_CHAT_ID")
if ADMIN_CHAT_ID:
    try:
        ADMIN_CHAT_ID = int(ADMIN_CHAT_ID)
    except ValueError:
        raise Exception("ADMIN_CHAT_ID must be an integer.")
else:
    raise Exception("ADMIN_CHAT_ID not set in environment variables.")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Бот для обработки обновлений заказов запущен.")

async def order_status_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data  
    try:
        parts = data.split(":")
        if len(parts) != 3 or parts[0] != "order":
            await query.edit_message_text("Неверные данные запроса.")
            return

        order_id = int(parts[1])
        new_status = parts[2]

        if new_status not in OrderStatus.values:
            await query.edit_message_text("Неверный статус.")
            return

        try:
            order = Order.objects.get(id=order_id)
        except ObjectDoesNotExist:
            await query.edit_message_text("Заказ не найден.")
            return

        order.status = new_status
        order.save()

        updated_text = query.message.text + f"\nСтатус обновлен: {dict(OrderStatus.choices).get(new_status, new_status)}"
        await query.edit_message_text(updated_text, reply_markup=query.message.reply_markup)
        logger.info(f"Order {order_id} status updated to {new_status} via Telegram callback.")
    except Exception as e:
        logger.error(f"Ошибка при обновлении статуса: {e}")
        await query.edit_message_text("Ошибка обновления статуса заказа.")

def main():
    token = os.environ.get("DISSTORE_TELEGRAM_BOT_TOKEN")  
    if not token:
        raise Exception("DISSTORE_TELEGRAM_BOT_TOKEN not set in environment variables.")

    application = ApplicationBuilder().token(token).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(order_status_callback))
    logger.info("Telegram bot polling started.")
    application.run_polling()

if __name__ == '__main__':
    main()
