<template>
  <article v-if="project">
    <section class="pt-28 md:pt-48 pb-10 md:pb-16 px-6 relative">
      <div class="gradient-blur w-96 h-96 bg-brand-purple top-20 -left-20" />
      <div class="max-w-7xl mx-auto">
        <NuxtLink
          to="/work"
          class="inline-flex items-center gap-2 py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-8 md:mb-12"
        >
          <ArrowLeft class="w-4 h-4" />
          All work
        </NuxtLink>
        <p
          v-reveal
          class="font-medium tracking-[0.3em] uppercase text-xs mb-6 md:mb-8"
          :class="project.accentClass"
        >
          {{ project.category }}
        </p>
        <h1
          v-reveal
          class="text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95] tracking-tighter mb-6 md:mb-10 max-w-5xl break-words hyphens-auto"
        >
          {{ project.name }}
        </h1>
        <p v-reveal class="max-w-2xl text-gray-400 text-lg md:text-xl leading-relaxed">
          {{ project.description }}
        </p>
      </div>
    </section>

    <section class="px-4 sm:px-6 pb-16 md:pb-24">
      <div v-reveal class="max-w-7xl mx-auto">
        <ProjectThumbnail
          :src="project.imageUrl"
          :alt="project.name"
          aspect-class="aspect-[4/3] md:aspect-[16/9]"
          padding-class="p-4 sm:p-8 md:p-16"
        />
      </div>
    </section>

    <section class="px-6 pb-20 md:pb-32">
      <div class="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-16">
        <aside v-reveal class="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-8 md:gap-y-10 content-start">
          <div v-for="meta in details" :key="meta.label">
            <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">
              {{ meta.label }}
            </p>
            <p class="text-base sm:text-lg font-semibold break-words">{{ meta.value }}</p>
          </div>
          <div class="col-span-2 md:col-span-1">
            <p class="text-xs uppercase tracking-widest text-gray-500 mb-4">Tech Stack</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.techStack"
                :key="tech"
                class="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-sm text-gray-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>
          <a
            v-magnetic
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="col-span-2 md:col-span-1 justify-self-start inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Visit live site
            <ArrowUpRight class="w-4 h-4" />
          </a>
        </aside>

        <div class="md:col-span-8 space-y-14 md:space-y-20">
          <div v-reveal>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 md:mb-8">What we did</h2>
            <ul class="grid sm:grid-cols-2 gap-4">
              <li
                v-for="service in project.services"
                :key="service"
                class="glass rounded-2xl p-5 sm:p-6 flex items-start gap-3 text-gray-300"
              >
                <Check class="w-5 h-5 mt-0.5 shrink-0 text-brand-orange" />
                {{ service }}
              </li>
            </ul>
          </div>

          <div v-reveal>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-6 md:mb-8">Impact</h2>
            <ol class="space-y-6">
              <li
                v-for="(achievement, index) in project.achievements"
                :key="achievement"
                class="flex gap-4 sm:gap-6 border-b border-white/5 pb-6"
              >
                <span class="text-xs font-bold pt-1.5" :class="project.accentClass">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <p class="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">{{ achievement }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <nav class="px-4 sm:px-6 pb-20 md:pb-32" aria-label="More projects">
      <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-1 bg-white/5 rounded-3xl overflow-hidden border border-white/5">
        <NuxtLink
          :to="`/work/${adjacent.previous.slug}`"
          class="bg-[#050505] p-6 md:p-10 hover:bg-zinc-900 transition-colors group"
        >
          <span class="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 mb-4">
            <ArrowLeft class="w-4 h-4" /> Previous
          </span>
          <span class="text-lg sm:text-xl md:text-2xl font-bold block group-hover:-translate-x-1 transition-transform">
            {{ adjacent.previous.name }}
          </span>
        </NuxtLink>
        <NuxtLink
          :to="`/work/${adjacent.next.slug}`"
          class="bg-[#050505] p-6 md:p-10 hover:bg-zinc-900 transition-colors group md:text-right"
        >
          <span class="flex items-center md:justify-end gap-2 text-xs uppercase tracking-widest text-gray-500 mb-4">
            Next <ArrowRight class="w-4 h-4" />
          </span>
          <span class="text-lg sm:text-xl md:text-2xl font-bold block group-hover:translate-x-1 transition-transform">
            {{ adjacent.next.name }}
          </span>
        </NuxtLink>
      </div>
    </nav>
  </article>
</template>

<script>
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-vue-next'
import { findProject, getAdjacentProjects } from '~/utils/projects'

export default {
  name: 'ProjectPage',

  components: { ArrowLeft, ArrowRight, ArrowUpRight, Check },

  data() {
    const slug = this.$route.params.slug
    return {
      project: findProject(slug),
      adjacent: getAdjacentProjects(slug)
    }
  },

  computed: {
    details() {
      return [
        { label: 'Role', value: this.project.role },
        { label: 'Duration', value: this.project.duration },
        { label: 'Website', value: this.project.link }
      ]
    }
  },

  created() {
    if (!this.project) {
      throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
    }

    useHead({
      title: `${this.project.name} | Morphe Creatives`,
      meta: [{ name: 'description', content: this.project.description }]
    })
  }
}
</script>
