<template>
  <section id="ethos" class="py-20 md:py-32 px-6">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 md:gap-16 lg:gap-24 items-center">
      <div v-reveal class="relative">
        <div class="aspect-[4/5] max-h-[70svh] md:max-h-none mx-auto bg-zinc-900 rounded-3xl overflow-hidden glass p-1">
          <img
            :src="image"
            alt="Inside the Morphe studio"
            class="w-full h-full object-cover rounded-[22px]"
          />
        </div>
        <div
          class="absolute -bottom-10 -right-6 lg:-right-10 glass p-8 rounded-2xl max-w-xs hidden md:block"
        >
          <p class="text-sm italic text-gray-400">"{{ quote }}"</p>
        </div>
      </div>

      <div v-reveal>
        <h2 class="text-4xl sm:text-5xl font-bold mb-8 md:mb-10 tracking-tight">
          Software Led <br />By Design.
        </h2>
        <div class="space-y-6 md:space-y-8 text-gray-400 text-base sm:text-lg">
          <p>
            We believe most technology fails because it lacks empathy. At Morphe,
            we reverse the engineering process. We start with the human
            experience and build the software to support it.
          </p>
          <p>
            Our Martech approach ensures your marketing tools aren't just
            functional—they are beautiful, intuitive, and seamlessly integrated
            into your brand's ecosystem.
          </p>
          <div class="pt-6 flex gap-12">
            <div v-for="stat in stats" :key="stat.label">
              <span class="block text-white text-3xl font-bold">{{ stat.value }}</span>
              <span class="text-xs uppercase tracking-widest">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'EthosSection',

  data() {
    return {
      image: '/images/animated/ethos-fluid.svg',
      quote: 'Technology is the skeleton, design is the soul.',
      stats: [
        { value: '12+', label: 'Industries' },
        { value: '50+', label: 'Solutions' }
      ]
    }
  }
}
</script>
