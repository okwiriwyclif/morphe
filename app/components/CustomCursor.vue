<template>
  <div v-if="enabled">
    <div ref="cursor" class="cursor" :class="{ 'is-hovering': hovering }" />
    <div ref="follower" class="cursor-follower" :class="{ 'is-hovering': hovering }" />
  </div>
</template>

<script>
const INTERACTIVE = 'a, button, input, textarea, .group'

export default {
  name: 'CustomCursor',

  data() {
    return {
      enabled: false,
      hovering: false
    }
  },

  mounted() {
    // Disable custom cursor on touch devices
    if ('ontouchstart' in window) return

    this.enabled = true
    document.body.classList.add('has-custom-cursor')
    document.addEventListener('mousemove', this.onMove)
    document.addEventListener('mouseover', this.onOver)
  },

  beforeUnmount() {
    document.body.classList.remove('has-custom-cursor')
    document.removeEventListener('mousemove', this.onMove)
    document.removeEventListener('mouseover', this.onOver)
    clearTimeout(this.followTimer)
  },

  methods: {
    onMove(e) {
      const { cursor, follower } = this.$refs
      if (!cursor || !follower) return

      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'

      // Smoother delay for follower
      this.followTimer = setTimeout(() => {
        follower.style.left = e.clientX - 10 + 'px'
        follower.style.top = e.clientY - 10 + 'px'
      }, 50)
    },

    // Event delegation so elements rendered later also get hover states
    onOver(e) {
      this.hovering = !!e.target.closest?.(INTERACTIVE)
    }
  }
}
</script>

<style scoped>
.cursor {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: fixed;
  top: -100px;
  left: -100px;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.15s ease-out;
}

.cursor.is-hovering {
  transform: scale(3);
}

.cursor-follower {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: fixed;
  top: -100px;
  left: -100px;
  pointer-events: none;
  z-index: 9998;
  transition:
    transform 0.3s ease-out,
    border-color 0.3s ease-out,
    top 0.1s,
    left 0.1s;
}

.cursor-follower.is-hovering {
  transform: scale(1.5);
  border-color: rgba(255, 255, 255, 0.8);
}
</style>
