<template>
  <div
    class="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center gap-6 text-3xl font-bold transition-[transform,visibility] duration-500"
    :class="open ? 'translate-x-0 visible' : 'translate-x-full invisible'"
    role="dialog"
    aria-modal="true"
    aria-label="Menu"
    :aria-hidden="!open"
  >
    <BrandLogo mark-only mark-class="h-16" class="mb-6" />
    <button
      class="absolute top-5 right-4 p-3"
      aria-label="Close menu"
      @click="$emit('close')"
    >
      <X class="w-8 h-8" />
    </button>
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
      class="px-6 py-2"
      @click="$emit('close')"
    >
      {{ link.label }}
    </a>
  </div>
</template>

<script>
import { X } from 'lucide-vue-next'

export default {
  name: 'MobileMenu',

  components: { X },

  props: {
    open: {
      type: Boolean,
      default: false
    },
    links: {
      type: Array,
      required: true
    }
  },

  emits: ['close'],

  watch: {
    // Stop the page scrolling behind the open menu
    open(isOpen) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  },

  mounted() {
    document.addEventListener('keydown', this.onKeydown)
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeydown)
    document.body.style.overflow = ''
  },

  methods: {
    onKeydown(e) {
      if (e.key === 'Escape' && this.open) this.$emit('close')
    }
  }
}
</script>
