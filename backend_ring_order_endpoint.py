# Add this endpoint to your existing FastAPI app on Railway
# (the same backend that powers /save-ritual and /speak-intention).
#
# Requires: RESEND_API_KEY already set in Railway env vars (you have this
# configured already for the Save My Ritual feature).
#
# pip install resend  (if not already installed)

import os
import resend
from fastapi import HTTPException
from pydantic import BaseModel, EmailStr
from typing import Union

resend.api_key = os.environ["RESEND_API_KEY"]

# Make sure vibeshiftring.com (and www.vibeshiftring.com) are added to
# your existing CORS allow_origins list on this FastAPI app, e.g.:
#
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "https://chaiholistic.com", "https://www.chaiholistic.com",
#         "https://vibeshiftring.com", "https://www.vibeshiftring.com",
#     ],
#     allow_methods=["POST"],
#     allow_headers=["*"],
# )


class RingOrderCustomer(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = ""
    shipTo: str | None = ""
    notes: str | None = ""


class CompanionLink(BaseModel):
    type: str
    url: str | None = None
    verified: bool | None = None
    attempts: int | None = None


class RingOrderRequest(BaseModel):
    design: str
    designId: str
    price: float | None = None
    colors: Union[str, dict]
    companionLink: CompanionLink | None = None
    frequency: str
    size: int
    customer: RingOrderCustomer


def format_colors(colors):
    if isinstance(colors, str):
        return colors
    return f"{colors.get('outer', '—')} outer / {colors.get('inner', '—')} inner"


def format_companion(link):
    if not link:
        return "—"
    if link.type == "affirmation":
        return "Daily Affirmation (Included)"
    if link.type == "default":
        return "2AM Companion Prayer (Included)"
    if link.type == "custom":
        return f"Personalized Link — {link.url or '(no url provided)'} (+$6.00)"
    return link.type


@app.post("/ring-order")
async def ring_order(payload: RingOrderRequest):
    c = payload.customer
    colors_str = format_colors(payload.colors)
    companion_str = format_companion(payload.companionLink)
    surcharge = 6 if payload.companionLink and payload.companionLink.type == "custom" else 0
    total = (payload.price or 0) + surcharge

    # --- Email to Alex (the order notification) ---
    admin_html = f"""
    <h2>New Vibe Shift Ring Request</h2>
    <p><strong>Design:</strong> {payload.design} ({payload.designId})
       {f'&mdash; ${payload.price}' if payload.price else ''}</p>
    <p><strong>Colors:</strong> {colors_str}</p>
    <p><strong>Companion Link:</strong> {companion_str}</p>
    <p><strong>Frequency:</strong> {payload.frequency}</p>
    <p><strong>Size:</strong> US {payload.size}</p>
    {f'<p><strong>Total (incl. add-ons):</strong> ${total}</p>' if surcharge else ''}
    <hr/>
    <p><strong>Name:</strong> {c.name}</p>
    <p><strong>Email:</strong> {c.email}</p>
    <p><strong>Phone:</strong> {c.phone or '—'}</p>
    <p><strong>Ship to:</strong> {c.shipTo or '— (local pickup / not specified)'}</p>
    <p><strong>Notes:</strong><br/>{(c.notes or '—').replace(chr(10), '<br/>')}</p>
    """

    # --- Confirmation email to the customer ---
    customer_html = f"""
    <p>Hi {c.name.split(' ')[0]},</p>
    <p>Thank you for your Vibe Shift Ring request! Here's what you chose:</p>
    <ul>
      <li><strong>Design:</strong> {payload.design}</li>
      <li><strong>Colors:</strong> {colors_str}</li>
      <li><strong>Companion Link:</strong> {companion_str}</li>
      <li><strong>Frequency:</strong> {payload.frequency}</li>
      <li><strong>Size:</strong> US {payload.size}</li>
    </ul>
    <p>We'll be in touch shortly to confirm pricing and timeline before we
       begin your Meridian Infusion process.</p>
    <p>Wearable intention, made for you.<br/>&mdash; Chai Holistic</p>
    """

    try:
        resend.Emails.send({
            "from": "Vibe Shift Rings <orders@chaiholistic.com>",
            "to": ["YOUR_EMAIL@example.com"],   # <-- replace with your inbox
            "subject": f"New Ring Request — {payload.design} ({payload.frequency})",
            "html": admin_html,
            "reply_to": c.email,
        })
        resend.Emails.send({
            "from": "Vibe Shift Rings <orders@chaiholistic.com>",
            "to": [c.email],
            "subject": "We've received your Vibe Shift Ring request",
            "html": customer_html,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email send failed: {e}")

    return {"ok": True}
