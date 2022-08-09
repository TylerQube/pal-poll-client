<template>
<div class="admin">
  <v-container style="position: relative;">
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <h1 class="
          shadow 
          font-weight-bold 
          text-lg-h2
          text-md-h3
          text-sm-h4
          text-h4
        ">Admin Panel</h1>
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
        <v-card
          class="color-black"
        >
          <v-container>
            <v-row>
              <v-col cols="auto">
                <h1 class="ml-4">PalPoll Global Config</h1>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-row>
              <v-col cols="auto" class="py-0 d-flex justify-center align-center">
                <h3>PalPoll Start Date</h3>
              </v-col>
              <v-col cols="auto">
                <DatePicker></DatePicker>
              </v-col>
            </v-row>
          </v-container>
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
        <v-expansion-panels :value="opened" class="color-black">
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
    <v-row>
      <v-spacer></v-spacer>
      <v-col
        cols="11"
        md="10"
        lg="8"
      >
        <v-expansion-panels :value="questionsOpen">
        <v-expansion-panel class="color-black" >
          <v-expansion-panel-header>
            <h2>Questions</h2>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Container
              :list="questions"
              @drop="onChange"
              drag-handle-selector=".drag-handle"
            >
              <Draggable
                v-for="(question, index) in questions"
                :key="index"
                class="mb-4"
              >
                <v-card>
                  <QuestionEditor 
                    :questionIndex="index"
                    :question="question"
                  ></QuestionEditor>
                </v-card>
              </Draggable>>
            </Container>
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
import draggable from 'vuedraggable'
import { bus } from '@/main';

import { Container, Draggable } from "vue-smooth-dnd";
import DatePicker from "../components/DatePicker.vue";

export default {
  name: 'AdminView',
  components: {
    QuestionEditor,
    draggable,
    Container,
    Draggable,
    DatePicker
},
  
  data() {
    return {
      opened: 0,
      questions: [],

      startDate: null,
      dateMenu: false,
      questionsOpen: 0
    }
  },
  computed: {
  },
  methods: {
    getQuestions(startNum, num) {
      return this.$http.get(`http://localhost:3030/questions/get/${startNum}/${num}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {
        console.log("Received questions");
        console.log(res);

        for(let i = 0; i < res.data.questions.length; i++) {
          const q = res.data.questions[i];

          let newQuestion = {
            _id: q._id,
            orderNum: q.orderNum,
            questionBody: q.questionBody,
            answerOptions: q.answerOptions,
            answerNumber: q.answerNumber,
          };
          if(q.answerOptions.length == 0) {
            newQuestion.questionType = 'Poll';
          } else {
            newQuestion.questionType = 'Quiz';
          }
          this.questions.push(newQuestion);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    async onChange(moved) {
      const newIndex = moved.addedIndex;
      const oldIndex = moved.removedIndex;

      const movedQuestion = this.questions[oldIndex];

      this.arrayMove(this.questions, oldIndex, newIndex);

      const reqBody = {
        questionId: movedQuestion._id,
        newOrderNum: newIndex,
      };

      await this.$http.post("http://localhost:3030/questions/order", reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
      });
    },
    // Utility function sourced from https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    arrayMove(arr, old_index, new_index) {
      if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
              arr.push(undefined);
          }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    },
  },
  created() {
    this.getQuestions(0, 10);
    bus.$on('delete-question', (qIndex) => {
      const qCount = this.questions.length - (qIndex + 1);

      this.questions.splice(qIndex, 1);
      console.log("qCount: " + qCount)

      // this.getQuestions(qIndex, qCount);
    });
    bus.$on('added-question', () => {
      this.getQuestions(this.questions.length, 1);
    });
  },
}
</script>

<style scoped lang="scss">
  .admin {
    color: white;
  }

  .shadow {
    text-shadow: 0.1em 0.1em rgba(58, 58, 58, 0.816);
  }
</style>