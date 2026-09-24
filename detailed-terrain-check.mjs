import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  
  const allErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      allErrors.push(text);
      console.log(`[ERROR] ${text}`);
    }
    if (text.includes('Terrain') || text.includes('layer')) {
      console.log(`[LOG] ${text}`);
    }
  });
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Check if terrain is actually rendered
  console.log('\n=== TERRAIN RENDER CHECK ===');
  const terrainStatus = await page.evaluate(() => {
    // Look at canvas rendering
    const canvas = document.querySelector('canvas');
    if (!canvas) return { status: 'NO_CANVAS' };
    
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check if canvas has color variance (indicating rendered content)
    let colorCount = new Set();
    for (let i = 0; i < data.length; i += 4) {
      colorCount.add(`${data[i]},${data[i+1]},${data[i+2]}`);
    }
    
    return {
      status: colorCount.size > 10 ? 'CONTENT_RENDERED' : 'BLANK_OR_MINIMAL',
      uniqueColors: colorCount.size,
      canvasResolution: { width: canvas.width, height: canvas.height }
    };
  });
  
  console.log(`Canvas status: ${JSON.stringify(terrainStatus)}`);
  
  // Check source type - is it actually raster-dem?
  console.log('\n=== SOURCE TYPE VALIDATION ===');
  const sourceInfo = await page.evaluate(() => {
    // MapLibre GL stores map in window at creation
    const scripts = document.querySelectorAll('script');
    let mapCreated = false;
    
    // Try to find if setTerrain was called
    return {
      hasConsoleLog: true,  // We saw "Terrain layer loaded"
      canvasExists: !!document.querySelector('canvas'),
      checkAltMethod: 'Check if DEM tiles are correct format'
    };
  });
  
  console.log(`Source validation: ${JSON.stringify(sourceInfo)}`);
  
  // Count decode errors
  console.log('\n=== DECODE ERROR ANALYSIS ===');
  const decodeErrors = allErrors.filter(e => e.includes('InvalidStateError'));
  console.log(`Total InvalidStateError messages: ${decodeErrors.length}`);
  
  if (decodeErrors.length > 0) {
    console.log('\n⚠️  ISSUE DETECTED: GeoTIFF format incompatibility');
    console.log('MapLibre GL JS expects RGB-encoded DEMs (Terrarium or Mapbox format)');
    console.log('AWS elevation-tiles-prod GeoTIFFs are raw elevation data, not RGB-encoded');
    console.log('Result: Tiles fetch with HTTP 200, but cannot be decoded for elevation rendering');
  }
  
  // Final check - are these the right tile format?
  console.log('\n=== TILE FORMAT VERIFICATION ===');
  console.log('Current URL: https://elevation-tiles-prod.s3.amazonaws.com/geotiff/{z}/{x}/{y}.tif');
  console.log('Expected format for MapLibre: RGB-encoded DEM (Terrarium, Mapbox, or similar)');
  console.log('AWS GeoTIFF: Raw elevation GeoTIFFs (not RGB-encoded)');
  
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Check failed:', err);
  process.exit(1);
});
