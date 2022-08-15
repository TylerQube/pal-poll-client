<template>
  <div class="login">
    <v-container>
        <v-row>
            <v-spacer></v-spacer>
            <v-col
                cols="12"
                sm="6"
                md="5"
                lg="5"
            >
                <PollLogin/>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
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
