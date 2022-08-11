<template>
  <div>
    <flickity ref="flickity" :class="`carousel`" @init="onInit">
      <div 
        class="carousel-cell"
        v-for="(friend, i) in friendsImgs"
        :key="i"
        :ref="`child-${i}`"
        :id="`child-${i}`"
      >
        <img :src="require(`../assets/friends/${friend.name.toLowerCase()}.jpg`)" :alt="friend.name">
      </div>
    </flickity>
    <h2 class="shadow label-margin" id="carousel-label">{{ friendsImgs[selectedIndex].name }}</h2>
  </div>
</template>

<script>
import Flickity from 'vue-flickity';

export default {
  name: 'FlickityCarousel',
  components: {
    Flickity,
  },
  data() {
    return {
      friends: [
        'Abi',
        'Cor',
        'Dean',
        'Emilia',
        'Esther',
        'Ethan',
        'Jai',
        'Mo',
        'Mya',
        'Tyler'
      ],
      friendsImgs: [],
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: false,
        pageDots: true,
        wrapAround: true,
        draggable: true
      },
      selectedIndex: 0,
      disabled: false
    }
  },
  methods: {
    createCarousel() {
    },
    generateList() {
      let list = [];
      for(let i = 0; i < this.friends.length; i++) {
        const name = this.friends[i];
        let obj = {};
        obj.name = name;
        obj.path = `../assets/friends/${name.toLowerCase()}.jpg`;
        list.push(obj);
      }
      list.sort(() => Math.random() - 0.5);
      console.log(list);
      this.friendsImgs = list;
    },
    onInit() {
      this.$refs.flickity.on('change', (event) => {
        this.selectedIndex = event
        console.log('current index', event)
      })
    },
    disableCarousel() {
      console.log("disabling carousel");
      this.$refs.flickity.disableDrag();
      for(let i = 0; i < this.friends.length; i++) {
        if(i == this.selectedIndex) continue;
        this.$refs.flickity.remove(this.$refs[`child-${i}`]);
      }
      try {
        const buttons = document.querySelectorAll('.flickity-button');
        for(let b = 0; b < buttons.length; b++) {
          buttons[b].style.display = "none"
        }
        document.getElementById('carousel-label').classList.remove('label-margin');
      } catch (e) {
        console.log(e)
      }
      
      const dots = document.querySelector('.flickity-page-dots');
      dots.style.display = "none";

      document.getElementById(`child-${this.selectedIndex}`).classList.add('circle-anim');

    }
  },
  mounted() {
    this.generateList();
    this.createCarousel();
    console.log("FLICKITY MOUNTED")
    setTimeout(() => {
      this.$refs.flickity.rerender();
      console.log("RERENDER AS;LDKFJAS;LKDFJKSA")
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>

.carousel {
  width: min(90vw, 400px);
}

.label-margin {
  margin-top: 1.5em;
}

#carousel-label {
  transition-duration: .5s;
  transition-property: margin-top;
}

.carousel-cell {
  width: min(90vw, 300px);
  height: min(90vw, 300px);
  border: 2px solid white;
  overflow: hidden;

  img {
    width: 110%;
  }
}

.flickity-button {
  background: white !important;
}

.disabled::after {
  content: '';
}

.circle-anim {
  animation: circle 0.6s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes circle {
  100% {
    border-radius: 50%;
    box-shadow: 0px 5px 15px black;
    transform: scale(0.8);
  }
}
</style>