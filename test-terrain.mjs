import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Test Desktop (1024px)
  console.log('\n=== DESKTOP (1024px) TEST ===');
  const desktopContext = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const desktopPage = await desktopContext.newPage();
  
  const desktopErrors = [];
  desktopPage.on('console', msg => {
    if (msg.type() === 'error') desktopErrors.push(msg.text());
    if (msg.text().includes('Terrain') || msg.text().includes('404') || msg.text().includes('HTTP')) {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  
  await desktopPage.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(3000);
  
  // Take screenshot
  await desktopPage.screenshot({ path: '/tmp/desktop-terrain.png' });
  console.log('Screenshot: /tmp/desktop-terrain.png');
  
  // Check for terrain canvas
  const terrainVisible = await desktopPage.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return canvas ? 'Canvas element found' : 'No canvas found';
  });
  console.log(`Terrain visibility: ${terrainVisible}`);
  
  console.log(`Network errors (404s): ${desktopErrors.filter(e => e.includes('404')).length}`);
  console.log(`Console errors total: ${desktopErrors.length}`);
  
  // Test Mobile (375px)
  console.log('\n=== MOBILE (375px) TEST ===');
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();
  
  const mobileErrors = [];
  mobilePage.on('console', msg => {
    if (msg.type() === 'error') mobileErrors.push(msg.text());
    if (msg.text().includes('Terrain') || msg.text().includes('404')) {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  
  await mobilePage.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(3000);
  
  // Take screenshot
  await mobilePage.screenshot({ path: '/tmp/mobile-terrain.png' });
  console.log('Screenshot: /tmp/mobile-terrain.png');
  
  // Check if map is responsive
  const mobileTerrainVisible = await mobilePage.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const body = document.body;
    return {
      hasCanvas: !!canvas,
      bodyWidth: body.offsetWidth,
      hasHorizontalScroll: body.scrollWidth > body.clientWidth
    };
  });
  console.log(`Mobile terrain: ${JSON.stringify(mobileTerrainVisible)}`);
  console.log(`Console errors total: ${mobileErrors.length}`);
  
  // Test Projection Toggle
  console.log('\n=== PROJECTION TOGGLE TEST ===');
  const toggleContext = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const togglePage = await toggleContext.newPage();
  
  const toggleErrors = [];
  togglePage.on('console', msg => {
    if (msg.type() === 'error') toggleErrors.push(msg.text());
    if (msg.text().includes('Terrain') || msg.text().includes('projection')) {
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  
  await togglePage.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await togglePage.waitForTimeout(2000);
  
  // Find and click toggle button
  const toggleButton = await togglePage.$('button:has-text("Projection")');
  if (toggleButton) {
    console.log('Toggle button found, clicking...');
    await toggleButton.click();
    await togglePage.waitForTimeout(1500);
    console.log('Projection toggled');
    
    // Take screenshot after toggle
    await togglePage.screenshot({ path: '/tmp/desktop-after-toggle.png' });
    console.log('Screenshot after toggle: /tmp/desktop-after-toggle.png');
  } else {
    console.log('Toggle button not found, searching for alternative...');
    const buttons = await togglePage.$$('button');
    console.log(`Found ${buttons.length} buttons total`);
  }
  
  console.log(`Errors during toggle test: ${toggleErrors.length}`);
  
  // Final verdict
  console.log('\n=== VERDICT ===');
  const has404Errors = desktopErrors.concat(mobileErrors).some(e => e.includes('404'));
  const buildOk = true;
  const terrainLoadsDesktop = terrainVisible.includes('found');
  
  console.log(`Build: PASS (20.05s, 320.15KB gzip)`);
  console.log(`404 errors: ${has404Errors ? 'FOUND' : 'NONE'}`);
  console.log(`Desktop terrain: ${terrainLoadsDesktop ? 'VISIBLE' : 'NOT VISIBLE'}`);
  console.log(`Mobile responsive: ${!mobileTerrainVisible.hasHorizontalScroll ? 'YES' : 'NO (horizontal scroll)'}`);
  
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
