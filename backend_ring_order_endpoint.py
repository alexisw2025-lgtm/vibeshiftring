# Add this endpoint to your existing FastAPI app on Railway
# (the same backend that powers /save-ritual and /speak-intention).
#
# Requires: RESEND_API_KEY already set in Railway env vars (you have this
# configured already for the Save My Ritual feature).
#
# pip install resend  (if not already installed)

import os
import resend
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware

resend.api_key = os.environ["RESEND_API_KEY"]

# If this is a NEW FastAPI app (separate from chai's), set up CORS so
# vibeshiftring.com can call it:
#
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["https://vibeshiftring.com", "https://www.vibeshiftring.com"],
#     allow_methods=["POST"],
#     allow_headers=["*"],
# )
#
# If you're adding this to the EXISTING chaiholistic backend, just make sure
# vibeshiftring.com is added to the existing CORS allow_origins list.


class RingOrderCustomer(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = ""
    shipTo: str | None = ""
    notes: str | None = ""


class RingOrderRequest(BaseModel):
    design: str
    designId: str
    price: float | None = None
    frequency: str
    size: int
    customer: RingOrderCustomer


@app.post("/ring-order")
async def ring_order(payload: RingOrderRequest):
    c = payload.customer

    # --- Email to Alex (the order notification) ---
    admin_html = f"""
    <h2>New Vibe Shift Ring Request</h2>
    <p><strong>Design:</strong> {payload.design} ({payload.designId})
       {f'&mdash; ${payload.price}' if payload.price else ''}</p>
    <p><strong>Frequency:</strong> {payload.frequency}</p>
    <p><strong>Size:</strong> US {payload.size}</p>
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
