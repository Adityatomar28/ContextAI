import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_email(to_email: str, subject: str, body: str):
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print(f"SMTP credentials not configured. Skipping email to {to_email}")
        return False

    msg = MIMEMultipart()
    msg['From'] = settings.EMAILS_FROM_EMAIL or settings.SMTP_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email to {to_email}: {str(e)}")
        return False

def send_verification_otp(email: str, otp: str):
    subject = "Verify your Context-AI Account"
    body = f"""
    <html>
        <body>
            <h2>Welcome to Context-AI!</h2>
            <p>Please use the following OTP to verify your email address:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">{otp}</h1>
            <p>This code will expire in 10 minutes.</p>
        </body>
    </html>
    """
    return send_email(email, subject, body)

def send_password_reset_otp(email: str, otp: str):
    subject = "Reset Your Context-AI Password"
    body = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Use the following OTP to proceed:</p>
            <h1 style="color: #EC4899; letter-spacing: 5px;">{otp}</h1>
            <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """
    return send_email(email, subject, body)
