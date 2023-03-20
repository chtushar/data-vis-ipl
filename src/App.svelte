<script lang="ts">
  import * as d3 from "d3";
  import PlayerLineUp from "./lib/PlayerLineUp.svelte";
  import Unsold from "./lib/Unsold.svelte";
  import PlayerTypes from "./lib/PlayerTypes.svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { players } from "./data";
  
  let vis
  const dimensions = {
    width: 600,
    height: 600,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  };
  const svg = writable(null);
  setContext("svg", svg);

</script>

<main>
  <div class="sections">
    <PlayerLineUp />
    <Unsold />
    <PlayerTypes />
  </div>
  <div class="vis" bind:this={vis}>
    <svg bind:this={$svg} width={dimensions.width} height={dimensions.height}>
      <g class="players"
        transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}
      >
        <!-- {#each $players as player}
          <circle r={5} fill="black" />
        {/each} -->
      </g>
    </svg>
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(5, 1fr); 
  }
  .sections {
    grid-column: 1 / 3;
    display: flex;
    flex-direction: column;
  }
  .vis {
    grid-column: 3 / 6;
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .vis svg g circle {
    transition: stroke 0.2s ease,
                fill 0.2s ease;
  }
</style>