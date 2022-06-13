<template>
  <div class="container">
    <p class="login-header">Login</p>
    <v-form>
        <v-text-field 
          v-model="username" 
          label="Username" 
        ></v-text-field>
        <v-text-field
            v-model="password"
            :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showpass ? 'text' : 'password'"
            label="Password"
            @click:append="showpass = !showpass"
          ></v-text-field>
        <v-btn
          block
          color="primary"
          :disabled="btnDisabled"
        >Log In</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'PollLogin',
  data() {
    return {
        username: "",
        password: "",
        showpass: false,
    }
  },
  computed: {
    btnDisabled() {
        return this.username === "" || this.password === "";
    }
  },
  methods: {
      login() {
          console.log("logging in...");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.login-header {
  color: black;
  font-size: 2em;
  font-weight: 400;
}

.container {
  h1, h2, h3 {
      color: black;
  }
  display: inline-block;
  font-family: 'Abel', sans-serif;
  border-radius: 0.2em;
  padding: 1em 1em;

  min-width: 25%;

  border: 1px solid rgb(214, 214, 214);
  // box-shadow: 3px 3px 8px 1px rgba(219,219,219,0.8);
}

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
