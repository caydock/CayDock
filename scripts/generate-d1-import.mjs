import fs from 'node:fs'

// Source JSON path provided by user
const SOURCE_PATH = '/Users/Bright/Work/WanQuDao/public/content.transformed.json'
const OUTPUT_PATH = 'tmp/d1_import.sql'

function sqlEscape(value) {
  if (value === null || value === undefined) return 'NULL'
  const str = String(value).replace(/'/g, "''")
  return `'${str}'`
}

function main() {
  const raw = fs.readFileSync(SOURCE_PATH, 'utf-8')
  const data = JSON.parse(raw)
  if (!Array.isArray(data)) {
    throw new Error('JSON root is not an array')
  }
  fs.mkdirSync('tmp', { recursive: true })

  const lines = []
  lines.push('BEGIN TRANSACTION;')

  for (const item of data) {
    const slug = item.slug ?? ''
    const abbrlink = item.abbrlink ?? null
    const link = item.link ?? null

    const titleZh = item.title_zh ?? null
    const titleEn = item.title_en ?? null
    const descZh = item.desc_zh ?? null
    const descEn = item.desc_en ?? null

    // Required non-null title fallback
    const title = titleEn || titleZh || slug || 'Untitled'

    // Choose id: prefer slug; fallback to abbrlink; last resort random
    const id = slug || abbrlink || `auto_${Math.random().toString(36).slice(2)}`

    const cols = [
      'id','abbrlink','slug','title','title_zh','title_en','description','desc_zh','desc_en','sub_title','icon','link','permalink','date','isShow'
    ]

    const vals = [
      sqlEscape(id),
      sqlEscape(abbrlink),
      sqlEscape(slug),
      sqlEscape(title),
      sqlEscape(titleZh),
      sqlEscape(titleEn),
      sqlEscape(descEn || descZh),
      sqlEscape(descZh),
      sqlEscape(descEn),
      'NULL', // sub_title
      'NULL', // icon
      sqlEscape(link),
      'NULL', // permalink
      'NULL', // date
      1
    ]

    // Use OR REPLACE to resolve conflicts on any unique constraint (id/slug/abbrlink)
    lines.push(`INSERT OR REPLACE INTO sites (${cols.join(',')}) VALUES (${vals.join(',')});`)
  }

  lines.push('COMMIT;')

  fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf-8')
  console.log(`Wrote ${data.length} rows to ${OUTPUT_PATH}`)
}

main()
