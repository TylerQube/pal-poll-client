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
            class="drag-handle"
          >
            <h3>{{ this.question != undefined && this.questionIndex != undefined ? this.questionIndex+1 : "" }}</h3>
            <v-icon>
              mdi-arrow-split-horizontal
            </v-icon>
          </v-col>
          <v-col
            cols="auto"
            class="d-flex flex-row align-center"
            v-if="this.$vuetify.breakpoint.name != 'sm' && this.$vuetify.breakpoint.name != 'xs'"
          >
            <v-icon
              v-if="isQuiz"
            >mdi-chat-question</v-icon>
            <v-icon
              v-else
            >mdi-chart-bar</v-icon>
          </v-col>
          <v-col
            cols="auto"
            md="8"
            lg="8"
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
              @click="editing = !editing; if(!editing) cancelEdit();"
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
          <v-col cols="auto">
            <v-btn-toggle
            v-model="questionForm.questionType"
            mandatory
            tile
            color="deep-purple accent-3"
            group
            >
              <v-btn value="Quiz">
                <v-icon>
                  mdi-chat-question
                </v-icon>
              </v-btn>
              <v-btn value="Poll">
                <v-icon>
                  mdi-chart-bar
                </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col
            class="d-flex flex-row align-center"
            cols="auto"
          >
            <h3 class="my-3">{{ questionForm.questionType }}</h3>
          </v-col>
        </v-row>
        <template v-if="isQuiz">
        <v-row>
          <h2 class="mb-3">Answer Options</h2>
        </v-row>
        <v-radio-group v-model="questionForm.correctAnswer">
        <v-row
          v-for="(option, i) in questionForm.answerOptions"
          :key="i"
        >
          <v-col
            class="pa-0"
            cols="auto"
          >
            <v-radio
              :value="i"
              @click="answerChecked(i)"
              class="mt-2"
            ></v-radio>
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
        </v-radio-group>
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
        </template>
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
    question: Object,
    questionIndex: Number
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
        correctAnswer: 0,
        questionType: "Quiz"
        // if false, question is poll
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
    // bus.$on('changed-order', this.loadQuestionProp);
    this.loadQuestionProp();
  },
  computed: {
    isQuiz() {
      return this.questionForm.questionType == "Quiz";
    },
    questionValid() {
      const bodyNotEmpty = this.questionForm.questionBody.replaceAll(" ", "") != "";

      if(this.questionForm.questionType == "Poll") {
        if(this.savedQuestion.questionType == "Quiz" && bodyNotEmpty) return true;

        return bodyNotEmpty && this.questionForm.questionBody != this.savedQuestion.questionBody;
      } else {

        let optionsValid = true;
        for(let i = 0; i < this.questionForm.answerOptions.length; i++) {
          if(this.questionForm.answerOptions[i].replaceAll(" ", "") == "") optionsValid = false;
        }

        const questionsNotEmpty = bodyNotEmpty
          && this.questionForm.answerOptions.length >= 2
          && optionsValid
          && this.questionForm.correctAnswer >= 0 && this.questionForm.correctAnswer < this.questionForm.answerOptions.length;


        if(this.savedQuestion.questionType == "Poll") {
          return bodyNotEmpty && questionsNotEmpty;
        }
        // if using the question editor, only check that all fields are filled
        if(!this.question) return questionsNotEmpty;

        // otherwise, ensure at least one of the fields is different
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
      return this.$vuetify.breakpoint.name != 'sm' && this.$vuetify.breakpoint.name != 'xs'
    }
  },
  methods: {
    loadQuestionProp() {
      // if question provided, 
      if(this.question != undefined) {
        this.questionForm.questionBody = this.question.questionBody;

        this.questionForm.answerOptions = []
        for(let i = 0; i < this.question.answerOptions.length; i++) {
          const option = this.question.answerOptions[i];
          this.questionForm.answerOptions.push(option.answerBody);
        }

        if(this.question.questionType == "Poll") {
          this.questionForm.answerOptions = [
            "",
            ""
          ]
          this.questionForm.correctAnswer = 0;
        }

        this.questionForm.correctAnswer = this.question.answerNumber;
        this.editing = false;

        this.questionId = this.question._id;

        if(this.question.questionType != undefined) {
          this.questionForm.questionType = this.question.questionType;
        }

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
          answerNumber: this.questionForm.correctAnswer,
          questionType: this.questionForm.questionType
        };

        return this.$http.post("http://localhost:3030/questions/add", reqBody, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
        }).then(res => {
          console.log(res)
          this.alertType = "success"
          this.editorStatus = "Question added!"
          this.resetForm();
          console.log("EMITTING ADDED EVENT")
          bus.$emit('added-question');
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
        answerNumber: this.questionForm.correctAnswer,
        questionType: this.questionForm.questionType
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .q-body {
    font-size: 130%;
  }

  .drag-handle {
    user-select: no-select;

    &:hover {
      cursor: row-resize;
    }
  }
</style>
