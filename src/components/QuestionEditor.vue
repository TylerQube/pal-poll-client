<template>
  <div class="container">
    <v-form :disabled="this.submittingQuestion">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field
              label="Question"
              v-model="questionForm.questionBody"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <h2 class="mb-3">Answer Options</h2>
        </v-row>
        <v-row
          v-for="(option, i) in questionForm.answerOptions"
          :key="i"
        >
          <v-col
            class="pa-0"
            cols="auto"
          >
            <v-checkbox
              :input-value="questionForm.correctAnswer == i"
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
              v-model="questionForm.answerOptions[i]"
              :label="'Option ' + (i + 1)"
              :rules="questionForm.optionRules"
              counter="25"
              solo
              dense
            ></v-text-field>
          </v-col>
          <v-col
            cols="auto"
            class="pa-2"
          >
            <v-icon
              :disabled="questionForm.answerOptions.length <= 2"
              @click="questionForm.answerOptions.splice(i, 1); if(questionForm.correctAnswer >= questionForm.answerOptions.length) questionForm.correctAnswer--;"
            >
              mdi-delete
            </v-icon>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="auto"
            class="pa-0"
          >
            <v-btn
              plain
              v-if="questionForm.answerOptions.length < 4"
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
        <v-row>
          <v-col>
            <v-alert
              dense
              v-if="editorStatus != ''"
              :type="alertType"
            >
              {{ editorStatus }}
            </v-alert>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn
              :disabled="!questionValid"
              :loading="submittingQuestion"
              class="primary"
              @click="addQuestion()"
            >Add Question</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'QuestionEditor',
  data() {
    return {
      maxOptions: 4,
      questionForm: {
        optionRules: [v => v.length <= 25 || 'Max 25 characters'],
        questionBody: "",
        answerOptions: [
          "",
          ""
        ],
        correctAnswer: 0
      },
      submittingQuestion: false,
      questions: [],
      editorStatus: "",
      alertType: "success"
    }
  },
  computed: {
    questionValid() {
      let optionsValid = true;
      for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
        if(this.questionForm.answerOptions[i].replaceAll(" ", "") == "") optionsValid = false;
      }

      // validate editor form
      return this.questionForm.questionBody.replaceAll(" ", "") != ""
        && this.questionForm.answerOptions.length >= 2
        && optionsValid
        && this.questionForm.correctAnswer >= 0 && this.questionForm.correctAnswer < this.questionForm.answerOptions.length;
    }
  },
  methods: {
    answerChecked(index) {
      this.questionForm.correctAnswer = index;
    },
    resetForm() {
      this.questionForm.questionBody = "";
      this.questionForm.answerOptions = ["", ""];

      setTimeout(() => {
        this.editorStatus = "";
      }, 3000);
    },
    addQuestion() {
        this.submittingQuestion = true;
        let reqAnswerOptions = [];
        for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
          reqAnswerOptions.push({
            optionNumber: i,
            answerBody: this.questionForm.answerOptions[i]
          });
        }

        const reqBody = {
          questionBody: this.questionForm.questionBody,
          answerOptions: reqAnswerOptions,
          answerNumber: this.questionForm.correctAnswer
        };

        return this.$http.post("http://localhost:3030/questions/add", reqBody, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        }).then(res => {
          console.log(res)
          this.alertType = "success"
          this.editorStatus = "Question added!"
          this.resetForm();
        }).catch(e => {
          console.log(e);
          this.alertType = "error"
          this.editorStatus = "Something went wrong"
        }).finally(() => {
          this.submittingQuestion = false;
        });
    }
    // getQuestions(startNum, amt) {
    //   // add fetched questions to array

    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
