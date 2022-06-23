
<template>
  <v-app>
  <div id="app">
    <nav>
      <v-app-bar>
        <v-spacer></v-spacer>
        <v-toolbar-title class="toolbar-text" v-if="this.displayName != ''">Hi, {{ this.displayName }}!</v-toolbar-title>
        <v-btn v-if="this.token == null && this.$route.name != 'login'"><router-link to="/login">Login</router-link></v-btn>
        <v-btn v-if="this.token != null" @click="loginModal = true">Logout</v-btn>
        <v-dialog
          v-model="loginModal"
          :v-if="this.token != null"
          width="300"
        >
          <v-card class="modal-card">
            <p>Are you sure you want to logout?</p>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="loginModal = false"
              >Cancel</v-btn>
              <v-btn
                text
                @click="loginModal = false; logout();"
              >Logout</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>
    </nav>
    <p>Logged In: {{ this.token != null }}</p>
    <p>Show login btn: {{ this.showLoginBtn }}</p>
    <router-view/>
  </div>
  </v-app>
</template>

<script>
import { bus } from './main'

export default {
  data() {
    return {
      token: null,
      loginModal: false,
      displayName: ""
    }
  },
  methods: {
    logout() {
      // wipe JWT, redirect to login
      this.token = null;
      localStorage.removeItem("jwt");
      this.displayName = '';
      localStorage.removeItem("displayName");
      this.$router.push("/login");
    },
    async getDisplayName() {
      return this.$http.get("http://localhost:3030/user/me", {
          headers: { Authorization: `Bearer ${this.token}` }
        }).then(res => {
          console.log(res.data);
          let displayName = res.data.displayName;
          if(displayName) this.displayName = displayName;
        }).catch(e => {
          console.log(e);
          this.loggingIn = false;
        });
    }
  },
  computed: {
    showLoginBtn() {
      return this.token == null
    },
  },
  watch: {
    token(newToken) {
      localStorage.setItem("jwt", newToken);
    },
    displayName(name) {
      localStorage.setItem("displayName", name);
    }
  },
  created() {
    // receive JWT from PollLogin event
    bus.$on('logged-in', (newToken) => {
      this.token = newToken;
      localStorage.setItem("jwt", newToken);
      this.getDisplayName();
      this.$router.push("/");
    });
    // console.log(localStorage.getItem("jwt"))
    // console.log(localStorage.getItem("jwt") == "null")
    if(localStorage.getItem("jwt") == "null" || localStorage.getItem("jwt") == null) {
      this.token = null;
    } else {
      this.token = localStorage.getItem("jwt");
    }

    console.log(localStorage.getItem("displayName"))
    if(localStorage.getItem("displayName") == "null" || localStorage.getItem("displayName") == null) {
      this.displayName = "";
    } else {
      this.displayName = localStorage.getItem("displayName");
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding-bottom: 30px;
}

.modal-card {
  padding: 1em;
  p {
    font-size: 1.1em;
  }
}

.toolbar-text {
  margin: auto 1em;
}
</style>
