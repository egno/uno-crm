<template>
  <div class="spinner">
    <div class="scaling-circles-spinner">
      <div class="circle red" />
      <div class="circle" />
      <div class="circle" />
      <div class="circle" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
.spinner {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner * {
  box-sizing: border-box;
}

.spinner .scaling-circles-spinner {
  position: absolute;
  height: 65px;
  width: 65px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  animation: scaling-circles-animation 2500ms;
  animation-iteration-count: infinite;
  transform: rotate(0deg);
}

.spinner .scaling-circles-spinner .circle {
  width: 32px;
  height: 32px;
  background-color: #333c54;
  border-radius: 50%;
  margin: 0;
  animation-duration: 2500ms;
  animation-iteration-count: infinite;
}

.spinner .scaling-circles-spinner .circle.red {
  background-color: #ef4d37;
}

.spinner .scaling-circles-spinner .circle:nth-child(1) {
  animation-name: scaling-circles-spinner-animation-child-1;
}

.spinner .scaling-circles-spinner .circle:nth-child(2) {
  animation-name: scaling-circles-spinner-animation-child-2;
}

.spinner .scaling-circles-spinner .circle:nth-child(3) {
  animation-name: scaling-circles-spinner-animation-child-3;
}

.spinner .scaling-circles-spinner .circle:nth-child(4) {
  animation-name: scaling-circles-spinner-animation-child-4;
}

@keyframes scaling-circles-animation {
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes scaling-circles-spinner-animation-child-1 {
  50% {
    transform: translate(-50%, -50%);
  }
}

@keyframes scaling-circles-spinner-animation-child-2 {
  50% {
    transform: translate(50%, -50%);
  }
}

@keyframes scaling-circles-spinner-animation-child-3 {
  50% {
    transform: translate(-50%, 50%);
  }
}

@keyframes scaling-circles-spinner-animation-child-4 {
  50% {
    transform: translate(50%, 50%);
  }
}
</style>
