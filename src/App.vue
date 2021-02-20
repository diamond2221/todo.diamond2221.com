<template>
  <router-view></router-view>
  <teleport to='body'>
    <div
      class="loading"
      id="loading"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24px"
        height="30px"
        viewBox="0 0 30 30"
        style="enable-background:new 0 0 50 50;"
        xml:space="preserve"
      >
        <rect
          x="0"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect
          x="7"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.2s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
        <rect
          x="14"
          y="0"
          width="4"
          height="20"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="1; .2; 1"
            begin="0.4s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animate>
        </rect>
      </svg>
      <div class="loading-txt">努力加载中……</div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    onMounted(() => {
      document
        .querySelector("#app")!
        .addEventListener("contextmenu", (e) => e.preventDefault());
    });
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  padding: 5vh;
  height: 100vh;
  box-sizing: border-box;
  padding-top: calc(60px + 5vh);
}
* {
  margin: 0;
  padding: 0;
}

#loading {
  position: fixed;
  z-index: 9999;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  display: none;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  svg {
    width: 50px;
    height: 50px;
  }
}
</style>
