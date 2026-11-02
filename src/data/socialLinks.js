export const socialLinks = {
  facebook: {
    href: "https://example.com/ratio-facebook-placeholder",
    ariaLabel: {
      pl: "Otwórz profil RATIO na Facebooku — link zastępczy",
      en: "Open RATIO on Facebook — placeholder link"
    }
  },
  instagram: {
    href: "https://example.com/ratio-instagram-placeholder",
    ariaLabel: {
      pl: "Otwórz profil RATIO na Instagramie — link zastępczy",
      en: "Open RATIO on Instagram — placeholder link"
    }
  },
  tiktok: {
    href: "https://example.com/ratio-tiktok-placeholder",
    ariaLabel: {
      pl: "Otwórz profil RATIO na TikToku — link zastępczy",
      en: "Open RATIO on TikTok — placeholder link"
    }
  },
  linkedin: {
    href: "https://www.linkedin.com/company/ratio-smart-innovations/",
    ariaLabel: {
      pl: "Otwórz profil RATIO na LinkedIn",
      en: "Open RATIO on LinkedIn"
    }
  }
};

export const visibleSocialLinks = Object.fromEntries(
  Object.entries(socialLinks).filter(([, { href }]) => !href.startsWith("https://example.com/"))
);
