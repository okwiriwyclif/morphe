<template>
  <span class="inline-flex items-center gap-3" :aria-label="label" role="img">
    <img
      src="/brand/morphe-mark-128.png"
      srcset="/brand/morphe-mark-128.png 1x, /brand/morphe-mark-256.png 2x"
      alt=""
      :class="markClass"
      class="w-auto"
    />
    <img
      v-if="!markOnly"
      :src="wordmarkSrc"
      alt=""
      :class="wordmarkClass"
      class="w-auto"
    />
  </span>
</template>

<script>
export default {
  name: 'BrandLogo',

  props: {
    // 'white' for dark backgrounds, 'color' for light ones
    variant: {
      type: String,
      default: 'white',
      validator: (value) => ['white', 'color', 'black'].includes(value)
    },
    markOnly: {
      type: Boolean,
      default: false
    },
    markClass: {
      type: String,
      default: 'h-8'
    },
    wordmarkClass: {
      type: String,
      default: 'h-4'
    },
    label: {
      type: String,
      default: 'Morphe Creatives'
    }
  },

  computed: {
    wordmarkSrc() {
      const suffix = this.variant === 'color' ? '' : `-${this.variant}`
      return `/brand/morphe-wordmark${suffix}.svg`
    }
  }
}
</script>
