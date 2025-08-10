export const runtime = 'edge'

function isNonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const target = searchParams.get('url') || ''
    if (!/^https?:\/\//i.test(target)) {
      return Response.json({ canEmbed: false, reason: 'invalid_url' }, { status: 400 })
    }
    const res = await fetch(target, { method: 'HEAD', redirect: 'follow' })
    const xfo = res.headers.get('x-frame-options') || ''
    const csp = res.headers.get('content-security-policy') || ''

    let can = true
    if (isNonEmpty(xfo)) {
      const v = xfo.toLowerCase()
      if (v.includes('deny') || v.includes('sameorigin')) can = false
    }
    if (can && isNonEmpty(csp)) {
      const v = csp.toLowerCase()
      if (v.includes('frame-ancestors')) {
        // If frame-ancestors is present and does not include * or our domain, treat as blocked
        const seg = v.split(';').find(s => s.trim().startsWith('frame-ancestors')) || ''
        const val = seg.replace('frame-ancestors', '').trim()
        if (!val.includes("*") && !val.includes('w3cay.com')) can = false
      }
    }
    return Response.json({ canEmbed: can, status: res.status })
  } catch (e) {
    return Response.json({ canEmbed: false, reason: 'fetch_failed' }, { status: 200 })
  }
}
