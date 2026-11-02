import { readFile } from "node:fs/promises";

const src = new URL("../../src/", import.meta.url);
const messages = new URL("../../messages/", import.meta.url);
const mailStub = new URL("./mail-stub.mjs", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "nodemailer") {
    return { url: mailStub.href, shortCircuit: true };
  }

  if (specifier === "next/server" && context.parentURL?.startsWith(src.href)) {
    return { url: new URL("../../node_modules/next/server.js", import.meta.url).href, shortCircuit: true };
  }

  if (specifier.startsWith("@/")) {
    return { url: new URL(`${specifier.slice(2)}.js`, src).href, shortCircuit: true };
  }

  if (context.parentURL?.startsWith(src.href) && specifier === "./config") {
    return { url: new URL("i18n/config.js", src).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith(src.href) && new URL(url).pathname.endsWith(".js")) {
    return { format: "module", source: await readFile(new URL(url), "utf8"), shortCircuit: true };
  }

  if (url.startsWith(messages.href) && url.endsWith(".json")) {
    const json = JSON.parse(await readFile(new URL(url), "utf8"));
    return { format: "module", source: `export default ${JSON.stringify(json)};`, shortCircuit: true };
  }

  return nextLoad(url, context);
}
