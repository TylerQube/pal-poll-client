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
    <v-row>
      <v-spacer></v-spacer>
      <v-col
        cols="11"
        md="10"
        lg="8"
      >
        <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h2>Questions</h2>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <draggable
              :list="questions"
              @change="onChange"
              handle=".drag-handle"
            >
              <v-card
                v-for="(question, index) in questions"
                :key="index"
                class="mb-4"
              >
                <QuestionEditor 
                  :question="question"
                ></QuestionEditor>
              </v-card>
            </draggable>
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

export default {
  name: 'AdminView',
  components: {
    QuestionEditor,
    draggable
  },
  
  data() {
    return {
      opened: 0,
      questions: []
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
    async onChange({ moved }) {
      console.log("changed")
      const movedQuestion = this.questions[moved.newIndex];

      const reqBody = {
        questionId: movedQuestion._id,
        newOrderNum: moved.newIndex,
      };

      await this.$http.post("http://localhost:3030/questions/order", reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).catch(e => {
        console.log(e);
      });

      console.log("refetching questions");
      this.$http.get(`http://localhost:3030/questions/get/${0}/${this.questions.length}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
      }).then(res => {
        console.log("Received questions");
        console.log(res);

        const newQuestions = [];
        for(let i = 0; i < res.data.questions.length; i++) {
          const q = res.data.questions[i];
          newQuestions.push({
            _id: q._id,
            orderNum: q.orderNum,
            questionBody: q.questionBody,
            answerOptions: q.answerOptions,
            answerNumber: q.answerNumber
          });
        }
        this.questions = [];
        this.questions = newQuestions;
        bus.$emit('changed-order')
      }).catch(err => {
        console.log(err);
      });
    }
  },
  created() {
    this.getQuestions(0, 10);
    bus.$on('delete-question', (qIndex) => {
      const qCount = this.questions.length - (qIndex + 1);

      this.questions = this.questions.slice(0, qIndex);
      console.log("qCount: " + qCount)

      this.getQuestions(qIndex, qCount);
    });
    bus.$on('added-question', () => {
      console.log("Question added!!!!!")
      this.getQuestions(this.questions.length, 1);
    });
  },
}
</script>

<style scoped lang="scss">
</style>