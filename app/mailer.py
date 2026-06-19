import asyncio
import os
import smtplib
import ssl
import uuid
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

from dotenv import load_dotenv

from app.models import OrderStatus

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Дельфиниум.рф")
MAIL_BASE_URL = os.getenv("MAIL_BASE_URL", "http://127.0.0.1:8000").rstrip("/")

_TEMPLATES_DIR = Path(__file__).parent / "email_templates"
_PREVIEW_DIR = Path(__file__).resolve().parent.parent / "sent_emails"

STATUS_LABELS = {
    OrderStatus.PENDING: "Ожидает проверки",
    OrderStatus.RESERVED: "Зарезервирован",
    OrderStatus.PENDING_PAYMENT: "Оформлен",
    OrderStatus.PAID: "Оплачен",
    OrderStatus.SHIPPING: "Отправлен",
    OrderStatus.DELIVERED: "Доставлен",
    OrderStatus.CLOSED: "Завершён",
    OrderStatus.CANCELLED: "Отменён",
}


def build_order_link(public_id: uuid.UUID) -> str:
    return f"{MAIL_BASE_URL}/order?public_id={public_id}"


def _greeting(customer_name: str | None) -> str:
    name = (customer_name or "").strip()
    return f"Здравствуйте, {name}!" if name else "Здравствуйте!"


def _render(template_name: str, replacements: dict[str, str]) -> str:
    html = (_TEMPLATES_DIR / template_name).read_text(encoding="utf-8")
    for key, value in replacements.items():
        html = html.replace("{{" + key + "}}", value)
    return html


def _smtp_send(to_email: str, subject: str, html: str) -> None:
    """Блокирующая отправка по SMTP (вызывается в отдельном потоке)."""
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((SMTP_FROM_NAME, SMTP_USER)) if SMTP_FROM_NAME else SMTP_USER
    msg["To"] = to_email
    msg.set_content("Откройте это письмо в почтовом клиенте с поддержкой HTML.")
    msg.add_alternative(html, subtype="html")

    context = ssl.create_default_context()
    if SMTP_PORT == 465:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=15) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    else:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.starttls(context=context)
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)


async def _send_email(to_email: str, subject: str, html: str, preview_tag: str) -> None:
    if not (SMTP_HOST and SMTP_USER and SMTP_PASSWORD):
        try:
            _PREVIEW_DIR.mkdir(exist_ok=True)
            path = _PREVIEW_DIR / f"{preview_tag}.html"
            path.write_text(html, encoding="utf-8")
            print(f"[mailer] DEV-превью (SMTP не настроен): письмо для {to_email} "
                  f"сохранено в {path}")
        except Exception as e:
            print(f"[mailer] Не удалось сохранить превью письма: {e}")
        return

    try:
        await asyncio.to_thread(_smtp_send, to_email, subject, html)
        print(f"[mailer] Письмо отправлено на {to_email} (SMTP {SMTP_HOST})")
    except Exception as e:
        print(f"[mailer] Ошибка отправки по SMTP на {to_email}: {e}")


async def send_order_created_email(
    to_email: str,
    order_link: str,
    public_id: uuid.UUID,
    customer_name: str | None = None,
) -> None:
    html = _render("order_created.html", {
        "GREETING": _greeting(customer_name),
        "ORDER_LINK": order_link,
        "PUBLIC_ID": str(public_id),
    })
    await _send_email(
        to_email,
        subject="Ваш заказ на Дельфиниум.рф оформлен 🌸",
        html=html,
        preview_tag=f"{public_id}_created",
    )


async def send_status_changed_email(
    to_email: str,
    order_link: str,
    status: OrderStatus,
    public_id: uuid.UUID,
    customer_name: str | None = None,
) -> None:
    """Письмо после смены статуса заказа."""
    try:
        status = OrderStatus(status)
    except ValueError:
        pass
    status_label = STATUS_LABELS.get(status, str(status))
    html = _render("status_changed.html", {
        "GREETING": _greeting(customer_name),
        "ORDER_LINK": order_link,
        "PUBLIC_ID": str(public_id),
        "STATUS": status_label,
    })
    await _send_email(
        to_email,
        subject=f"Статус заказа на Дельфиниум.рф: {status_label}",
        html=html,
        preview_tag=f"{public_id}_status_{status_label}",
    )
