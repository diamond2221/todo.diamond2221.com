<template>
  <router-view></router-view>
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

<style>
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
</style>
