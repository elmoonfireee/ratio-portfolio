"use client";

export default function SentryTestButton() {
  return (
    <button
      type="button"
      className="rounded-full bg-brand-orange px-6 py-3 font-semibold text-brand-black transition hover:brightness-110"
      onClick={() => {
        throw new Error("Controlled Sentry browser test error");
      }}
    >
      Wywołaj testowy błąd Sentry
    </button>
  );
}
