import Image from "next/image";
import LoxonePartner from "./LoxonePartner";
import { PrivacyPolicyButton } from "./privacy/PrivacyPolicyProvider";

export default function Footer({ locale, content, nav, partner }) {
  return (
    <footer className="border-t border-white/10 bg-brand-black">
      <div className="section-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <Image
              src="/brand/logo_ratio_białe.png"
              alt="RATIO Smart Innovations"
              width={760}
              height={240}
              sizes="256px"
              className="h-auto w-64 object-contain"
            />
            <p className="mt-5 text-lg font-semibold text-white">
              {content.tagline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              {content.description}
            </p>
            <div className="mt-6 max-w-md">
              <LoxonePartner content={partner} compact />
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end" aria-label={content.aria}>
            {nav.items.map(({ label, href }) => (
              <a key={href} href={`/${locale}${href}`} className="footer-nav-link nav-link">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} RATIO Smart Innovations.</p>
          <PrivacyPolicyButton className="footer-privacy-button hover-fine-footer-policy text-left text-white/60">
            {content.privacy}
          </PrivacyPolicyButton>
        </div>
      </div>
    </footer>
  );
}
