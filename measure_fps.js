const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--use-gl=swiftshader'] });
  const page = await browser.newPage();
  
  // Go to the sandbox
  console.log("Navigating to http://localhost:5173...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // Helper to read FPS
  const readFps = async () => {
    return await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const fpsDiv = divs.find(d => d.textContent.includes('FPS:'));
      return fpsDiv ? fpsDiv.textContent : 'FPS: N/A';
    });
  };

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // Test A (Default)
  console.log("Testing A (Spline + Bloom)...");
  await delay(5000); // let it stabilize
  const fpsA = await readFps();
  console.log(`Test A Result: ${fpsA}`);

  // Switch to Test B
  console.log("Switching to Test B (20k Stars)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Test B'));
    if (btn) btn.click();
  });
  await delay(5000);
  const fpsB = await readFps();
  console.log(`Test B Result: ${fpsB}`);

  // Switch to Test C
  console.log("Switching to Test C (Unified Material)...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Test C'));
    if (btn) btn.click();
  });
  await delay(5000);
  const fpsC = await readFps();
  console.log(`Test C Result: ${fpsC}`);

  await browser.close();
  console.log("Done.");
})();
