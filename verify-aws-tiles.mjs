import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  
  const networkRequests = [];
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('elevation-tiles-prod') || url.includes('.tif') || url.includes('404')) {
      networkRequests.push({
        url: url,
        status: response.status(),
        contentType: response.headers()['content-type'] || 'unknown'
      });
    }
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[ERROR] ${msg.text()}`);
    }
    if (msg.text().includes('Terrain')) {
      console.log(`[LOG] ${msg.text()}`);
    }
  });
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('\n=== AWS ELEVATION TILE REQUESTS ===');
  if (networkRequests.length > 0) {
    networkRequests.forEach(req => {
      console.log(`${req.status === 200 ? '✓' : '✗'} ${req.status} - ${req.url}`);
    });
  } else {
    console.log('Checking if tiles are in-flight or cached...');
    // Wait for lazy load
    await page.waitForTimeout(3000);
    networkRequests.forEach(req => {
      console.log(`${req.status === 200 ? '✓' : '✗'} ${req.status} - ${req.url}`);
    });
  }
  
  // Get all network activity via CDP
  console.log('\n=== VERIFYING ELEVATION TILE SOURCE ===');
  const tileInfo = await page.evaluate(() => {
    // Try to access MapLibre sources
    if (window.map && window.map.getSource) {
      const dem = window.map.getSource('dem');
      return {
        sourceExists: !!dem,
        sourceType: dem ? dem.type : 'none',
        sourceConfig: dem ? {
          tiles: dem.tiles || 'n/a',
          tileSize: dem.tileSize || 'n/a'
        } : null
      };
    }
    return { sourceExists: false, error: 'Map not exposed globally' };
  });
  
  console.log(JSON.stringify(tileInfo, null, 2));
  
  // Test projection toggle
  console.log('\n=== TESTING PROJECTION TOGGLE ===');
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} button(s)`);
  
  if (buttons.length > 0) {
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const ariaLabel = await buttons[i].getAttribute('aria-label');
      console.log(`Button ${i}: text="${text}", aria-label="${ariaLabel}"`);
      
      if (text.includes('Projection') || ariaLabel?.includes('projection')) {
        console.log(`Clicking button ${i}...`);
        await buttons[i].click();
        await page.waitForTimeout(1500);
        console.log('✓ Projection toggled successfully');
        
        // Verify terrain still exists
        const terrainAfterToggle = await page.evaluate(() => {
          return {
            hasTerrain: !!window.map?.getTerrain(),
            hasCanvas: !!document.querySelector('canvas')
          };
        });
        console.log(`After toggle: ${JSON.stringify(terrainAfterToggle)}`);
        break;
      }
    }
  }
  
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
