"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { contactIcons } from "@/data/icons";
import SectionTitle from "./SectionTitle";
import { PrivacyPolicyButton } from "./privacy/PrivacyPolicyProvider";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_MS = 30000;

const initialState = {
  name: "",
  email: "",
  phone: "",
  serviceType: "",
  message: "",
  privacy: false,
  company: ""
};

function formatMessage(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, value),
    template
  );
}

function validateForm(form, errorsText) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = errorsText.name;
  }

  if (!form.email.trim()) {
    errors.email = errorsText.emailRequired;
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = errorsText.emailInvalid;
  }

  if (!form.serviceType) {
    errors.serviceType = errorsText.serviceType;
  }

  if (!form.message.trim()) {
    errors.message = errorsText.message;
  }

  if (!form.privacy) {
    errors.privacy = errorsText.privacy;
  }

  return errors;
}

export default function Contact({ locale, content }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    if (!lastSubmittedAt) {
      setCooldownSeconds(0);
      return undefined;
    }

    function updateCooldown() {
      const remaining = COOLDOWN_MS - (Date.now() - lastSubmittedAt);
      setCooldownSeconds(Math.max(0, Math.ceil(remaining / 1000)));
    }

    updateCooldown();
    const interval = window.setInterval(updateCooldown, 1000);

    return () => window.clearInterval(interval);
  }, [lastSubmittedAt]);

  function updateField(event) {
    const { checked, name, type, value } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((current) => ({
      ...current,
      [name]: nextValue
    }));

    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (cooldownSeconds > 0) {
      setStatus({
        ok: false,
        message: content.errors.cooldown
      });
      return;
    }

    const clientErrors = validateForm(form, content.errors);
    setErrors(clientErrors);

    if (Object.keys(clientErrors).length > 0) {
      event.currentTarget.elements.namedItem(Object.keys(clientErrors)[0])?.focus();
      setStatus({
        ok: false,
        message: content.errors.form
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale })
      });
      const result = await response.json();

      setStatus({ ok: response.ok, message: result.message });
      setLastSubmittedAt(Date.now());

      if (result.errors) {
        setErrors(result.errors);
      }

      if (response.ok) {
        setForm(initialState);
      }
    } catch {
      setLastSubmittedAt(Date.now());
      setStatus({
        ok: false,
        message: content.errors.network
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isButtonDisabled = isSubmitting || cooldownSeconds > 0;

  return (
    <section id="kontakt" className="section-padding bg-brand-black">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionTitle
            eyebrow={content.eyebrow}
            title={content.title}
            lead={content.lead}
          />

          <div className="mt-10 grid gap-4">
            {content.details.map(([label, value], index) => {
              const Icon = contactIcons[index];
              return (
                <div key={label} className="flex gap-4 border border-white/10 p-4">
                  <Icon size={21} className="mt-1 text-brand-orange" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-white/60">{label}</p>
                    <p className="mt-1 text-white/80">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-brand-ink p-5 sm:p-8"
          noValidate
        >
          <div className="hidden" aria-hidden="true">
            <label>
              {content.fields.company}
              <input
                tabIndex={-1}
                autoComplete="off"
                name="company"
                value={form.company}
                onChange={updateField}
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="field-label" htmlFor="contact-name">
              {content.fields.name}
              <input
                required
                id="contact-name"
                name="name"
                value={form.name}
                onChange={updateField}
                className="field-input"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errors.name ? (
                <span id="contact-name-error" className="mt-2 block text-sm text-red-300">
                  {errors.name}
                </span>
              ) : null}
            </label>

            <label className="field-label" htmlFor="contact-email">
              {content.fields.email}
              <input
                required
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                className="field-input"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {errors.email ? (
                <span id="contact-email-error" className="mt-2 block text-sm text-red-300">
                  {errors.email}
                </span>
              ) : null}
            </label>

            <label className="field-label" htmlFor="contact-phone">
              {content.fields.phone}
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="field-input"
                autoComplete="tel"
              />
            </label>

            <label className="field-label" htmlFor="contact-service">
              {content.fields.serviceType}
              <select
                required
                id="contact-service"
                name="serviceType"
                value={form.serviceType}
                onChange={updateField}
                className="field-input"
                aria-invalid={Boolean(errors.serviceType)}
                aria-describedby={
                  errors.serviceType ? "contact-service-error" : undefined
                }
              >
                <option value="">{content.fields.servicePlaceholder}</option>
                {content.serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.serviceType ? (
                <span id="contact-service-error" className="mt-2 block text-sm text-red-300">
                  {errors.serviceType}
                </span>
              ) : null}
            </label>
          </div>

          <label className="field-label mt-5" htmlFor="contact-message">
            {content.fields.message}
            <textarea
              required
              id="contact-message"
              name="message"
              value={form.message}
              onChange={updateField}
              className="field-input min-h-40 resize-y"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
            {errors.message ? (
              <span id="contact-message-error" className="mt-2 block text-sm text-red-300">
                {errors.message}
              </span>
            ) : null}
          </label>

          <div className="contact-consent-row mt-5 flex items-start gap-3 text-sm leading-6 text-white/70">
            <input
              id="contact-privacy"
              required
              type="checkbox"
              name="privacy"
              checked={form.privacy}
              onChange={updateField}
              className="mt-1 h-4 w-4 accent-brand-orange"
              aria-invalid={Boolean(errors.privacy)}
              aria-describedby={errors.privacy ? "contact-privacy-error" : undefined}
              aria-labelledby="contact-privacy-label"
            />
            <p className="min-w-0" id="contact-privacy-label">
              <label htmlFor="contact-privacy">{content.fields.privacyPrefix}</label>{" "}
              <PrivacyPolicyButton
                id="contact-privacy-policy"
                className="contact-policy-button hover-fine-contact-policy p-0 text-left text-brand-orange underline decoration-brand-orange/40 underline-offset-4"
              >
                {content.fields.privacyLink}
              </PrivacyPolicyButton>
              <label htmlFor="contact-privacy">{content.fields.privacySuffix}</label>
            </p>
          </div>
          {errors.privacy ? (
            <p id="contact-privacy-error" className="mt-2 text-sm text-red-300">
              {errors.privacy}
            </p>
          ) : null}

          <button type="submit" className="btn-primary mt-6" disabled={isButtonDisabled}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin" size={17} aria-hidden="true" />
                {content.sending}
              </>
            ) : cooldownSeconds > 0 ? (
              formatMessage(content.cooldown, { seconds: cooldownSeconds })
            ) : (
              <>
                {content.submit}
                <Send size={17} aria-hidden="true" />
              </>
            )}
          </button>

          {status ? (
            <p
              className={`mt-5 text-sm leading-6 ${
                status.ok ? "text-brand-orange" : "text-red-300"
              }`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
