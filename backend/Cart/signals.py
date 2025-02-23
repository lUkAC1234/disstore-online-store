# orders/signals.py
import os
import logging
import threading
from dotenv import load_dotenv
load_dotenv()  # Load environment variables

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, OrderStatus
from .telegram_utils import send_telegram_message, send_telegram_photo

logger = logging.getLogger(__name__)

def format_order_message(order: Order) -> str:
    lines = []
    # Order header and buyer details
    lines.append(f"<b>Новый заказ:</b> №{order.id}")
    lines.append("────────────────────────────")
    lines.append(f"<b>Покупатель:</b> {order.full_name}")
    lines.append(f"<b>Эл. почта:</b> {order.email}")
    lines.append(f"<b>Телефон:</b> {order.phone}")
    lines.append(f"<b>Адрес доставки:</b> {order.address}")
    lines.append("")
    # Order items
    lines.append(f"<b>Товары:</b>")
    order_items = order.items.all()
    if not order_items.exists():
        lines.append("— Нет товаров —")
    else:
        for idx, item in enumerate(order_items, start=1):
            options = []
            if item.selected_color:
                options.append(f"<i>Цвет:</i> {item.selected_color}")
            if item.selected_size:
                options.append(f"<i>Размер:</i> {item.selected_size}")
            options_str = " | ".join(options) if options else "Без опций"
            lines.append(f"{idx}. <b>{item.product.title}</b>")
            lines.append(f"    {options_str}")
            lines.append(f"    <b>Количество:</b> {item.quantity} шт.")
            lines.append("")
    
    original_total = sum(item.product.price * item.quantity for item in order_items)
    total_discount = sum((item.product.price - item.product.real_price) * item.quantity for item in order_items)
    delivery_price = 50000
    final_total = original_total - total_discount + delivery_price  
    discount_percentage = round((total_discount / original_total) * 100, 2) if original_total > 0 else 0

    lines.append("────────────────────────────")
    lines.append("<b>Сводка заказа:</b>")
    lines.append(f"<b>Сумма товаров:</b> {original_total:,} сум")
    lines.append(f"<b>Общая скидка:</b> {total_discount:,} сум")
    lines.append(f"<b>Цена доставки:</b> {delivery_price:,} сум")
    lines.append(f"<b>Итого к оплате:</b> {final_total:,} сум")
    lines.append(f"<b>Процент скидки:</b> {discount_percentage}%")
    lines.append("────────────────────────────")
    lines.append("<b>Выберите статус заказа:</b>")
    return "\n".join(lines)

def build_status_keyboard(order_id: int) -> dict:
    return {
        "inline_keyboard": [
            [
                {"text": "Подтвержден", "callback_data": f"order:{order_id}:confirmed"},
                {"text": "В обработке", "callback_data": f"order:{order_id}:processing"},
            ],
            [
                {"text": "Отправлено", "callback_data": f"order:{order_id}:shipped"},
                {"text": "Доставлено", "callback_data": f"order:{order_id}:delivered"},
            ],
            [
                {"text": "Отменено", "callback_data": f"order:{order_id}:canceled"},
            ],
        ]
    }

def format_item_caption(item) -> str:
    options = []
    if item.selected_color:
        options.append(f"<i>Цвет:</i> {item.selected_color}")
    if item.selected_size:
        options.append(f"<i>Размер:</i> {item.selected_size}")
    options_str = " | ".join(options) if options else "Без опций"
    caption = (
        f"<b>{item.product.title}</b>\n"
        f"{options_str}\n"
        f"<b>Количество:</b> {item.quantity} шт."
    )
    return caption

def delayed_notification(order_id: int):
    # Import Order here for a fresh DB connection
    from .models import Order
    try:
        order = Order.objects.get(id=order_id)
        message_text = format_order_message(order)
        reply_markup = build_status_keyboard(order.id)
        send_telegram_message(message_text, reply_markup)
        logger.info(f"Telegram уведомление отправлено для заказа {order.id}.")
        # Now send images for items that have a valid image URL.
        for item in order.items.all():
            if item.selected_image and item.selected_image.startswith("http"):
                caption = format_item_caption(item)
                send_telegram_photo(item.selected_image, caption)
                logger.info(f"Изображение для товара {item.id} отправлено.")
            else:
                logger.warning(f"Заказ {order.id} товар {item.id} не имеет корректного URL изображения: {item.selected_image}")
    except Exception as e:
        logger.error(f"Ошибка в delayed_notification для заказа {order_id}: {e}")

@receiver(post_save, sender=Order)
def send_order_notification(sender, instance: Order, created, **kwargs):
    if created:
        logger.info(f"Signal triggered for order {instance.id}. Scheduling delayed notification.")
        # Delay the notification by 3 seconds to allow OrderItems to be created.
        threading.Timer(3, delayed_notification, args=[instance.id]).start()
