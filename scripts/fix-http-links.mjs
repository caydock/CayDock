#!/usr/bin/env node
import { execSync } from 'node:child_process'

function run(cmd) {
  const out = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  return out
}

function parseWranglerJson(stdout) {
  const start = stdout.indexOf('[')
  const end = stdout.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('Failed to parse wrangler JSON output')
  const json = stdout.slice(start, end + 1)
  return JSON.parse(json)
}

async function probeHttps(url) {
  const httpsUrl = url.replace(/^http:\/\//i, 'https://')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 7000)
  try {
    const res = await fetch(httpsUrl, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    clearTimeout(timer)
    if (res.ok) return { ok: true, httpsUrl }
    // Some servers disallow HEAD; fallback to GET
    const resGet = await fetch(httpsUrl, { method: 'GET', redirect: 'follow', signal: controller.signal })
    return { ok: resGet.ok, httpsUrl }
  } catch (e) {
    clearTimeout(timer)
    return { ok: false, httpsUrl }
  }
}

async function main() {
  // 1) Read all rows with http:// in link
  const q = "SELECT id, abbrlink, slug, link FROM sites WHERE link LIKE 'http://%';"
  const stdout = run(`npx wrangler d1 execute w3cay-db --remote --command \"${q}\"`)
  const data = parseWranglerJson(stdout)
  const rows = data[0]?.results || []
  if (!rows.length) {
    console.log('No http:// links found')
    return
  }
  console.log(`Found ${rows.length} http:// links. Probing https...`)

  const toUpdate = []
  const toDelete = []

  for (const row of rows) {
    const url = row.link
    const { ok, httpsUrl } = await probeHttps(url)
    if (ok) {
      toUpdate.push({ id: row.id, httpsUrl })
      console.log(`OK  -> ${url} => ${httpsUrl}`)
    } else {
      toDelete.push({ id: row.id, url })
      console.log(`DROP -> ${url}`)
    }
  }

  // 2) Apply updates
  for (const u of toUpdate) {
    const cmd = `npx wrangler d1 execute w3cay-db --remote --command \"UPDATE sites SET link = '${u.httpsUrl.replaceAll('\\', '\\\\').replaceAll("'", "''")}' WHERE id = '${u.id.replaceAll('\\', '\\\\').replaceAll("'", "''")}';\"`
    run(cmd)
  }

  // 3) Apply deletes
  for (const d of toDelete) {
    const cmd = `npx wrangler d1 execute w3cay-db --remote --command \"DELETE FROM sites WHERE id = '${d.id.replaceAll('\\', '\\\\').replaceAll("'", "''")}';\"`
    run(cmd)
  }

  console.log(`Done. Updated ${toUpdate.length}, deleted ${toDelete.length}.`)
}

main().catch((e) => { console.error(e); process.exit(1) })
