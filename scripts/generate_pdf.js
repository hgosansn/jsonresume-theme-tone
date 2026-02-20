const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Load .env file manually (no dotenv dependency)
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found! Copy example.env to .env and fill it in.');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getResumeNameSlug() {
  const resumePath = path.resolve(__dirname, '..', 'temp', 'resume.json');
  if (!fs.existsSync(resumePath)) {
    console.error(`resume.json not found at ${resumePath}. Run "npm run fetch" first.`);
    process.exit(1);
  }
  const resume = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
  const fullName = resume.basics && resume.basics.name;
  if (!fullName) {
    console.error('Could not find basics.name in resume.json');
    process.exit(1);
  }
  // "Hugo SANSON" → "hugo_sanson"
  const slug = fullName.trim().toLowerCase().replace(/\s+/g, '_');
  return slug;
}

async function generatePdf() {
  const htmlPath = path.resolve(__dirname, '..', 'dist', 'index.html');

  if (!fs.existsSync(htmlPath)) {
    console.error(`dist/index.html not found. Run "npm run build" first.`);
    process.exit(1);
  }

  const nameSlug = getResumeNameSlug();
  const pdfName = `cv_${nameSlug}.pdf`;
  const tempDir = path.resolve(__dirname, '..', 'temp');
  fs.mkdirSync(tempDir, { recursive: true });
  const pdfPath = path.resolve(tempDir, pdfName);

  console.log(`Generating PDF: ${pdfPath}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const fileUrl = `file://${htmlPath}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'light' },
  ]);

  await page.pdf({
    path: pdfPath,
    format: 'a4',
    printBackground: true,
    margin: { top: '0.6cm', right: '0.8cm', bottom: '0.6cm', left: '0.8cm' },
    preferCSSPageSize: false,
    scale: 1,
  });

  await browser.close();
  console.log(`PDF saved at ${pdfPath}`);

  return { pdfPath, pdfName };
}

function uploadToS3(pdfPath, pdfName) {
  const bucketUrl = process.env.S3_BUCKET_URL;
  if (!bucketUrl) {
    console.error('S3_BUCKET_URL is not set in .env — skipping upload.');
    process.exit(1);
  }

  // Ensure the bucket URL ends with /
  const destination = bucketUrl.endsWith('/') ? `${bucketUrl}${pdfName}` : `${bucketUrl}/${pdfName}`;

  console.log(`Uploading ${pdfName} to ${destination} ...`);

  try {
    execSync(
      `aws s3 cp "${pdfPath}" "${destination}" --acl public-read`,
      { stdio: 'inherit' }
    );
    console.log(`Upload complete! Public URL: ${destination}`);
  } catch (err) {
    console.error('S3 upload failed:', err.message);
    process.exit(1);
  }
}

(async () => {
  loadEnv();
  const { pdfPath, pdfName } = await generatePdf();
  uploadToS3(pdfPath, pdfName);
})();
