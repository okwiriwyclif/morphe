<template>
  <section id="ethos" class="py-32 px-6">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
      <div v-reveal class="relative">
        <div class="aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden glass p-1">
          <div
            class="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[22px] flex items-center justify-center p-12"
          >
            <div class="space-y-4 w-full">
              <div class="h-1 w-2/3 bg-white/20 rounded" />
              <div class="h-1 w-full bg-white/40 rounded" />
              <div class="h-1 w-1/2 bg-white/10 rounded" />
              <div class="pt-8 grid grid-cols-2 gap-4">
                <div
                  class="aspect-square bg-indigo-500/20 rounded-xl border border-indigo-500/30"
                />
                <div class="aspect-square bg-white/5 rounded-xl border border-white/10" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute -bottom-10 -right-10 glass p-8 rounded-2xl max-w-xs hidden md:block"
        >
          <p class="text-sm italic text-gray-400">"{{ quote }}"</p>
        </div>
      </div>

      <div v-reveal>
        <h2 class="text-5xl font-bold mb-10 tracking-tight">
          Software Led <br />By Design.
        </h2>
        <div class="space-y-8 text-gray-400 text-lg">
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
      quote: 'Technology is the skeleton, design is the soul.',
      stats: [
        { value: '12+', label: 'Industries' },
        { value: '50+', label: 'Solutions' }
      ]
    }
  }
}
</script>
