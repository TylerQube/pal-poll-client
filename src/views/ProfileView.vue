<template>
  <div class="profile">
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="11" md="10" lg="6">
          <v-card
            class="profile-card"
          >
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
                  :disabled="!infoChanged"
                  >Update Info</v-btn>  
                </v-col>
                
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
    
  </div>
</template>

<script>
// @ is an alias to /src

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
      infoChanged: false
    }
  },
  methods: {
    
  },
  created() {
    const storageJSON = localStorage.getItem("userInfo");
    const localUserInfo = JSON.parse(storageJSON);
    console.log(localUserInfo);
    this.profileInfo.displayName = localUserInfo.displayName;
    this.profileInfo.email = localUserInfo.email;
    this.profileInfo.username = localUserInfo.name;

    console.log("setting orig info")

    this.origInfo.displayName = this.profileInfo.displayName;
    this.origInfo.email = this.profileInfo.email;
    this.origInfo.username = this.profileInfo.username;

  },
  watch: {
    profileInfo: {
      handler() {
        console.log("info changed")
        this.infoChanged = 
          this.origInfo.displayName != this.profileInfo.displayName ||
          this.origInfo.email != this.profileInfo.email ||
          this.origInfo.username != this.profileInfo.username
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