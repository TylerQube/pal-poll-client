<template>
  <div class="d-flex flex-column justify-space-between" style="height: 100%;">
    <v-container class="container">
    <v-row>
      <v-col cols="12" class="d-flex flex-row justify-end">
        <div id="stopwatch" class="stopwatch" :style="`height: ${stopwatchSize}; width: ${stopwatchSize}`">
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
          {{ question.questionBody }}
        </h1>
      </v-col>
    </v-row>
    <v-row v-if="question.answerOptions">
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
              <input type="radio" :disabled="curSec <= 0" :id="`control_${i}`" name="select" :value="question.answerOptions[i].answerBody">
              <label :for="`control_${i}`" @click="selected = true;">
                <h2>{{ question.answerOptions[i].answerBody }}</h2>
              </label>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
    <v-row v-else>

    </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col v-if="lost">
          <img src="../assets/esther_L.jpg" alt="L" class="icon-big"/>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-col>
          <v-btn
            v-show="selected"
            style="color: white;"
            color="purple"
            x-large
          >
            DONE!
          </v-btn>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </div>
  

</template>

<script>
export default {
  name: 'QuizQuestion',
  data() {
    return {
      question: null,
      selected: false,
      curSec: 5,
      lost: false
    }
  },
  methods: {
    getQuestion() {
      return this.$http.get("http://localhost:3030/questions/daily", {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }).then(res => {
        console.log(res.data);
        this.question = res.data.question;
        setTimeout(() => {
          this.countdown();
        }, 1000);
      }).catch(e => {
        console.log(e);
      }).finally(() => {
        
      });
    },
    countdown() {
      const countdown = setInterval(() => {
        this.curSec--;
        document.getElementById('stopwatch').classList.add('pulse');
        setTimeout(() => {
          document.getElementById('stopwatch').classList.remove('pulse')
        }, 300);
        if(this.curSec == 0) { clearInterval(countdown); this.lost=true; }

      }, 1000);
    },
  },
  computed: {
    stopwatchSize() {
      switch(this.$vuetify.breakpoint.name) {
        case 'lg':
        case 'xl':
          return '6em';
        case 'md':
          return '4em';
        case 'sm':
        case 'xs':
        default:
          return '3.5em';
      }
    },
    stopwatchFont() {
      switch(this.$vuetify.breakpoint.name) {
        case 'lg':
        case 'xl':
          return '2.5em';
        case 'md':
          return '2em';
        case 'sm':
        case 'xs':
        default:
          return '1.5em';
      }
    },
  }
}
</script>

<!-- https://codepen.io/adamstuartclark/pen/pbYVYR -->
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