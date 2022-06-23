<template>
  <div class="login">
    <PollLogin/>
  </div>
</template>

<script>
// @ is an alias to /src
import PollLogin from '@/components/PollLogin.vue'

export default {
  name: 'LoginView',
  components: {
    PollLogin
  },
  created() {
  }
}
</script>
