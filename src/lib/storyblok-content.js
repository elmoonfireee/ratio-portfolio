import "server-only";

import { projects as localProjects } from "@/data/projects";
import { getStoryblokApi, isStoryblokConfigured } from "@/lib/storyblok";

const REVALIDATE_SECONDS = 300;
const SUPPORTED_LOCALES = new Set(["pl", "en"]);
const STATUS_LABELS = {
  demo: { pl: "Projekt demonstracyjny", en: "Demo project" },
  coming_soon: { pl: "Wkrótce", en: "Coming soon" },
  completed: { pl: "Zrealizowany", en: "Completed" }
};

function safeLocale(locale) {
  return SUPPORTED_LOCALES.has(locale) ? locale : "pl";
}

function languageParams(locale) {
  return locale === "en"
    ? { language: "en", fallback_lang: "default" }
    : {};
}

function localized(value, locale) {
  return {
    pl: locale === "pl" ? value : "",
    en: locale === "en" ? value : ""
  };
}

function textFromRichNode(node) {
  if (!node || typeof node !== "object") return "";
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.content)) return "";

  return node.content
    .map(textFromRichNode)
    .filter(Boolean)
    .join(node.type === "doc" ? "\n\n" : " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function toText(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return textFromRichNode(value);
}

function toList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          return toText(item.name || item.label || item.value || item);
        }
        return "";
      })
      .filter(Boolean);
  }

  if (value && typeof value === "object") {
    const listItems = [];
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (node.type === "list_item") {
        const item = textFromRichNode(node);
        if (item) listItems.push(item);
        return;
      }
      node.content?.forEach(visit);
    };
    visit(value);
    if (listItems.length) return listItems;
  }

  const text = toText(value);
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function assetData(asset, fallbackAlt = "") {
  if (!asset || typeof asset !== "object" || typeof asset.filename !== "string") {
    return null;
  }

  return {
    src: asset.filename,
    alt: toText(asset.alt || asset.title) || fallbackAlt
  };
}

function normalizeProject(story, locale) {
  const content = story?.content;
  if (content?.component !== "project") return null;

  const title = toText(content.title);
  const shortDescription = toText(content.short_description);
  const fullDescription = toText(content.full_description);
  const rawStatus = toText(content.status);
  if (
    !story.slug ||
    !title ||
    !shortDescription ||
    !fullDescription ||
    !Object.hasOwn(STATUS_LABELS, rawStatus)
  ) {
    return null;
  }

  const statusKey = rawStatus;
  const featured = assetData(content.featured_image, title);
  const gallery = Array.isArray(content.gallery)
    ? content.gallery.map((asset) => assetData(asset, title)).filter(Boolean)
    : [];
  const featuredImage = featured?.src || "/projects/neutral-automation.svg";

  return {
    slug: story.slug,
    isDemo: statusKey !== "completed",
    noindex: Boolean(content.noindex) || statusKey !== "completed",
    statusKey,
    category: toText(content.category) || "Smart Home",
    year: toText(content.year),
    featuredImage,
    featuredImageAlt: localized(featured?.alt || title, locale),
    galleryImages: (gallery.length ? gallery : [{ src: featuredImage, alt: featured?.alt || title }])
      .map((image) => ({ src: image.src, alt: localized(image.alt, locale) })),
    status: localized(STATUS_LABELS[statusKey][locale], locale),
    location: localized(toText(content.service_region), locale),
    title: localized(title, locale),
    shortDescription: localized(shortDescription, locale),
    fullDescription: localized(fullDescription, locale),
    scopeOfWork: localized(toList(content.scope_of_work), locale),
    systemsAndTechnologies: toList(content.technologies),
    keyFunctions: localized(toList(content.smart_functions), locale),
    seoTitle: localized(toText(content.seo_title), locale),
    seoDescription: localized(toText(content.seo_description), locale),
    testimonial: { enabled: false, quote: localized("", locale), author: "" }
  };
}

function diagnostic(message) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[Storyblok] ${message}`);
  }
}

async function fetchProjectStories(locale) {
  if (!isStoryblokConfigured) return null;

  try {
    const api = getStoryblokApi();
    if (!api) return null;

    const response = await api.getStories(
      {
        version: "published",
        starts_with: "projects/",
        per_page: 100,
        ...languageParams(locale)
      },
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    return Array.isArray(response?.data?.stories) ? response.data.stories : [];
  } catch {
    diagnostic("project content is unavailable; local fallback remains active.");
    return null;
  }
}

export async function getStoryblokProjects(requestedLocale) {
  const locale = safeLocale(requestedLocale);
  const stories = await fetchProjectStories(locale);
  if (!stories) return null;

  const projects = stories
    .map((story) => normalizeProject(story, locale))
    .filter(Boolean);

  return projects.length ? projects : null;
}

export async function getStoryblokProjectBySlug(requestedLocale, slug) {
  const locale = safeLocale(requestedLocale);
  if (!isStoryblokConfigured || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  try {
    const api = getStoryblokApi();
    if (!api) return null;

    const response = await api.getStory(
      `projects/${slug}`,
      { version: "published", ...languageParams(locale) },
      { next: { revalidate: REVALIDATE_SECONDS } }
    );

    return normalizeProject(response?.data?.story, locale);
  } catch {
    diagnostic("project content is unavailable; local fallback remains active.");
    return null;
  }
}

export async function getProjects(locale) {
  const cmsProjects = await getStoryblokProjects(locale);
  if (!cmsProjects) return localProjects;

  const cmsBySlug = new Map(cmsProjects.map((project) => [project.slug, project]));
  const merged = localProjects.map((project) => cmsBySlug.get(project.slug) || project);
  const localSlugs = new Set(localProjects.map((project) => project.slug));

  return [...merged, ...cmsProjects.filter((project) => !localSlugs.has(project.slug))];
}

export async function getProjectBySlug(locale, slug) {
  const cmsProject = await getStoryblokProjectBySlug(locale, slug);
  return cmsProject || localProjects.find((project) => project.slug === slug) || null;
}
