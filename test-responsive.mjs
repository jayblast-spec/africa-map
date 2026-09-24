import { chromium } from 'playwright';

async function testResponsiveness() {
  const browser = await chromium.launch();
  
  // Test at 375px (mobile)
  console.log('\n=== Testing Mobile (375px) ===');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });
  const mobilePage = await mobileContext.newPage();
  
  try {
    await mobilePage.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    await mobilePage.waitForTimeout(2000); // Wait for map to load
    
    // Check for key elements
    const header = await mobilePage.locator('header h1').isVisible();
    const legend = await mobilePage.locator('div:has-text("About")').first().isVisible();
    const layers = await mobilePage.locator('button:has-text("Layers")').first().isVisible();
    const slider = await mobilePage.locator('#year-slider').isVisible();
    
    console.log(`✓ Header visible: ${header}`);
    console.log(`✓ Legend visible: ${legend}`);
    console.log(`✓ Layer controls visible: ${layers}`);
    console.log(`✓ Year slider visible: ${slider}`);
    
    // Take screenshot
    await mobilePage.screenshot({ path: '/tmp/mobile-375px.png' });
    console.log('✓ Screenshot saved: /tmp/mobile-375px.png');
  } catch (err) {
    console.error('Mobile test failed:', err.message);
  } finally {
    await mobileContext.close();
  }

  // Test at 1024px (tablet/desktop)
  console.log('\n=== Testing Tablet/Desktop (1024px) ===');
  const desktopContext = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  const desktopPage = await desktopContext.newPage();
  
  try {
    await desktopPage.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    await desktopPage.waitForTimeout(2000); // Wait for map to load
    
    // Check for key elements
    const header = await desktopPage.locator('header h1').isVisible();
    const legend = await desktopPage.locator('div:has-text("About")').first().isVisible();
    const layers = await desktopPage.locator('button:has-text("Layers")').first().isVisible();
    const slider = await desktopPage.locator('#year-slider').isVisible();
    const projection = await desktopPage.locator('button:has-text("Switch to")').first().isVisible();
    
    console.log(`✓ Header visible: ${header}`);
    console.log(`✓ Legend visible: ${legend}`);
    console.log(`✓ Layer controls visible: ${layers}`);
    console.log(`✓ Year slider visible: ${slider}`);
    console.log(`✓ Projection toggle visible: ${projection}`);
    
    // Take screenshot
    await desktopPage.screenshot({ path: '/tmp/desktop-1024px.png' });
    console.log('✓ Screenshot saved: /tmp/desktop-1024px.png');
  } catch (err) {
    console.error('Desktop test failed:', err.message);
  } finally {
    await desktopContext.close();
  }

  await browser.close();
  console.log('\n✓ Responsive testing complete!');
}

testResponsiveness().catch(console.error);
