<template>
  <div class="py-20 border-y border-white/5 bg-white/[0.02]">
    <div class="marquee">
      <div
        class="marquee-content text-6xl md:text-8xl font-bold opacity-10 tracking-tighter uppercase space-x-20 px-10"
      >
        <span v-for="n in 2" :key="n" :aria-hidden="n > 1">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarqueeBand',

  props: {
    items: {
      type: Array,
      default: () => [
        'UI/UX Design',
        'Martech',
        'Design as a Service',
        'Branding',
        'Campaigns',
        'Software',
        'Event Design'
      ]
    }
  },

  computed: {
    text() {
      return this.items.join(' • ') + ' • '
    }
  }
}
</script>
