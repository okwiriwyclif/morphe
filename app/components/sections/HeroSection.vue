<template>
  <section class="min-h-screen flex flex-col justify-center px-6 relative pt-20">
    <div class="gradient-blur w-96 h-96 bg-indigo-600 top-20 -left-20" />
    <div class="gradient-blur w-[500px] h-[500px] bg-purple-900 bottom-0 -right-40" />

    <div class="max-w-7xl mx-auto w-full">
      <p
        v-reveal
        class="text-indigo-400 font-medium tracking-[0.3em] uppercase text-xs mb-8"
      >
        Design-Led Technology Studio
      </p>
      <h1
        v-reveal
        class="text-[12vw] md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-12"
      >
        SHAPING <br />
        <span class="italic font-light opacity-50">DIGITAL</span> <br />
        FLUIDITY.
      </h1>

      <div v-reveal class="flex flex-col md:flex-row justify-between items-end gap-12">
        <p class="max-w-md text-gray-400 text-lg leading-relaxed">
          Morphe Creatives is a boutique agency at the intersection of high-end
          design and software engineering. We build martech solutions that feel
          human.
        </p>
        <div class="flex gap-4">
          <a
            href="#work"
            aria-label="Scroll to selected work"
            class="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all group"
          >
            <ArrowDown class="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ArrowDown } from 'lucide-vue-next'

export default {
  name: 'HeroSection',

  components: { ArrowDown }
}
</script>
