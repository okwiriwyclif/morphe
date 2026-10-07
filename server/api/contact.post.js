import { validateInquiry } from '#shared/contact'
import { assertMailConfig, getMailConfig, sendMail } from '../utils/mailer'
import { inquiryAutoReply, inquiryNotification } from '../utils/inquiry-email'

const MIN_FILL_MS = 3000 // humans take longer than this to fill the form
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }

// Best-effort per-isolate limiter; Workers isolates are short-lived, so this only blunts bursts
const hits = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 1000) hits.clear()
  return recent.length > RATE_LIMIT.max
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => null)) || {}

  // Spam traps: hidden honeypot field filled, or submitted impossibly fast. Pretend success.
  const elapsed = Date.now() - Number(body.startedAt)
  if (body.company_url || !(elapsed >= MIN_FILL_MS)) {
    return { ok: true }
  }

  const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (rateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again in a few minutes.' })
  }

  const { data: inquiry, errors } = validateInquiry(body)
  if (errors) {
    throw createError({ statusCode: 422, statusMessage: 'Please check the highlighted fields.', data: { errors } })
  }

  const config = getMailConfig(event)
  try {
    assertMailConfig(config)
    const country = event.context.cloudflare?.request?.cf?.country
    const messages = [{ to: { email: config.to }, ...inquiryNotification(inquiry, { country }) }]
    if (config.autoReply) messages.push(inquiryAutoReply(inquiry, config.to))
    await sendMail(config, messages)
  } catch (error) {
    console.error('[contact] failed to send inquiry:', error?.message || error)
    throw createError({
      statusCode: 502,
      statusMessage: `We couldn't send your message right now. Please email ${config.to || 'us'} directly.`
    })
  }

  return { ok: true }
})
