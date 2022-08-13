<template>
  <div>
    <v-card v-show="question != null" class="stats-card">
      <v-container>
        <v-row>
          <v-col cols="auto">
            <v-icon
              v-if="isQuiz"
            >mdi-chat-question</v-icon>
            <v-icon
              v-else
            >mdi-chart-bar</v-icon>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-col cols="12" class="
            d-flex justify-center
          ">
            <h1
              class="
                text-lg-h3
                text-md-h3
                text-xs-h3
              "
            >{{ question.questionBody }}</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="d-flex flex-column align-center">
            <img class="result-img" :src="require(`../assets/friends/${resultName}.jpg`)" :alt="resultName">
            <h2 v-if="!isQuiz">{{ this.countVotes().popularVote[0].toUpperCase() + this.countVotes().popularVote.slice(1) }}</h2>
            <h2 v-else>{{ quizAnswer }}</h2>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
    <div v-show="loading" class="d-flex justify-center align-center loading-container">
      <v-progress-circular
      v-show="loading"
      :size="100"
      :width="7"
      color="white"
      indeterminate
      ></v-progress-circular>
    </div>
  </div>
  
</template>

<script>
// import { bus } from '@/main'

export default {
    name: 'StatsCard',
    props: [
      'question',
      'guesses',
      'flickity'
    ],
    data() {
      return {
        loading: false,
        // question: {
        //   questionBody: '',
          
        // },
        showCard: false
      }
    },
    methods: {
      countVotes() {
        let voteCounts = {};
        const votes = this.guesses;
        let maxVote = 0;
        let popularVote = "tyler";

        for(let i = 0; i < votes.length; i++) {
          const vote = votes[i];
          const content = vote.guessContent.toLowerCase();

          // keep track of most frequent vote
          if(voteCounts[content] == null) voteCounts[content] = 0;
          voteCounts[content] = voteCounts[content] + 1;
          
          if(voteCounts[content] > maxVote) {
            maxVote = voteCounts[content];
            popularVote = content;
          }
        }
        return {
          popularVote: popularVote,
          voteCounts: voteCounts
        };
      },
    },
    computed: {
      isQuiz() {
        return this.question && this.question.answerOptions.length > 0;
      },
      quizAnswer() {
        return this.question.answerOptions[this.question.answerNumber].answerBody
      },  
      resultName() {
        console.log(this.question)
        if(this.isQuiz) {
          console.log("Getting quiz result")
          const name = this.question.answerOptions[this.question.answerNumber].answerBody;
          console.log(name);
          return name.toLowerCase();
        } else {
          console.log("Getting POLL result")
          // calculate most voted person
          
          return this.countVotes().popularVote;
        }
      }
    },
    mounted() {
      this.flickity.prepend([this.$el])
    }
}
</script>

<style lang="scss" scoped>
  .loading-container {
    position: absolute;
    height: calc(100vh - 60px);
    width: 100%;
  }

  .stats-card {
    width: min(95vw, 800px);
    min-height: 95vh;
    margin: 0 5vw;
  }

  .result-img {
    width: min(50vw, 250px);
    border: 1px solid purple;
    border-radius: 50%;
  }
</style>