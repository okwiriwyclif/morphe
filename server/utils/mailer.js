// SMTP mail sending.
// - Cloudflare Workers (production / wrangler dev): worker-mailer over TCP sockets
// - `nuxt dev` (Node): nodemailer, since cloudflare:sockets doesn't exist there
// `import.meta.dev` is replaced at build time, so the unused branch is dropped from each bundle.

/** Read mail settings from Worker bindings (secrets/vars) or process.env (.env in dev). */
export function getMailConfig(event) {
  const env = { ...process.env, ...(event?.context?.cloudflare?.env || {}) }
  return {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    secure: env.SMTP_SECURE !== 'false',
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.CONTACT_FROM || env.SMTP_USER,
    fromName: env.CONTACT_FROM_NAME || 'Morphe Creatives',
    to: env.CONTACT_TO,
    autoReply: env.CONTACT_AUTOREPLY !== 'false'
  }
}

export function assertMailConfig(config) {
  const missing = ['host', 'user', 'pass', 'to'].filter((key) => !config[key])
  if (missing.length) {
    throw new Error(`Mail is not configured, missing: ${missing.join(', ')}`)
  }
}

/**
 * Send one or more messages over a single SMTP connection.
 * message: { to: {name?, email}, reply?: {name?, email}, subject, text, html }
 */
export async function sendMail(config, messages) {
  const from = { name: config.fromName, email: config.from }

  if (import.meta.dev) {
    const { default: nodemailer } = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass }
    })
    const address = (a) => a && { name: a.name || '', address: a.email }
    for (const m of messages) {
      await transport.sendMail({
        from: address(from),
        to: address(m.to),
        replyTo: address(m.reply),
        subject: m.subject,
        text: m.text,
        html: m.html
      })
    }
    transport.close()
    return
  }

  const { WorkerMailer } = await import('worker-mailer')
  const mailer = await WorkerMailer.connect({
    host: config.host,
    port: config.port,
    secure: config.secure, // 465 = implicit TLS
    startTls: !config.secure, // 587 = upgrade with STARTTLS
    credentials: { username: config.user, password: config.pass },
    authType: ['plain', 'login'],
    socketTimeoutMs: 15000,
    responseTimeoutMs: 15000
  })
  try {
    for (const m of messages) {
      await mailer.send({ from, ...m })
    }
  } finally {
    await mailer.close()
  }
}
