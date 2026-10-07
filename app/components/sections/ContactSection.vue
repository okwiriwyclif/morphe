<template>
  <section id="contact" class="py-32 px-6">
    <div
      class="max-w-7xl mx-auto glass rounded-[4rem] p-12 md:p-24 relative overflow-hidden"
    >
      <div class="gradient-blur w-80 h-80 bg-brand-magenta -top-20 -right-20" />

      <div class="grid md:grid-cols-2 gap-16 relative z-10">
        <div v-reveal>
          <h2 class="text-5xl md:text-7xl font-bold tracking-tighter mb-8 italic">
            Let's <br />Morph.
          </h2>
          <p class="text-gray-400 text-xl mb-12">
            Whether you need a full digital product or a continuous design
            subscription, we're ready.
          </p>
          <div class="space-y-4">
            <a
              :href="`mailto:${email}`"
              class="block text-2xl font-bold hover:text-brand-pink transition-colors"
            >
              {{ email }}
            </a>
            <p class="text-gray-500 uppercase tracking-widest text-xs">
              {{ locations.join(' / ') }}
            </p>
          </div>
        </div>

        <div v-reveal>
          <form v-if="!submitted" class="space-y-6" @submit.prevent="onSubmit">
            <div class="group">
              <input
                v-model.trim="form.name"
                type="text"
                placeholder="Name"
                aria-label="Name"
                :class="fieldClass"
                required
              />
            </div>
            <div class="group">
              <input
                v-model.trim="form.email"
                type="email"
                placeholder="Email"
                aria-label="Email"
                :class="fieldClass"
                required
              />
            </div>
            <div class="group">
              <textarea
                v-model.trim="form.message"
                placeholder="Tell us about your project or DaaS inquiry"
                aria-label="Message"
                rows="3"
                :class="[fieldClass, 'resize-none']"
                required
              />
            </div>
            <button
              v-magnetic
              type="submit"
              aria-label="Send message"
              class="w-20 h-20 rounded-full bg-brand-gradient text-white font-bold flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Send />
            </button>
          </form>

          <div v-else class="text-center py-20">
            <h3 class="text-3xl font-bold text-brand-gradient mb-2">Message Received</h3>
            <p class="text-gray-500">We'll get back to you shortly.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Send } from 'lucide-vue-next'

export default {
  name: 'ContactSection',

  components: { Send },

  data() {
    return {
      email: 'hello@morphe.co.ke',
      locations: ['Nairobi Kenya', 'Atlanta Georgia', 'Remote'],
      submitted: false,
      form: {
        name: '',
        email: '',
        message: ''
      },
      fieldClass:
        'w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-white transition-colors text-xl placeholder:text-gray-500'
    }
  },

  methods: {
    onSubmit() {
      // TODO: send this.form to an API endpoint
      this.submitted = true
    }
  }
}
</script>
