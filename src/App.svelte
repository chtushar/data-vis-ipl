<script lang="ts">
  import * as d3 from "d3";
  import { extent } from 'd3-array';
  import PlayerLineUp from "./lib/PlayerLineUp.svelte";
  import Unsold from "./lib/Unsold.svelte";
  import PlayerTypes from "./lib/PlayerTypes.svelte";
  import Role from "./lib/Role.svelte";
  import Teams from "./lib/Teams.svelte";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { players } from "./data";
  import { playerTypes, playerTypesLabel, colors, Teams as TeamsConstant, SectionLabels } from "./constants"; 
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
  $: sortByUnsold = [...$players].sort((a, b) => {
    return a.team_id === "" ? 1 : -1;
  });

  $: filterByUnsold = [...$players].filter((d) => d.team_id !== "");

  $: sortByRole = filterByUnsold.sort((a, b) => {
    const aKey = a.role;
    const bKey = b.role;
    return playerTypes.indexOf(aKey) - playerTypes.indexOf(bKey);
  });

  $: groupedByRole = d3.group(sortByRole, (d) => d.role);

  // Scales
  const playerTypeColorScale = d3.scaleOrdinal(playerTypes, colors);
  const roleXScale = d3.scaleLinear()
                      .domain([0, 243])
                      .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right ]);

  const soldPriceYScale = d3.scaleLinear()
                            .domain([0, 200000000])
                            .range([dimensions.height - 2 * dimensions.margin.top - dimensions.margin.bottom, 0]);

  // Axes
  

  // Functions
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
    
    const roleXAxis = d3.axisBottom(roleXScale)
                        .ticks(4)
                        .tickValues([91, 175, 212, 243])
                        .tickFormat((d) => {
                          if (d === 91) {
                            return "All Rounder";
                          } else if (d === 175) {
                            return "Bowler";
                          } else if (d === 212) {
                            return "Batter";
                          } else if (d === 243) {
                            return "WK/Batter";
                          }
                        })
  

    const soldPriceYAxis = d3.axisLeft(soldPriceYScale)
                              .tickFormat((d) => getIndianCompactNumber(d))
    
    // All axes
    $svg
      .append("g")
      .attr("class", `axis ${SectionLabels.Role}`)
      .attr("stroke", "#ffffff")
      .style("opacity", 0)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.height - dimensions.margin.bottom - dimensions.margin.top})`)
      .call(roleXAxis)
      .selectAll("line")
      .style("stroke", "#ffffff");
    
    $svg
      .append("g")
      .attr("class", `axis ${SectionLabels.Role} ${SectionLabels.Teams}`)
      .attr("stroke", "#ffffff")
      .style("opacity", 0)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)
      .call(soldPriceYAxis)
      .selectAll("path.domain")
      .remove()
      .selectAll("line")
      .style("stroke", "#ffffff");
  
    
    // Player Types
    const playerTypesGroup = $svg
      .append("g")
      .attr("class", `axis ${SectionLabels.Type}`)
      .style("opacity", 0)
      .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.height - dimensions.margin.top - 40})`)
      .selectAll("g.player-type")
      .data(playerTypes)
      .join("g")
      .attr("class", "player-type")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`)

    playerTypesGroup
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .attr("r", 5)
      .attr("fill", (d) => playerTypeColorScale(d))

    playerTypesGroup
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .attr("x", 10)
      .attr("y", 5)
      .attr("fill", "#ffffff")
      .text((d) => playerTypesLabel[d])

      
  });

</script>

<main>
  <div class="tooltip"></div>
  <div class="sections">
    <PlayerLineUp />
    <Unsold />
    <PlayerTypes />
    <Role />
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
      <g class="axis" />
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