<template>
  <div>
    <!-- Success -->
    <div v-if="status === 'sent'" class="py-16 md:py-24" role="status" aria-live="polite">
      <span class="w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center mb-8 shadow-lg shadow-brand-magenta/30">
        <Check class="w-7 h-7 text-white" />
      </span>
      <h3 class="text-3xl md:text-4xl font-bold mb-4">
        Thanks {{ firstName }}, <span class="text-brand-gradient">message received.</span>
      </h3>
      <p class="text-gray-400 text-lg max-w-md mb-10">
        We'll get back to you at <span class="text-white">{{ sentTo }}</span> within one business
        day. A confirmation is on its way to your inbox.
      </p>
      <button
        type="button"
        class="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-2"
        @click="reset"
      >
        Send another inquiry
      </button>
    </div>

    <form v-else novalidate @submit.prevent="onSubmit">
      <!-- Honeypot: hidden from people, bots tend to fill it -->
      <div class="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Company URL
          <input v-model="form.company_url" type="text" name="company_url" tabindex="-1" autocomplete="off" />
        </label>
      </div>

      <TransitionGroup
        tag="div"
        enter-active-class="transition duration-700 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        leave-active-class="hidden"
      >
        <FormStep
          v-for="step in visibleSteps"
          :key="`${step.number}-${step.state === 'locked'}`"
          :ref="`step${step.number}`"
          v-bind="step"
          :total="steps.length"
        >
          <!-- 1. About you -->
          <div v-if="step.number === 1" class="grid sm:grid-cols-2 gap-4">
            <FloatingField
              v-for="field in personalFields"
              :id="`contact-${field.id}`"
              :key="field.id"
              v-model.trim="form[field.id]"
              :class="field.wide ? 'sm:col-span-2' : ''"
              :label="field.label"
              :type="field.type"
              :name="field.id"
              :autocomplete="field.autocomplete"
              :inputmode="field.inputmode"
              :maxlength="field.max"
              :required="field.required"
              :error="errors[field.id]"
              :valid="isFieldValid(field.id)"
              @update:model-value="clearError(field.id)"
              @blur="touch(field.id)"
            />
          </div>

          <!-- 2. Services + follow-ups -->
          <div v-else-if="step.number === 2">
            <div
              class="grid sm:grid-cols-2 gap-3"
              role="group"
              aria-label="Services"
              :aria-describedby="errors.services ? 'contact-services-error' : undefined"
            >
              <label
                v-for="service in services"
                :key="service.id"
                class="group relative flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04] has-[:checked]:border-transparent has-[:checked]:bg-white/[0.06] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange"
              >
                <input
                  v-model="form.services"
                  type="checkbox"
                  :value="service.id"
                  class="sr-only"
                  @change="clearError('services')"
                />
                <span
                  class="w-11 h-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-gray-300 transition-all duration-300 group-has-[:checked]:border-transparent group-has-[:checked]:bg-brand-gradient group-has-[:checked]:text-white"
                >
                  <component :is="serviceIcons[service.id]" class="w-5 h-5" />
                </span>
                <span class="flex-1 min-w-0 pr-6">
                  <span class="block font-semibold">{{ service.label }}</span>
                  <span class="block text-sm text-gray-500 mt-1 leading-snug">{{ service.hint }}</span>
                </span>
                <span
                  class="absolute top-4 right-4 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-has-[:checked]:border-transparent group-has-[:checked]:bg-white"
                  aria-hidden="true"
                >
                  <Check class="w-3 h-3 text-black opacity-0 scale-50 transition-all group-has-[:checked]:opacity-100 group-has-[:checked]:scale-100" />
                </span>
                <span
                  class="gradient-ring pointer-events-none absolute -inset-px rounded-2xl p-[1.5px] bg-brand-gradient opacity-0 transition-opacity duration-300 group-has-[:checked]:opacity-100"
                  aria-hidden="true"
                />
              </label>
            </div>
            <p v-if="errors.services" id="contact-services-error" class="mt-2 pl-1 text-sm text-brand-pink">
              {{ errors.services }}
            </p>

            <TransitionGroup
              tag="div"
              class="space-y-4 mt-4"
              enter-active-class="transition duration-500 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              leave-active-class="transition duration-200 ease-in"
              leave-to-class="opacity-0"
            >
              <fieldset
                v-for="service in selectedServices"
                :key="service.id"
                class="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 sm:p-6 space-y-6"
              >
                <legend class="sr-only">{{ service.label }} details</legend>
                <p class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-orange" aria-hidden="true">
                  <component :is="serviceIcons[service.id]" class="w-3.5 h-3.5" />
                  {{ service.label }}
                </p>
                <div v-for="question in service.questions" :key="question.id">
                  <template v-if="question.type === 'date'">
                    <FloatingField
                      :id="`q-${question.id}`"
                      v-model="form.details[question.id]"
                      class="max-w-xs"
                      type="date"
                      :label="question.label"
                      :min="today"
                      float-always
                    />
                  </template>
                  <template v-else>
                    <p :id="`q-${question.id}`" class="text-sm text-gray-300 mb-3">
                      {{ question.label }}
                      <span v-if="question.type === 'multi'" class="text-gray-600">· pick any</span>
                    </p>
                    <div class="flex flex-wrap gap-2" role="group" :aria-labelledby="`q-${question.id}`">
                      <label v-for="option in question.options" :key="option" :class="chipClass">
                        <input
                          v-if="question.type === 'multi'"
                          v-model="form.details[question.id]"
                          type="checkbox"
                          :value="option"
                          class="sr-only"
                        />
                        <input
                          v-else
                          v-model="form.details[question.id]"
                          type="radio"
                          :name="question.id"
                          :value="option"
                          class="sr-only"
                        />
                        <Check :class="chipCheckClass" />
                        {{ option }}
                      </label>
                    </div>
                  </template>
                </div>
              </fieldset>
            </TransitionGroup>
          </div>

          <!-- 3. Budget & timeline -->
          <div v-else-if="step.number === 3" class="space-y-8">
            <div>
              <p id="contact-budget" class="text-sm text-gray-300">Estimated budget <span class="text-gray-600">(USD)</span></p>
              <p class="text-xs text-gray-600 mt-1 mb-3">For Design as a Service, think per month.</p>
              <div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="contact-budget">
                <label v-for="option in budgets" :key="option" :class="chipClass">
                  <input v-model="form.budget" type="radio" name="budget" :value="option" class="sr-only" />
                  <Check :class="chipCheckClass" />
                  {{ option }}
                </label>
              </div>
            </div>
            <div>
              <p id="contact-timeline" class="text-sm text-gray-300 mb-3">When would you like to start?</p>
              <div class="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="contact-timeline">
                <label v-for="option in timelines" :key="option" :class="chipClass">
                  <input v-model="form.timeline" type="radio" name="timeline" :value="option" class="sr-only" />
                  <Check :class="chipCheckClass" />
                  {{ option }}
                </label>
              </div>
            </div>
            <button
              v-if="unlocked === 3"
              type="button"
              class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors py-2"
              @click="unlock(4)"
            >
              Not sure yet, skip
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- 4. Project details -->
          <div v-else-if="step.number === 4" class="space-y-6">
            <FloatingField
              id="contact-message"
              v-model="form.message"
              multiline
              name="message"
              label="Tell us about the project"
              required
              :maxlength="limits.message"
              :error="errors.message"
              :valid="form.message.trim().length >= limits.messageMin"
              @update:model-value="clearError('message')"
            >
              <template #suffix>
                <span class="pointer-events-none absolute left-5 right-5 bottom-3 flex justify-between gap-4 text-xs text-gray-600">
                  <span class="truncate">{{ messageHint }}</span>
                  <span class="tabular-nums shrink-0">{{ form.message.length }} / {{ limits.message }}</span>
                </span>
              </template>
            </FloatingField>

            <div class="relative max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 focus-within:border-white/40 transition-colors">
              <label for="contact-source" class="pointer-events-none absolute left-5 top-2.5 text-xs text-gray-400">
                How did you hear about us?
              </label>
              <select
                id="contact-source"
                v-model="form.source"
                name="source"
                class="block w-full h-16 appearance-none rounded-2xl bg-transparent px-5 pt-6 pb-1.5 pr-12 text-base text-white focus:outline-none [color-scheme:dark]"
                :class="form.source ? '' : 'text-gray-500'"
              >
                <option value="" class="bg-zinc-900">Select an option</option>
                <option v-for="option in sources" :key="option" :value="option" class="bg-zinc-900 text-white">
                  {{ option }}
                </option>
              </select>
              <ChevronDown class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center gap-5 pt-4">
              <button
                v-magnetic
                type="submit"
                :disabled="status === 'sending'"
                class="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-gradient text-white font-bold px-9 py-5 text-sm uppercase tracking-widest shadow-lg shadow-brand-magenta/25 hover:shadow-brand-magenta/40 transition-shadow disabled:opacity-60 disabled:cursor-wait"
              >
                <template v-if="status === 'sending'">
                  <LoaderCircle class="w-5 h-5 animate-spin" />
                  Sending…
                </template>
                <template v-else>
                  Send inquiry
                  <Send class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </template>
              </button>
              <p class="text-xs text-gray-500 max-w-xs">
                We reply within one business day. Your details are only used to respond to this inquiry.
              </p>
            </div>

            <p
              v-if="serverError"
              role="alert"
              class="rounded-2xl border border-brand-pink/40 bg-brand-pink/10 px-5 py-4 text-sm text-pink-100"
            >
              {{ serverError }}
            </p>
          </div>
        </FormStep>
      </TransitionGroup>

      <!-- Lets Enter advance through earlier steps (forms only submit on Enter when a submit button exists) -->
      <button v-if="unlocked < 4" type="submit" class="sr-only" tabindex="-1">Continue</button>
    </form>
  </div>
</template>

<script>
import {
  ArrowRight,
  ChartColumn,
  Check,
  ChevronDown,
  CodeXml,
  LoaderCircle,
  Palette,
  Presentation,
  RefreshCw,
  Send
} from 'lucide-vue-next'
import { BUDGETS, LIMITS, SERVICES, SOURCES, TIMELINES, validateInquiry } from '#shared/contact'

const STEP_FIELDS = {
  1: ['name', 'email', 'phone', 'company', 'website'],
  2: ['services'],
  3: [],
  4: ['message']
}

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  company: '',
  website: '',
  services: [],
  details: {},
  budget: '',
  timeline: '',
  source: '',
  message: '',
  company_url: ''
})

export default {
  name: 'ContactForm',

  components: { ArrowRight, Check, ChevronDown, LoaderCircle, Send },

  props: {
    contactEmail: {
      type: String,
      default: 'hello@morphe.co.ke'
    }
  },

  data() {
    return {
      form: emptyForm(),
      errors: {},
      touched: {},
      unlocked: 1, // highest step revealed; steps never re-hide once shown
      status: 'idle', // idle | sending | sent
      serverError: '',
      sentTo: '',
      startedAt: 0,
      services: SERVICES,
      serviceIcons: {
        branding: Palette,
        development: CodeXml,
        daas: RefreshCw,
        events: Presentation,
        martech: ChartColumn
      },
      budgets: BUDGETS,
      timelines: TIMELINES,
      sources: SOURCES,
      limits: LIMITS,
      steps: [
        { number: 1, title: 'About you', hint: 'So we know who to get back to.' },
        { number: 2, title: 'What can we help with?', hint: 'Pick everything that applies.' },
        { number: 3, title: 'Budget & timeline', hint: 'A rough idea helps us shape the right proposal.' },
        { number: 4, title: 'Project details', hint: 'Goals, audience, anything you already have.' }
      ],
      personalFields: [
        { id: 'name', label: 'Full name', type: 'text', autocomplete: 'name', max: LIMITS.name, required: true },
        { id: 'email', label: 'Email address', type: 'email', autocomplete: 'email', inputmode: 'email', max: LIMITS.email, required: true },
        { id: 'phone', label: 'Phone / WhatsApp', type: 'tel', autocomplete: 'tel', inputmode: 'tel', max: LIMITS.phone },
        { id: 'company', label: 'Company / organisation', type: 'text', autocomplete: 'organization', max: LIMITS.company },
        { id: 'website', label: 'Current website (optional)', type: 'text', autocomplete: 'url', inputmode: 'url', max: LIMITS.website, wide: true }
      ],
      chipClass:
        'group/chip inline-flex items-center cursor-pointer select-none rounded-full border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 transition-all duration-200 hover:border-white/40 hover:text-white has-[:checked]:bg-white has-[:checked]:text-black has-[:checked]:border-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange',
      chipCheckClass:
        'w-0 h-3.5 shrink-0 opacity-0 transition-all duration-200 group-has-[:checked]/chip:w-3.5 group-has-[:checked]/chip:mr-1.5 group-has-[:checked]/chip:opacity-100'
    }
  },

  computed: {
    // Field-level validity from the shared rules (null = no errors)
    liveErrors() {
      return validateInquiry(this.form).errors || {}
    },

    stepComplete() {
      const ok = (n) => STEP_FIELDS[n].every((f) => !this.liveErrors[f])
      return {
        1: ok(1),
        2: ok(2),
        3: !!(this.form.budget && this.form.timeline),
        4: ok(4)
      }
    },

    // Unlocked steps in full, plus a locked preview of the next one
    visibleSteps() {
      const lastShown = Math.min(this.unlocked + 1, this.steps.length)
      return this.steps.slice(0, lastShown).map((step) => {
        const locked = step.number > this.unlocked
        return {
          ...step,
          state: locked ? 'locked' : this.stepComplete[step.number] ? 'done' : 'active',
          last: step.number === lastShown
        }
      })
    },

    selectedServices() {
      return this.services.filter((s) => this.form.services.includes(s.id))
    },

    firstName() {
      return this.form.name.split(/\s+/)[0] || 'there'
    },

    today() {
      return new Date().toISOString().slice(0, 10)
    },

    messageHint() {
      const ids = this.form.services
      if (ids.includes('daas')) return 'e.g. the design work you need each month and who is on your team'
      if (ids.includes('events')) return 'e.g. audience, venue and what success looks like'
      if (ids.includes('development')) return 'e.g. what it should do, who it is for, what exists today'
      return 'e.g. goals, audience and what you already have in place'
    }
  },

  watch: {
    'stepComplete.1'(done) {
      if (done) this.unlock(2)
    },
    'stepComplete.2'(done) {
      if (done) this.unlock(3)
    },
    'stepComplete.3'(done) {
      if (done) this.unlock(4)
    },

    // Multi-select questions need an array to bind checkboxes to
    selectedServices: {
      immediate: true,
      handler(services) {
        services.forEach((service) =>
          service.questions.forEach((q) => {
            if (q.type === 'multi' && !Array.isArray(this.form.details[q.id])) {
              this.form.details[q.id] = []
            }
          })
        )
      }
    }
  },

  mounted() {
    this.startedAt = Date.now()
  },

  methods: {
    unlock(step) {
      if (step <= this.unlocked) return
      this.unlocked = step
      // Steps revealed by a click (not while typing) are scrolled into view if off-screen
      if (step >= 3) {
        this.$nextTick(() => {
          const el = this.$refs[`step${step}`]?.[0]?.$el
          if (!el) return
          const { top } = el.getBoundingClientRect()
          if (top > window.innerHeight - 160) {
            const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' })
          }
        })
      }
    },

    touch(field) {
      this.touched = { ...this.touched, [field]: true }
      // Validate a field once the visitor leaves it, so errors don't appear mid-typing
      if (this.form[field] && this.liveErrors[field]) {
        this.errors = { ...this.errors, [field]: this.liveErrors[field] }
      }
    },

    isFieldValid(field) {
      return !!this.form[field] && !this.liveErrors[field]
    },

    clearError(field) {
      if (this.errors[field]) {
        const { [field]: _removed, ...rest } = this.errors
        this.errors = rest
      }
    },

    focusFirstError() {
      this.$nextTick(() => {
        const first = Object.keys(this.errors)[0]
        const el =
          first === 'services'
            ? this.$el.querySelector('input[type="checkbox"][value]')
            : this.$el.querySelector(`#contact-${first}`)
        el?.focus()
      })
    },

    async onSubmit() {
      this.serverError = ''

      // Enter pressed on an earlier step: validate that step and move on instead of submitting
      if (this.unlocked < 4) {
        const stepErrors = Object.fromEntries(
          STEP_FIELDS[this.unlocked].filter((f) => this.liveErrors[f]).map((f) => [f, this.liveErrors[f]])
        )
        this.errors = stepErrors
        if (Object.keys(stepErrors).length) this.focusFirstError()
        else this.unlock(this.unlocked + 1)
        return
      }

      const { errors } = validateInquiry(this.form)
      if (errors) {
        this.errors = errors
        this.focusFirstError()
        return
      }

      this.status = 'sending'
      try {
        await $fetch('/api/contact', {
          method: 'POST',
          body: { ...this.form, startedAt: this.startedAt }
        })
        this.sentTo = this.form.email
        this.status = 'sent'
      } catch (error) {
        this.status = 'idle'
        const fieldErrors = error?.data?.data?.errors
        if (fieldErrors) {
          this.errors = fieldErrors
          this.focusFirstError()
        }
        this.serverError =
          error?.data?.statusMessage ||
          `Something went wrong. Please try again or email ${this.contactEmail}.`
      }
    },

    reset() {
      this.form = emptyForm()
      this.errors = {}
      this.touched = {}
      this.unlocked = 1
      this.serverError = ''
      this.status = 'idle'
      this.startedAt = Date.now()
    }
  }
}
</script>
