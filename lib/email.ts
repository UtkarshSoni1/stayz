/**
 * lib/email.ts
 *
 * Nodemailer transport + branded email helpers for StayZ.
 * Reads SMTP config from env. Falls back to console.log in dev
 * when credentials are not configured (lets you test without real SMTP).
 */

import nodemailer from "nodemailer"

// ─── Transporter (lazy singleton) ─────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    // Dev fallback: log emails to console instead of sending
    _transporter = nodemailer.createTransport({ jsonTransport: true })
  } else {
    _transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT ?? 587),
      secure: Number(EMAIL_PORT ?? 587) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
  }

  return _transporter
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FROM = process.env.EMAIL_FROM ?? "StayZ <noreply@stayz.in>"

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "http://localhost:3000"

// ─── sendVerificationEmail ────────────────────────────────────────────────────

/**
 * Sends a branded email verification message to the user.
 * @param to      - Recipient email address
 * @param rawToken - The raw (unhashed) token to embed in the link
 */
export async function sendVerificationEmail(
  to: string,
  rawToken: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/auth/verify?token=${rawToken}`

  const html = buildVerificationEmail(verifyUrl, to)

  const transporter = getTransporter()

  const info = await transporter.sendMail({
    from: FROM,
    to,
    subject: "Verify your StayZ email address",
    html,
    text: `Verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`,
  })

  // Dev mode: print the verification URL so developers can test without real SMTP
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.log("\n──────────────────────────────────────────────────────────")
    console.log("📧  [DEV] Email verification link (SMTP not configured):")
    console.log("    " + verifyUrl)
    console.log("──────────────────────────────────────────────────────────\n")
  } else {
    console.log(`[email] Verification sent to ${to}`, (info as { messageId?: string }).messageId)
  }
}

// ─── Email Template ───────────────────────────────────────────────────────────

function buildVerificationEmail(verifyUrl: string, to: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your StayZ email</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation"
               style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:36px 40px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#fff;">StayZ</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;line-height:1.3;">
                Welcome to StayZ 🏠
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
                Thanks for signing up! Click the button below to verify your email address and activate your account.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                <tr>
                  <td style="border-radius:10px;background:#fff;">
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0a0a0a;text-decoration:none;border-radius:10px;letter-spacing:-0.1px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.35);">
                If the button doesn&apos;t work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 28px;word-break:break-all;">
                <a href="${verifyUrl}" style="font-size:13px;color:#60a5fa;text-decoration:underline;">
                  ${verifyUrl}
                </a>
              </p>

              <!-- Expiry notice -->
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:16px;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.5;">
                  ⏱ This link expires in <strong style="color:rgba(255,255,255,0.7);">24 hours</strong>.
                  If you didn&apos;t create a StayZ account, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
                Sent to ${to} &nbsp;·&nbsp; StayZ — Find your vibe. Find your place.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
