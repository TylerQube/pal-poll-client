<template>
  <div class="error-container">
    <h1 class="shadow">This link is invalid or has expired.</h1>
  </div>
</template>

<script>
export default {
  name: 'LinkExpired',
}
</script>

<style scoped>
  .error-container {
    width: 100%;
    height: calc(100vh - 60px);

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>