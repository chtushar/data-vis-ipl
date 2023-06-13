<script lang="ts">
  import { readable } from "svelte/store";
  import playersData from './data.json';
  import Hero from "./lib/Hero.svelte";
  import Demographics from "./lib/Demographics.svelte";
  import { setContext } from "svelte";
  

  const dimensions = {
    width: 600,
    height: 600,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  };

  const players = readable(playersData)
  setContext('data', $players)
  

</script>

<main>
  <div class="sections">
    <Hero />
    <Demographics />
  </div>
</main>

<style>
  main {
    display: grid;
  }
  .sections {
    display: grid;
    grid-template-columns: repeat(8, 1fr); 
  }
</style>