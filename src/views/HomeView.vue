<template>
  <div class="home" height="calc(100vh - 60px)">
    <v-card id="section-1" class="transparent first-full big-heading">
    <v-container class="full-div d-flex flex-column justify-space-between">
      <v-row></v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="d-flex justify-center align-center flex-column" style="transform: translate(0, -60px)">
          <h1 class="
            shadow 
            flavor-text 
            text-bob 
            font-weight-bold 
            text-md-h1
            text-sm-h2
            text-h2"
          >Welcome to PalPoll</h1>
          <h5 :class="flavorTextClasslist + 'mt-5 mb-3'"
          >How well do you really know your friends?</h5>
          <router-link to="/play" class="play-router">
            <CoolButton  v-show="finishedTutorial" class="mt-5" label="PLAY"></CoolButton>
          </router-link>
          <h6 v-show="!finishedTutorial" class="
            shadow 
            flavor-text
            font-weight-bold 
            text-lg-h4
            text-md-h6
            text-sm-h6
            text-h6
            mt-5 
            mb-3
          "
          >Scroll down to unlock the game!</h6>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
      <!-- https://csshint.com/html-css-scroll-down-arrow-examples/ -->
      <v-row>
        <v-col align-self="center">
          <svg class="arrows" @click="scrollSection(2)">
            <path class="a1" d="M0 0 L30 32 L60 0"></path>
            <path class="a2" d="M0 20 L30 52 L60 20"></path>
            <path class="a3" d="M0 40 L30 72 L60 40"></path>
          </svg>
        </v-col>
      </v-row>
    </v-container>
    </v-card>
    <v-card id="section-2" class="transparent full-div big-heading d-flex flex-column align-center justify-center">
      <v-container class="full-div d-flex flex-column justify-space-between">
        <v-row></v-row>
        <v-container>
          <v-row>
            <v-spacer></v-spacer>
            <v-col align-self="center" cols="auto">
              <h6 :class="flavorTextClasslist"
              >Each day, compete to see how well you know your pals!</h6>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row
            :class="flavorTextClasslist.replace('flavor-text', '')"
          >
            <v-spacer></v-spacer>
            <v-col>
              <v-icon size="2em" color="white" class="icon-shadow">mdi-chat-question</v-icon>
              <p class="ma-0">Quiz</p>
            </v-col>
            <v-spacer v-if="this.$vuetify.breakpoint.name == 'xs'"></v-spacer>
            <v-col>
              <v-icon size="2em" color="white" class="icon-shadow">mdi-chart-bar</v-icon>
              <p class="ma-0">Poll</p>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-col align-self="center" cols="auto">
              <h6 
                :class="flavorTextClasslist"
              >Some days you'll race the clock in a timed quiz, others you'll pick a friend's name for a "Who's most likely to" question!</h6>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <!-- https://csshint.com/html-css-scroll-down-arrow-examples/ -->
        <v-row>
          <v-col align-self="center">
            <svg class="arrows" @click="scrollSection(3)">
              <path class="a1" d="M0 0 L30 32 L60 0"></path>
              <path class="a2" d="M0 20 L30 52 L60 20"></path>
              <path class="a3" d="M0 40 L30 72 L60 40"></path>
            </svg>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card id="section-3" class="transparent full-div big-heading d-flex flex-column align-center justify-center">
      <h6 
        :class="flavorTextClasslist"
      >Play each day to learn more about your friends and fight to become:</h6>
      <img src="@/assets/podium.png" :width="imgWidth"/>
      <h2 class="
        shadow 
        flavor-text
        font-weight-bold 
        text-lg-h1
        text-md-h2
        text-sm-h2
        text-h2
      ">The Ultimate Pal</h2>
    </v-card>
  </div>
</template>

<script>
// @ is an alias to /src
import CoolButton from '@/components/CoolButton.vue'
import { bus } from '@/main'

export default {
  name: 'HomeView',
  components: {
    CoolButton
  },
  data() {
    return {
      finishedTutorial: false,
    }
  },
  methods: {
    scrollSection(num) {
      console.log(document.getElementById(`section-${num}`).offsetTop)
      setTimeout(() => {
        window.scrollTo({
        top: document.getElementById(`section-${num}`).offsetTop,
        behavior: 'smooth'
      });
      }, 2)
      
    }
  },
  computed: {
    flavorTextClasslist() {
      let classlist = `
        shadow 
        flavor-text
        font-weight-bold 
        text-lg-h2
        text-md-h4
        text-sm-h4
        text-h4
      `;
      if(window.innerHeight < 700) classlist = classlist.replace('text-h4', 'text-h5');
      return classlist;
    },
    imgWidth() {
      switch(this.$vuetify.breakpoint.name) {
        case 'xs':
          return '40%';
        case 'sm':
          return '40%';
        case 'lg':
        case 'xl':
        default:
          return '20%';
      }
    },
  },
  created() {
    bus.$on("finished-tutorial", () => {
      this.finishedTutorial = localStorage.getItem("finishedTutorial");
    });
    this.finishedTutorial = localStorage.getItem("finishedTutorial");
  },
}
</script>

<style lang="scss">

  .flavor-text {
    max-width: 900px;
  }

  .first-full {
    height: calc(100vh - 60px);
    color: white !important;
  }
  .full-div {
    height: 100vh;
    color: white !important;
  }

  .big-heading {
    font-size: 1em;
  }

  .shadow {
    text-shadow: 0.1em 0.1em rgba(58, 58, 58, 0.816);
  }

  .icon-shadow {
    text-shadow: 0.1em 0.08em rgba(58, 58, 58, 0.816);
  }

  .transparent {
    background-color: rgba(0, 0, 0, 0) !important;
    box-shadow: none !important;
  }

  /* https://codepen.io/postor/pen/vYpNYg */
  .arrows {
    width: 60px;
    height: 72px;
    position: absolute;
    left: 50%;
    margin-left: -30px;
    bottom: 20px;

    cursor: pointer;
  }

  .arrows path {
    stroke: white;
    fill: transparent;
    stroke-width: 5px;	
    animation: arrow 2s infinite;
    -webkit-animation: arrow 2s infinite; 
  }

  @keyframes arrow
  {
  0% {opacity:0}
  40% {opacity:1}
  80% {opacity:0}
  100% {opacity:0}
  }

  @-webkit-keyframes arrow /*Safari and Chrome*/
  {
  0% {opacity:0}
  40% {opacity:1}
  80% {opacity:0}
  100% {opacity:0}
  }

  .arrows path.a1 {
    animation-delay:-1s;
    -webkit-animation-delay:-1s; /* Safari 和 Chrome */
  }

  .arrows path.a2 {
    animation-delay:-0.5s;
    -webkit-animation-delay:-0.5s; /* Safari 和 Chrome */
  }

  .arrows path.a3 {	
    animation-delay:0s;
    -webkit-animation-delay:0s; /* Safari 和 Chrome */
  }

  .large-icon {
    font-size: 50px;
  }

  .text-bob {
    animation-name: textfloat;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite; 
  }

  @keyframes textfloat 
  {
    0% {transform: translateY(0)}
    50% {transform: translateY(-5px)}
    100% {transform: translateY(0)}
  }

  @-webkit-keyframes textfloat /*Safari and Chrome*/
  {
    0% {transform: translateY(0)}
    50% {transform: translateY(-10px)}
    100% {transform: translateY(0)}
  }

  .play-router {
    text-decoration: none;
  }
</style>
