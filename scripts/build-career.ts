import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const outputDir = path.join(process.cwd(), 'apps/web/src/data');
const outputFile = path.join(outputDir, 'career.json');

// Helper to read YAML files
function readYamlDir(dirName: string) {
  const dirPath = path.join(contentDir, dirName);
  if (!fs.existsSync(dirPath)) return [];
  
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    .map(file => {
      const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      return yaml.load(content);
    });
}

// Helper to read MDX files
function readMdxDir(dirName: string) {
  const dirPath = path.join(contentDir, dirName);
  if (!fs.existsSync(dirPath)) return [];
  
  return fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const { data, content } = matter(fs.readFileSync(path.join(dirPath, file), 'utf8'));
      return { ...data, body: content.trim() };
    });
}

async function buildCareer() {
  console.log('Building career.json...');
  
  // Read Profile
  const profileContent = fs.readFileSync(path.join(contentDir, 'profile.yml'), 'utf8');
  const profile = yaml.load(profileContent);

  // Read Tags
  const tagsContent = fs.readFileSync(path.join(contentDir, 'tags.yml'), 'utf8');
  const tags = yaml.load(tagsContent);

  const careerData = {
    profile,
    tags,
    projects: readMdxDir('projects'),
    experience: readYamlDir('experience'),
    education: readYamlDir('education'),
    certifications: readYamlDir('certifications'),
    hackathons: readMdxDir('hackathons'),
    publications: readYamlDir('publications'),
    story: readMdxDir('story').sort((a: any, b: any) => a.chapter - b.chapter),
    resumeProfiles: readYamlDir('resume-profiles')
  };

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(careerData, null, 2));
  console.log(`✅ career.json successfully written to ${outputFile}`);
}

buildCareer().catch(console.error);
