<template>
  <div class="profile">
    <v-container>
      <v-row
        justify="center"
      >
        <v-col cols="11" md="8" lg="6">
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
        <v-col
          cols="11"
          md="4"
          lg="3"
        >
          <v-card>
            <v-container>
              <v-row>
                <v-spacer></v-spacer>
                <v-col 
                  cols="auto"
                >
                  <!-- <div style="
                    height: 100%;
                    width: 100%;
                  "
                    class="d-flex justify-end"
                  > -->
                  <!-- <div
                    style="
                      width: 100%;
                      height: 100%;
                    "
                  > -->
                  <div
                    class="d-flex justify-end"
                    absolute
                  >
                    <v-btn
                      fab
                      small
                      absolute
                      elevation="0"
                      :loading="isSelecting" 
                      @click="handleFileImport"
                    >
                      <v-icon>
                        mdi-pencil
                      </v-icon>
                    </v-btn>

                    <input 
                      ref="uploader" 
                      class="d-none" 
                      type="file" 
                      accept=".png,.jpg,.jpeg,.heic"
                      @change="onFileChanged"
                    >
                    <v-avatar
                      size="144"
                      color="white"
                    >
                      <v-icon
                        v-if="this.avatarUrl == null"
                      >
                          mdi-file-document-alert
                      </v-icon>
                      <img v-else :src="this.avatarUrl"/>
                    </v-avatar>
                  </div>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-row>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-spacer></v-spacer>
                  <v-alert
                  dense
                  v-if="avatarStatus != ''"
                  :type="alertType"
                  >
                    {{ avatarStatus }}
                  </v-alert>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { bus } from '@/main';
import FormData from 'form-data';

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
      sendingUpdate: false,

      isSelecting: false,
      selectedFile: null,

      avatarStatus: "",
      alertType: "success",

      avatarUrl: null
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
    },
    handleFileImport() {

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      
      // Trigger click on the FileInput
      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      this.isSelecting = true;
      this.selectedFile = e.target.files[0];

      // Send file to backend
      const formData = new FormData();
      console.log(this.selectedFile.name)
      formData.append('avatar', this.selectedFile, this.selectedFile.name);

      for(const value of formData.values()) {
        console.log(value)
      }

      try {
        await this.$http.post("http://localhost:3030/user/updatepfp", formData, 
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("jwt")}` ,
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.alertType = "success";
          this.avatarStatus = "Updated!";
          setTimeout(() => {
            this.avatarStatus = ""
          }, 3000);
          console.log("fetching avatar")
          this.fetchAvatar();
          bus.$emit("user-updated");
        }).finally(() => {
          this.isSelecting = false;
        });
      } catch (err) {
          this.alertType = "error";
          this.avatarStatus = "Something went wrong";
          setTimeout(() => {
            this.avatarStatus = ""
          }, 3000);
        console.log(err)
        this.isSelecting = false;
      }
    },
    async fetchAvatar() {
      const res = await this.$http.get(`http://localhost:3030/user/avatar?username=${this.profileInfo.username}`);
      console.log(res);
      this.avatarUrl = res.data;
    },
  },
  created() {
    const storageJSON = localStorage.getItem("userInfo");
    const localUserInfo = JSON.parse(storageJSON);
    this.profileInfo.displayName = localUserInfo.displayName;
    this.profileInfo.email = localUserInfo.email;
    this.profileInfo.username = localUserInfo.name;

    this.refreshOrigInfo();
    this.fetchAvatar();
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