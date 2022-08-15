<template>
  <!-- <div class="container"> -->
    <v-card class="card">
      <p class="login-header">Login</p>
      <v-form>
        <v-text-field 
          :value="login.username"
          @input="login.username = $event"
          label="Username" 
          :error="errorMsg != ''"
          @keydown="errorMsg = ''"
        ></v-text-field>
        <v-text-field
          v-model="login.password"
          :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showpass ? 'text' : 'password'"
          label="Password"
          @click:append="showpass = !showpass"
          :error="errorMsg != ''"
          @keydown="errorMsg = ''"
        ></v-text-field>
        <v-alert
          dense
          type="error"
          class="login-error"
          v-show="errorMsg != ''"
        >
          {{ errorMsg }}
        </v-alert>
        <v-row>
          <v-spacer></v-spacer>
          <v-col
                  cols="12"
                  sm="6"
                  md="5"
                >
          <v-btn
            block
            :disabled="btnDisabled"
            :loading="loggingIn"
            @click="loginUser"
            color="purple"
            class="login-btn"
          >Log In</v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-form>
    </v-card>
  <!-- </div> -->
</template>

<script>
import { bus } from '@/main';

export default {
  name: 'PollLogin',
  data() {
    return {
      login: {
        username: "",
        password: "",
      },
      showpass: false,
      loggingIn: false,

      errorMsg: ""
    }
  },
  computed: {
    btnDisabled() {
        return this.login.username === "" || this.login.password === "";
    }
  },
  methods: {
    updateUsername(evt) {
      console.log(evt);
      this.login.username = evt
    },
    loginUser() {
        console.log("logging in...");
        this.loggingIn = true;
        console.log(process.env)
        return this.$http.post(`https://${process.env.VUE_APP_API_URL}/user/login`, {
          username: this.login.username,
          password: this.login.password
        }).then(res => {
          this.loggingIn = false;
          console.log(res);
          let token = res.data.token;
          if(token) {
            // save jsonwebtoken in local storage for auth
            bus.$emit('new-token', token)
            bus.$emit('logged-in');
            console.log("User Authenticated");
          }
        }).catch(e => {
          console.log(e);
          this.loggingIn = false;

          if(e.response.status == 401)
            this.errorMsg = "Invalid login information"
          else
            this.errorMsg = "Something went wrong :("
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

input[type="text"] {
  border: 1px solid black;
}

.login-header {
  color: black;
  font-size: 2em;
  font-weight: 400;
}

.card {
  padding: 1rem;
}

.login-btn {
  color: white;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

// .container {
//   h1, h2, h3 {
//       color: black;
//   }
//   display: inline-block;
//   font-family: 'Abel', sans-serif;
//   border-radius: 0.2em;
//   padding: 1em 1em;

//   min-width: 25%;

//   border: 1px solid rgb(214, 214, 214);
//   // box-shadow: 3px 3px 8px 1px rgba(219,219,219,0.8);
// }

v-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// button {
//     width: 100%;
//     background-color: rgb(30, 58, 151);
//     color: white;
//     padding: 0.7em;
//     border: none;
//     font-size: 1em;

//     &:disabled {
//         background-color: rgb(156, 156, 156);
//     }
// }
</style>
