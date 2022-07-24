
<template>
  <v-app>
  <div id="app">
    <nav>
      <v-app-bar>
        <v-spacer></v-spacer>
        <v-toolbar-title class="toolbar-text" v-if="this.userInfo != null && this.userInfo.displayName != null">Hi, {{ this.userInfo.displayName }}!</v-toolbar-title>
        <v-btn v-if="this.token == null && this.$route.name != 'login'" class="primary"><router-link to="/login">Login</router-link></v-btn>
        <v-menu offset-y v-if="this.token != null">
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <v-avatar
                size="48"
                color="white"
              >
                <img v-if="avatarUrl != ''" :src="avatarUrl"/>
                <v-icon
                  v-else
                >
                    mdi-file-document-alert
                </v-icon>
              </v-avatar>
            </div>
          </template>
          <v-list class="py-0">
            <v-list-item class="px-6"><router-link class="router-link" to="/profile">Profile</router-link></v-list-item>
            <v-list-item class="px-6" @click="loginModal = true">Logout</v-list-item>
          </v-list>
        </v-menu>
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
    <!-- <p>Logged In: {{ this.token != null }}</p>
    <p>Show login btn: {{ this.showLoginBtn }}</p> -->
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
      displayName: null,
      userInfo: null,
      avatarUrl: "",
      showMenu: false
    }
  },
  methods: {
    logout() {
      // wipe JWT, redirect to login
      this.token = null;
      localStorage.removeItem("jwt");
      this.userInfo = null;
      this.avatarUrl = null;
      this.$router.push("/login");
    },
    async getUserInfo() {
      console.log("refreshing user info...")
      return this.$http.get("http://localhost:3030/user/me", {
          headers: { Authorization: `Bearer ${this.token}` }
        }).then(res => {
          console.log(res.data);
          this.userInfo = res.data;
        }).catch(e => {
          console.log(e);
        }).finally(() => {
          this.loggingIn = false;
        });
    },
    async fetchAvatar() {
      const res = await this.$http.get(`http://localhost:3030/user/avatar?username=${this.userInfo.name}`);
      console.log(res);
      console.log("Updating url")
      this.avatarUrl = res.data;
    },
  },
  computed: {
    showLoginBtn() {
      return this.token == null
    },
  },
  watch: {
    token(newToken) {
      localStorage.setItem("jwt", newToken);
      if(newToken == null) localStorage.removeItem("jwt");
    },
    displayName(name) {
      localStorage.setItem("displayName", name);
      if(name == null) localStorage.removeItem("displayName");
    },
    userInfo(newInfo) {
      localStorage.setItem("userInfo", JSON.stringify(newInfo));
      if(newInfo == null) localStorage.removeItem("userInfo");
    }
  },
  created() {
    this.$vuetify.theme.light = true 
    // receive JWT from PollLogin event
    bus.$on('new-token', async (newToken) => {
      this.token = newToken;
      localStorage.setItem("jwt", newToken);
      await this.getUserInfo();
      this.fetchAvatar();
    });

    bus.$on('logged-in', () => {
      this.$router.push("/");
    });

    bus.$on('user-updated', async () => {
      await this.getUserInfo();
      console.log("user updated avatar!")
      this.fetchAvatar();
    });

    const localToken = localStorage.getItem("jwt");
    if(localToken == "null" || localToken == null) {
      this.token = null;
    } else {
      this.token = localToken;
    }

    const localUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(this.userInfo == null) this.userInfo = localUserInfo;

    if(this.userInfo != null) this.fetchAvatar();
  },
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

.router-link {
  text-decoration: none;
  color: black !important;
}
</style>
