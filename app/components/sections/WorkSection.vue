<template>
  <section id="work" class="py-20 md:py-32 px-6">
    <div class="max-w-7xl mx-auto">
      <div v-reveal class="flex justify-between items-end mb-12 md:mb-20">
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
          SELECTED<br />WORK
        </h2>
        <div class="hidden md:block text-right">
          <p class="text-gray-500 text-sm mb-2">{{ total }} Projects</p>
          <div class="w-24 h-[1px] bg-white/20 ml-auto" />
        </div>
      </div>

      <div class="space-y-16 md:space-y-32">
        <ProjectCard
          v-for="(project, index) in featured"
          :key="project.slug"
          v-bind="project"
          :reversed="index % 2 === 1"
        />
      </div>

      <div v-reveal class="mt-16 md:mt-32 flex justify-center">
        <NuxtLink
          v-magnetic
          to="/work"
          class="inline-flex items-center gap-3 border border-white/20 rounded-full px-8 sm:px-10 py-4 sm:py-5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          View all work
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { ArrowRight } from 'lucide-vue-next'
import { projects } from '~/utils/projects'

export default {
  name: 'WorkSection',

  components: { ArrowRight },

  props: {
    limit: {
      type: Number,
      default: 4
    }
  },

  data() {
    return {
      total: projects.length
    }
  },

  computed: {
    featured() {
      return projects.slice(0, this.limit)
    }
  }
}
</script>
