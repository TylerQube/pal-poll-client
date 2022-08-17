<template>
  <div>
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
                  <h4 class="ma-0" style="color: gray;">(Please don't use like your bank password, I built all the security myself)</h4>
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
                  <v-text-field 
                    v-model="newPassword"
                    label="New Password" 
                    :rules="minRules"

                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showpass ? 'text' : 'password'"
                    @click:append="showpass = !showpass"
                  ></v-text-field>
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
                  <v-text-field 
                    v-model="confirmPassword"
                    label="Confirm Password" 

                    :append-icon="showconfirm ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showconfirm ? 'text' : 'password'"
                    @click:append="showconfirm = !showconfirm"
                  ></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <v-col
                  cols="12"
                  sm="6"
                  md="5"
                  v-if="!reset"
                >
                  <v-btn
                    block
                    :disabled="!passwordReady"
                    :loading="submitting"
                    @click="submitPassword"
                    color="purple"
                    class="submit-btn"
                  >Reset</v-btn>
                </v-col>
                <v-col cols="12" v-else>
                  <v-alert
                    dense
                    text
                    type="success"
                  >
                    Password Reset!
                  </v-alert>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-row v-if="error">
                <v-col cols="12">
                  <v-alert
                    dense
                    text
                    type="error"
                  >
                    Something went wrong :(
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
            <v-form>
              
            </v-form>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    
    <div class="error-container">

    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordReset',
  data() {
    return {
        minRules: [v => v.length >= 8 || 'Min 8 characters'],

        newPassword: '',
        showpass: false,

        confirmPassword: '',
        showconfirm: false,

        submitting: false,

        reset: false,
        error: false
    }
  },
  computed: {
    passwordReady() {
      return this.newPassword.length >= 8 && this.newPassword == this.confirmPassword
    }
  },
  methods: {
    async submitPassword() {
      this.submitting = true;
      this.error = false;

      const body = {
        token: this.$route.params.token,
        newPassword: this.newPassword
      }

      console.log(body)

      return this.$http.post(`${process.env.VUE_APP_API_URL}/password-reset/submit`, body)
        .then(res => { 
          console.log(res);
          if(res.status == 200) this.reset = true;
        }).catch(e => {
          console.log(e);
          this.error = true;
        }).finally(() => {
          this.submitting = false;
        });
    }
  }
}
</script>

<style lng="scss" scoped>
  .submit-btn {
    color: white !important;
  }
</style>