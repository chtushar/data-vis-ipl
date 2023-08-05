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
    const res = await fetch("/ball-by-ball-2.json");
    const data = await res.json();

    if (res.ok) {
      $data = data;
      return true;
    } else {
      throw new Error(data);
    }
  };
</script>

<BallByBall />

<style>
  main {
    display: grid;
  }
  .sections {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    @apply items-center;
  }
</style>
