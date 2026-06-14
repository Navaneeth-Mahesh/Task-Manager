import nodemailer from 'nodemailer'

/**
 * Create a Nodemailer transporter using SMTP credentials from env.
 * In development, logs the preview URL when using ethereal.email.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/**
 * Core send function.
 * @param {Object} options - { to, subject, html, text }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter()
  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'TaskFlow'}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  }

  const info = await transporter.sendMail(mailOptions)
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email sent:', nodemailer.getTestMessageUrl(info))
  }
  return info
}

// ── Email Templates ───────────────────────────────────────────────────────────

/**
 * Welcome email after registration.
 */
export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/></head>
    <body style="font-family:'Inter',sans-serif;background:#050505;color:#fff;margin:0;padding:0">
      <div style="max-width:560px;margin:40px auto;background:#0D0D0D;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
        <div style="padding:32px;background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(6,182,212,0.1));text-align:center">
          <div style="width:48px;height:48px;background:#8B5CF6;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px">⚡</div>
          <h1 style="font-size:24px;font-weight:700;margin:0">Welcome to TaskFlow</h1>
        </div>
        <div style="padding:32px">
          <p style="color:#9CA3AF;font-size:15px;line-height:1.7">
            Hi <strong style="color:#fff">${user.fullname}</strong>,<br/><br/>
            Your account is ready. You can now log in and start organizing your tasks like a pro.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${process.env.CLIENT_URL}/login"
               style="background:#8B5CF6;color:#fff;padding:13px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block">
              Open TaskFlow →
            </a>
          </div>
          <p style="color:#6B7280;font-size:12px;text-align:center;margin-top:24px">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  return sendEmail({
    to: user.email,
    subject: 'Welcome to TaskFlow ⚡',
    html,
    text: `Welcome to TaskFlow, ${user.fullname}! Log in at ${process.env.CLIENT_URL}/login`,
  })
}

/**
 * Password reset email with a secure token link.
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/></head>
    <body style="font-family:'Inter',sans-serif;background:#050505;color:#fff;margin:0;padding:0">
      <div style="max-width:560px;margin:40px auto;background:#0D0D0D;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
        <div style="padding:32px;background:linear-gradient(135deg,rgba(239,68,68,0.15),rgba(139,92,246,0.1));text-align:center">
          <div style="font-size:36px;margin-bottom:8px">🔑</div>
          <h1 style="font-size:22px;font-weight:700;margin:0">Reset Your Password</h1>
        </div>
        <div style="padding:32px">
          <p style="color:#9CA3AF;font-size:15px;line-height:1.7">
            Hi <strong style="color:#fff">${user.fullname}</strong>,<br/><br/>
            We received a request to reset your password. Click the button below — this link expires in <strong style="color:#F59E0B">1 hour</strong>.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${resetUrl}"
               style="background:#8B5CF6;color:#fff;padding:13px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block">
              Reset Password
            </a>
          </div>
          <p style="color:#6B7280;font-size:12px;text-align:center;margin-top:24px">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  return sendEmail({
    to: user.email,
    subject: 'TaskFlow — Password Reset Request',
    html,
    text: `Reset your TaskFlow password: ${resetUrl}`,
  })
}
