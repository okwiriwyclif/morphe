// Contact form options + validation, shared by the form (app/) and the API route (server/)

export const SERVICES = [
  {
    id: 'branding',
    label: 'UI/UX & Branding',
    hint: 'Identity, product design, design systems',
    questions: [
      {
        id: 'brandingScope',
        label: 'What do you need designed?',
        type: 'multi',
        options: [
          'New brand identity',
          'Brand refresh',
          'Website / product UI',
          'Design system',
          'Marketing collateral'
        ]
      }
    ]
  },
  {
    id: 'development',
    label: 'Development',
    hint: 'Websites, web & mobile apps, integrations',
    questions: [
      {
        id: 'devType',
        label: 'What are we building?',
        type: 'multi',
        options: [
          'Marketing website',
          'Web app / portal',
          'Mobile app',
          'E-commerce',
          'Integrations / APIs',
          'Improve an existing product'
        ]
      }
    ]
  },
  {
    id: 'daas',
    label: 'Design as a Service',
    hint: 'Unlimited design requests, one monthly fee',
    questions: [
      {
        id: 'daasVolume',
        label: 'How much design work do you expect?',
        type: 'single',
        options: ['A few requests a month', 'Weekly requests', 'A dedicated designer (daily)']
      }
    ]
  },
  {
    id: 'events',
    label: 'Hybrid Events',
    hint: 'Event identity, staging, kiosks, live streaming',
    questions: [
      {
        id: 'eventFormat',
        label: 'Event format',
        type: 'single',
        options: ['In-person', 'Virtual', 'Hybrid']
      },
      {
        id: 'eventSize',
        label: 'Expected attendance',
        type: 'single',
        options: ['Under 200', '200 – 1,000', '1,000 – 5,000', '5,000+']
      },
      {
        id: 'eventDate',
        label: 'Event date (if known)',
        type: 'date'
      }
    ]
  },
  {
    id: 'martech',
    label: 'Martech Strategy',
    hint: 'Automation, analytics, campaigns',
    questions: [
      {
        id: 'martechGoals',
        label: 'What are your goals?',
        type: 'multi',
        options: [
          'Lead generation',
          'Marketing automation',
          'Analytics & dashboards',
          'Campaign launch',
          'CRM integration'
        ]
      }
    ]
  }
]

export const BUDGETS = [
  'Under $2,000',
  '$2,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
  'Not sure yet'
]

export const TIMELINES = [
  'As soon as possible',
  'Within a month',
  '1 – 3 months',
  '3 – 6 months',
  'Flexible'
]

export const SOURCES = ['Referral', 'Google search', 'Social media', 'Saw your work', 'An event', 'Other']

export const LIMITS = {
  name: 100,
  email: 200,
  phone: 40,
  company: 120,
  website: 200,
  messageMin: 20,
  message: 5000
}

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i
const PHONE_RE = /^\+?[\d\s()-]{7,}$/
const WEBSITE_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const SERVICE_IDS = SERVICES.map((s) => s.id)

// Single-line text: trimmed, length-capped, no line breaks (keeps email headers safe)
const line = (value, max) =>
  typeof value === 'string' ? value.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : ''

const pick = (value, allowed) => (allowed.includes(value) ? value : '')

export const serviceLabel = (id) => SERVICES.find((s) => s.id === id)?.label || id

/**
 * Normalise untrusted input into a clean inquiry.
 * Returns { data, errors } where errors is null when valid.
 */
export function validateInquiry(input = {}) {
  const services = Array.isArray(input.services)
    ? [...new Set(input.services.filter((id) => SERVICE_IDS.includes(id)))]
    : []

  // Only keep answers to questions of the selected services, and only allowed values
  const details = {}
  const rawDetails = input.details && typeof input.details === 'object' ? input.details : {}
  SERVICES.filter((s) => services.includes(s.id)).forEach((service) => {
    service.questions.forEach((q) => {
      const value = rawDetails[q.id]
      if (q.type === 'multi' && Array.isArray(value)) {
        const chosen = value.filter((v) => q.options.includes(v))
        if (chosen.length) details[q.id] = chosen
      } else if (q.type === 'single' && q.options.includes(value)) {
        details[q.id] = value
      } else if (q.type === 'date' && typeof value === 'string' && DATE_RE.test(value)) {
        details[q.id] = value
      }
    })
  })

  const data = {
    name: line(input.name, LIMITS.name),
    email: line(input.email, LIMITS.email).toLowerCase(),
    phone: line(input.phone, LIMITS.phone),
    company: line(input.company, LIMITS.company),
    website: line(input.website, LIMITS.website),
    services,
    details,
    budget: pick(input.budget, BUDGETS),
    timeline: pick(input.timeline, TIMELINES),
    source: pick(input.source, SOURCES),
    message: typeof input.message === 'string' ? input.message.trim().slice(0, LIMITS.message) : ''
  }

  const errors = {}
  if (data.name.length < 2) errors.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.'
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Please enter a valid phone number.'
  if (data.website && !WEBSITE_RE.test(data.website)) errors.website = 'Please enter a valid website.'
  if (!data.services.length) errors.services = 'Pick at least one service.'
  if (data.message.length < LIMITS.messageMin) {
    errors.message = `Tell us a little more (at least ${LIMITS.messageMin} characters).`
  }

  return { data, errors: Object.keys(errors).length ? errors : null }
}
