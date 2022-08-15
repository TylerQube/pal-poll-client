<template>
  <div class="stats-container">
    <flickity ref="flickity" id="stats-carousel" :options="flickityOptions" class="stats-carousel" @init="onInit" v-show="statsInfo.length > 0">
      <StatsCard 
        v-for="(info, i) in statsInfo"
        :key="i"
        :question="info.question"
        :guesses="info.guesses"
        :users="info.users"
        :flickity="$refs.flickity"
        :notPlayed="info.notPlayed"
      >
      </StatsCard>
    </flickity>
    <div v-if="statsInfo.length == 0" class="loading-wrapper d-flex flex-col flex-center">
      <h1 class="shadow">No stats to display!</h1>
    </div>
  </div>
</template>

<script>
import StatsCard from './StatsCard.vue';
import Flickity from 'vue-flickity';
// import Vue from 'vue'
// import { bus } from '@/main'

// const StatsCardClass = Vue.extend(StatsCard);

export default {
  name: 'StatsCarousel',
  components: {
    StatsCard,
    Flickity
},
  data() {
    return {
      selectedIndex: 2,

      flickityOptions: {
        setGallerySize: false,
        pageDots: false,
        initialIndex: 2
      },

      initCards: [
        -2, -1, 0
      ],
      statsCards: [

      ],

      statsInfo: [
        
      ]
    }
  },
  methods: {
    onInit() {
      this.$refs.flickity.on('change', this.updateFlickity); 
    },
    async updateFlickity(event) {
      // update list
      const desc = this.selectedIndex >= event;

      let ind = null;
      // if on second to last, or second element
      if(desc && event == 1) {
        console.log(this.statsCards)
        ind = this.statsCards[0] - 1;
      }

      if(ind) {
        console.log(`Adding index ${ind}`)
        this.loadStats(ind);
      }
      
      this.selectedIndex = event
    },  
    async loadStats(relativeIndex) {
        
      return await this.$http.get(`http://localhost:3030/stats/get/${relativeIndex}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }).then(res => {
        if(res.status == 200) {
          this.statsCards.splice(0, 0, relativeIndex);
          this.createCard(res);
        }
      }).catch((e) => {
        console.log(e);
        console.log(e.response.data.msg)
        if(!e.response.data.msg) return
        if(e.response.data.msg.includes("User has not played")) {
          console.log("Not played")
          this.statsInfo.push({
            notPlayed: true
          })
        } 
      });
    },
    createCard(res) {
      console.log("FETCHED QUESTION")
      console.log(res)
      
      this.statsInfo.push({
        question: res.data.question,
        guesses: res.data.guesses ?? res.data.votes,
        users: res.data.users
      });
    }
  },
  async mounted() {
    for(let i = this.initCards.length - 1; i >= 0; i--) {
      await this.loadStats(this.initCards[i]);
    }
    this.$refs.flickity.rerender();
  }
}
</script>

<style lang="scss">

.stats-container {
  height: calc(100vh - 60px);
}

.stats-carousel {
  height: /* calc(100vh - 60px); */ calc(100vh - 60px);
}

#stats-carousel {
  .flickity-viewport {

    height: /* calc(100vh - 60px); */ calc(100vh - 60px);
    // overflow-y: scroll !important;
    // overflow-x: hidden;
  }
}

</style>