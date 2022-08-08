<template>
  <div id="intro-slide-div">
    <div>
      <div id="text" class="text-container flex-container shadow">
        <h3 class="shadow">Day {{ dayNum }}</h3>
        <div class="shadow-wrapper">
          <h1 id="quiz-label" class="multi-shadow">{{ qType.toUpperCase() }}</h1>
        </div>

        <svg height="30" width="70" class="svg-container">
          <polygon points="0,30 15,0 70,20" class="triangle" />
          Sorry, your browser does not support inline SVG.
        </svg>
        <svg height="60" width="60" class="star-container">
          <polygon points="30,3 12,60 57,25 3,23 47,60"
          class="star" />
        </svg>
        <img src="../assets/spiral.svg" class="spiral"/>
      </div>
    </div>
    <div id="backdrop" class="backdrop-container">
      <div class="outlined"></div>
    </div>
  </div>
  
</template>

<script>
export default {
  name: 'QuizIntro',
  methods: {
    animate() {
      document.getElementById('backdrop').classList.add('animate-backdrop');
      document.getElementById('text').classList.add('animate-text');
    }
  },
  data() {
    return {
      qType: '',
      dayNum: 0
    }
  }
}
</script>

<style lang="scss">

$btn-bg: #8c1bc9;
$btn-base: white;
$btn-hover: #ffc16f;

* {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  -webkit-user-drag: none;

}

.shadow-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#quiz-label {
}

#intro-slide-div {
  width: 100%;
  height: min(20em, 45vh);
  // height: max(12vh, 6em);
  margin-bottom: 1em;

  overflow-x: hidden;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;  
}

.outlined {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;

  background: none;
  outline: 6px solid white;
  border-radius: 5px;
  
  transform: translate(1em, -1.5em);
  box-shadow: 10px 10px 17px -8px rgba(0,0,0,0.75);
  -webkit-box-shadow: 10px 10px 17px -8px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 17px -8px rgba(0,0,0,0.75);
}

.text-container {
  width: min(75vw, 350px);
  height: min(20vh, 9em);
  background-color: $btn-bg;
  color: white;
  z-index: 100;
  opacity: 0;
  top: 25%;
  
  h1 {
    margin: 0.05em 0;
    font-size: 4em;
  }
  
  h3 {
    margin: 0.1em 0;
  }
  
  position: absolute;
  
  
}

.animate-text {
  animation-name: intro-slide-from-right;
  animation-duration: 2s;
  animation-delay: 0.2s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

.heading-appear {
  position: relative;
  overflow: hidden;
  
  transform: scaleY(0);
  transform-origin: top;
  
  animation-name: text-appear;
  animation-duration: 0.5s;
  animation-delay: 2.2s;
  animation-fill-mode: forwards;
}

.backdrop-container {
  width: min(75vw, 325px);
  height: min(25vh, 7em);

  background-color: $btn-hover;
  color: white;
  
  position: absolute;
  opacity: 0;
  bottom: 10%;
}

.animate-backdrop {
  animation-name: intro-slide-from-left;
  animation-duration: 2s;
  animation-delay: 0.2s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes intro-slide-from-left {
  0% {
    // transform: translate(0, -100vw);
    left: -150%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 1;
    left: 50%;
    transform: translateX(-60%);
  }
}

@keyframes intro-slide-from-right {
  0% {
    // transform: translate(100vw, 0);
    left: 150%;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 1;
    left: 50%;
    transform: translateX(-40%);
  }
}


.shadow {
    text-shadow: 0.1em 0.1em rgba(8, 8, 8, 0.9);
}

// $shadow-4: rgb(239, 254, 0);
// $shadow-3: rgb(255, 193, 0);
// $shadow-2: rgb(255, 124, 0);
// $shadow-1: rgb(255, 0, 0);

$shadow-1: #f6aca2;
$shadow-2: #f49b90;
$shadow-3: #f28b7d;
$shadow-4: #f07a6a;

.multi-shadow {
  animation: 
    shadows 1s infinite,
    shift-text 1s infinite;
  font-family: canada-type-gibson, sans-serif;
  color: white;
}

@keyframes slide-right-text {
  from { transform: translateX(200%); }
  to { transform: translateX(0); }
}

$shadow-dist: 5px;

@keyframes shift-text {
  12%, 87% { transform: translate(calc(-#{$shadow-dist}), calc(-#{$shadow-dist})); }
  25%, 75% { transform: translate(calc(-#{$shadow-dist} * 2), calc(-#{$shadow-dist} * 2)); }
  37%, 62% { transform: translate(calc(-#{$shadow-dist} * 3), calc(-#{$shadow-dist} * 3)); }
  50% { transform: translate(calc(-#{$shadow-dist} * 4), calc(-#{$shadow-dist} * 4)); }
  
}

@keyframes shadows {
  0%, 100% {
    text-shadow: none;
  }
  12%, 87% {
    text-shadow: calc(#{$shadow-dist} * 1) calc(#{$shadow-dist} * 1)  $shadow-1;
  }
  25%, 75% {
    text-shadow: 
      calc(#{$shadow-dist} * 1)  calc(#{$shadow-dist} * 1)  $shadow-1,
      calc(#{$shadow-dist} * 2)  calc(#{$shadow-dist} * 1)  $shadow-2
      ;
  }
  37%, 62% {
    text-shadow: 
      calc(#{$shadow-dist} * 1)  calc(#{$shadow-dist} * 1)  $shadow-1,
      calc(#{$shadow-dist} * 2)  calc(#{$shadow-dist} * 2)  $shadow-2,
      calc(#{$shadow-dist} * 3)  calc(#{$shadow-dist} * 3)  $shadow-3
      ;
  }
  50% {
    text-shadow: 
      calc(#{$shadow-dist} * 1)  calc(#{$shadow-dist} * 1)  $shadow-1,
      calc(#{$shadow-dist} * 2)  calc(#{$shadow-dist} * 2)  $shadow-2,
      calc(#{$shadow-dist} * 3)  calc(#{$shadow-dist} * 3)  $shadow-3,
      calc(#{$shadow-dist} * 4)  calc(#{$shadow-dist} * 4)  $shadow-4
      ;
  }
}

.triangle {
  fill: $btn-hover;
  stroke: purple;
  stroke-width: 1;
}

.spiral {
  width: 50%;

  position: absolute;
  top: -42%;
  right: -13%;

  animation: 1s spin;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.star {
    fill: $btn-hover;
    stroke: purple;
    stroke-width: 0;
}

.star-container {
  position: absolute;
  bottom: -6%;
  right: -4%;
  
  animation-name: bulge;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: steps(2, jump-none);
}

@keyframes bulge {
  100% { 
    transform: scale(1.2) rotate(-20deg) translate(-5%, 10%); 
  }
}

.svg-container {
  position: absolute;
  top: 10%;
  left: -8%;
  
  animation-name: pivot;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes pivot {
  0%{ transform: rotate(0deg); }
  50% { transform: rotate(30deg); }
  100% { transform: rotate(0deg); }
  
}
</style>