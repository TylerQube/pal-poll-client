<template>
  <div class="stats-container">
    <flickity ref="flickity" id="stats-carousel" :options="flickityOptions" class="stats-carousel" @init="onInit">
      <StatsCard 
        v-for="(info, i) in statsInfo"
        :key="i"
        :question="info.question"
        :guesses="info.guesses"
        :flickity="$refs.flickity"
      >
      </StatsCard>
    </flickity>
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

      statsCards: [
        -2, -1, 0
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
        this.statsCards.splice(0, 0, ind);
      }

      if(ind) {
        console.log(`Adding index ${ind}`)
        const res = await this.loadStats(ind);
        if(res.status == 200) {
          // this.statsInfo.splice(0, 0, res.data);
          this.createCard(res);
        }
      }
      
      this.selectedIndex = event
    },  
    async loadStats(relativeIndex) {
        
      return await this.$http.get(`http://localhost:3030/stats/get/${relativeIndex}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }).catch(() => {
        return;
        // console.log(e);
      });
    },
    createCard(res) {
      console.log("FETCHED QUESTION")
      console.log(res)
      this.statsInfo.push({
        question: res.data.question,
        guesses: res.data.guesses ?? res.data.votes,
        // chosenOptions: res.data.chosenOptions
      });

      // const newCard = new StatsCardClass({
      //   propsData: { 
      //     question: res.data.question,
      //     guesses: res.data.guesses ?? res.data.votes
      //   }
      // });

      // newCard.$mount();
      // if(prepend) {
      //   this.$refs.flickity.$el.prepend(newCard.$el);
      //   this.$refs.flickity.prepend([newCard.$el]);
      // } else {
      //   this.$refs.flickity.$el.appendChild(newCard.$el);
      //   this.$refs.flickity.prepend([newCard.$el]);
      // }
      
    }
  },
  async mounted() {

    // bus.$on('update-carousel', () => {
    //   console.log('rerendering')
    //   this.$refs.flickity.rerender();
    // })

    // bus.$on('add-carousel-item', ele => {
    //   this.$refs.flickity.append([ele]);
    // })
    for(let i = this.statsCards.length - 1; i >= 0; i--) {
      const res = await this.loadStats(this.statsCards[i]);
      console.log(res)
      console.log("Creating card");
      this.createCard(res);
    }
    setTimeout(() => {
      // this.$refs.flickity.rerender();
    }, 1)
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

.flickity-viewport {
  padding-top: 2rem;

  height: /* calc(100vh - 60px); */ calc(100vh - 60px);
  overflow-y: scroll !important;
  overflow-x: hidden;
}
</style>