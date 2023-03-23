<script lang="ts">
  import * as d3 from "d3";
  import PlayerLineUp from "./lib/PlayerLineUp.svelte";
  import Unsold from "./lib/Unsold.svelte";
  import PlayerTypes from "./lib/PlayerTypes.svelte";
  import Role from "./lib/Role.svelte";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import data from './data2.json'
  import { playerTypes, colors, Teams as TeamsConstant, SectionLabels } from "./constants"; 
  import { getIndianCompactNumber } from "./utils/formatter";
  
  let vis
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

  // Stores
  const svg = writable(null);
  
  // Reactive statements
  $: sortByUnsold = [...data].sort((a, b) => {
    return a.team_id === "" ? 1 : -1;
  });

  $: filterByUnsold = [...data].filter((d) => d.team_id === "");

  $: sortByRole = filterByUnsold.sort((a, b) => {
    const aKey = a.role;
    const bKey = b.role;
    return playerTypes.indexOf(aKey) - playerTypes.indexOf(bKey);
  });

  $: groupedByRole = d3.group(sortByRole, (d) => d.role);

  // Scales
  const playerTypeColorScale = d3.scaleOrdinal(playerTypes, colors);
  const roleXScale = d3.scaleBand()
                      .domain(playerTypes)
                      .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right ]);
  const soldPriceYScale = d3.scaleLinear()
                            .domain([d3.max(data, (d) => parseInt(d.sold_price)), 0])
                            .range([dimensions.height - 2 * dimensions.margin.top - dimensions.margin.bottom, 0]);

  const clean = (label: SectionLabels) => {
    $svg
      .selectAll(`g.axis`)
      .transition()
      .duration(500)
      .style("opacity", 0)

    $svg
      .selectAll(`g.${label}`)
      .transition()
      .duration(500)
      .style("opacity", 1)
  }
  // Context
  setContext("dimensions", dimensions);
  setContext("clean", clean);
  setContext("data", {
    sortByUnsold,
    filterByUnsold,
    sortByRole,
    groupedByRole,
  });
  setContext("scales", {
    playerTypeColorScale,
    roleXScale,
    soldPriceYScale,
  })

  setContext("svg", svg);

  onMount(() => {
    $svg = d3.select(vis).select("svg");
    const roleXAxis = d3.axisBottom(roleXScale);
    const soldPriceYAxis = d3.axisLeft(soldPriceYScale)
                              .tickFormat((d) => getIndianCompactNumber(d));
    
    $svg
      .append("g")
      .attr("class", `axis ${SectionLabels.Role}`)
      .style("opacity", 0)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.height - dimensions.margin.bottom - dimensions.margin.top})`)
      .call(roleXAxis);
    
    $svg
      .append("g")
      .attr("class", `axis ${SectionLabels.Role}`)
      .style("opacity", 0)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)
      .call(soldPriceYAxis);

  });

</script>

<main>
  <div class="sections">
    <PlayerLineUp />
    <Unsold />
    <PlayerTypes />
    <Role />
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