<script lang="ts">
  import { writable } from "svelte/store";
  // import playersData from "./data.json";
  // import Hero from "./lib/Hero.svelte";
  // import Demographics from "./lib/Demographics.svelte";
  import { setContext } from "svelte";
  import ballByBall from "./ball-by-ball.json";
  import BallByBall from "./lib/BallByBall.svelte";
  // import BattingStats from "./lib/BattingStats.svelte";

  const data = writable([]);
  setContext("data", data);

  const fetchJson = async () => {
    const res = await fetch("/ball-by-ball.json");
    const data = await res.json();

    if (res.ok) {
      $data = data;
      return true;
    } else {
      throw new Error(data);
    }
  };
</script>

<main>
  <div class="sections">
    <!-- <Hero />
    <Demographics />
    <BattingStats /> -->
    {#await fetchJson()}
      <p>loading</p>
    {:then show}
      {#if show}
        <BallByBall />
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
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
