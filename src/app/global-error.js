"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

const copy = {
  pl: {
    eyebrow: "RATIO Smart Innovations",
    title: "Coś poszło nie tak",
    description:
      "Nie udało się wyświetlić tej strony. Wróć na stronę główną i spróbuj ponownie.",
    action: "Wróć na stronę główną"
  },
  en: {
    eyebrow: "RATIO Smart Innovations",
    title: "Something went wrong",
    description:
      "We could not display this page. Return to the homepage and try again.",
    action: "Return to homepage"
  }
};

function getLocale() {
  if (typeof window === "undefined") {
    return "pl";
  }

  return window.location.pathname.split("/")[1] === "en" ? "en" : "pl";
}

export default function GlobalError({ error }) {
  const locale = getLocale();
  const messages = copy[locale];

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang={locale}>
      <body style={styles.body}>
        <main style={styles.main}>
          <section style={styles.card}>
            <span style={styles.eyebrow}>{messages.eyebrow}</span>
            <h1 style={styles.title}>{messages.title}</h1>
            <p style={styles.description}>{messages.description}</p>
            <a href={`/${locale}`} style={styles.action}>
              {messages.action}
            </a>
          </section>
        </main>
      </body>
    </html>
  );
}

const styles = {
  body: {
    margin: 0,
    background: "#0d0d0d",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif"
  },
  main: {
    alignItems: "center",
    background:
      "radial-gradient(circle at top right, rgba(234, 88, 12, 0.18), transparent 40%)",
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "24px"
  },
  card: {
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "24px",
    maxWidth: "620px",
    padding: "clamp(32px, 6vw, 64px)",
    textAlign: "center"
  },
  eyebrow: {
    color: "#f97316",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase"
  },
  title: {
    fontSize: "clamp(34px, 7vw, 64px)",
    lineHeight: 1.05,
    margin: "20px 0"
  },
  description: {
    color: "#c4c4c4",
    fontSize: "18px",
    lineHeight: 1.65,
    margin: "0 auto 32px",
    maxWidth: "500px"
  },
  action: {
    background: "#f97316",
    borderRadius: "999px",
    color: "#0d0d0d",
    display: "inline-block",
    fontWeight: 700,
    padding: "14px 24px",
    textDecoration: "none"
  }
};
