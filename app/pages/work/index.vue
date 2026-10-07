<template>
  <div>
    <section class="pt-48 pb-20 px-6 relative">
      <div class="gradient-blur w-96 h-96 bg-indigo-600 top-20 -left-20" />
      <div class="max-w-7xl mx-auto">
        <p
          v-reveal
          class="text-indigo-400 font-medium tracking-[0.3em] uppercase text-xs mb-8"
        >
          Portfolio
        </p>
        <h1
          v-reveal
          class="text-[14vw] md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-12"
        >
          ALL <span class="italic font-light opacity-50">WORK</span>
        </h1>
        <p v-reveal class="max-w-xl text-gray-400 text-lg leading-relaxed">
          {{ projects.length }} platforms across climate, health, government,
          hospitality and commerce, designed and engineered end to end.
        </p>
      </div>
    </section>

    <section class="pb-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div v-reveal class="flex flex-wrap gap-3 mb-16">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            class="px-5 py-2 rounded-full border text-xs uppercase tracking-widest transition-colors"
            :class="
              activeFilter === filter
                ? 'bg-white text-black border-white'
                : 'border-white/15 text-gray-400 hover:border-white/40 hover:text-white'
            "
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>

        <div class="grid md:grid-cols-2 gap-x-12 gap-y-20">
          <ProjectTile
            v-for="project in filteredProjects"
            :key="project.slug"
            :project="project"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { projects } from '~/utils/projects'

const ALL = 'All'
const FILTER_LIMIT = 6

export default {
  name: 'WorkPage',

  data() {
    return {
      projects,
      activeFilter: ALL
    }
  },

  computed: {
    // Most common technologies across projects, used as filters
    filters() {
      const counts = {}
      projects.forEach((project) => {
        project.techStack.forEach((tech) => {
          const key = tech.toLowerCase()
          counts[key] = counts[key] || { label: tech, count: 0 }
          counts[key].count++
        })
      })
      const top = Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, FILTER_LIMIT)
        .map((item) => item.label)
      return [ALL, ...top]
    },

    filteredProjects() {
      if (this.activeFilter === ALL) return this.projects
      const filter = this.activeFilter.toLowerCase()
      return this.projects.filter((project) =>
        project.techStack.some((tech) => tech.toLowerCase() === filter)
      )
    }
  },

  created() {
    useHead({ title: 'Work | Morphe Creatives' })
  }
}
</script>
