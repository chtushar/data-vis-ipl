<script>
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";

  export let innerHeight;
  export let margin;
  export let position;
  export let scale;
  export let ticks = 10;
  export let hideDomain = false;
  export let showGridLines = false;

  let transform;
  let g;
  let gridLinesContainer;

  $: {
    select(g).selectAll("*").remove();

    let axis;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).tickSizeOuter(0).ticks(ticks);
        transform = `translate(0, ${innerHeight})`;
        break;

      case "left":
        axis = axisLeft(scale).tickSizeOuter(0).ticks(ticks);
        transform = `translate(${margin}, 0)`;
    }
    select(g).call(axis).selectAll("*");

    if (hideDomain) {
      select(g).selectAll(".domain").style("opacity", 0);
    }
  }
</script>

{#if showGridLines}
  <g bind:this={gridLinesContainer} />
{/if}

<g
  class="axis text-[#E0E0E0] pointer-events-none [&>.tick>text]:text-[#949494]"
  bind:this={g}
  {transform}
/>

<style>
  .axis .tick text {
    color: #949494;
  }
</style>
