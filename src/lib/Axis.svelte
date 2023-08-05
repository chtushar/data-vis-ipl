<script>
  import { select } from "d3-selection";
  import { axisBottom, axisLeft } from "d3-axis";

  export let innerHeight;
  export let innerWidth;
  export let margin;
  export let position;
  export let scale;
  export let ticks = 10;

  let transform;
  let g;
  let gridLinesContainer;

  $: {
    select(g).selectAll("*").remove();

    let axis;
    switch (position) {
      case "bottom":
        axis = axisBottom(scale).ticks(ticks).tickSize(-innerHeight);
        transform = `translate(0, ${innerHeight})`;
        break;

      case "left":
        axis = axisLeft(scale).ticks(ticks).tickSize(-innerWidth);
        transform = `translate(${margin}, 0)`;
    }

    select(g).call(axis).selectAll(".tick line").attr("stroke-dasharray", "5");
    select(g).selectAll(".domain").style("opacity", 0);

    switch (position) {
      case "bottom":
        select(g).selectAll(".tick:first-of-type").style("opacity", 0);
        break;
      default:
        break;
    }
  }
</script>

<g bind:this={gridLinesContainer} />

<g
  class="axis text-[#E0E0E0] pointer-events-none [&>.tick>text]:text-[#949494]"
  bind:this={g}
  {transform}
/>
