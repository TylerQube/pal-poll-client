<template>
  <h1 style="font-size: 4rem;">{{ timerStr }}</h1>
</template>

<script>
export default {
  data() {
    return {
      timeLeft: 0
    }
  },
  computed: {
    timerStr() {
      const pad = (str) => "0" + str;

      const hours = Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);

      const hStr = hours.toString().length < 2 ? pad(hours.toString()) : hours.toString();
      const mStr = minutes.toString().length < 2 ? pad(minutes.toString()) : minutes.toString();
      const sStr = seconds.toString().length < 2 ? pad(seconds.toString()) : seconds.toString();


      // Display the result in the element with id="demo"
      return `${hStr}:${mStr}:${sStr}`;
    }
  },
  methods: {
    startTimer() {
      let date = new Date();
      date.setHours(24);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      date = new Date(
        date.toLocaleString('en-US', {
          timeZone: 'America/Chicago',
        })
      );

      const now = new Date().getTime();

      const newQuestionTime = date.getTime();

      const distance = newQuestionTime - now;
      this.timeLeft = distance;

      const timer = setInterval(() => {
        if(this.timeLeft < 1000) {
          this.timeLeft = 0;
          clearInterval(timer);
        } else {
          this.timeLeft -= 1000;
        }
      }, 1000)
    }
  },
  mounted() {
    this.startTimer();
  }
}
</script>
    
<style>

</style>