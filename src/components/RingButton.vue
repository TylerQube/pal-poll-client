<template>
  <button class="button">Go</button>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.button {

  z-index: 1000;
  min-width: 120px;
  min-height: 120px;
  font-family: 'Nunito', sans-serif;
  font-size: 44px;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 700;
  color: white;
  background: #fcb354;
  background: linear-gradient(90deg, #fcb354 0%, #ffa733 100%);
  border: none;
  border-radius: 1000px;
  box-shadow: 6px 6px 24px rgb(255, 221, 176, 0.6);
  transition: all 0.3s ease-in-out 0s;
  cursor: pointer;
  outline: none;
  position: relative;
  padding: 10px;
  }

button::before {
  content: '';
  border-radius: 1000px;
  min-width: calc(120px + 12px);
  min-height: calc(120px + 12px);
  border: 6px solid #ffffff;
  box-shadow: 0 0 60px rgba(255, 245, 232, 0.702);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all .3s ease-in-out 0s;
}

.button:hover {
  color: white;
  transform: translateY(-3px);
}

.button:active, .button:focus {
  color: white;
  transform: translateY(6px);
}

button:hover::before, button:focus::before {
  opacity: 1;
}

button::after {
  content: '';
  width: 30px; height: 30px;
  border-radius: 100%;
  border: 6px solid #fcb354;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ring 1.5s infinite;
}

button:hover::after, button:focus::after {
  animation: none;
  display: none;
}

@keyframes ring {
  0% {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
  100% {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}
</style>