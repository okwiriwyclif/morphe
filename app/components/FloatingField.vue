<template>
  <div :class="$attrs.class" :style="$attrs.style">
    <div
      class="group/field relative rounded-2xl border bg-white/[0.03] transition-colors"
      :class="error ? 'border-brand-pink/70' : 'border-white/10 hover:border-white/20 focus-within:border-transparent'"
    >
      <!-- Gradient outline while focused -->
      <span
        v-if="!error"
        class="gradient-ring pointer-events-none absolute -inset-px rounded-2xl p-[1.5px] bg-brand-gradient opacity-0 transition-opacity duration-300 group-focus-within/field:opacity-100"
        aria-hidden="true"
      />

      <textarea
        v-if="multiline"
        :id="id"
        v-bind="controlAttrs"
        :value="modelValue"
        :rows="rows"
        :maxlength="maxlength"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        placeholder=" "
        class="peer relative block w-full min-h-40 resize-y rounded-2xl bg-transparent px-5 pt-9 pb-9 text-base sm:text-lg leading-relaxed text-white placeholder:text-transparent focus:outline-none"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />
      <input
        v-else
        :id="id"
        v-bind="controlAttrs"
        :value="modelValue"
        :type="type"
        :maxlength="maxlength"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        placeholder=" "
        class="peer relative block w-full h-16 rounded-2xl bg-transparent px-5 pt-6 pb-1.5 pr-12 text-base sm:text-lg text-white placeholder:text-transparent focus:outline-none [color-scheme:dark]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      />

      <label
        :for="id"
        class="pointer-events-none absolute left-5 origin-left text-gray-400 transition-all duration-200 peer-focus:text-white"
        :class="labelClass"
      >
        {{ label }}<span v-if="required" class="text-brand-orange"> *</span>
      </label>

      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0 scale-50"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0"
      >
        <span
          v-if="valid && !error"
          class="absolute right-4 w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center"
          :class="multiline ? 'top-4' : 'top-1/2 -translate-y-1/2'"
          aria-hidden="true"
        >
          <Check class="w-3.5 h-3.5 text-white" />
        </span>
      </Transition>

      <slot name="suffix" />
    </div>
    <p v-if="error" :id="`${id}-error`" class="mt-2 pl-1 text-sm text-brand-pink">{{ error }}</p>
  </div>
</template>

<script>
import { Check } from 'lucide-vue-next'

// Peer variants that move the label up while focused or filled
const FLOAT_ON_INPUT =
  'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs'

export default {
  name: 'FloatingField',

  components: { Check },

  inheritAttrs: false,

  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    maxlength: { type: Number, default: undefined },
    error: { type: String, default: '' },
    // Shows a check mark when the value passes validation
    valid: { type: Boolean, default: false },
    multiline: { type: Boolean, default: false },
    rows: { type: Number, default: 5 },
    // Keep the label up (e.g. date inputs always render their own placeholder)
    floatAlways: { type: Boolean, default: false }
  },

  emits: ['update:modelValue', 'blur'],

  computed: {
    // class/style go on the wrapper; everything else (name, autocomplete, min…) on the control
    controlAttrs() {
      const { class: _class, style: _style, ...rest } = this.$attrs
      return rest
    },

    labelClass() {
      if (this.floatAlways) return 'top-2.5 text-xs'
      if (this.multiline) return `top-5 text-base ${FLOAT_ON_INPUT}`
      return `top-1/2 -translate-y-1/2 text-base ${FLOAT_ON_INPUT}`
    }
  }
}
</script>
