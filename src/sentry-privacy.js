const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?:\+?\d[\d ().-]{6,}\d)/g;

function redactSensitiveText(value) {
  return typeof value === "string"
    ? value
        .replace(EMAIL_PATTERN, "[redacted-email]")
        .replace(PHONE_PATTERN, "[redacted-phone]")
    : value;
}

export function beforeSend(event) {
  const sanitizedEvent = {
    ...event,
    message: redactSensitiveText(event.message)
  };

  delete sanitizedEvent.user;
  delete sanitizedEvent.request;
  delete sanitizedEvent.breadcrumbs;
  delete sanitizedEvent.extra;

  if (sanitizedEvent.exception?.values) {
    sanitizedEvent.exception = {
      ...sanitizedEvent.exception,
      values: sanitizedEvent.exception.values.map((exception) => ({
        ...exception,
        value: redactSensitiveText(exception.value)
      }))
    };
  }

  if (sanitizedEvent.contexts) {
    sanitizedEvent.contexts = { ...sanitizedEvent.contexts };
    delete sanitizedEvent.contexts.request;
    delete sanitizedEvent.contexts.response;
    delete sanitizedEvent.contexts.trace;
  }

  return sanitizedEvent;
}
