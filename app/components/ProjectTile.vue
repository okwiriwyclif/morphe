<template>
  <NuxtLink v-reveal :to="`/work/${project.slug}`" class="group block">
    <ProjectThumbnail :src="project.imageUrl" :alt="project.name" class="mb-6" />
    <p
      class="text-xs font-bold uppercase tracking-[0.2em] mb-3"
      :class="project.accentClass"
    >
      {{ project.category }}
    </p>
    <h3 class="text-xl sm:text-2xl font-bold mb-3 flex items-start justify-between gap-4">
      {{ project.name }}
      <ArrowUpRight
        class="w-6 h-6 shrink-0 opacity-40 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"
      />
    </h3>
    <p class="text-gray-500 line-clamp-2">{{ project.description }}</p>
  </NuxtLink>
</template>

<script>
import { ArrowUpRight } from 'lucide-vue-next'

export default {
  name: 'ProjectTile',

  components: { ArrowUpRight },

  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>
