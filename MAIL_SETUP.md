# Gmail SMTP Configuration for Baladia

## Issue
"550 5.7.1 Relaying denied" error when sending password reset emails via Gmail SMTP.

## Solution: Use Gmail App Password

### Step 1: Enable 2-Factor Authentication (if not already enabled)
1. Go to https://myaccount.google.com/
2. Click **Security** in the left menu
3. Scroll down to "How you sign in to Google"
4. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Windows/Mac/Linux** (or your device type)
4. Google will generate a **16-character password**
5. Copy this password

### Step 3: Update `.env.docker` File
Replace the `MAIL_PASSWORD` in `/backend/.env.docker`:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=yakoubouldbouchiba@gmail.com
MAIL_PASSWORD=<16-CHARACTER-APP-PASSWORD>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="yakoubouldbouchiba@gmail.com"
MAIL_FROM_NAME="Baladia"
```

### Step 4: Test Email Sending
Run the password reset endpoint and check if the email sends successfully.

---

## Alternative: Use Mailgun/SendGrid (More Reliable for Production)

For production environments, consider using a dedicated email service:

### Mailgun
```dotenv
MAIL_MAILER=mailgun
MAILGUN_SECRET=<your-mailgun-api-key>
MAILGUN_DOMAIN=<your-mailgun-domain>
```

### SendGrid
```dotenv
MAIL_MAILER=postmark
POSTMARK_TOKEN=<your-sendgrid-api-key>
```

---

## Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 550 5.7.1 Relaying denied | Invalid credentials or 2FA issue | Use App Password, not regular Gmail password |
| 535 5.7.8 Username and Password not accepted | 2FA not enabled | Enable 2-Step Verification on account |
| Connection timeout | Port issue | Use port 587 with TLS |
| 530 5.7.0 Must issue a STARTTLS command | Encryption not set | Set `MAIL_ENCRYPTION=tls` |

