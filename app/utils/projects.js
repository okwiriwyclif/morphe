import rawProjects from '~~/db/projects'

const ACCENTS = ['text-indigo-400', 'text-purple-400', 'text-pink-400', 'text-orange-400']

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toUrl = (link) => (/^https?:\/\//.test(link) ? link : `https://${link}`)

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

// Normalise the raw db entries into what the UI needs
export const projects = rawProjects.map((project, index) => ({
  ...project,
  slug: slugify(project.name),
  url: toUrl(project.link),
  services: project.services.map(capitalize),
  category: project.techStack.slice(0, 2).join(' / '),
  accentClass: ACCENTS[index % ACCENTS.length]
}))

export const findProject = (slug) => projects.find((project) => project.slug === slug)

export const getAdjacentProjects = (slug) => {
  const index = projects.findIndex((project) => project.slug === slug)
  const total = projects.length
  return {
    previous: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total]
  }
}
