<template>
  <div
    class="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center gap-8 text-3xl font-bold transition-transform duration-500"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
    :aria-hidden="!open"
  >
    <button class="absolute top-8 right-8" aria-label="Close menu" @click="$emit('close')">
      <X class="w-8 h-8" />
    </button>
    <a
      v-for="link in links"
      :key="link.href"
      :href="link.href"
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

  emits: ['close']
}
</script>
