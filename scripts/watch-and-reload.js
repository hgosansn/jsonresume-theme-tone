const puppeteer = require("puppeteer");
const chokidar = require("chokidar");
const { exec } = require("child_process");
const fs = require("fs");
if (process.platform === "darwin") {
  const fsevents = require("fsevents"); // Required for chokidar on macOS
}
const path = require("path");
const util = require("util");

const HTML_FILE = path.resolve(__dirname, "../dist/index.html"); // Update as needed
const BUILD_COMMAND = "npm run build && npm run export";

const execPromise = util.promisify(exec);

// Function to wait for the file to exist
const waitForFile = (filePath, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(filePath)) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error(`Timeout waiting for file: ${filePath}`));
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  });
};

(async () => {
  console.log("🔄 Running initial build...");
  await execPromise(BUILD_COMMAND);

  console.log(`⏳ Waiting for file: ${HTML_FILE}`);
  await waitForFile(HTML_FILE);
  console.log("✅ File found, launching browser...");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Simulate a normal desktop browser behavior
  await page.emulate({
    viewport: {
      width: 1024, // Default width (adjustable)
      height: 1248, // Default height (adjustable)
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  });


  await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: 'light' },
  ]);

  await page.goto(`file://${HTML_FILE}`);


  const watchDir = path.resolve(__dirname, "../src");
  const resumeFile = path.resolve(__dirname, "../temp/resume.json");
  console.log("🚀 Watching for changes in " + watchDir + " and " + resumeFile);
  // Watch for changes and rebuild

  const watcher = chokidar.watch([watchDir, resumeFile]);
  watcher.on("change", async () => {
    console.log("🔄 Changes detected, rebuilding...");

    try {
      await execPromise(BUILD_COMMAND);
      console.log("✅ Build complete, waiting for file...");
      await waitForFile(HTML_FILE);
      console.log("♻️ Reloading page...");
      await page.reload({ waitUntil: "networkidle0" });
    } catch (error) {
      console.error("❌ Error during rebuild:", error);
    }
  }).on("all", (event, path) => {
    console.log(`📁 ${event}: ${path}`);
  });
})();
