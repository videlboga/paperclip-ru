#!/usr/bin/env node
// Capture screenshots of the Document Annotation storybook stories.
// Usage: node scripts/screenshot-doc-annotations.mjs <storybook-static-dir> <output-dir>

import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";

async function main() {
  const [, , staticDir, outDir] = process.argv;
  if (!staticDir || !outDir) {
    console.error("usage: node scripts/screenshot-doc-annotations.mjs <storybook-static-dir> <output-dir>");
    process.exit(1);
  }
  await fs.mkdir(outDir, { recursive: true });
  const absStaticDir = path.resolve(staticDir);

  const server = http.createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "iframe.html";
      const filePath = path.resolve(absStaticDir, `.${urlPath}`);
      if (!filePath.startsWith(absStaticDir + path.sep) && filePath !== absStaticDir) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const buf = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const mime = {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".map": "application/json",
      }[ext] || "application/octet-stream";
      res.writeHead(200, { "content-type": mime });
      res.end(buf);
    } catch (err) {
      res.writeHead(404);
      res.end(String(err));
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/iframe.html`;

  const browser = await chromium.launch();
  try {
    const stories = [
      // INTEGRATED — these are the captures the UX gate requires. They render
      // IssueDocumentsSection chrome (count chip in header row, body + side panel
      // wired together, edit mode wrapping the layer, real shadcn Sheet on mobile).
      { id: "product-documents-annotations--integrated-desktop-open", file: "01-integrated-desktop-open.png", width: 1440, height: 900 },
      { id: "product-documents-annotations--integrated-desktop-zero-comments", file: "02-integrated-desktop-zero-count.png", width: 1440, height: 900 },
      { id: "product-documents-annotations--integrated-desktop-edit-mode", file: "03-integrated-desktop-edit-mode.png", width: 1440, height: 900 },
      { id: "product-documents-annotations--integrated-desktop-dirty-draft", file: "04-integrated-desktop-dirty-draft.png", width: 1440, height: 900 },
      { id: "product-documents-annotations--integrated-mobile-bottom-sheet", file: "05-integrated-mobile-sheet.png", width: 390, height: 844 },
      // ISOLATED — kept around for visual debugging of state pieces.
      { id: "product-documents-annotations--desktop-open-focused", file: "10-states-open-focused.png", width: 1280, height: 900 },
      { id: "product-documents-annotations--desktop-resolved-focused", file: "11-states-resolved-focused.png", width: 1280, height: 900 },
      { id: "product-documents-annotations--desktop-stale-focused", file: "12-states-stale-focused.png", width: 1280, height: 900 },
      { id: "product-documents-annotations--desktop-orphaned-focused", file: "13-states-orphaned-focused.png", width: 1280, height: 900 },
    ];

    const themeArg = (process.env.SCREENSHOT_THEME || "dark").toLowerCase();
    const theme = themeArg === "light" ? "light" : "dark";

    for (const story of stories) {
      const ctx = await browser.newContext({
        viewport: { width: story.width, height: story.height },
        deviceScaleFactor: 2,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      const url = `${baseUrl}?id=${story.id}&viewMode=story&globals=theme:${theme}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate((appliedTheme) => {
        document.documentElement.classList.toggle("dark", appliedTheme === "dark");
        document.documentElement.style.colorScheme = appliedTheme;
      }, theme);
      // Allow async query prefill + the layer's interval-driven layout pass to settle.
      await page.waitForTimeout(900);
      const out = path.join(outDir, story.file);
      await page.screenshot({ path: out, fullPage: false });
      console.log("wrote", out);
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
