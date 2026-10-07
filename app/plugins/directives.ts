// v-reveal: fades an element in when it scrolls into view
// v-magnetic: element is pulled toward the pointer while hovered
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  const getObserver = () => {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )
    }
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({ class: 'reveal' }),
    mounted(el: HTMLElement) {
      el.classList.add('reveal')
      getObserver().observe(el)
    },
    unmounted(el: HTMLElement) {
      observer?.unobserve(el)
    }
  })

  type MagneticEl = HTMLElement & {
    _magneticMove?: (e: MouseEvent) => void
    _magneticLeave?: () => void
  }

  nuxtApp.vueApp.directive('magnetic', {
    getSSRProps: () => ({ class: 'magnetic' }),
    mounted(el: MagneticEl) {
      el.classList.add('magnetic')
      el._magneticMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
      }
      el._magneticLeave = () => {
        el.style.transform = 'translate(0px, 0px)'
      }
      el.addEventListener('mousemove', el._magneticMove)
      el.addEventListener('mouseleave', el._magneticLeave)
    },
    unmounted(el: MagneticEl) {
      if (el._magneticMove) el.removeEventListener('mousemove', el._magneticMove)
      if (el._magneticLeave) el.removeEventListener('mouseleave', el._magneticLeave)
    }
  })
})
