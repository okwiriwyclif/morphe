<template>
  <div>
    <CustomCursor />
    <AppNav />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout'
}
</script>
