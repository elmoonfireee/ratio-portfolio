import test from "node:test";
import assert from "node:assert/strict";
import { socialLinks, visibleSocialLinks } from "../src/data/socialLinks.js";

test("Facebook labels are readable in both languages", () => {
  assert.equal(socialLinks.facebook.ariaLabel.pl, "Otwórz profil RATIO na Facebooku — link zastępczy");
  assert.equal(socialLinks.facebook.ariaLabel.en, "Open RATIO on Facebook — placeholder link");
});

test("placeholder social links are hidden while LinkedIn remains available", () => {
  assert.equal(visibleSocialLinks.facebook, undefined);
  assert.equal(visibleSocialLinks.instagram, undefined);
  assert.equal(visibleSocialLinks.tiktok, undefined);
  assert.equal(visibleSocialLinks.linkedin, socialLinks.linkedin);
});
