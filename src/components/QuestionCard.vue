<template>
  <div class="container">
    <v-card>
      <v-form :disabled="!this.editing">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              label="Question"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <h2 class="mb-3">Answer Options</h2>
        </v-row>
        <v-row
          v-for="(option, i) in this.question.answerOptions"
          :key="i"
        >
          <v-col
            class="pa-0"
            cols="auto"
          >
            <v-checkbox
              :input-value="this.question.answerNumber == i"
              @click="answerChecked(i)"
              class="ma-0"
            ></v-checkbox>
          </v-col>
          <v-col 
            class="pa-0"
            cols="9"
            sm="6"
            md="6"
            lg="4"
          >
            <v-text-field
              v-model="option.answerBody"
              :label="'Option ' + (i + 1)"
              counter="25"
              solo
              dense
            ></v-text-field>
          </v-col>
          <v-col
            cols="auto"
            class="pa-2"
            v-if="this.editing"
          >
            <v-icon
              :disabled="this.question.answerOptions.length <= 2"
            >
              mdi-delete
            </v-icon>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="auto"
            class="pa-0"
            v-if="this.editing"
          >
            <v-btn
              plain
              v-if="this.question.answerOptions.length < 4"
              @click="questionForm.answerOptions.push('')"
            >
              Add Option
              <v-icon 
                dark
              >
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'QuestionCard',
  props: {
    question: Object
  },
  data() {
    return {
      editing: false
    }
  },
  computed: {
  },
  methods: {
  },
  created() {
    console.log("Adding question: " + this.question)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
