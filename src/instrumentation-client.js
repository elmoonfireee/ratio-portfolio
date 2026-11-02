import * as Sentry from "@sentry/nextjs";
import { beforeSend } from "./sentry-privacy";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    sendClientReports: false,
    autoSessionTracking: false,
    enableLogs: false,
    maxBreadcrumbs: 0,
    beforeSend
  });
}
