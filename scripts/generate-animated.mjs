// Generates the animated SVG illustrations used in the Ethos and Capabilities sections.
// usage: node scripts/generate-animated.mjs [outDir]   (default: public/images/animated)
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = process.argv[2] || 'public/images/animated'
mkdirSync(OUT, { recursive: true })

const C = {
  bg: '#0b0b0e',
  panel: '#131318',
  line: 'rgba(255,255,255,0.08)',
  yellow: '#fed001',
  orange: '#fe9e15',
  coral: '#fb664c',
  pink: '#ee34a1',
  magenta: '#d02eb9',
  purple: '#a928c7',
  violet: '#8e20c1',
  deep: '#4e1594'
}

// ---------- shared pieces -------------------------------------------------

const brandGradient = (id, x2 = 1, y2 = 1) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">
    <stop offset="0" stop-color="${C.yellow}"/>
    <stop offset=".3" stop-color="${C.orange}"/>
    <stop offset=".55" stop-color="${C.pink}"/>
    <stop offset=".8" stop-color="${C.purple}"/>
    <stop offset="1" stop-color="${C.deep}"/>
  </linearGradient>`

const glow = (id, color, opacity = 0.45) => `
  <radialGradient id="${id}">
    <stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/>
    <stop offset="1" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`

const baseStyle = (extra = '') => `
  <style>
    .fb { transform-box: fill-box; transform-origin: center; }
    .fl { transform-box: fill-box; transform-origin: left center; }
    .fbt { transform-box: fill-box; transform-origin: center bottom; }
    ${extra}
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  </style>`

const svg = (w, h, label, defs, body, style = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <defs>${defs}</defs>${baseStyle(style)}
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
${body}
</svg>
`

const grid = (w, h, size = 48, id = 'grid') => ({
  def: `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><path d="M${size} 0H0V${size}" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>`,
  rect: `<rect width="${w}" height="${h}" fill="url(#${id})"/>`
})

const windowFrame = (x, y, w, h, title = '') => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${C.panel}" stroke="#fff" stroke-opacity=".08"/>
  <path d="M${x} ${y + 44}H${x + w}" stroke="#fff" stroke-opacity=".06"/>
  <circle cx="${x + 26}" cy="${y + 22}" r="6" fill="${C.coral}"/>
  <circle cx="${x + 46}" cy="${y + 22}" r="6" fill="${C.yellow}"/>
  <circle cx="${x + 66}" cy="${y + 22}" r="6" fill="${C.purple}"/>
  ${title ? `<rect x="${x + w / 2 - 70}" y="${y + 15}" width="140" height="14" rx="7" fill="#fff" fill-opacity=".06"/>` : ''}`

// Seeded random so output is stable between runs
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

// Smooth closed blob through n points (Catmull-Rom -> cubic Bézier)
const blob = (cx, cy, r, n = 7, wobble = 0.22) => {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    const rr = r * (1 - wobble / 2 + rand() * wobble)
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]
  })
  const p = (i) => pts[(i + n) % n]
  let d = `M${p(0)[0].toFixed(1)},${p(0)[1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1.map((v) => v.toFixed(1)).join(',')} ${c2.map((v) => v.toFixed(1)).join(',')} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

const morph = (cx, cy, r, dur, frames = 3, wobble = 0.22) => {
  const shapes = Array.from({ length: frames }, () => blob(cx, cy, r, 7, wobble))
  const values = [...shapes, shapes[0]].join(';')
  const keyTimes = Array.from({ length: frames + 1 }, (_, i) => (i / frames).toFixed(3)).join(';')
  const splines = Array(frames).fill('.45 0 .55 1').join(';')
  return {
    d: shapes[0],
    animate: `<animate attributeName="d" dur="${dur}s" repeatCount="indefinite" calcMode="spline" keyTimes="${keyTimes}" keySplines="${splines}" values="${values}"/>`
  }
}

// keyframes that show something between start% and end% of a looping cycle
const reveal = (name, start, prop = 'scaleX', hold = 88) => `
  @keyframes ${name} {
    0%, ${start}% { transform: ${prop}(0); opacity: 0; }
    ${Math.min(start + 4, hold)}%, ${hold}% { transform: ${prop}(1); opacity: 1; }
    ${hold + 6}%, 100% { transform: ${prop}(0); opacity: 0; }
  }`

// ---------- 1. Ethos: fluid design over a technical skeleton ----------------

function ethos() {
  const W = 800, H = 1000, cx = 400, cy = 500
  const g = grid(W, H, 40)
  const main = morph(cx, cy, 210, 10)
  const back = morph(cx + 40, cy + 30, 250, 13, 3, 0.3)
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return `<circle cx="${(cx + Math.cos(a) * 320).toFixed(1)}" cy="${(cy + Math.sin(a) * 320).toFixed(1)}" r="5" fill="${C.bg}" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`
  }).join('')
  const orbit = (r, dur, color, size, delay = 0, reverse = false) => `
    <g style="transform-origin:${cx}px ${cy}px; animation: spin ${dur}s linear ${delay}s infinite ${reverse ? 'reverse' : ''}">
      <circle cx="${cx + r}" cy="${cy}" r="${size}" fill="${color}"/>
    </g>`

  const defs = `${brandGradient('brand')}
    <linearGradient id="back" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.pink}"/><stop offset="1" stop-color="${C.deep}"/></linearGradient>
    <radialGradient id="gloss" cx=".35" cy=".3" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
    ${glow('g1', C.orange)}${glow('g2', C.deep, 0.7)}${g.def}`

  const body = `
  <circle cx="120" cy="160" r="420" fill="url(#g1)" style="animation: pulse 9s ease-in-out infinite"/>
  <circle cx="700" cy="880" r="480" fill="url(#g2)" style="animation: pulse 11s ease-in-out infinite reverse"/>
  ${g.rect}
  <g fill="none" stroke="#fff" stroke-opacity=".14">
    <path d="M${cx} 60V940M60 ${cy}H740" stroke-dasharray="4 10"/>
    <circle cx="${cx}" cy="${cy}" r="380" stroke-dasharray="2 12" style="transform-origin:${cx}px ${cy}px; animation: spin 80s linear infinite reverse"/>
  </g>
  <g style="transform-origin:${cx}px ${cy}px; animation: spin 50s linear infinite">
    <circle cx="${cx}" cy="${cy}" r="320" fill="none" stroke="#fff" stroke-opacity=".18" stroke-dasharray="14 18"/>
    ${nodes}
  </g>
  <path d="${back.d}" fill="url(#back)" opacity=".55">${back.animate}</path>
  <path d="${main.d}" fill="url(#brand)">${main.animate}</path>
  <path d="${main.d}" fill="url(#gloss)">${main.animate}</path>
  ${orbit(300, 14, C.yellow, 9)}
  ${orbit(250, 20, C.pink, 6, -6, true)}
  ${orbit(360, 26, C.purple, 7, -12)}
  <g transform="translate(70 820)"><g style="animation: float 6s ease-in-out infinite">
    <rect width="250" height="110" rx="18" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-opacity=".1"/>
    <rect x="22" y="26" width="140" height="10" rx="5" fill="#fff" fill-opacity=".35"/>
    <rect x="22" y="48" width="200" height="8" rx="4" fill="#fff" fill-opacity=".15"/>
    <rect x="22" y="66" width="170" height="8" rx="4" fill="#fff" fill-opacity=".15"/>
    <rect x="22" y="84" width="90" height="8" rx="4" fill="${C.orange}" class="fl" style="animation: grow 4s ease-in-out infinite alternate"/>
  </g></g>`

  const style = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
    @keyframes grow { from { transform: scaleX(.3); } to { transform: scaleX(1.8); } }`

  return svg(W, H, 'Fluid design shaping a technical skeleton', defs, body, style)
}

// ---------- 2. UI/UX & Branding: an interface designing itself -------------

function branding() {
  const W = 1200, H = 675
  const g = grid(W, H)
  const cards = [0, 1, 2].map((i) => `
    <g class="fb" style="animation: card 8s ease-in-out ${i * 0.25}s infinite">
      <rect x="${190 + i * 178}" y="390" width="160" height="170" rx="16" fill="#fff" fill-opacity=".04" stroke="#fff" stroke-opacity=".08"/>
      <rect x="${206 + i * 178}" y="406" width="128" height="72" rx="10" fill="${[C.orange, C.pink, C.purple][i]}" fill-opacity=".85"/>
      <rect x="${206 + i * 178}" y="494" width="96" height="9" rx="4.5" fill="#fff" fill-opacity=".4"/>
      <rect x="${206 + i * 178}" y="512" width="120" height="7" rx="3.5" fill="#fff" fill-opacity=".15"/>
      <rect x="${206 + i * 178}" y="528" width="70" height="7" rx="3.5" fill="#fff" fill-opacity=".15"/>
    </g>`).join('')
  const swatches = [C.yellow, C.orange, C.pink, C.purple, C.deep].map((c, i) => `
    <circle cx="${790 + i * 54}" cy="190" r="20" fill="${c}" class="fb" style="animation: pop 4s ease-in-out ${i * 0.18}s infinite"/>`).join('')

  const defs = `${brandGradient('brand')}
    <linearGradient id="alt" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${C.deep}"/><stop offset=".6" stop-color="${C.magenta}"/><stop offset="1" stop-color="${C.coral}"/></linearGradient>
    ${glow('g1', C.pink, 0.35)}${g.def}`

  const body = `
  <circle cx="1050" cy="80" r="420" fill="url(#g1)"/>
  ${g.rect}
  ${windowFrame(150, 70, 900, 535, true)}
  <rect x="190" y="150" width="520" height="210" rx="18" fill="url(#brand)"/>
  <rect x="190" y="150" width="520" height="210" rx="18" fill="url(#alt)" style="animation: swap 10s ease-in-out infinite"/>
  <rect x="226" y="196" width="300" height="22" rx="11" fill="#fff" fill-opacity=".95" class="fl" style="animation: type 8s ease-in-out infinite"/>
  <rect x="226" y="232" width="210" height="22" rx="11" fill="#fff" fill-opacity=".95" class="fl" style="animation: type 8s ease-in-out .3s infinite"/>
  <rect x="226" y="290" width="120" height="38" rx="19" fill="${C.bg}"/>
  <rect x="246" y="305" width="80" height="8" rx="4" fill="#fff" fill-opacity=".8"/>
  ${swatches}
  <text x="780" y="330" fill="#fff" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-size="110" font-weight="700" letter-spacing="-4">Aa</text>
  <rect x="930" y="262" width="80" height="8" rx="4" fill="#fff" fill-opacity=".3"/>
  <rect x="930" y="282" width="56" height="8" rx="4" fill="#fff" fill-opacity=".15"/>
  <rect x="930" y="302" width="68" height="8" rx="4" fill="#fff" fill-opacity=".15"/>
  ${cards}
  <rect x="740" y="390" width="270" height="170" rx="16" fill="none" stroke="${C.orange}" stroke-width="2" stroke-dasharray="8 8" style="animation: dash 3s linear infinite"/>
  <g style="animation: cursor 8s ease-in-out infinite">
    <circle cx="0" cy="0" r="26" fill="none" stroke="#fff" stroke-width="2" class="fb" style="animation: click 8s ease-out infinite"/>
    <path d="M0 0L0 30L8 22L14 36L20 33L14 20L25 20Z" fill="#fff" stroke="${C.bg}" stroke-width="2"/>
  </g>`

  const style = `
    @keyframes swap { 0%,40% { opacity: 0; } 50%,90% { opacity: 1; } 100% { opacity: 0; } }
    @keyframes pop { 0%,70%,100% { transform: scale(1); } 80% { transform: scale(1.25); } }
    @keyframes card { 0%,5% { transform: translateY(20px); opacity: 0; } 15%,85% { transform: translateY(0); opacity: 1; } 95%,100% { transform: translateY(20px); opacity: 0; } }
    @keyframes type { 0%,8% { transform: scaleX(0); } 22%,85% { transform: scaleX(1); } 95%,100% { transform: scaleX(0); } }
    @keyframes dash { to { stroke-dashoffset: -32; } }
    @keyframes cursor {
      0% { transform: translate(1080px, 640px); }
      20%,28% { transform: translate(840px, 190px); }
      48%,56% { transform: translate(300px, 310px); }
      76%,84% { transform: translate(870px, 470px); }
      100% { transform: translate(1080px, 640px); }
    }
    @keyframes click {
      0%,22% { transform: scale(0); opacity: 0; } 24% { transform: scale(.15); opacity: 1; } 30% { transform: scale(1); opacity: 0; }
      50% { transform: scale(0); opacity: 0; } 52% { transform: scale(.15); opacity: 1; } 58% { transform: scale(1); opacity: 0; }
      78% { transform: scale(0); opacity: 0; } 80% { transform: scale(.15); opacity: 1; } 86%,100% { transform: scale(1); opacity: 0; }
    }`

  return svg(W, H, 'Interface and brand system being designed', defs, body, style)
}

// ---------- 3. Development: code writing itself + deploy -------------------

function development() {
  const W = 1200, H = 675
  const g = grid(W, H)
  const tok = { k: C.pink, f: C.orange, s: C.yellow, p: 'rgba(255,255,255,.45)', c: 'rgba(255,255,255,.18)' }
  // [indent, [type, width], ...]
  const lines = [
    [0, ['c', 220]],
    [0, ['k', 60], ['p', 40], ['f', 110], ['p', 30]],
    [1, ['k', 50], ['p', 90], ['p', 24], ['s', 150]],
    [1, ['k', 70], ['f', 130], ['p', 60]],
    [2, ['p', 80], ['f', 90], ['s', 120]],
    [2, ['k', 46], ['p', 150]],
    [1, ['p', 24]],
    [1, ['k', 60], ['f', 100], ['p', 30], ['s', 90]],
    [2, ['f', 140], ['p', 70]],
    [1, ['p', 24]],
    [0, ['p', 24]],
    [0, ['k', 80], ['p', 40], ['f', 120]]
  ]
  const x0 = 200, y0 = 140, lh = 34
  const cycle = 9
  let keyframes = ''
  const code = lines.map(([indent, ...tokens], i) => {
    const start = 4 + i * 6
    keyframes += reveal(`l${i}`, start)
    let x = x0 + indent * 32
    const rects = tokens.map(([t, w]) => {
      const r = `<rect x="${x}" y="${y0 + i * lh}" width="${w}" height="12" rx="6" fill="${tok[t]}"/>`
      x += w + 12
      return r
    }).join('')
    return `<text x="${x0 - 46}" y="${y0 + i * lh + 11}" fill="#fff" fill-opacity=".18" font-family="Menlo, monospace" font-size="12">${String(i + 1).padStart(2, ' ')}</text>
    <g class="fl" style="animation: l${i} ${cycle}s steps(12) infinite">${rects}</g>`
  }).join('')

  const term = ['$ npm run build', '✓ compiled in 2.1s', '$ deploy --edge', '✓ live on 300+ locations'].map((t, i) => {
    keyframes += reveal(`t${i}`, 40 + i * 10, 'translateY', 88).replace(/translateY\(0\)/g, 'translateY(8px)').replace(/translateY\(1\)/g, 'translateY(0)')
    return `<text x="812" y="${380 + i * 30}" fill="${t.startsWith('✓') ? C.yellow : 'rgba(255,255,255,.7)'}" font-family="Menlo, monospace" font-size="15" style="animation: t${i} ${cycle}s ease-out infinite">${t}</text>`
  }).join('')

  const defs = `${brandGradient('brand')}${glow('g1', C.purple, 0.45)}${glow('g2', C.orange, 0.3)}${g.def}`
  const body = `
  <circle cx="1000" cy="160" r="380" fill="url(#g1)"/>
  <circle cx="160" cy="640" r="320" fill="url(#g2)"/>
  ${g.rect}
  ${windowFrame(120, 70, 620, 535, true)}
  <path d="M176 114V605" stroke="#fff" stroke-opacity=".05"/>
  ${code}
  <rect x="${x0}" y="${y0 + lines.length * lh - 2}" width="10" height="18" fill="${C.orange}" style="animation: blink 1s steps(1) infinite"/>
  <g style="animation: float 6s ease-in-out infinite">
    <text x="830" y="250" fill="url(#brand)" font-family="Space Grotesk, Helvetica, Arial, sans-serif" font-size="150" font-weight="700" letter-spacing="-6">&lt;/&gt;</text>
  </g>
  ${windowFrame(780, 310, 320, 190)}
  ${term}
  <g transform="translate(780 530)">
    <rect width="190" height="44" rx="22" fill="#fff" fill-opacity=".05" stroke="#fff" stroke-opacity=".1"/>
    <circle cx="24" cy="22" r="6" fill="${C.yellow}" style="animation: blink 2s ease-in-out infinite"/>
    <rect x="42" y="17" width="120" height="10" rx="5" fill="#fff" fill-opacity=".45"/>
  </g>`

  const style = `${keyframes}
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }`

  return svg(W, H, 'Code being written and deployed', defs, body, style)
}

// ---------- 4. Hybrid Events: stage, screen, spotlights, remote viewers ----

function events() {
  const W = 1200, H = 675
  const vx = 600, vy = 300
  const floor = Array.from({ length: 13 }, (_, i) => {
    const x = -300 + i * 150
    return `<path d="M${vx} ${vy}L${x} ${H}" stroke="#fff" stroke-opacity=".05"/>`
  }).join('') + [420, 480, 560, 660].map((y) => `<path d="M0 ${y}H${W}" stroke="#fff" stroke-opacity=".04"/>`).join('')

  const bars = Array.from({ length: 18 }, (_, i) => `
    <rect x="${360 + i * 27}" y="300" width="14" height="40" rx="4" fill="#fff" fill-opacity=".7" class="fbt" style="animation: eq ${0.8 + (i % 5) * 0.17}s ease-in-out ${-(i % 7) * 0.2}s infinite alternate"/>`).join('')

  const heads = []
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 16 - row; i++) {
      const x = 60 + i * 72 + row * 36
      const y = 540 + row * 48
      const phone = (i + row) % 5 === 0
      heads.push(`<g style="animation: bob ${2 + ((i + row) % 3) * 0.4}s ease-in-out ${-(i % 4) * 0.3}s infinite">
        <circle cx="${x}" cy="${y}" r="18" fill="#1d1d24"/>
        <path d="M${x - 32} ${y + 60}Q${x} ${y + 10} ${x + 32} ${y + 60}Z" fill="#17171d"/>
        ${phone ? `<rect x="${x + 10}" y="${y - 34}" width="12" height="20" rx="3" fill="${C.yellow}" fill-opacity=".9" style="animation: flash 3s ease-in-out ${-i * 0.4}s infinite"/>` : ''}
      </g>`)
    }
  }

  const remote = [0, 1, 2].map((i) => `
    <g style="animation: rise 6s ease-in-out ${-i * 2}s infinite">
      <rect x="1010" y="${130 + i * 90}" width="130" height="74" rx="12" fill="${C.panel}" stroke="#fff" stroke-opacity=".12"/>
      <circle cx="1075" cy="${160 + i * 90}" r="14" fill="${[C.orange, C.pink, C.purple][i]}"/>
      <rect x="1050" y="${182 + i * 90}" width="50" height="7" rx="3.5" fill="#fff" fill-opacity=".3"/>
    </g>`).join('')

  const defs = `${brandGradient('brand', 1, 0)}
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="screen"><rect x="330" y="100" width="540" height="260" rx="14"/></clipPath>
    ${glow('g1', C.magenta, 0.5)}${glow('blobA', C.yellow, 0.9)}${glow('blobB', C.pink, 0.9)}${glow('blobC', C.deep, 1)}`

  const body = `
  <circle cx="600" cy="220" r="520" fill="url(#g1)"/>
  ${floor}
  <rect x="320" y="90" width="560" height="280" rx="18" fill="#000" stroke="#fff" stroke-opacity=".15"/>
  <g clip-path="url(#screen)">
    <rect x="330" y="100" width="540" height="260" fill="${C.deep}"/>
    <circle cx="420" cy="180" r="220" fill="url(#blobA)" style="animation: drift1 9s ease-in-out infinite"/>
    <circle cx="760" cy="260" r="240" fill="url(#blobB)" style="animation: drift2 11s ease-in-out infinite"/>
    <circle cx="600" cy="120" r="200" fill="url(#blobC)" style="animation: drift1 13s ease-in-out infinite reverse"/>
    ${bars}
  </g>
  <g transform="translate(350 118)">
    <rect width="74" height="26" rx="13" fill="${C.pink}"/>
    <circle cx="16" cy="13" r="5" fill="#fff" style="animation: flash 1.2s steps(1) infinite"/>
    <text x="28" y="18" fill="#fff" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1">LIVE</text>
  </g>
  <polygon points="130,0 190,0 520,520 240,520" fill="url(#beam)" style="transform-origin:160px 0; animation: sweepL 7s ease-in-out infinite"/>
  <polygon points="1010,0 1070,0 960,520 680,520" fill="url(#beam)" style="transform-origin:1040px 0; animation: sweepR 8s ease-in-out infinite"/>
  <rect x="300" y="384" width="600" height="16" rx="8" fill="url(#brand)" opacity=".8"/>
  ${remote}
  <path d="M1000 300 C 940 300, 920 250, 880 240" fill="none" stroke="${C.orange}" stroke-width="2" stroke-dasharray="6 8" style="animation: dash 2s linear infinite"/>
  ${heads.join('')}`

  const style = `
    @keyframes eq { from { transform: scaleY(.25); } to { transform: scaleY(1.4); } }
    @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(120px, 40px); } }
    @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-140px, -50px); } }
    @keyframes sweepL { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(14deg); } }
    @keyframes sweepR { 0%,100% { transform: rotate(12deg); } 50% { transform: rotate(-16deg); } }
    @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes flash { 50% { opacity: .2; } }
    @keyframes rise { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes dash { to { stroke-dashoffset: -28; } }`

  return svg(W, H, 'Hybrid event stage with live and remote audiences', defs, body, style)
}

// ---------- 5. Martech: live marketing dashboard ---------------------------

function martech() {
  const W = 1200, H = 675
  const g = grid(W, H)
  const heights = [90, 140, 115, 180, 150, 210, 240]
  const cycle = 8
  let keyframes = ''
  const bars = heights.map((h, i) => {
    keyframes += `@keyframes b${i} { 0%,${i * 4}% { transform: scaleY(0); } ${i * 4 + 14}%,86% { transform: scaleY(1); } 96%,100% { transform: scaleY(0); } }`
    return `<rect x="${180 + i * 56}" y="${560 - h}" width="34" height="${h}" rx="8" fill="url(#bar)" class="fbt" style="animation: b${i} ${cycle}s cubic-bezier(.2,.8,.2,1) infinite"/>`
  }).join('')

  const line = 'M640 520 C 690 500, 710 470, 760 480 S 840 420, 880 430 S 960 360, 1000 370 S 1050 300, 1080 280'
  const kpis = [
    { x: 150, w: 270, c: C.orange },
    { x: 440, w: 270, c: C.pink },
    { x: 730, w: 320, c: C.purple }
  ].map((k, i) => `
    <g>
      <rect x="${k.x}" y="120" width="${k.w}" height="120" rx="16" fill="#fff" fill-opacity=".03" stroke="#fff" stroke-opacity=".08"/>
      <rect x="${k.x + 22}" y="144" width="90" height="9" rx="4.5" fill="#fff" fill-opacity=".3"/>
      <rect x="${k.x + 22}" y="172" width="${120 + i * 20}" height="26" rx="8" fill="#fff" fill-opacity=".9" class="fl" style="animation: grow 4s ease-in-out ${i * 0.4}s infinite alternate"/>
      <g transform="translate(${k.x + k.w - 82} 144)">
        <rect width="60" height="24" rx="12" fill="${k.c}" fill-opacity=".2"/>
        <path d="M14 16L22 8L30 16" fill="none" stroke="${k.c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="36" y="9" width="14" height="6" rx="3" fill="${k.c}"/>
      </g>
      <rect x="${k.x + 22}" y="214" width="${k.w - 44}" height="4" rx="2" fill="#fff" fill-opacity=".08"/>
      <rect x="${k.x + 22}" y="214" width="${k.w - 44}" height="4" rx="2" fill="${k.c}" class="fl" style="animation: grow2 6s ease-in-out ${i * 0.6}s infinite"/>
    </g>`).join('')

  const defs = `${brandGradient('stroke', 1, 0)}
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.yellow}"/><stop offset="1" stop-color="${C.coral}"/></linearGradient>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.pink}" stop-opacity=".35"/><stop offset="1" stop-color="${C.pink}" stop-opacity="0"/></linearGradient>
    ${glow('g1', C.orange, 0.35)}${glow('g2', C.deep, 0.7)}${g.def}`

  const body = `
  <circle cx="140" cy="100" r="360" fill="url(#g1)"/>
  <circle cx="1100" cy="620" r="420" fill="url(#g2)"/>
  ${g.rect}
  <rect x="110" y="70" width="980" height="535" rx="24" fill="${C.panel}" stroke="#fff" stroke-opacity=".08"/>
  <rect x="150" y="92" width="160" height="10" rx="5" fill="#fff" fill-opacity=".25"/>
  ${kpis}
  <path d="M170 560H580M630 560H1060" stroke="#fff" stroke-opacity=".1"/>
  ${bars}
  <path d="${line} L1080 560 L640 560Z" fill="url(#area)" style="animation: fade ${cycle}s ease-in-out infinite"/>
  <path d="${line}" fill="none" stroke="url(#stroke)" stroke-width="5" stroke-linecap="round" pathLength="100" stroke-dasharray="100" style="animation: draw ${cycle}s ease-in-out infinite"/>
  <circle r="9" fill="#fff" stroke="${C.pink}" stroke-width="4">
    <animateMotion dur="${cycle}s" repeatCount="indefinite" keyPoints="0;0;1;1;0" keyTimes="0;.1;.6;.9;1" calcMode="linear" path="${line}"/>
  </circle>
`

  const style = `${keyframes}
    @keyframes draw { 0%,10% { stroke-dashoffset: 100; } 60%,90% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 100; } }
    @keyframes fade { 0%,30% { opacity: 0; } 60%,88% { opacity: 1; } 100% { opacity: 0; } }
    @keyframes grow { from { transform: scaleX(.55); } to { transform: scaleX(1); } }
    @keyframes grow2 { 0% { transform: scaleX(0); } 70%,100% { transform: scaleX(1); } }`

  return svg(W, H, 'Live marketing analytics dashboard', defs, body, style)
}

// ---------- 6. Design as a Service: endless conveyor of design work --------

function daas() {
  const W = 1600, H = 600
  const fills = [C.orange, C.pink, C.purple, C.yellow, C.magenta, C.coral, C.violet]
  const tile = (x, y, i) => `
    <g transform="translate(${x} ${y})">
      <rect width="230" height="150" rx="18" fill="${C.panel}" stroke="#fff" stroke-opacity=".1"/>
      <rect x="14" y="14" width="202" height="72" rx="10" fill="${fills[i % fills.length]}" fill-opacity=".9"/>
      <rect x="14" y="100" width="${80 + (i * 23) % 90}" height="9" rx="4.5" fill="#fff" fill-opacity=".45"/>
      <rect x="14" y="118" width="${60 + (i * 37) % 110}" height="7" rx="3.5" fill="#fff" fill-opacity=".18"/>
    </g>`
  const row = (y, offset, dir, dur) => {
    const count = 8, step = 260 // one set spans 2080px, matching the keyframes
    const tiles = Array.from({ length: count * 2 }, (_, i) => tile(i * step, 0, i + offset)).join('')
    return `<g transform="translate(0 ${y})"><g style="animation: ${dir} ${dur}s linear infinite">${tiles}</g></g>`
  }
  const defs = `${glow('g1', C.magenta, 0.4)}${glow('g2', C.orange, 0.3)}`
  const body = `
  <circle cx="300" cy="300" r="600" fill="url(#g2)"/>
  <circle cx="1300" cy="300" r="600" fill="url(#g1)"/>
  ${row(60, 0, 'left', 40)}
  ${row(250, 3, 'right', 46)}
  ${row(440, 5, 'left', 52)}`
  const style = `
    @keyframes left { from { transform: translateX(0); } to { transform: translateX(-2080px); } }
    @keyframes right { from { transform: translateX(-2080px); } to { transform: translateX(0); } }`
  return svg(W, H, 'A continuous stream of design deliverables', defs, body, style)
}

const files = {
  'ethos-fluid.svg': ethos(),
  'capability-branding.svg': branding(),
  'capability-development.svg': development(),
  'capability-events.svg': events(),
  'capability-martech.svg': martech(),
  'capability-daas.svg': daas()
}
for (const [name, content] of Object.entries(files)) writeFileSync(join(OUT, name), content)
console.log(`wrote ${Object.keys(files).length} animated SVGs to ${OUT}`)
