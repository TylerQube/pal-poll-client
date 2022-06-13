<template>
  <v-app>
    <div id="app">
      <PollLogin></PollLogin>
    </div>
  </v-app>
</template>

<script>
import PollLogin from './components/PollLogin';

export default {
  name: 'App',

  components: {
    PollLogin,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
}
</style>
