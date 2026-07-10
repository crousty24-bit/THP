import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import { chromium } from 'playwright-core'

const APP_URL = 'http://127.0.0.1:5173'
const screenshotsDirectory = resolve('docs/screenshots')
const consoleProblems = []
const failedResponses = []

await mkdir(screenshotsDirectory, { recursive: true })

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
})

try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } })

  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleProblems.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`)
    }
  })

  async function loadStagedReport() {
    await page.goto(APP_URL, { waitUntil: 'networkidle' })
    await page.getByText('API connectée').waitFor()
    await page.getByText('Indexé', { exact: true }).click()
    await page.getByRole('button', { name: 'Analyser' }).click()
    await page.locator('.report-view').waitFor()
    await page.waitForTimeout(350)
  }

  await loadStagedReport()
  await page.screenshot({
    path: resolve(screenshotsDirectory, 'dashboard-desktop.png'),
    fullPage: true,
  })

  const desktopFacts = await page.locator('body').evaluate((body) => ({
    heading: body.querySelector('h1')?.textContent,
    risk: body.querySelector('.risk-value')?.textContent?.replace(/\s+/g, ' ').trim(),
    fileRows: body.querySelectorAll('tbody tr').length,
  }))

  await page.setViewportSize({ width: 390, height: 844 })
  await loadStagedReport()
  const mobileOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth
  ))
  await page.screenshot({
    path: resolve(screenshotsDirectory, 'dashboard-mobile.png'),
    fullPage: true,
  })

  if (consoleProblems.length > 0 || failedResponses.length > 0 || mobileOverflow) {
    throw new Error(JSON.stringify({ consoleProblems, failedResponses, mobileOverflow }, null, 2))
  }

  process.stdout.write(`${JSON.stringify({
    ...desktopFacts,
    consoleProblems,
    failedResponses,
    mobileOverflow,
  }, null, 2)}\n`)
} finally {
  await browser.close()
}
