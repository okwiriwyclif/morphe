<template>
  <div v-reveal class="group">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <NuxtLink
        :to="to"
        class="block overflow-hidden rounded-3xl aspect-[16/10] bg-zinc-900 glass relative"
        :class="{ 'md:order-2': reversed }"
        :aria-label="`View ${name} case study`"
      >
        <img
          :src="imageUrl"
          :alt="name"
          class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </NuxtLink>

      <div :class="{ 'md:order-1': reversed }">
        <p
          class="text-xs font-bold uppercase tracking-[0.2em] mb-4"
          :class="accentClass"
        >
          {{ category }}
        </p>
        <h3 class="text-4xl font-bold mb-6">{{ name }}</h3>
        <p class="text-gray-400 mb-8 text-lg">
          {{ description }}
        </p>
        <NuxtLink :to="to" class="inline-flex items-center gap-2 font-bold group/link">
          View Case
          <ArrowRight class="group-hover/link:translate-x-2 transition-transform" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRight } from 'lucide-vue-next'

export default {
  name: 'ProjectCard',

  components: { ArrowRight },

  // Parent spreads the whole project object; don't leak unused fields as HTML attrs
  inheritAttrs: false,

  props: {
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    accentClass: {
      type: String,
      default: 'text-indigo-400'
    },
    // Swap image/text columns on desktop
    reversed: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    to() {
      return `/work/${this.slug}`
    }
  }
}
</script>
