import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import http from "node:http";
import puppeteer from "puppeteer";
// @ts-ignore
import careerData from "../apps/web/src/data/career.json" assert { type: "json" };

const OUT_DIR = path.join(process.cwd(), "apps/web/out");
const PUBLIC_DIR = path.join(process.cwd(), "apps/web/public/resume");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

async function buildResumes() {
  console.log("Starting resume export pipeline...");

  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  // Start a local static server to serve the exported Next.js site
  const server = http.createServer((req, res) => {
    let reqUrl = req.url === "/" ? "/index.html" : req.url;
    // Strip query strings
    reqUrl = reqUrl?.split("?")[0] || "/";

    // Fallback for paths without extensions (Next.js export generates .html files)
    if (!path.extname(reqUrl)) {
      reqUrl += ".html";
    }

    const filePath = path.join(OUT_DIR, reqUrl);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || "application/octet-stream";

    const readStream = createReadStream(filePath);
    readStream.on("error", () => {
      res.writeHead(404);
      res.end(`File not found: ${reqUrl}`);
    });
    readStream.on("open", () => {
      res.writeHead(200, { "Content-Type": contentType });
      readStream.pipe(res);
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      resolve();
    });
  });

  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Local server listening at ${baseUrl}`);

  const browser = await puppeteer.launch({ headless: true });
  const profiles = careerData.resumeProfiles || [];

  for (const profile of profiles) {
    const profileId = profile.id;
    console.log(`\nProcessing profile: ${profileId}`);

    for (const template of ["ats", "signature"]) {
      const pageUrl = `${baseUrl}/resume/${profileId}/${template}`;
      const pdfPath = path.join(
        PUBLIC_DIR,
        `${profileId}${template === "signature" ? "-sig" : ""}.pdf`,
      );

      try {
        const page = await browser.newPage();

        // Next.js static exports load CSS via <link> and some JS for hydration.
        // We wait for networkidle0 to ensure everything is loaded.
        await page.goto(pageUrl, { waitUntil: "networkidle0" });

        await page.evaluateHandle("document.fonts.ready");

        const pdfOptions = {
          path: pdfPath,
          format: "A4" as const,
          printBackground: true,
          margin: {
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
          },
        };

        await page.pdf(pdfOptions);
        console.log(`[OK] Generated PDF: ${pdfPath}`);

        await page.close();
      } catch (err) {
        console.error(`[ERROR] Failed to generate ${profileId} (${template}):`, err);
      }
    }
  }

  await browser.close();

  server.close(() => {
    console.log("\nServer closed. Resume export pipeline complete.");
  });
}

buildResumes().catch((err) => {
  console.error(err);
  process.exit(1);
});
