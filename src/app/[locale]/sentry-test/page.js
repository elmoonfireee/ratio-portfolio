import { notFound } from "next/navigation";
import SentryTestButton from "./SentryTestButton";
import { isLocale } from "@/i18n/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Sentry test",
  robots: {
    index: false,
    follow: false,
    noarchive: true
  }
};

export default async function SentryTestPage({ params }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  if (process.env.SENTRY_TEST_ENABLED !== "true") {
    notFound();
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-brand-white"
    >
      <section className="max-w-xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Development only
        </p>
        <h1 className="mb-8 text-4xl font-semibold">Test monitoringu błędów</h1>
        <SentryTestButton />
      </section>
    </main>
  );
}
