<template>
  <div class="relative overflow-hidden rounded-3xl bg-zinc-900 glass" :class="aspectClass">
    <!-- Adaptive backdrop: blurred, enlarged copy of the image itself -->
    <img
      :src="src"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl saturate-150 opacity-70"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-black/30" />

    <!-- Full design, never cropped -->
    <div class="absolute inset-0 flex items-center justify-center" :class="paddingClass">
      <img
        :src="src"
        :alt="alt"
        class="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 transition-transform duration-700 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectThumbnail',

  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    aspectClass: {
      type: String,
      default: 'aspect-[16/10]'
    },
    paddingClass: {
      type: String,
      default: 'p-6 md:p-10'
    }
  }
}
</script>
