import nodemailer from "nodemailer";
import { siteConfig } from "@/data/site";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/getMessages";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_ENV = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS"
];

let requestTimestamps = [];
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16 * 1024;

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return cleanText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRateLimited() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (requestTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  requestTimestamps.push(now);
  return false;
}

async function readPayload(request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > MAX_BODY_BYTES) {
    return { tooLarge: true };
  }

  if (!request.body) return { data: null };

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        return { tooLarge: true };
      }
      text += decoder.decode(value, { stream: true });
    }

    return { data: JSON.parse(text + decoder.decode()) };
  } catch {
    return { data: null };
  } finally {
    reader.releaseLock();
  }
}

function validatePayload(data, errorsText) {
  const values = {
    locale: isLocale(data?.locale) ? data.locale : defaultLocale,
    name: cleanText(data?.name),
    email: cleanText(data?.email),
    phone: cleanText(data?.phone),
    serviceType: cleanText(data?.serviceType),
    message: cleanText(data?.message),
    privacy: data?.privacy === true,
    company: cleanText(data?.company)
  };

  const errors = {};

  if (!values.name) {
    errors.name = errorsText.name;
  }

  if (!values.email) {
    errors.email = errorsText.emailRequired;
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = errorsText.emailInvalid;
  }

  if (!values.serviceType) {
    errors.serviceType = errorsText.serviceType;
  }

  if (!values.message) {
    errors.message = errorsText.message;
  }

  if (!values.privacy) {
    errors.privacy = errorsText.privacy;
  }

  return { values, errors };
}

function getMissingEnv() {
  return REQUIRED_ENV.filter((name) => !process.env[name]);
}

function buildEmail({ values, submittedAt }) {
  const safe = {
    name: escapeHtml(values.name),
    email: escapeHtml(values.email),
    phone: escapeHtml(values.phone || "Nie podano / Not provided"),
    serviceType: escapeHtml(values.serviceType),
    message: escapeHtml(values.message).replaceAll("\n", "<br />"),
    submittedAt: escapeHtml(submittedAt),
    locale: escapeHtml(values.locale)
  };

  const text = [
    "Nowe zapytanie z formularza RATIO Smart Innovations",
    "New inquiry from the RATIO Smart Innovations contact form",
    "",
    `Language / Język: ${values.locale}`,
    `Imię i nazwisko / Full name: ${values.name}`,
    `E-mail: ${values.email}`,
    `Telefon / Phone: ${values.phone || "Nie podano / Not provided"}`,
    `Rodzaj usługi / Service type: ${values.serviceType}`,
    `Data wysłania / Submission time: ${submittedAt}`,
    "",
    "Wiadomość / Message:",
    values.message
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,sans-serif;color:#f5f5f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0b0b0b;padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border-collapse:collapse;background:#111;border:1px solid #2b2b2b;">
              <tr>
                <td style="padding:28px 32px;border-bottom:3px solid #ff6700;">
                  <p style="margin:0 0 8px;color:#ff6700;font-size:12px;letter-spacing:2px;text-transform:uppercase;">RATIO Smart Innovations</p>
                  <h1 style="margin:0;color:#fff;font-size:24px;line-height:1.35;">Nowe zapytanie z formularza kontaktowego</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    ${[
                      ["Język / Language", safe.locale],
                      ["Imię i nazwisko / Full name", safe.name],
                      ["E-mail", safe.email],
                      ["Telefon / Phone", safe.phone],
                      ["Rodzaj usługi / Service type", safe.serviceType],
                      ["Data wysłania / Submission time", safe.submittedAt]
                    ]
                      .map(
                        ([label, value]) => `
                          <tr>
                            <td style="padding:12px 0;width:210px;color:#9a9a9a;font-size:13px;border-bottom:1px solid #242424;">${label}</td>
                            <td style="padding:12px 0;color:#fff;font-size:15px;border-bottom:1px solid #242424;">${value}</td>
                          </tr>
                        `
                      )
                      .join("")}
                  </table>
                  <div style="margin-top:28px;">
                    <p style="margin:0 0 10px;color:#9a9a9a;font-size:13px;">Wiadomość / Message</p>
                    <div style="padding:18px 20px;background:#080808;border-left:3px solid #ff6700;color:#f5f5f5;font-size:15px;line-height:1.7;">
                      ${safe.message}
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  return { html, text };
}

export async function POST(request) {
  const payload = await readPayload(request);
  if (payload.tooLarge) {
    return Response.json(
      { ok: false, message: "Treść żądania jest zbyt duża. / Request body is too large." },
      { status: 413 }
    );
  }

  const data = payload.data;
  const locale = isLocale(data?.locale) ? data.locale : defaultLocale;
  const messages = getMessages(locale);
  const statusText = messages.contact.status;

  if (isRateLimited()) {
    return Response.json(
      {
        ok: false,
        message: statusText.rateLimit
      },
      { status: 429 }
    );
  }

  const { values, errors } = validatePayload(data, messages.contact.errors);

  if (values.company) {
    return Response.json({
      ok: true,
      message: statusText.accepted
    });
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        ok: false,
        message: statusText.invalid,
        errors
      },
      { status: 400 }
    );
  }

  const missingEnv = getMissingEnv();

  if (missingEnv.length > 0) {
    return Response.json(
      {
        ok: false,
        message: statusText.missingSmtp
      },
      { status: 503 }
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(smtpPort) || smtpPort <= 0 || smtpPort > 65535) {
    return Response.json(
      {
        ok: false,
        message: statusText.badSmtpPort
      },
      { status: 503 }
    );
  }

  const submittedAt = new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Warsaw"
  }).format(new Date());

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    const { html, text } = buildEmail({ values, submittedAt });

    await transporter.sendMail({
      from: `"RATIO Smart Innovations" <${process.env.SMTP_USER}>`,
      to: siteConfig.contact.email,
      replyTo: `"${values.name}" <${values.email}>`,
      subject: `RATIO Smart Innovations: ${values.serviceType}`,
      text,
      html
    });
  } catch (error) {
    console.error("Contact form email error:", error);

    return Response.json(
      {
        ok: false,
        message: statusText.sendError
      },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    message: statusText.sent
  });
}
