/**
 * Fetches one reference photo per product and stores it in `src/assets/products`.
 *
 * Why this exists: the catalogue used to show a pastel tile with an abstract
 * silhouette for every product, so whole stores read as rows of identical
 * squares. Real reference photos make the catalogue legible.
 *
 * Source: the lead image of a Wikipedia article, through the public summary API.
 * Files come from Wikimedia Commons; the script records the source of every
 * downloaded image in `src/assets/products/CREDITS.md`.
 *
 * Images are committed on purpose — the demo has to build and run with no
 * internet connection.
 *
 * Usage: node scripts/fetch-product-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(HERE, '..', 'src', 'assets', 'products')

const USER_AGENT = 'smart-shopint/1.0 (academic demo; local build script)'
const SUMMARY_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

/** Candidate article titles per sku, tried in order until one yields an image. */
const CANDIDATES = {
  'SKU-0001': ['Milk', 'Milk carton'],
  'SKU-0002': ['White rice', 'Rice'],
  'SKU-0003': ['Cooking oil', 'Sunflower oil'],
  'SKU-0004': ['Spaghetti', 'Pasta'],
  'SKU-0005': ['Canned tuna', 'Tuna'],
  'SKU-0006': ['Inca Kola', 'Soft drink'],
  'SKU-0007': ['Bottled water', 'Water bottle'],
  'SKU-0008': ['Laundry detergent', 'Detergent'],
  'SKU-0009': ['Bleach', 'Sodium hypochlorite'],
  'SKU-0010': ['Saltine cracker', 'Cracker (food)'],
  'SKU-0011': ['Yogurt', 'Strained yogurt'],
  'SKU-0012': ['Coca-Cola', 'Cola'],
  'SKU-0013': ['Toilet paper', 'Toilet paper roll'],
  'SKU-0014': ['Chocolate bar', 'Chocolate'],
  'SKU-0015': ['Rice', 'Jasmine rice'],
  'SKU-0016': ['T-shirt', 'Polo shirt'],
  'SKU-0017': ['Jeans', 'Denim'],
  'SKU-0018': ['Polo shirt', 'Rugby shirt'],
  'SKU-0019': ['Sneakers', 'Sport shoe'],
  'SKU-0020': ['Bed sheet', 'Bedding'],
  'SKU-0021': ['Headphones', 'Bluetooth headset'],
  'SKU-0022': ['Hammer drill', 'Drill bit'],
  'SKU-0023': ['Screwdriver', 'Screwdriver bit'],
  'SKU-0024': ['Paint', 'Paint roller'],
  'SKU-0025': ['Tap (valve)', 'Faucet'],
  'SKU-0026': ['Flowerpot', 'Plant pot'],
  'SKU-0027': ['LED lamp', 'Light bulb'],
}

const EXTENSION_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  })
  return response.ok ? response.json() : null
}

/**
 * Prefers the summary's thumbnail over the original upload.
 *
 * Originals can be several megabytes, which is absurd for a small catalogue row.
 * The thumbnail is a few hundred pixels wide — still crisp on a phone's 2x
 * density — and a few tens of kilobytes.
 */
function imageUrlOf(summary) {
  return summary?.thumbnail?.source ?? summary?.originalimage?.source ?? null
}

/** Wikimedia throttles bursts, so a rejected download is retried with backoff. */
async function download(url, destinationBase, attempts = 4) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'image/*' },
    })

    if (response.ok) {
      const type = (response.headers.get('content-type') ?? '').split(';')[0].trim()
      const extension = EXTENSION_BY_TYPE[type]
      if (!extension) throw new Error(`unsupported content type "${type}"`)

      const bytes = Buffer.from(await response.arrayBuffer())
      await writeFile(`${destinationBase}${extension}`, bytes)
      return { bytes: bytes.length, extension }
    }

    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt === attempts) {
      throw new Error(`HTTP ${response.status}`)
    }
    await sleep(1200 * attempt)
  }
  throw new Error('unreachable')
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const credits = []
  const missing = []

  for (const [sku, titles] of Object.entries(CANDIDATES)) {
    let saved = null

    for (const title of titles) {
      const summary = await getJson(SUMMARY_API + encodeURIComponent(title))
      const url = imageUrlOf(summary)
      if (!url) continue

      try {
        const file = await download(url, join(OUT_DIR, sku))
        saved = { title, url, bytes: file.bytes }
        break
      } catch (error) {
        console.warn(`  ${sku}: "${title}" failed — ${error.message}`)
      }
    }

    if (saved) {
      const kilobytes = Math.round(saved.bytes / 1024)
      console.log(`OK    ${sku}  ${saved.title}  ${kilobytes} kB`)
      credits.push(`- \`${sku}\` — ${saved.title} — ${saved.url}`)
    } else {
      console.warn(`MISS  ${sku}`)
      missing.push(sku)
    }

    await sleep(250)
  }

  const header = [
    '# Product images',
    '',
    'Reference photos downloaded from Wikipedia (Wikimedia Commons) by',
    '`scripts/fetch-product-images.mjs`. They are bundled with the app so the',
    'demo builds and runs offline. Copyright stays with each original author,',
    'under the licence of the corresponding Wikimedia Commons file page.',
    '',
    'Source list:',
    '',
  ].join('\n')

  await writeFile(join(OUT_DIR, 'CREDITS.md'), header + credits.join('\n') + '\n', 'utf8')

  console.log(`\nSaved ${credits.length} of ${Object.keys(CANDIDATES).length} images.`)
  if (missing.length > 0) console.log(`Missing: ${missing.join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
