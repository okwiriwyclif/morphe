<template>
  <div
    class="md:col-span-6 bg-[#050505] p-12 hover:bg-zinc-900 transition-colors group"
  >
    <div v-if="image" class="overflow-hidden rounded-2xl aspect-video mb-10">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
    </div>
    <span class="text-xs font-bold mb-4 block" :class="accentClass">{{ number }}</span>
    <h3 class="text-3xl font-bold mb-6 group-hover:translate-x-2 transition-transform">
      {{ title }}
    </h3>
    <p class="text-gray-500 max-w-sm">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'CapabilityCard',

  props: {
    number: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    // Full Tailwind class (e.g. "text-indigo-500") so it is picked up at build time
    accentClass: {
      type: String,
      default: 'text-indigo-500'
    }
  }
}
</script>
