"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const PrivacyPolicyContext = createContext(null);

export function PrivacyPolicyButton({ children, className = "", ...props }) {
  const context = useContext(PrivacyPolicyContext);

  if (!context) return null;

  return (
    <button
      type="button"
      className={`focus-ring ${className}`}
      aria-haspopup="dialog"
      onClick={context.openPolicy}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrivacyPolicyProvider({ children, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(null);

  function openPolicy() {
    returnFocusRef.current = document.activeElement;
    setIsOpen(true);
  }

  function closePolicy() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePolicy();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [isOpen]);

  return (
    <PrivacyPolicyContext.Provider value={{ openPolicy }}>
      {children}

      {isOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePolicy();
          }}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-policy-title"
            aria-describedby="privacy-policy-intro"
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto border border-white/15 bg-brand-black shadow-orange"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-white/10 bg-brand-black/95 px-5 py-5 backdrop-blur sm:px-8">
              <div>
                <p className="section-eyebrow">
                  <span aria-hidden="true" />
                  {content.eyebrow}
                </p>
                <h2 id="privacy-policy-title" className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {content.title}
                </h2>
                <p className="mt-2 text-xs text-white/40">{content.updated}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="hover-fine-privacy-close focus-ring grid h-11 w-11 shrink-0 place-items-center border border-white/15 text-white/70 transition-colors motion-reduce:transition-none"
                aria-label={content.close}
                onClick={closePolicy}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-7 sm:px-8 sm:py-9">
              <p id="privacy-policy-intro" className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                {content.intro}
              </p>

              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                {content.sections.map((section, index) => (
                  <section key={section.title} className="grid gap-4 py-6 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-6">
                    <span className="font-mono text-xs text-brand-orange" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="mt-3 text-sm leading-7 text-white/60">
                          {paragraph}
                        </p>
                      ))}
                      {section.items?.length ? (
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-white/60">
                          {section.items.map((item) => (
                            <li key={item} className="border-l border-brand-orange/50 pl-4">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </PrivacyPolicyContext.Provider>
  );
}
