import { SERVICES, serviceLabel } from '#shared/contact'

const escape = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

const GRADIENT = 'linear-gradient(120deg,#fed001,#fe9e15 25%,#ee34a1 55%,#a928c7 80%,#4e1594)'

const layout = (title, inner) => `<!doctype html>
<html><body style="margin:0;background:#f4f4f6;font-family:Helvetica,Arial,sans-serif;color:#111">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="height:6px;background:#d02eb9;background-image:${GRADIENT}"></td></tr>
        <tr><td style="padding:28px 32px 8px">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d02eb9;font-weight:bold">Morphe Creatives</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3">${escape(title)}</h1>
        </td></tr>
        <tr><td style="padding:16px 32px 32px">${inner}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

const row = (label, value) =>
  value
    ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;width:38%;vertical-align:top;color:#666;font-size:13px">${escape(label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${value}</td>
      </tr>`
    : ''

// Selected services with their follow-up answers, as [label, value] pairs
function detailRows(inquiry) {
  const rows = []
  SERVICES.filter((s) => inquiry.services.includes(s.id)).forEach((service) => {
    service.questions.forEach((q) => {
      const answer = inquiry.details[q.id]
      if (answer) rows.push([`${service.label}: ${q.label}`, Array.isArray(answer) ? answer.join(', ') : answer])
    })
  })
  return rows
}

/** Notification to the Morphe team. Reply-To is the person who filled in the form. */
export function inquiryNotification(inquiry, meta = {}) {
  const services = inquiry.services.map(serviceLabel)
  const details = detailRows(inquiry)
  const website = inquiry.website && (/^https?:\/\//.test(inquiry.website) ? inquiry.website : `https://${inquiry.website}`)

  const html = layout(`New inquiry from ${inquiry.name}`, `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      ${row('Name', escape(inquiry.name))}
      ${row('Email', `<a href="mailto:${escape(inquiry.email)}" style="color:#d02eb9">${escape(inquiry.email)}</a>`)}
      ${row('Phone', inquiry.phone && `<a href="tel:${escape(inquiry.phone.replace(/\s/g, ''))}" style="color:#111">${escape(inquiry.phone)}</a>`)}
      ${row('Company', escape(inquiry.company))}
      ${row('Website', website && `<a href="${escape(website)}" style="color:#d02eb9">${escape(inquiry.website)}</a>`)}
      ${row('Services', escape(services.join(', ')))}
      ${details.map(([label, value]) => row(label, escape(value))).join('')}
      ${row('Budget', escape(inquiry.budget))}
      ${row('Timeline', escape(inquiry.timeline))}
      ${row('Heard about us', escape(inquiry.source))}
    </table>
    <h2 style="margin:28px 0 10px;font-size:15px">Project details</h2>
    <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;background:#f7f7f9;border-radius:12px;padding:16px">${escape(inquiry.message)}</div>
    <p style="margin:24px 0 0;font-size:12px;color:#999">Sent from the morphe.co.ke contact form${meta.country ? ` · ${escape(meta.country)}` : ''}. Reply to this email to answer ${escape(inquiry.name)} directly.</p>
  `)

  const field = (label, value) => (value ? `${label}: ${value}` : null)
  const text = [
    `New inquiry from ${inquiry.name}`,
    '',
    field('Email', inquiry.email),
    field('Phone', inquiry.phone),
    field('Company', inquiry.company),
    field('Website', inquiry.website),
    field('Services', services.join(', ')),
    ...details.map(([label, value]) => field(label, value)),
    field('Budget', inquiry.budget),
    field('Timeline', inquiry.timeline),
    field('Heard about us', inquiry.source),
    '',
    'Project details:',
    inquiry.message
  ]
    .filter((l) => l !== null)
    .join('\n')

  return {
    subject: `New inquiry: ${services.join(', ')} | ${inquiry.name}`,
    reply: { name: inquiry.name, email: inquiry.email },
    html,
    text
  }
}

/**
 * Confirmation to the sender. Deliberately contains no free text from the form,
 * so the endpoint can't be used to relay arbitrary content to third parties.
 */
export function inquiryAutoReply(inquiry, contactEmail) {
  const firstName = inquiry.name.split(/\s+/)[0]
  const services = inquiry.services.map(serviceLabel).join(', ')

  const html = layout(`Thanks ${firstName}, we've got your message`, `
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px">We've received your inquiry about <strong>${escape(services)}</strong>. Someone from the team will get back to you within one business day.</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 16px">If anything is urgent, just reply to this email or write to <a href="mailto:${escape(contactEmail)}" style="color:#d02eb9">${escape(contactEmail)}</a>.</p>
    <p style="font-size:15px;line-height:1.6;margin:24px 0 0">Talk soon,<br><strong>Morphe Creatives</strong><br><span style="color:#888;font-size:13px">Nairobi · Atlanta · Remote</span></p>
  `)

  const text = `Thanks ${firstName}, we've got your message.

We've received your inquiry about ${services}. Someone from the team will get back to you within one business day.

If anything is urgent, reply to this email or write to ${contactEmail}.

Talk soon,
Morphe Creatives`

  return {
    to: { name: inquiry.name, email: inquiry.email },
    reply: { email: contactEmail },
    subject: 'We received your inquiry | Morphe Creatives',
    html,
    text
  }
}
