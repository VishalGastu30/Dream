import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";

// Assuming Zod schemas are compiled and can be imported, or we can use tsx to run this directly.
// We'll import from the built/ts files. Since this is run via tsx, we can import .ts files.
import {
  TagVocabulary,
  Project,
  Experience,
  Education,
  Certification,
  Hackathon,
  Achievement,
  Publication,
  StoryChapter,
  Profile,
  ResumeProfile,
} from "../packages/schema/src/index.js";

const CONTENT_DIR = path.resolve(process.cwd(), "content");
const ASSETS_DIR = path.resolve(process.cwd(), "assets");

let hasErrors = false;

function reportError(file: string, message: string) {
  console.error(`❌ [${file}] ${message}`);
  hasErrors = true;
}

function getFiles(dir: string, extensions: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

// 1. Load Tag Vocabulary
const tagsPath = path.join(CONTENT_DIR, "tags.yml");
let allowedTags = new Set<string>();
if (fs.existsSync(tagsPath)) {
  try {
    const tagsContent = fs.readFileSync(tagsPath, "utf8");
    const parsedTags = yaml.load(tagsContent) as Record<string, string[]>;
    // Validate tag vocabulary structure
    const parsed = TagVocabulary.safeParse(parsedTags);
    if (!parsed.success) {
      reportError("tags.yml", `Invalid tags vocabulary: ${parsed.error.message}`);
    } else {
      Object.values(parsedTags).forEach(tagList => {
        if (Array.isArray(tagList)) {
          tagList.forEach(tag => allowedTags.add(tag));
        }
      });
    }
  } catch (e: any) {
    reportError("tags.yml", `Failed to parse: ${e.message}`);
  }
} else {
  reportError("tags.yml", "Missing tags.yml");
}

function checkTags(filePath: string, tags: string[] = []) {
  for (const tag of tags) {
    if (!allowedTags.has(tag)) {
      reportError(path.relative(CONTENT_DIR, filePath), `Unknown tag used: '${tag}'`);
    }
  }
}

function checkMedia(filePath: string, mediaArray: any[] = []) {
  for (const media of mediaArray) {
    if (media && media.src) {
      const absolutePath = path.join(process.cwd(), media.src.startsWith("/") ? media.src.slice(1) : media.src);
      if (!fs.existsSync(absolutePath)) {
         reportError(path.relative(CONTENT_DIR, filePath), `Media source not found: ${media.src} (looked at ${absolutePath})`);
      }
    }
  }
}

function validateFile(filePath: string, schema: any, isMdx: boolean) {
  const content = fs.readFileSync(filePath, "utf8");
  let data: any;
  const relPath = path.relative(CONTENT_DIR, filePath);

  try {
    if (isMdx) {
      const parsed = matter(content);
      data = parsed.data;
    } else {
      data = yaml.load(content);
    }
  } catch (e: any) {
    reportError(relPath, `Parse error: ${e.message}`);
    return;
  }

  if (!data) return; // Empty file

  const result = schema.safeParse(data);
  if (!result.success) {
    const errorDetails = result.error.errors.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ");
    reportError(relPath, `Validation failed: ${errorDetails}`);
  } else {
    // Cross-validation
    if (data.tags) checkTags(filePath, data.tags);
    if (data.bullets) {
      data.bullets.forEach((b: any) => checkTags(filePath, b.tags || []));
    }
    if (data.media) checkMedia(filePath, data.media);
    
    // Check ID matches filename for specific entities (excluding profile.yml, etc)
    if (data.id && !filePath.includes("profile.yml")) {
      const expectedId = path.basename(filePath, path.extname(filePath));
      if (data.id !== expectedId) {
        reportError(relPath, `ID '${data.id}' does not match filename '${expectedId}'`);
      }
    }
  }
}

console.log("Validating content...");

// 2. Validate Profile & Resume Profiles
const profilePath = path.join(CONTENT_DIR, "profile.yml");
if (fs.existsSync(profilePath)) validateFile(profilePath, Profile, false);

const resumeProfiles = getFiles(path.join(CONTENT_DIR, "resume-profiles"), [".yml"]);
resumeProfiles.forEach(f => validateFile(f, ResumeProfile, false));

// 3. Validate MDX Entities (Projects, Story, Hackathons)
const projects = getFiles(path.join(CONTENT_DIR, "projects"), [".mdx"]);
projects.forEach(f => validateFile(f, Project, true));

const storyChapters = getFiles(path.join(CONTENT_DIR, "story"), [".mdx"]);
storyChapters.forEach(f => validateFile(f, StoryChapter, true));

const hackathons = getFiles(path.join(CONTENT_DIR, "hackathons"), [".mdx"]);
hackathons.forEach(f => validateFile(f, Hackathon, true));

// 4. Validate YAML Entities (Experience, Education, etc)
const experiences = getFiles(path.join(CONTENT_DIR, "experience"), [".yml"]);
experiences.forEach(f => validateFile(f, Experience, false));

const educations = getFiles(path.join(CONTENT_DIR, "education"), [".yml"]);
educations.forEach(f => validateFile(f, Education, false));

const certs = getFiles(path.join(CONTENT_DIR, "certifications"), [".yml"]);
certs.forEach(f => validateFile(f, Certification, false));

const achievements = getFiles(path.join(CONTENT_DIR, "achievements"), [".yml"]);
achievements.forEach(f => validateFile(f, Achievement, false));

const publications = getFiles(path.join(CONTENT_DIR, "publications"), [".yml"]);
publications.forEach(f => validateFile(f, Publication, false));


if (hasErrors) {
  console.error("\n❌ Content validation failed.");
  process.exit(1);
} else {
  console.log("✅ All content valid!");
  process.exit(0);
}
