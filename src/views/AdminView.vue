<template>
<div class="admin">
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col
          cols="11"
          md="10"
          lg="8"
      >
        <v-card
        >
          <h1>PalPoll Global Config</h1>
        </v-card>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col
          cols="11"
          md="10"
          lg="8"
      >
        <v-expansion-panels :value="opened">
          <v-expansion-panel
          >
            <v-expansion-panel-header>
              <h2>Question Editor</h2>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <QuestionEditor></QuestionEditor>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</div>
</template>

<script>
// @ is an alias to /src
import QuestionEditor from '@/components/QuestionEditor.vue'

export default {
  name: 'AdminView',
  components: {
    QuestionEditor
  },
  
  data() {
    return {
      opened: 0,
    }
  },
  computed: {
  },
  methods: {
    
  },
  created() {
    // getQuestions()
  },
}
</script>

<style scoped lang="scss">
</style>