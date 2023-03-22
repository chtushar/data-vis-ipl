<script lang="ts">
  import * as d3 from "d3";
  import PlayerLineUp from "./lib/PlayerLineUp.svelte";
  import Unsold from "./lib/Unsold.svelte";
  import PlayerTypes from "./lib/PlayerTypes.svelte";
  import Teams from "./lib/Teams.svelte";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { players } from "./data";
  import data from './data2.json'
  import { playerTypes, colors, Teams as TeamsConstant } from "./constants"; 
  
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
  
  const playerTypeColorScale = d3.scaleOrdinal(playerTypes, colors);
  const teamYScale = d3.scaleBand().domain(Object.values(TeamsConstant)).range([0, 500]);

  setContext("scales", {
    playerTypeColorScale,
    teamYScale,
  })

  setContext("data", {
    sortByUnsold: [...data].sort((a, b) => {
        return a.team_id === "" ? 1 : -1;
      }),
    filterByUnsold: [...data].filter((d) => d.team_id === ""),
    sortByRole: [...data].sort((a, b) => {
        const aKey = a.role;
        const bKey = b.role;
        return playerTypes.indexOf(aKey) - playerTypes.indexOf(bKey);
      }),
  })

  onMount(() => {
    $svg = d3.select(vis).select("svg");
  });

</script>

<main>
  <div class="sections">
    <PlayerLineUp />
    <Unsold />
    <PlayerTypes />
    <Teams />
  </div>
  <div class="vis" bind:this={vis}>
    <svg width={dimensions.width} height={dimensions.height}>
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
</style>