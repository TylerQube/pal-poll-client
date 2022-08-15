<template>
  <div class="card-container">
    <v-card v-show="question != null" class="stats-card">
      <div v-if="notPlayed" class="error-container d-flex flex-column justify-center align-center">
        <h2 style="max-width: 60vw;">Go play and come back to see the results!</h2>
      </div>
      <v-container v-if="!notPlayed">
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
        <v-row class="justify-center">
          <v-col
            :cols="imgColWidth"
            v-for="(name, i) in imgList"
            :key="`img-${i}`"
          >
            <!-- <v-img 
              contain
              class="result-img" 
              :src="require(`../assets/friends/${name}.jpg`)" 
              :alt="name"> -->
            <div class="img-wrapper"
                v-if="staticFriendList.includes(name)"
              >
              <div
                class="result-img"
                :style="{ 'background-image': 'url(' + require('../assets/friends/' + name + '.jpg') + ')' }"
              >
              </div>
            </div>
            
            <div v-if="guesses.length > 0">
              <h2 v-if="!isQuiz">{{ name[0].toUpperCase() + name.slice(1) }}</h2>
              <h2 v-else>{{ quizAnswer }}</h2>
            </div>
          </v-col>
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
        <v-row>
          <v-col>
            <h2 class="" style="color: purple; text-shadow: 2px 2px pink;">{{ isQuiz ? "Guesses" : "Votes" }}</h2>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row v-if="guesses.length > 0" >
          <v-spacer></v-spacer>
          <v-col class="table-container" cols="12" lg="8" xs="12">
            <v-simple-table class="guess-table">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      User
                    </th>
                    <th class="text-left">
                      {{ isQuiz ? "Guess" : "Vote" }}
                    </th>
                    <th>
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(guess, i) in guesses"
                    :key="i"
                  >
                    <td>
                      <div class="d-flex flex-row align-center truncate">
                        <img :src="users[i].avatarUrl" alt=""><p>{{ users[i].displayName }}</p>
                      </div>
                    </td>
                    <td>{{ tableGuess(guess) }}</td>
                    <td>{{ guess.timeElapsed > 60 ? "60+" : guess.timeElapsed + "s" }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-spacer></v-spacer>

        </v-row>
        <v-row v-if="guesses.length == 0">
          <v-col>
            <h2>No one played today!</h2>
          </v-col>
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
    props: {
      question: {
        type: Object,
        default() {
          return {}
        }
      },
      guesses: {
        type: Array,
        default() {
          return []
        }
      },
      users: {
        type: Array,
        default() {
          return []
        }
      },
      flickity: Object,
      notPlayed: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
            loading: false,
            // question: {
            //   questionBody: '',
            // },
            showCard: false,
            imgList: [],

            staticFriendList: [
              'abi',
              'dean',
              'cor',
              'emilia',
              'esther',
              'ethan',
              'mya',
              'jai',
              'tyler',
              'mo'
            ]
        };
    },
    methods: {
        
        answerContentFromId(optionId) {
          for(let i = 0; i < this.question.answerOptions.length; i++) {
            const option = this.question.answerOptions[i];
            if(option._id == optionId) return option.answerBody;
          }
          return null;
        },
        tableGuess(guess) {
          let str = "";
          if(this.isQuiz) {
            if(guess.answerOptionId) {
              str += !guess.isCorrect ? '❌' : '✔️'
              str += " "
              str += this.answerContentFromId(guess.answerOptionId)
            } else {
              str += "⏰"
              // str += "N/A"
            }
          } else {
            str += guess.guessContent;
          }
          return str;
        }
    },
    computed: {
        imgColWidth() {
          Math.max(12/5, 3)
          const len = this.imgList.length;
          if(len == 1) return this.$vuetify.breakpoint.name == 'lg' ? 4 : 6;
          if(len <= 4) return 12 / len;
          if(len <= 6) return 4;
          if(len <= 8) return 3;
          if(len == 9) return 4;
          return 3;
        },
        isQuiz() {
            return this.question && this.question.answerOptions.length > 0;
        },
        quizAnswer() {
            return this.question.answerOptions[this.question.answerNumber].answerBody;
        },
        resultName() {
            if (this.isQuiz) {
                const name = this.question.answerOptions[this.question.answerNumber].answerBody;
                console.log("The quiz answer")
                console.log([name.toLowerCase()])
                return [name.toLowerCase()];
            }
            else {
                if(this.guesses.length == 0) return ['sad_egg']
                // calculate most voted person
                console.log("DA POPULAR VOTES")
                console.log(this.voteCounts.popularVote)
                console.log("done")

                return this.voteCounts.popularVote;
            }
        },
        voteCounts() {
          let voteCounts = {};
          const votes = this.guesses;
          let maxVote = 0;
          let popularVote = [];
          console.log("Vote counts for " + (parseInt(this.question.orderNum) + 1))

          for (let i = 0; i < votes.length; i++) {
              const vote = votes[i];
              const content = !this.isQuiz ? vote.guessContent.toLowerCase() : this.answerContentFromId(vote.answerOptionId);
              // keep track of most frequent vote
              if (voteCounts[content] == null)
                  voteCounts[content] = 0;
              voteCounts[content] = voteCounts[content] + 1;
              if (voteCounts[content] >= maxVote) {
                  // console.log("new max: " + content)
                  maxVote = voteCounts[content];
              }
          }

          // console.log(maxVote)
          // console.log("iterating counts after maxes");
          for (const voteCount in voteCounts) {
              // console.log(voteCount);
              // console.log(voteCounts[voteCount])
              if(voteCounts[voteCount] >= maxVote) {
                popularVote.push(voteCount);
              }
          }
          // console.log("MAX COUNTS LENGTH: " + popularVote.length)
          const counts = {
              popularVote: popularVote.length == 0 ? ['sad_egg'] : popularVote,
              voteCounts: voteCounts
          };
          console.log(counts);
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
      this.flickity.append([this.$el]);
      this.imgList = this.resultName;
    },
}
</script>

<style lang="scss" scoped>
  .card-container {
    padding-top: 1rem;

    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    // margin: 0 5vw;

    overflow-y: scroll;
  }

  .error-container {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .stats-card {

    width: min(95vw, 800px);
    // min-height: 75vh;
    margin-bottom: 1rem;
  }

  .img-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
  }

  .result-img {
    position:absolute;
    background-size: cover;
    height: 100%;
    width: 100%;
    // max-width: min(50vw, 250px);
    // height: min(50vw, 250px);
    // width: min(50vw, 250px);
    border: 1px solid purple;
    border-radius: 50%;
  }

  .table-container {
    padding-top: 0;
  }

  .guess-table {
    img {
      border-radius: 50%;
      border: 1px solid gray;
      width: 40px;
    }

    p {
      margin: 0 1em;
    }

    td {
      text-align: left;
    }

    td:first-child {
      padding-left: 8px;
    }

    .truncate {
      p {
        max-width: 31vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 0;
      }
    }

    td, th {
      padding-left: 0 !important;

    }

  }
</style>