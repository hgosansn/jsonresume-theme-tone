const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshot(url, savePath) {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Resolve the file path and convert it to a file:// URL
  const filePath = path.resolve(url);
  const fileUrl = `file://${filePath}`;

  // Check if the URL is a local file
  if (!fs.existsSync(url)) {
    console.log();
      throw new Error(`File does not exist: ${url} ${fileUrl}`);
  }
  await page.goto(fileUrl);


  // Take a screenshot and save it to the specified path
  await page.setViewport({ width: 1280, height: 800 });
  for (let colorScheme of ['light', 'dark']) {
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: colorScheme },
    ]);
    const filePath = savePath.replace('.png', `-${colorScheme}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Screenshot saved at ${filePath}`);
  }

  // Close the browser
  await browser.close();

}

// Get the URL and save path from the command line arguments
const url = './dist/resume.html';
const savePath = './assets/preview.png';

if (!url) {
  console.log('Please provide a URL to capture.');
  process.exit(1);
}

takeScreenshot(url, savePath);
