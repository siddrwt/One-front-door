// scripts/demonstrate.js
import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/siddh/.gemini/antigravity-ide/brain/d9692465-ebf9-42a2-bf46-62f76b1e721c';

async function runDemo() {
  console.log('Launching browser automation...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Dashboard
  console.log('1. Loading Dashboard at http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_01_dashboard.png'), fullPage: false });
  console.log('Saved demo_01_dashboard.png');

  // 2. Chat Initial State
  console.log('2. Opening One Front Door Chat ...');
  await page.goto('http://localhost:5173/chat', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_02_chat_initial.png') });
  console.log('Saved demo_02_chat_initial.png');

  // 3. Direct Answer: When is the semester fee deadline?
  console.log('3. Testing State 1: Direct Answer ...');
  const inputSelector = 'input[placeholder*="Ask anything"]';
  await page.waitForSelector(inputSelector);
  await page.type(inputSelector, 'When is the semester fee deadline?');
  await page.keyboard.press('Enter');
  
  // Wait for response to render
  await new Promise(r => setTimeout(r, 1500));
  
  // Find and click "Why this answer?"
  const whyButton = await page.waitForSelector('button ::-p-text(Why this answer?)');
  if (whyButton) {
    await whyButton.click();
    await new Promise(r => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_03_direct_answer_expanded.png') });
  console.log('Saved demo_03_direct_answer_expanded.png');

  // 4. Ambiguity / Clarification: When is the registration deadline?
  console.log('4. Testing State 2: Clarification ...');
  await page.type(inputSelector, 'When is the registration deadline?');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_04_clarification_card.png') });
  console.log('Saved demo_04_clarification_card.png');

  // Click [Examination Registration] option button
  console.log('Clicking [Examination Registration] button ...');
  const examRegButton = await page.waitForSelector('button ::-p-text(Examination Registration)');
  if (examRegButton) {
    await examRegButton.click();
    await new Promise(r => setTimeout(r, 1500));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_05_clarified_answer.png') });
  console.log('Saved demo_05_clarified_answer.png');

  // 5. Multi-Domain: Fees + Exams
  console.log('5. Testing State 3: Multi-Domain Decomposition ...');
  await page.type(inputSelector, 'When is the semester fee deadline and when are the mid-semester exams?');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_06_multidomain_split.png') });
  console.log('Saved demo_06_multidomain_split.png');

  // 6. Out-of-Scope Fallback & Handoff Ticket
  console.log('6. Testing State 4: Fallback & Handoff ...');
  await page.type(inputSelector, 'Can I bring an exotic pet to stay in the campus hostel?');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1500));
  
  // Click "Create University Support Ticket"
  const ticketBtn = await page.waitForSelector('button ::-p-text(Create University Support Ticket)');
  if (ticketBtn) {
    await ticketBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_07_handoff_ticket.png') });
  console.log('Saved demo_07_handoff_ticket.png');

  // 7. Evaluation Dashboard
  console.log('7. Loading Evaluation Dashboard ...');
  await page.goto('http://localhost:5173/evaluation', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'demo_08_evaluation_dashboard.png'), fullPage: false });
  console.log('Saved demo_08_evaluation_dashboard.png');

  await browser.close();
  console.log('ALL DEMONSTRATION STEPS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!');
}

runDemo().catch((err) => {
  console.error('Error during demo execution:', err);
  process.exit(1);
});
