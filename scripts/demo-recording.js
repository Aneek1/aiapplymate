const puppeteer = require('puppeteer');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SCREENSHOTS_DIR = path.join(ASSETS_DIR, 'screenshots');
const BASE_URL = 'http://localhost:5173';

const VIEWPORT = { width: 1440, height: 900 };

// Sample data for the demo
const DEMO_DATA = {
  name: 'Alex Johnson',
  email: 'alex.johnson@gmail.com',
  phone: '+1 (415) 555-0192',
  location: 'San Francisco, CA',
  resumeText: `ALEX JOHNSON
Senior Software Engineer | San Francisco, CA
alex.johnson@gmail.com | (415) 555-0192

PROFESSIONAL SUMMARY
Experienced software engineer with 6+ years building scalable web applications. Strong background in JavaScript, React, and Node.js. Led teams of 5+ engineers delivering enterprise SaaS products.

EXPERIENCE

Senior Software Engineer — Stripe (2021 – Present)
• Architected and shipped a new payments dashboard serving 50K+ merchants
• Reduced API response times by 40% through Redis caching and query optimization
• Mentored 3 junior engineers through structured onboarding program
• Led migration from monolith to microservices using Docker and Kubernetes

Software Engineer — Airbnb (2019 – 2021)
• Built real-time search filtering system processing 10M+ queries/day
• Implemented A/B testing framework that increased booking conversion by 12%
• Contributed to open-source design system used across 20+ internal tools

Junior Software Engineer — Twilio (2017 – 2019)
• Developed RESTful APIs for voice and messaging services
• Wrote comprehensive test suites achieving 95% code coverage
• Participated in on-call rotation for production incident response

EDUCATION
B.S. Computer Science — UC Berkeley (2017)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, Redis, Docker, AWS, Git`,

  jobTitle: 'Staff Frontend Engineer',
  company: 'Vercel',
  jobDescription: `Staff Frontend Engineer — Vercel

About the Role
We're looking for a Staff Frontend Engineer to help build the future of web development. You'll work on Vercel's dashboard, developer tools, and Next.js integrations, directly impacting millions of developers.

Requirements
• 7+ years of professional software development experience
• Deep expertise in React, TypeScript, and modern frontend architecture
• Experience with Next.js, server components, and edge computing
• Track record of leading large-scale frontend initiatives
• Strong understanding of web performance, accessibility, and SEO
• Experience with design systems and component libraries
• Familiarity with CI/CD pipelines and deployment infrastructure

Nice to Have
• Open-source contributions
• Experience with Turborepo or monorepo tooling
• Background in developer tools or platform engineering

What We Offer
• Competitive salary ($220K–$300K) + equity
• Remote-first culture
• Conference and learning budget
• Health, dental, and vision insurance`
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeSlowly(page, selector, text, delayMs = 15) {
  await page.click(selector);
  await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector);
  await page.type(selector, text, { delay: delayMs });
}

async function run() {
  console.log('🚀 Starting demo recording...');

  // Ensure directories exist
  execSync(`mkdir -p ${SCREENSHOTS_DIR}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: VIEWPORT,
  });

  const page = await browser.newPage();
  let screenshotIndex = 0;

  async function screenshot(name) {
    const filename = `${String(screenshotIndex).padStart(3, '0')}-${name}.png`;
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: false });
    console.log(`  📸 ${filename}`);
    screenshotIndex++;
    return filename;
  }

  try {
    // ====== 1. Landing Page ======
    console.log('\n📄 Capturing Landing Page...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await delay(1000);
    await screenshot('landing-hero');

    // Scroll to features
    await page.evaluate(() => {
      document.querySelector('#features')?.scrollIntoView({ behavior: 'instant' });
    });
    await delay(500);
    await screenshot('landing-features');

    // Scroll to how it works
    await page.evaluate(() => {
      document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'instant' });
    });
    await delay(500);
    await screenshot('landing-how-it-works');

    // ====== 2. Dashboard - Step 1 ======
    console.log('\n📝 Capturing Dashboard Step 1...');
    await page.goto(`${BASE_URL}/app/dashboard`, { waitUntil: 'networkidle0', timeout: 15000 });
    await delay(1000);
    await screenshot('dashboard-empty');

    // Fill in personal info
    await typeSlowly(page, 'input[name="name"]', DEMO_DATA.name);
    await typeSlowly(page, 'input[name="email"]', DEMO_DATA.email);
    await typeSlowly(page, 'input[name="phone"]', DEMO_DATA.phone);
    await typeSlowly(page, 'input[name="location"]', DEMO_DATA.location);
    await screenshot('dashboard-info-filled');

    // Switch to paste mode and enter resume
    const buttons1 = await page.$$('button');
    for (const btn of buttons1) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text?.includes('Paste Text')) {
        await btn.click();
        break;
      }
    }
    await delay(300);

    await typeSlowly(page, 'textarea[name="resumeText"]', DEMO_DATA.resumeText, 3);
    await delay(300);
    await screenshot('dashboard-resume-pasted');

    // Scroll to see the Next button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(300);
    await screenshot('dashboard-step1-complete');

    // Click Next
    const nextButtons = await page.$$('button');
    for (const btn of nextButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text?.includes('Next Step')) {
        await btn.click();
        break;
      }
    }
    await delay(500);

    // ====== 3. Dashboard - Step 2 ======
    console.log('\n🎯 Capturing Dashboard Step 2...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(300);
    await screenshot('dashboard-step2-empty');

    // Fill job details
    await typeSlowly(page, 'input[name="jobTitle"]', DEMO_DATA.jobTitle);
    await typeSlowly(page, 'input[name="company"]', DEMO_DATA.company);
    await typeSlowly(page, 'textarea[name="jobDescription"]', DEMO_DATA.jobDescription, 3);
    await delay(300);
    await screenshot('dashboard-step2-filled');

    // Scroll to generate button
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(300);
    await screenshot('dashboard-step2-ready');

    // ====== 4. Take final composite screenshots ======
    console.log('\n✅ Capturing final views...');

    // Go back to landing for a full-page hero shot
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await delay(1000);
    await page.screenshot({
      path: path.join(ASSETS_DIR, 'demo-landing.png'),
      fullPage: true,
    });
    console.log('  📸 demo-landing.png (full page)');

    // Dashboard step 1 filled
    await page.goto(`${BASE_URL}/app/dashboard`, { waitUntil: 'networkidle0', timeout: 15000 });
    await delay(500);

    // Re-fill for a clean screenshot
    await typeSlowly(page, 'input[name="name"]', DEMO_DATA.name, 2);
    await typeSlowly(page, 'input[name="email"]', DEMO_DATA.email, 2);
    await typeSlowly(page, 'input[name="phone"]', DEMO_DATA.phone, 2);
    await typeSlowly(page, 'input[name="location"]', DEMO_DATA.location, 2);

    // Switch to paste mode
    const allBtns = await page.$$('button');
    for (const btn of allBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text?.includes('Paste Text')) {
        await btn.click();
        break;
      }
    }
    await delay(200);
    await typeSlowly(page, 'textarea[name="resumeText"]', DEMO_DATA.resumeText, 1);

    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(500);
    await page.screenshot({
      path: path.join(ASSETS_DIR, 'demo-dashboard.png'),
      fullPage: true,
    });
    console.log('  📸 demo-dashboard.png (full page)');

    console.log('\n🎬 Creating demo GIF from screenshots...');

    // Create GIF using ffmpeg
    try {
      execSync(
        `ffmpeg -y -framerate 0.7 -pattern_type glob -i '${SCREENSHOTS_DIR}/*.png' ` +
        `-vf "scale=1200:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" ` +
        `-loop 0 ${path.join(ASSETS_DIR, 'demo.gif')}`,
        { stdio: 'pipe' }
      );
      console.log('  ✅ demo.gif created!');
    } catch (e) {
      console.log('  ⚠️ GIF creation failed, screenshots are still available');
      console.log('  Error:', e.message?.substring(0, 200));
    }

    console.log('\n✨ Demo recording complete!');
    console.log(`📁 Assets saved to: ${ASSETS_DIR}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await browser.close();
  }
}

run();
