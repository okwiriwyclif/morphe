<template>
  <section id="contact" class="py-20 md:py-32 px-4 sm:px-6">
    <div
      class="max-w-7xl mx-auto glass rounded-[2rem] md:rounded-[4rem] px-6 py-12 sm:p-12 lg:p-20 relative overflow-clip"
    >
      <div class="gradient-blur w-80 h-80 bg-brand-magenta -top-20 -right-20" />
      <div class="gradient-blur w-96 h-96 bg-brand-orange -bottom-40 -left-40 opacity-20" />

      <div class="grid lg:grid-cols-5 gap-12 lg:gap-16 relative z-10">
        <aside v-reveal class="lg:col-span-2 lg:sticky lg:top-28 self-start">
          <h2 class="text-5xl md:text-7xl font-bold tracking-tighter mb-6 md:mb-8 italic">
            Let's <br />Morph.
          </h2>
          <p class="text-gray-400 text-lg md:text-xl mb-10">
            Whether you need a full digital product, an event that people remember, or a
            continuous design subscription, tell us where you're headed.
          </p>

          <ol class="space-y-6 mb-12">
            <li v-for="(step, index) in steps" :key="step.title" class="flex gap-4">
              <span
                class="w-8 h-8 shrink-0 rounded-full border border-white/15 flex items-center justify-center text-xs font-bold text-brand-orange"
              >
                {{ index + 1 }}
              </span>
              <div>
                <p class="font-semibold">{{ step.title }}</p>
                <p class="text-sm text-gray-500">{{ step.text }}</p>
              </div>
            </li>
          </ol>

          <div class="space-y-3">
            <a
              :href="`mailto:${email}`"
              class="block text-xl sm:text-2xl font-bold break-words hover:text-brand-pink transition-colors"
            >
              {{ email }}
            </a>
            <p class="text-gray-500 uppercase tracking-widest text-xs">
              {{ locations.join(' / ') }}
            </p>
          </div>
        </aside>

        <div v-reveal class="lg:col-span-3">
          <ContactForm :contact-email="email" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ContactSection',

  data() {
    return {
      email: 'hello@morphe.co.ke',
      locations: ['Nairobi Kenya', 'Atlanta Georgia', 'Remote'],
      steps: [
        { title: 'We reply within a day', text: 'A real person reads every inquiry.' },
        { title: 'Discovery call', text: '30 minutes to understand your goals and constraints.' },
        { title: 'Proposal', text: 'Scope, timeline and a clear quote, usually within a week.' }
      ]
    }
  }
}
</script>
