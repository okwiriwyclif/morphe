<template>
  <section class="min-h-[100svh] flex flex-col justify-center px-6 relative pt-28 md:pt-40 pb-12 md:pb-20">
    <div class="gradient-blur w-96 h-96 bg-brand-orange top-20 -left-20" />
    <div class="gradient-blur w-[500px] h-[500px] bg-brand-deep bottom-0 -right-40" />

    <div class="max-w-7xl mx-auto w-full">
      <p
        v-reveal
        class="text-brand-orange font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 md:mb-8"
      >
        Design-Led Technology Studio
      </p>
      <h1
        v-reveal
        class="text-[15vw] sm:text-[12vw] md:text-[8vw] font-bold leading-[0.9] tracking-tighter mb-8 md:mb-12"
      >
        SHAPING <br />
        <span class="italic font-light text-brand-gradient pr-[0.08em]">DIGITAL</span> <br />
        FLUIDITY.
      </h1>

      <div v-reveal class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
        <p class="max-w-md text-gray-400 text-base sm:text-lg leading-relaxed">
          Morphe Creatives is a boutique agency at the intersection of high-end
          design and software engineering. We build martech solutions that feel
          human.
        </p>
        <div class="flex gap-4">
          <a
            href="#work"
            aria-label="Scroll to selected work"
            class="hidden md:flex w-16 h-16 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all group"
          >
            <ArrowDown class="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>

      <ProjectShowreel v-reveal class="mt-12 md:mt-20 -mx-2 sm:mx-0" />
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
