<template>
  <div class="d-flex flex-column" style="height: 100%;">
    <v-container class="container">
    <v-row>
      <v-col cols="12" class="d-flex flex-row justify-end">
        <div v-if="question.answerOptions && question.answerOptions.length > 0" id="stopwatch" class="stopwatch" :style="`height: ${stopwatchSize}; width: ${stopwatchSize}`">
          <h1 :style="`font-size: ${stopwatchFont}`">{{ curSec }}</h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1 class="
          shadow
          font-weight-bold 
          text-lg-h3
          text-md-h3
          text-sm-h4
          text-h4
        ">
          {{ question != null ? question.questionBody : '' }}
        </h1>
      </v-col>
    </v-row>
    <v-row v-if="question != null && question.answerOptions && question.answerOptions.length > 0">
      <v-container>
        <v-row class="d-flex flex-row justify-center">
          <v-col
            v-for="(option, i) in question.answerOptions"
            :key="i"
            cols="6"
            lg="3"
            md="3"
            sm="6"
            xs="6"
          >
            <div >
              <input type="radio" :disabled="curSec <= 0 || quizEnded" :id="`control_${i}`" name="select" v-model="multiChoiceAnswer" :value="question.answerOptions[i].answerBody">
              <label :for="`control_${i}`" @click="selected = true;" :id="`label_${i}`">
                <h2>{{ question.answerOptions[i].answerBody }}</h2>
              </label>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-if="!question.answerOptions || question.answerOptions.length == 0">
      <v-container>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <FlickityCarousel ref="carousel"></FlickityCarousel>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-row>
    </v-container>
    <v-container fill-height >
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            v-show="(selected || question.answerOptions.length == 0) && !(quizEnded && !submittingQuiz)"
            style="color: white; font-family: 'Nunito', sans-serif; font-size: 1.5rem;"
            rounded
            color="purple"
            x-large
            :block="this.$vuetify.breakpoint.name == 'xs'"
            @click.native="endQuiz()"
            :loading="submittingQuiz"
          >
            DONE!
          </v-btn>
          <v-btn
            v-show="quizEnded && !submittingQuiz"
            style="color: white;"
            x-large
            rounded
            color="purple"
            :block="this.$vuetify.breakpoint.name == 'xs'"
            @click.native="toStats()"
          >
            See the results!
            <v-icon
              right
            >
              mdi-arrow-right-bold
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
  

</template>

<script>
import { bus } from '../main';
import FlickityCarousel from './FlickityCarousel.vue';

export default {
    name: "QuizQuestion",
    data() {
        return {
            question: null,
            selected: false,
            curSec: 4,
            timeLimit: 4,
            stopwatchInterval: null,

            quizEnded: false,
            submittingQuiz: false,

            multiChoiceAnswer: null,
        };
    },
    methods: {
        toStats() {
          this.$router.push("/stats");
        },
        getQuestion() {
            return this.$http.get(`https://${process.env.VUE_APP_API_URL}/questions/daily`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
            }).then(res => {
                console.log(res.data);
                this.question = res.data.question;
                console.log(this.question.answerOptions)
                bus.$emit("quiz-ready");
                setTimeout(() => {
                    if(this.question != null && this.question.answerOptions && this.question.answerOptions.length > 0) {
                      // select random quiz option
                    }
                    this.countdown();
                }, 1000);
            }).catch(e => {
                console.log(e);
                bus.$emit("quiz-error");
            }).finally(() => {
            });
        },
        countdown() {
            const countdown = setInterval(() => {
                this.curSec--;
                if(this.question.answerOptions && this.question.answerOptions.length > 0) {
                  document.getElementById("stopwatch").classList.add("pulse");
                  setTimeout(() => {
                      document.getElementById("stopwatch").classList.remove("pulse");
                  }, 300);
                }
                
                if (this.curSec == 0 && (this.question.answerOptions && this.question.answerOptions.length > 0)) {
                  console.log("OUTTA TIME")
                  console.log("Options length: " + this.question.answerOptions.length)
                  clearInterval(countdown);
                  this.endQuiz();
                }
            }, 1000);
            this.stopwatchInterval = countdown;
        },
        async endQuiz() {
          this.quizEnded = true;
          // disable carousel if multiple choice
          if(!this.question.answerOptions || this.question.answerOptions.length == 0) this.$refs.carousel.disableCarousel();
          // disable timer
          clearInterval(this.stopwatchInterval);
          
          const guess = this.question.answerOptions.length > 0 ? this.multiChoiceAnswer : this.pollAnswer;
          // Use stopwatch time if quiz, use all elapsed time if poll
          const elapsed = this.question.answerOptions.length > 0 ? 
            this.timeLimit - this.curSec : 
            (this.curSec < 0 ? Math.abs(this.curSec) + this.timeLimit : this.timeLimit - this.curSec);
          this.submitAnswer(guess, elapsed);

        },
        async submitAnswer(userAnswer, guessTime) {
          this.submittingQuiz = true;

          console.log("Is Quiz: " + this.isQuiz);
          console.log("Failed: " + this.multiChoiceAnswer)

          const body = {
            failed: this.isQuiz && this.multiChoiceAnswer == null,
            guess: userAnswer,
            guessTime: guessTime
          };

          await this.$http.post(`http://localhost:3030/guess/submit`, body, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }
          }).then(res => {
            console.log(res);
            console.log(res.data.correctIndex)
            if(res.data.correctIndex != undefined) this.revealAnswer(res.data.correctIndex);
          }).catch(e => {
            console.log(e)
          }).finally(() => {
            this.submittingQuiz = false;
          });
        },
        revealAnswer(correctIndex) {
          console.log("revealing answer")
          if(!this.question.answerOptions) return;
          for(let i = 0; i < this.question.answerOptions.length; i++) {
            const label = document.getElementById(`label_${i}`);
            if(i == correctIndex) {
              label.classList.add('correct-choice');
            }
            else label.classList.add('incorrect-choice');

            if(document.getElementById(`control_${i}`).checked) {
              label.classList.add(i == correctIndex ? 'chosen-correct' : 'chosen-incorrect');
            }
          }
        }
    },
    computed: {
        isQuiz() {
          return this.question && this.question.answerOptions && this.question.answerOptions.length > 0
        },
        pollAnswer() {
          return this.$refs.carousel.friendsImgs[this.$refs.carousel.selectedIndex].name;
        },
        stopwatchSize() {
            switch (this.$vuetify.breakpoint.name) {
                case "lg":
                case "xl":
                    return "6em";
                case "md":
                    return "4em";
                case "sm":
                case "xs":
                default:
                    return "3.5em";
            }
        },
        stopwatchFont() {
            switch (this.$vuetify.breakpoint.name) {
                case "lg":
                case "xl":
                    return "2.5em";
                case "md":
                    return "2em";
                case "sm":
                case "xs":
                default:
                    return "1.5em";
            }
        },
    },
    beforeDestroy() {
        clearInterval(this.stopwatchInterval);
    },
    components: { FlickityCarousel },
}
</script>

<!-- /* https://codepen.io/adamstuartclark/pen/pbYVYR */ -->
<style lang="scss" scoped>
  .container {
    color: white;
  }

  .icon-big {
    width: 15vh;
    height: 15vh;

    border-radius: 50%;
    border: 2px solid white;
  }

  .shadow {
    text-shadow: 0.1em 0.1em rgba(58, 58, 58, 0.816);
  }

  .pulse {
    animation: .1s pulse;
  }

  @keyframes pulse {
    50% { transform: scale(1.2); }
  }

  $btn-bg: #8c1bc9;
  $btn-base: white;
  $btn-hover: rgb(237, 74, 191);
  $gold-yellow: #ffc16f;

  input[type="radio"] {
    display: none;
    &:not(:disabled) ~ label {
      cursor: pointer;
    }
    &:disabled ~ label {
      color: hsla(150, 5%, 75%, 1);
      border-color: hsla(150, 5%, 75%, 1);
      box-shadow: none;
      cursor: not-allowed;
    }
  }
  label {
    height: 100%;
    display: block;
    background: $btn-bg;
    border: 2px solid white;
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    //margin: 1rem;
    text-align: center;
    box-shadow: 0px 3px 10px -2px hsla(150, 5%, 65%, 0.5);
    position: relative;

    padding-top: 1.5em;
    padding-bottom: 1.5em;

  }
  input[type="radio"]:checked + label {
    background: $btn-hover;
    color: hsla(215, 0%, 100%, 1);
    box-shadow: 0px 0px 20px hsla(34, 100%, 72%, 0.759);
    &::after {
      color: hsla(215, 5%, 25%, 1);
      font-family: FontAwesome;
      border: 2px solid $btn-hover;
      content: "❓";
      font-size: 24px;
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      height: 50px;
      width: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 50%;
      background: white;
      box-shadow: 0px 2px 5px -2px hsla(0, 0%, 0%, 0.25);
    }
  }
  input[type="radio"]#control_05:checked + label {
    background: red;
    border-color: red;
  }

  .incorrect-choice {
    background-color: #e33434 !important;
    color: white !important;
  }
  
  .correct-choice {
    background-color: rgb(20, 165, 20) !important;
    color: white !important;
  }

  .chosen-correct {
    &::after {
      content: '✔️' !important;
    }
  }

  .chosen-incorrect {
    &::after {
      content: '❌' !important;
    }
  }

    .stopwatch {
    width: 4em;
    height: 4em;
    background-image: url('../assets/stopwatch.svg');
    background-size:contain;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    font-family: 'Exo', sans-serif;

    h1 {
      font-size: 2.5em;
      margin-top: 0.55em;
    }
  }
</style>