<template>
  <div class="profile">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="11" md="10" lg="6">
          <v-card
            class="profile-card"
          >
          <v-form v-model="infoValid">
            <v-container>
              <v-row>
                <h1>Profile</h1>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="profileInfo.displayName"
                    label="Display Name"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="profileInfo.email"
                    label="Email"
                    :rules="[rules.email]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="profileInfo.username"
                    label="Username"
                    filled
                    disabled
                    class="disabled-input"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <v-col
                  cols="12"
                  sm="auto"
                >
                  <v-btn
                  block
                  class="primary"
                  :disabled="!infoChanged || !infoValid"
                  :loading="sendingUpdate"
                  @click="updateInfo"
                  >Update Info</v-btn>  
                </v-col>
                
              </v-row>
            </v-container>
          </v-form>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    
  </div>
</template>

<script>
// @ is an alias to /src
import { bus } from '@/main';

export default {
  name: 'ProfileView',
  data() {
    return {
      origInfo: {
        displayName: "",
        email: "",
        username: ""
      },
      profileInfo: {
        displayName: "",
        email: "",
        username: ""
      },
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || value == "" || 'Invalid e-mail.'
        },
      },
      infoChanged: false,
      infoValid: false,
      sendingUpdate: false
    }
  },
  methods: {
    updateInfo() {
      if(!this.infoChanged) return;
      this.sendingUpdate = true;

      const token = localStorage.getItem("jwt");
      let config = {
        
      };
      if(this.origInfo.email != this.profileInfo.email) config.email = this.profileInfo.email;
      if(this.origInfo.displayName != this.profileInfo.displayName) config.displayName = this.profileInfo.displayName;

      return this.$http.post("http://localhost:3030/user/updateinfo", config, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          console.log(res);
          bus.$emit("new-token", res.data.token);
          this.refreshOrigInfo();
          this.checkInfoChange();
        }).catch(e => {
          console.log(e);
        }).finally(() => {
          this.sendingUpdate = false;
        });
    },
    refreshOrigInfo() {
      this.origInfo.displayName = this.profileInfo.displayName;
      this.origInfo.email = this.profileInfo.email;
      this.origInfo.username = this.profileInfo.username;
    },
    checkInfoChange() {
      this.infoChanged = 
          this.origInfo.displayName != this.profileInfo.displayName ||
          this.origInfo.email != this.profileInfo.email ||
          this.origInfo.username != this.profileInfo.username
    }
  },
  created() {
    const storageJSON = localStorage.getItem("userInfo");
    const localUserInfo = JSON.parse(storageJSON);
    this.profileInfo.displayName = localUserInfo.displayName;
    this.profileInfo.email = localUserInfo.email;
    this.profileInfo.username = localUserInfo.name;

    this.refreshOrigInfo();
  },
  watch: {
    profileInfo: {
      handler() {
        this.checkInfoChange();
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.profile-card {
  padding: 1em;
}

.disabled-input {
  &:hover {
    cursor: not-allowed;
  }
}
</style>