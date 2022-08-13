<template>
  <div>
    <v-card v-show="question != null" class="stats-card">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-icon
              large
              v-if="isQuiz"
            >mdi-chat-question</v-icon>
            <v-icon
              large
              v-else
            >mdi-chart-bar</v-icon>
          </v-col>
          <v-col cols="8">
            <h2 class="" style="color: purple; text-shadow: 2px 2px pink;">Day {{ question.orderNum + 1 }}</h2>
          </v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="
            d-flex justify-center
          ">
            <h1
              class="
                text-lg-h3
                text-h5
              "
            >{{ question.questionBody }}</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col class="d-flex flex-column align-center">
            <img class="result-img" :src="require(`../assets/friends/${resultName}.jpg`)" :alt="resultName">
            <h2 v-if="!isQuiz">{{ this.voteCounts.popularVote[0].toUpperCase() + this.voteCounts.popularVote.slice(1) }}</h2>
            <h2 v-else>{{ quizAnswer }}</h2>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col>
            <StatsBarChart
              :voteCounts="voteCounts"
              v-show="numVotes > 0"
            ></StatsBarChart>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card>
    <!-- <div v-show="loading" class="d-flex justify-center align-center loading-container">
      <v-progress-circular
      v-show="loading"
      :size="100"
      :width="7"
      color="white"
      indeterminate
      ></v-progress-circular>
    </div> -->
  </div>
  
</template>

<script>
import StatsBarChart from './StatsBarChart.vue';
// import { bus } from '@/main'

export default {
    name: "StatsCard",
    components: { 
      StatsBarChart 
    },
    props: [
      "question",
      "guesses",
      // "chosenOptions",
      "flickity"
    ],
    data() {
        return {
            loading: false,
            // question: {
            //   questionBody: '',
            // },
            showCard: false,

        };
    },
    methods: {
        
        answerContentFromId(optionId) {
          for(let i = 0; i < this.question.answerOptions.length; i++) {
            const option = this.question.answerOptions[i];
            if(option._id == optionId) return option.answerBody;
          }
          return null;
        }
    },
    computed: {
        isQuiz() {
            return this.question && this.question.answerOptions.length > 0;
        },
        quizAnswer() {
            return this.question.answerOptions[this.question.answerNumber].answerBody;
        },
        resultName() {
            if (this.isQuiz) {
                const name = this.question.answerOptions[this.question.answerNumber].answerBody;
                return name.toLowerCase();
            }
            else {
                // calculate most voted person
                return this.voteCounts.popularVote;
            }
        },
        voteCounts() {
          let voteCounts = {};
          const votes = this.guesses;
          let maxVote = 0;
          let popularVote = "sad_egg";
          for (let i = 0; i < votes.length; i++) {
              const vote = votes[i];
              const content = !this.isQuiz ? vote.guessContent.toLowerCase() : this.answerContentFromId(vote.answerOptionId);
              // keep track of most frequent vote
              if (voteCounts[content] == null)
                  voteCounts[content] = 0;
              voteCounts[content] = voteCounts[content] + 1;
              if (voteCounts[content] > maxVote) {
                  maxVote = voteCounts[content];
                  popularVote = content;
              }
          }
          const counts = {
              popularVote: popularVote,
              voteCounts: voteCounts
          };
          return counts;
        },
        numVotes() {
          const votes = this.voteCounts.voteCounts;
          let count = 0;
          for(const vote in votes) {
            count += votes[vote];
          }
          return count
        }
    },
    mounted() {
      this.flickity.prepend([this.$el]);
      console.log("vote len")
    },
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
    height: min(50vw, 250px);
    width: min(50vw, 250px);
    border: 1px solid purple;
    border-radius: 50%;
  }
</style>