<template>
  <section
    class="relative pl-11 sm:pl-16"
    :class="last ? '' : 'pb-12 sm:pb-14'"
    :aria-labelledby="`step-${number}-title`"
  >
    <!-- Rail connecting to the next step -->
    <span
      v-if="!last"
      class="absolute left-4 top-11 bottom-2 w-px transition-colors duration-500"
      :class="state === 'done' ? 'bg-gradient-to-b from-brand-orange via-brand-pink to-white/10' : 'bg-white/10'"
      aria-hidden="true"
    />

    <span
      class="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500"
      :class="badgeClass"
      aria-hidden="true"
    >
      <Check v-if="state === 'done'" class="w-4 h-4" />
      <Lock v-else-if="state === 'locked'" class="w-3.5 h-3.5" />
      <template v-else>{{ String(number).padStart(2, '0') }}</template>
    </span>

    <header class="pt-0.5" :class="state === 'locked' ? '' : 'mb-6'">
      <p class="text-[10px] uppercase tracking-[0.3em] mb-1" :class="state === 'locked' ? 'text-gray-700' : 'text-gray-500'">
        Step {{ number }} of {{ total }}
      </p>
      <h3
        :id="`step-${number}-title`"
        class="text-lg sm:text-xl font-semibold tracking-tight"
        :class="state === 'locked' ? 'text-gray-600' : 'text-white'"
      >
        {{ title }}
      </h3>
      <p v-if="state === 'locked'" class="text-sm text-gray-700 mt-1">{{ lockedHint }}</p>
      <p v-else-if="hint" class="text-sm text-gray-500 mt-1">{{ hint }}</p>
    </header>

    <div v-if="state !== 'locked'">
      <slot />
    </div>
  </section>
</template>

<script>
import { Check, Lock } from 'lucide-vue-next'

export default {
  name: 'FormStep',

  components: { Check, Lock },

  props: {
    number: { type: Number, required: true },
    total: { type: Number, default: 4 },
    title: { type: String, required: true },
    hint: { type: String, default: '' },
    state: {
      type: String,
      default: 'active',
      validator: (value) => ['active', 'done', 'locked'].includes(value)
    },
    last: { type: Boolean, default: false },
    lockedHint: { type: String, default: 'Complete the step above to continue.' }
  },

  computed: {
    badgeClass() {
      if (this.state === 'done') return 'bg-brand-gradient text-white shadow-lg shadow-brand-magenta/30'
      if (this.state === 'locked') return 'border border-white/10 text-gray-600 bg-[#0b0b0d]'
      return 'border-2 border-white text-white bg-[#0b0b0d]'
    }
  }
}
</script>
