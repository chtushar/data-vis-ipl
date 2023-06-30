<script>
  import { writable } from "svelte/store";
  import { getContext } from "svelte";
  import { scaleLinear, scaleOrdinal } from "d3-scale";
  import Axis from "./Axis.svelte";

  let container;

  const margin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };
  const maxDomainRuns = 950;
  const maxDomainStrikeRate = 300;

  // Calculated to avoid calculations at the runtime
  const meanRuns = 146.17;
  const stdDeviationRuns = 177.46;
  const meanStrikeRate = 105.71;
  const stdDeviationStrikeRate = 52.03;
  const meanBoundaryPercentage = 50.87;
  const stdDeviationBoundaryPercentage = 25.201;

  const uR = meanRuns + stdDeviationRuns;
  const lR = meanRuns - stdDeviationRuns;

  const uSR = meanStrikeRate + stdDeviationStrikeRate;
  const lSR = meanStrikeRate - stdDeviationStrikeRate;

  const uBP = meanBoundaryPercentage + stdDeviationBoundaryPercentage;
  const lBP = meanBoundaryPercentage - stdDeviationBoundaryPercentage;

  const batterColor = ({ BdryPercent = 0, StrikeRate = 0, TotalRuns = 0 }) => {
    if (TotalRuns < lR) {
      return "#ff0000";
    }

    if (TotalRuns >= lR && TotalRuns <= uR) {
      return "#00ff00";
    }

    if (TotalRuns > uR) {
      return "#0000ff";
    }
  };

  const containerHeight = writable(0);
  const containerWidth = writable(0);

  const data = getContext("data");
  const arrData = Object.values(data);

  $: innerHeight = $containerHeight - margin.top - margin.bottom;
  $: innerWidth = $containerWidth - margin.left - margin.right;

  $: xScale = scaleLinear()
    .domain([-100, maxDomainRuns])
    .range([0, innerWidth]);
  $: yScale = scaleLinear()
    .domain([0, maxDomainStrikeRate])
    .range([innerHeight, 0]);

  $: colorScale = scaleOrdinal()
    .domain(arrData)
    .range(arrData.map((d) => batterColor(d)));
</script>

<div class="hero relative gap-20">
  <h1 class="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
    Batting Stats
  </h1>
  <div
    bind:this={container}
    bind:clientHeight={$containerHeight}
    bind:clientWidth={$containerWidth}
    class="aspect-[3/2] max-h-96 h-full relative w-full max-w-3xl"
  >
    <svg
      viewBox="0 0 {$containerWidth} {$containerHeight}"
      class="w-full h-full"
    >
      <g transform="translate({margin.left} {margin.top})">
        {#each arrData as d, i}
          <circle
            cx={xScale(d?.TotalRuns ?? 0)}
            cy={yScale(d?.StrikeRate ?? 0)}
            fill={colorScale(d)}
            r="2"
          />
        {/each}
        <Axis
          margin={10}
          {innerHeight}
          position="left"
          scale={yScale}
          ticks={5}
        />
        <Axis
          margin={10}
          {innerHeight}
          position="bottom"
          scale={xScale}
          ticks={maxDomainRuns / 100}
        />
      </g>
    </svg>
  </div>
</div>

<style lang="postcss">
  .hero {
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @apply col-start-2 col-end-8 py-20;
  }

  mark {
    cursor: default;
  }
</style>
