<template>
    <v-container class="pa-0">
        <v-row>
            <v-col cols="auto">
                <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dateFormatted"
                        label="Start Date"
                        hint="MM/DD/YYYY format"
                        persistent-hint
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        @blur="editingDate = parseDate(dateFormatted)"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="editingDate"
                        no-title
                        @input="menu1 = false"
                    ></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="auto" class="d-flex justify-center align-center">
                <v-btn
                v-if="editingDate != startDate || submittingDate || dateSubmitted || dateFailed"
                small
                fab
                dark
                :color="btnColor"
                elevation="1"
                :loading="submittingDate"
                @click="updateStartDate()"
                >
                    <v-icon dark v-if="!dateSubmitted && !dateFailed">
                        mdi-cloud-upload
                    </v-icon>
                    <v-icon dark v-if="dateSubmitted">
                        mdi-check-bold
                    </v-icon>
                    <v-icon dark v-if="dateFailed">
                        mdi-cloud-alert
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
    
    

</template>

<script>

export default {
  name: 'DatePicker',
  data() {
    return {
      startDate: null,
      editingDate: null,
      dateMenu: false,
      dateFormatted: '',

      submittingDate: false,

      dateSubmitted: false,
      dateFailed: false
    }
  },
  watch: {
    startDate (val) {
        this.dateFormatted = this.formatDate(val);

        this.editingDate = val;
    },
    editingDate (val) {
        console.log("editor updated!!!!");
        this.dateFormatted = this.formatDate(val);
    },
  },
  created() {
    this.getConfig();
  },
  computed: {
    btnColor() {
        if(this.dateSubmitted) return 'green';
        else if(this.dateFailed) return 'red';
        else return 'teal';
    }
  },
  methods: {
    getConfig() {
      return this.$http.get(`${process.env.VUE_APP_API_URL}/config/get`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {  
        console.log(res);

        const rawDate = res.data.startDate;
        const date = new Date(rawDate);
        console.log(date);

        const dateStr = rawDate.slice(0, 10)/* `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}` */;
        this.startDate = dateStr;
      }).catch(err => {
        console.log(err);
      });
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
    parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    async updateStartDate() {
        const body = {
            startDate: this.editingDate
        };

        this.submittingDate = true;

        return this.$http.post(`${process.env.VUE_APP_API_URL}/config/update`, body, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        }).then(res => {  
            console.log(res)
            this.dateSubmitted = true;

            setTimeout(() => {
                this.dateSubmitted = false;
            }, 2000);

            this.startDate = this.editingDate;
        }).catch(err => {
            console.log(err);
            this.dateFailed = true;

            setTimeout(() => {
                this.dateFailed = false;
            }, 2000);

        }).finally(() => {
            this.submittingDate = false;
        });
    }
  },
}
</script>
