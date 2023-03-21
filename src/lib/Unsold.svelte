<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import type { Writable } from "svelte/store";
    import * as d3 from "d3";
    import { getContext } from "svelte";
    import { players, resetPlayers } from "../data";
  import { setXFromIndex, setYFromIndex } from "../utils/position";
  
    let thisSection;
    const sectionLabel = "unsold";
    const svg = getContext<any>("svg");

    onMount(() => {
      registerFn(sectionLabel, () => {
        resetPlayers();
        
        $svg.select("g.players")
            .selectAll("circle")
            .data($players)
            .join(
                (enter) => enter.append("circle"),
                (update) => update,
                (exit) => exit.remove()
            )
            .transition()
            .attr("r", 5)
            .attr("cx", (d, i) => setXFromIndex(i))
            .attr("cy", (d, i) => setYFromIndex(i))
            .attr("stroke", (d) => (d.cost_in_cr !== "" ? '#000000' : '#777777'))
            .attr("fill", (d) => (d.cost_in_cr !== "" ? '#000000' : '#777777'))
      });
      observer.observe(thisSection);
    });
</script>
  
<Section>
    <div
        class="section-content"
        bind:this={thisSection}
        data-section={sectionLabel}
    >
        Unsold
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>
