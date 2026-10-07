<template>
  <section id="capabilities" class="py-32 px-6 bg-[#080808]">
    <div class="max-w-7xl mx-auto">
      <div v-reveal class="mb-20">
        <h2 class="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
          OUR CAPABILITIES
        </h2>
        <p class="text-gray-500 tracking-widest uppercase text-xs">
          Versatile skills for a volatile market
        </p>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-1 px-1 bg-white/5 rounded-3xl overflow-hidden border border-white/5"
      >
        <CapabilityCard
          v-for="cap in topCapabilities"
          :key="cap.number"
          v-bind="cap"
        />

        <!-- Highlighted: Design as a Service -->
        <div
          class="md:col-span-12 bg-gradient-to-r from-brand-orange/10 via-brand-magenta/15 to-brand-deep/30 p-12 hover:from-brand-orange/20 hover:via-brand-magenta/25 hover:to-brand-deep/40 transition-all group relative overflow-hidden"
        >
          <img
            :src="daasImage"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity"
            loading="lazy"
          />
          <div class="absolute top-12 right-12 hidden lg:block opacity-20">
            <RefreshCw class="w-32 h-32 animate-spin-slow" />
          </div>
          <div class="relative z-10">
            <span
              class="bg-brand-gradient text-[10px] text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block"
            >
              Subscription Model
            </span>
            <h3 class="text-4xl md:text-5xl font-bold mb-6">Design as a Service</h3>
            <div class="grid md:grid-cols-3 gap-8 items-start">
              <p class="text-gray-300 text-lg leading-relaxed md:col-span-2">
                Scale your design output without the overhead of a full-time
                hire. One flat monthly fee. Unlimited design requests. Delivered
                with boutique precision and agency speed.
              </p>
              <ul class="space-y-2 text-sm text-gray-400">
                <li v-for="perk in daasPerks" :key="perk" class="flex items-center gap-2">
                  <Check class="w-4 h-4 text-brand-orange" />
                  {{ perk }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <CapabilityCard
          v-for="cap in bottomCapabilities"
          :key="cap.number"
          v-bind="cap"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { Check, RefreshCw } from 'lucide-vue-next'

export default {
  name: 'CapabilitiesSection',

  components: { Check, RefreshCw },

  data() {
    return {
      topCapabilities: [
        {
          number: '01',
          title: 'UI/UX & Branding',
          description:
            'Creating digital languages that speak clearly. From visual identity systems to complex product interfaces.',
          image: '/images/animated/capability-branding.svg',
          accentClass: 'text-brand-yellow'
        },
        {
          number: '02',
          title: 'Development',
          description:
            'Modern tech stacks built for speed and scale. We build the engine that drives your design-led vision.',
          image: '/images/animated/capability-development.svg',
          accentClass: 'text-brand-orange'
        }
      ],
      bottomCapabilities: [
        {
          number: '03',
          title: 'Hybrid Events',
          description:
            'Designing immersive physical and digital spaces where brand stories come to life in real-time.',
          image: '/images/animated/capability-events.svg',
          accentClass: 'text-brand-pink'
        },
        {
          number: '04',
          title: 'Martech Strategy',
          description:
            'Bespoke software automation and campaigns designed to convert data into meaningful customer experiences.',
          image: '/images/animated/capability-martech.svg',
          accentClass: 'text-brand-magenta'
        }
      ],
      daasImage: '/images/animated/capability-daas.svg',
      daasPerks: ['No hiring headaches', 'Unlimited revisions', 'Pause or cancel anytime']
    }
  }
}
</script>
