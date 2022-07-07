<template>
  <div class="container">
    <v-dialog
      v-model="deleteModal"
      width="300"
    >
      <v-card class="modal-card">
        <p>Delete this question?</p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="deleteModal = false"
          >Cancel</v-btn>
          <v-btn
            text
            color="error"
            @click="deleteModal = false; deleteQuestion();"
          >Delete</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-form :disabled="this.submittingQuestion || !this.editing">
      <v-container>
        <v-row>
          <v-col
            v-if="this.question"
            cols="auto"
          >
            <h1>{{ this.question != undefined ? this.question.orderNum+1 : "" }}</h1>
          </v-col>
          <v-col
            cols="6"
            sm="8"
            md="8"
            lg="9"
            class="d-flex flex-row align-center"
          >
            <p
              v-if="!editing"
              class="ma-0 q-body text-truncate"
            >
              {{ this.questionForm.questionBody }}
            </p>
            <v-text-field
              label="Question"
              v-model="questionForm.questionBody"
              clearable
              v-if="editing"
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            cols="auto"
            v-if="this.question != undefined"
          >
            <v-btn
              class="mx-2"
              fab
              small
              depressed
              elevation="1"
              @click="editing = !editing; if(!editing) cancelEdit()"
            >
              <v-icon 
                v-if="!editing"
              >
                mdi-pencil
              </v-icon>
              <v-icon 
                v-if="editing"
              >
                mdi-window-close
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div
          v-if="editing"
        >
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
            xs="6"
            sm="6"
            md="6"
            lg="4"
          >
            <v-text-field
            
              v-model="questionForm.answerOptions[i]"
              :label="'Option ' + (i + 1)"
              :rules="optionRules"
              counter="25"
              solo
              dense
            ></v-text-field>
          </v-col>
          <v-col
            cols="auto"
            class="pa-2"
            v-if="editing"
          >
            <v-icon
              :disabled="questionForm.answerOptions.length <= 2"
              @click="questionForm.answerOptions.splice(i, 1); if(questionForm.correctAnswer >= questionForm.answerOptions.length) questionForm.correctAnswer--;"
            >
              mdi-delete
            </v-icon>
          </v-col>
        </v-row>
        <v-row
        >
          <v-col
            cols="auto"
            class="pa-0"
          >
            <v-btn
              plain
              v-if="questionForm.answerOptions.length < 4 && this.editing"
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
        <v-row
          v-if="editing"
        >
          <v-col
            cols="auto"
          >
            <v-alert
              dense
              v-if="editorStatus != ''"
              :type="alertType"
            >
              {{ editorStatus }}
            </v-alert>
          </v-col>
          <v-spacer></v-spacer>
          <v-col 
            cols="auto"
            v-if="question != undefined"
          >
            <v-btn 
              color="error"
              @click="deleteModal = true;"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              :disabled="!questionValid"
              :loading="submittingQuestion"
              class="primary"
              @click="send()"
            >
              <div v-if="!this.question">Add Question</div>
              <div v-if="this.question">
                <div v-if="showBtnText">Update Question</div>
                <v-icon v-else>
                  mdi-content-save
                </v-icon>
              </div>
            </v-btn>
          </v-col>
        </v-row>
        </div>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { bus } from '@/main';

export default {
  name: 'QuestionEditor',
  props: {
    question: Object
  },
  data() {
    return {
      maxOptions: 4,
      optionRules: [v => v.length <= 25 || 'Max 25 characters'],
      questionForm: {
        questionBody: "",
        answerOptions: [
          "",
          ""
        ],
        correctAnswer: 0
      },
      savedQuestion: {},
      questionId: "",
      submittingQuestion: false,
      questions: [],
      editorStatus: "",
      alertType: "success",
      editing: true,
      deleteModal: false
    }
  },
  watch: {
    question: {
      handler() {
        this.loadQuestionProp();
      },
      deep: true
    }
  },
  created() {
    this.loadQuestionProp();
  },
  computed: {
    questionValid() {
      let optionsValid = true;
      for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
        if(this.questionForm.answerOptions[i].replaceAll(" ", "") == "") optionsValid = false;
      }

      const questionsNotEmpty = this.questionForm.questionBody.replaceAll(" ", "") != ""
          && this.questionForm.answerOptions.length >= 2
          && optionsValid
          && this.questionForm.correctAnswer >= 0 && this.questionForm.correctAnswer < this.questionForm.answerOptions.length;

      if(!this.question) {
        // validate editor form
        return questionsNotEmpty;
      }
      else {
        let optionsDifferent = false;
        for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
          if(this.questionForm.answerOptions[i] != this.savedQuestion.answerOptions[i]) optionsDifferent = true;
        }

        // check if text inputs changed
        return questionsNotEmpty
          && (this.questionForm.questionBody != this.savedQuestion.questionBody || optionsDifferent 
            || this.savedQuestion.answerOptions.length != this.questionForm.answerOptions.length)
      }
    },
    showBtnText() {
      console.log(this.$vuetify.breakpoint.name);
      return this.$vuetify.breakpoint.name != 'sm' && this.$vuetify.breakpoint.name != 'xs'
    }
  },
  methods: {
    loadQuestionProp() {
      // if question provided, 
      if(this.question != undefined) {
        console.log("RELOADING QUESTION PROP")
        this.questionForm.questionBody = this.question.questionBody;

        this.questionForm.answerOptions = []
        for(let i = 0; i < this.question.answerOptions.length; i++) {
          const option = this.question.answerOptions[i];
          this.questionForm.answerOptions.push(option.answerBody);
        }

        this.questionForm.correctAnswer = this.question.answerNumber;
        this.editing = false;

        this.questionId = this.question._id;

        this.saveCurrentQuestion();
      }
    },
    send() {
      if(this.question == undefined) {
        this.addQuestion()
      } else {
        this.updateQuestion();
      }
    },
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
    // rever to earlier saved question when cancelled
    cancelEdit() {
      this.questionForm = JSON.parse(JSON.stringify(this.savedQuestion))
    },
    // save copy of question as original
    saveCurrentQuestion() {
      this.savedQuestion = JSON.parse(JSON.stringify(this.questionForm))
    },
    async deleteQuestion() {
      const reqBody = {
        questionId: this.questionId
      };

      await this.$http.post("http://localhost:3030/questions/delete", reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
        this.alertType = "error"
        this.editorStatus = "Something went wrong"
      }).finally(() => {
        this.submittingQuestion = false;
        setTimeout(() => {
          this.editorStatus = "";
        }, 3000);
      });

      bus.$emit('delete-question', this.question.orderNum);
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
    },
    updateQuestion() {
      this.submittingQuestion = true;
      let reqAnswerOptions = [];
      for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
        reqAnswerOptions.push({
          optionNumber: i,
          answerBody: this.questionForm.answerOptions[i]
        });
      }

      const reqBody = {
        questionId: this.questionId,
        questionBody: this.questionForm.questionBody,
        answerOptions: reqAnswerOptions,
        answerNumber: this.questionForm.correctAnswer
      };

      return this.$http.post("http://localhost:3030/questions/update", reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {
        console.log(res)
        this.alertType = "success"
        this.editorStatus = "Question updated!"

        this.saveCurrentQuestion();
        setTimeout(() => {
          this.editorStatus = "";
        }, 3000);
      }).catch(e => {
        console.log(e);
        this.alertType = "error"
        this.editorStatus = "Something went wrong"
        setTimeout(() => {
          this.editorStatus = "";
        }, 3000);
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
  .q-body {
    font-size: 130%;
  }
</style>
