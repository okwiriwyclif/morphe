<template>
  <div
    class="showreel relative overflow-hidden rounded-3xl glass aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/7]"
    role="region"
    aria-roledescription="carousel"
    aria-label="Project showreel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      v-for="(project, index) in slides"
      :key="project.slug"
      class="absolute inset-0 transition-opacity duration-1000 ease-out"
      :class="index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      role="group"
      aria-roledescription="slide"
      :aria-label="`${index + 1} of ${slides.length}: ${project.name}`"
      :aria-hidden="index !== current"
      :inert="index !== current"
    >
      <!-- Adaptive backdrop from the screenshot itself -->
      <img
        :src="project.imageUrl"
        alt=""
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl saturate-150 opacity-60"
        :loading="index === 0 ? 'eager' : 'lazy'"
      />
      <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 via-black/50 to-black/10" />

      <!-- Screenshot -->
      <div
        class="absolute inset-x-6 top-14 bottom-[45%] sm:bottom-[38%] lg:inset-y-10 lg:left-[40%] lg:right-10 flex items-center justify-center"
      >
        <img
          :src="project.imageUrl"
          :alt="`${project.name} screenshot`"
          class="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
          :class="{ 'showreel-zoom': index === current }"
          :style="{ animationDuration: `${interval + 1000}ms` }"
          :loading="index === 0 ? 'eager' : 'lazy'"
        />
      </div>

      <!-- Caption -->
      <div
        class="absolute left-6 right-6 bottom-16 sm:bottom-20 lg:left-12 lg:right-auto lg:top-0 lg:bottom-0 lg:w-[34%] flex flex-col justify-end lg:justify-center"
      >
        <p
          class="text-xs font-bold uppercase tracking-[0.2em] mb-3"
          :class="project.accentClass"
        >
          {{ project.category }}
        </p>
        <h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 lg:mb-5">
          {{ project.name }}
        </h3>
        <p class="hidden sm:block text-gray-300/80 mb-6 line-clamp-2 lg:line-clamp-3">
          {{ project.description }}
        </p>
        <NuxtLink
          :to="`/work/${project.slug}`"
          class="inline-flex items-center gap-2 text-sm font-bold group/link w-fit"
        >
          View case
          <ArrowRight class="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>
    </div>

    <!-- Header -->
    <div
      class="absolute top-5 left-6 lg:top-8 lg:left-12 z-20 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60"
    >
      <span class="w-2 h-2 rounded-full bg-brand-gradient" :class="{ 'animate-pulse': !paused }" />
      Showreel
      <span class="tabular-nums text-white/40">
        {{ String(current + 1).padStart(2, '0') }} / {{ String(slides.length).padStart(2, '0') }}
      </span>
    </div>

    <!-- Progress / navigation -->
    <div class="absolute left-6 right-6 bottom-4 sm:bottom-6 lg:left-12 lg:right-12 lg:bottom-8 z-20 flex gap-2">
      <button
        v-for="(project, index) in slides"
        :key="project.slug"
        type="button"
        class="group/bar flex-1 py-3"
        :aria-label="`Show ${project.name}`"
        :aria-current="index === current"
        @click="goTo(index)"
      >
        <span class="block h-[3px] rounded-full bg-white/15 overflow-hidden group-hover/bar:bg-white/30 transition-colors">
          <span
            v-if="index === current"
            :key="cycle"
            class="showreel-progress block h-full bg-brand-gradient"
            :style="{
              animationDuration: `${interval}ms`,
              animationPlayState: paused ? 'paused' : 'running'
            }"
            @animationend="next"
          />
          <span v-else-if="index < current" class="block h-full w-full bg-white/50" />
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { ArrowRight } from 'lucide-vue-next'
import { projects } from '~/utils/projects'

export default {
  name: 'ProjectShowreel',

  components: { ArrowRight },

  props: {
    limit: {
      type: Number,
      default: 6
    },
    // Time each project stays on screen (ms)
    interval: {
      type: Number,
      default: 5000
    }
  },

  data() {
    return {
      current: 0,
      cycle: 0,
      paused: false
    }
  },

  computed: {
    slides() {
      return projects.slice(0, this.limit)
    }
  },

  mounted() {
    document.addEventListener('visibilitychange', this.onVisibility)
  },

  beforeUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibility)
  },

  methods: {
    goTo(index) {
      this.current = (index + this.slides.length) % this.slides.length
      this.cycle++ // restarts the progress animation even when re-selecting the same slide
    },

    // Advancing is driven by the progress bar's animationend, so pausing it pauses the reel
    next() {
      this.goTo(this.current + 1)
    },

    onVisibility() {
      this.paused = document.hidden
    }
  }
}
</script>

<style scoped>
.showreel-progress {
  width: 0;
  animation-name: showreel-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes showreel-progress {
  to {
    width: 100%;
  }
}

.showreel-zoom {
  animation-name: showreel-zoom;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

@keyframes showreel-zoom {
  from {
    transform: scale(0.94) translateY(12px);
  }
  to {
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .showreel-zoom {
    animation: none;
  }
}
</style>
