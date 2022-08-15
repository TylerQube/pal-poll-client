<template>
  <div class="main-container">
    <div class="loading-wrapper" v-show="loadingQ">
      <v-progress-circular
      :size="100"
      :width="7"
      color="white"
      indeterminate
      ></v-progress-circular>
      

    </div>
    <div class="loading-wrapper d-flex flex-col flex-center" v-if="error">
      <h1 class="shadow">Sorry, something went wrong!</h1>
      <img src="../assets/sad_egg.jpg" alt="Sad Egg" class="icon">
    </div>
    <div v-if="alreadyPlayed" class="loading-wrapper d-flex flex-col flex-center">
      <h1 class="shadow">You've already played, come back tomorrow!</h1>
      <CountdownTimer ref="timer"></CountdownTimer>
    </div>
    <div v-if="notStarted" class="loading-wrapper d-flex flex-col flex-center">
      <h1 class="shadow">PalPoll hasn't started yet, come back soon!</h1>
    </div>
    <div v-if="!alreadyPlayed">
      <div class="flex-between" id="start-menu">
        <div class="intro-container flex-center">
        <QuizIntro ref="quizIntro"></QuizIntro>
        <div class="block-container">
          <p
            :class="flavorTextClasslist + ' unrevealed'"
            id="text-1"
          >
          <span>{{ flavorText[0] }}</span>
          </p>
        </div>
        <div class="block-container">
          <p
            :class="flavorTextClasslist + ' unrevealed'"
            id="text-2"
          >
          <span>{{ flavorText[1] }}</span>
          </p>
        </div>
        <div class="block-container">
          <p
            :class="flavorTextClasslist + ' unrevealed'"
            id="text-3"
          >
          <span>{{ flavorText[2] }}</span>
          </p>
        </div>
        </div>
        <RingButton id="go-btn" @click.native="hideStartMenu();"></RingButton>
      </div>
      
      <div id="quiz-container" v-show="displayQuestion">
        <QuizQuestion ref="quizQuestion"></QuizQuestion>
      </div>
      <div id="full-transition">
      </div>
    </div>
    
  </div>
  
</template>

<script>
import QuizIntro from '@/components/QuizIntro.vue'
import RingButton from '../components/RingButton.vue'
import QuizQuestion from '@/components/QuizQuestion.vue';
import { bus } from '../main'
import CountdownTimer from '@/components/CountdownTimer.vue';

export default {
  name: 'QuizView',
  components: {
    QuizIntro,
    RingButton,
    QuizQuestion,
    CountdownTimer
},
  data() {
    return {
      loadingQ: false,
      error: false,
      displayQuestion: false,
      timeouts: [],

      showAnswer: false,
      alreadyPlayed: false,
      notStarted: false,

      quizFlavor: [
        "Test your knowledge!",
        "Watch the clock!",
        "No do-overs!"
      ],

      pollFlavor: [
        "Take your time...",
        "Pick a final answer...",
        "And cast your vote!"
      ],

      qType: ""
    }
  },
  computed: {
    flavorText() {
      return this.qType == "Quiz" ? this.quizFlavor : this.pollFlavor;
    },
    flavorTextClasslist() {
      let classlist = `
        shadow 
        flavor-text
        font-weight-bold 
        text-lg-h3
        text-md-h4
        text-sm-h5
        text-h5
      `;
      if(window.innerHeight < 700) classlist = classlist.replace('text-h4', 'text-h5');
      return classlist;
    },
  },
  methods: {
    animText() {
      const baseDelay = 2000;
      const interval = 500;

      const textBlocks = document.querySelectorAll('.unrevealed');
      for(let i = 0; i < textBlocks.length; i++) {
        const introTimer = setTimeout(() => {
          console.log("Revealing " + i );
          this.revealText(`text-${i+1}`);
        }, baseDelay + i * interval);
        this.timeouts.push(introTimer);
      }
    
      const revealTimer = setTimeout(() => {
        document.getElementById('go-btn').classList.add('reveal-btn');
        console.log("revealing but")
      }, 1000 + baseDelay + (textBlocks.length - 1) * interval);
      this.timeouts.push(revealTimer);
    },
    revealText(id) {
      const ele = document.getElementById(id);

      ele.classList.add('block-reveal');
    },
    hideStartMenu() {
      const menu = document.getElementById('start-menu');
      const swipeAnim = setTimeout(() => {
        menu.classList.add('swipe-away');
      }, 300)

      const loadingTimer = setTimeout(() => {
        this.loadingQ = true;
      }, 1000);

      const startQuizDelay = setTimeout(() => {
        menu.style.display = "none";
        this.startQuiz();
      }, 1500);

      this.timeouts.push([swipeAnim, loadingTimer, startQuizDelay]);
    },
    setupQuiz() {
      this.loadingQ = true;
      return this.$http.get(`https://${process.env.VUE_APP_API_URL}/questions/daily/type`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }).then(res => {
        console.log(res.data);
        this.$refs.quizIntro.qType = res.data.qType;
        this.qType = res.data.qType;
        this.$refs.quizIntro.dayNum = res.data.orderNum + 1;

        this.$refs.quizIntro.animate();
        this.animText();
      }).catch(e => {
        console.log(e);
        if(e.response.data.msg) {
          if(e.response.data.msg.includes("already played")) {
            this.alreadyPlayed = true;
            return;
          } else if(e.response.data.msg.includes("has not yet started")) {
            this.notStarted = true;
            return;
          }
        }
        

        console.log("SHOWING ERROR");
        this.error = true;
      }).finally(() => {
        this.loadingQ = false;
      });
    },
    startQuiz() {
      
      bus.$on('quiz-error', () => {this.error = true; this.loadingQ = false;});
      this.displayQuestion = false;

      setTimeout(() => {
        this.$refs.quizQuestion.getQuestion();
      }, 0);

      // only transition once question loaded
      bus.$on('quiz-ready', () => {
        document.getElementById('full-transition').classList.add('full-wipe');
        this.loadingQ = false;
        setTimeout(() => {
          console.log("SHOWING QUESTION")
          this.displayQuestion = true;
        }, 550);
      });
      
    },
    // userRes : String
    endQuiz(userRes, guessTime) {
      this.$refs.quizAnswer.submitAnswer(userRes, guessTime);
    },
  },
  mounted() {
    this.setupQuiz();

    bus.$on('end-quiz', this.endQuiz);
  },
  beforeDestroy() {
    for(const timer in this.timeouts) {
      clearTimeout(timer);
    }
  }
}
</script>

<style lang="scss">
  .icon {
    width: 10vh;
    height: 10vh;

    border-radius: 50%;
    border: 2px solid white;
  }

  #quiz-container {
    height: 100%;
  }

  #full-transition {
    position: absolute;
    left: 0;
    bottom: 0;

    height: 100%;
    width: 0;

    margin: 0;
    padding: 0;

    background-color: rgb(237, 74, 191);
  }

  .full-wipe {
    animation: 1.1s transition-wipe;
    animation-timing-function: ease;
  }

  @keyframes transition-wipe {
    0% {
      left: 0;
      width: 0%;
    }
    30%, 70% {
      left: 0;
      width: 100%;
    }
    100% {
      left: 100%;
      width: 0%;
    }
  }

  .main-container {
    overflow-x:hidden;
    height: calc(100vh - 60px);
    position: relative;
  }

  .intro-container {
    width: 100%;
  }

  .loading-wrapper {
    position: absolute;
    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    overflow: hidden;
  }

  .flex-between {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    height: calc(90vh - 60px);
  }

  .flex-center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    color: white;
  }

  .shadow {
    color: white;
    text-shadow: 0.1em 0.1em rgba(58, 58, 58, 0.816);
  }

  $btn-bg: #8c1bc9;
  $btn-base: white;
  $btn-hover: #ffc16f;

  .block-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .unrevealed {
    span {
      opacity: 0;
    }
  }

  $reveal-duration: 0.6s;

  #text-1::after, #text-3::after {
    background: $btn-hover;
  }

  #text-2::after {
    background: $btn-bg;
  }

  .block-reveal {
    span {
      animation: .000001s text-reveal forwards calc(#{$reveal-duration} / 2);
    }

    &::after {
      content: "";
      top: 0;
      left: 0;
      position: absolute;
      width: 0%;
      height: 100%;
      opacity: 1;

      animation: $reveal-duration before-reveal linear;
    }
  }

  @keyframes before-reveal {
    0% {
      left: 0;
      width: 0%;
    }
    30%, 70% {
      left: 0;
      width: 100%;
    }
    100% {
      left: 100%;
      width: 0%;
    }
  }

  @keyframes text-reveal {
    100% {
      opacity: 1;
    }
  }

  .reveal-btn {
    animation: text-reveal 0.5s;
    animation-fill-mode: forwards;
  }

  #go-btn {
    opacity: 0;
  }

  .swipe-away {
    animation: swipe-right 1s;
    animation-fill-mode: forwards;
  }

  @keyframes swipe-right {
    100% {
      transform: translateX(200%);
    }
  }
</style>