<template>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        sm="6"
        md="6"
        lg="5"
      >
        <v-card class="pa-2">
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <h2>Reset your password</h2>
                <h4 class="mt-2">Enter the email associated with your account to receive a reset link</h4>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-col 
                class="py-0" 
                cols="12"
                md="10"
                lg="8"
              >
              <v-form v-model="isFormValid">
                <v-text-field 
                  v-model="email"
                  label="Email"
                  :rules="[emailRules]"
                ></v-text-field>
              </v-form>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-col
                cols="12"
                sm="6"
                md="5"
                v-if="!emailSent"
              >
                <v-btn
                  block
                  :disabled="!enableBtn"
                  :loading="submitting"
                  @click="submitReset"
                  color="purple"
                  style="color: white !important;"
                >Send Email</v-btn>
              </v-col>
              <v-col cols="12" v-else>
                <v-alert
                  dense
                  text
                  type="success"
                >
                  Email sent!
                </v-alert>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row v-if="errorMsg != ''">
              <v-col cols="12">
                <v-alert
                  dense
                  text
                  type="error"
                >
                  {{ errorMsg }}
                </v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      errorMsg: '',
      email: '',
      emailRules: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || value == "" || 'Invalid e-mail.'
      },

      submitting: false,
      emailSent: false,
      isFormValid: false
    }
  },
  methods: {
    submitReset() {
      const body = {
        email: this.email
      }

      this.submitting = true;
      this.errorMsg = ""

      return this.$http.post(`${process.env.VUE_APP_API_URL}/password-reset`, body, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(() => {
        this.emailSent = true;
      }).catch((e) => {
        if(e.response.data == "No user found with specified email") this.errorMsg = "No account is associated with this email"
        else this.errorMsg = "Something went wrong :(";
      }).finally(() => {
        this.submitting = false;
      });
    },
  },
  computed: {
    enableBtn() {
      return this.isFormValid && this.email != "";
    }
  }
}
</script>

<style>

</style>