<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import type { Writable } from "svelte/store";
    import * as d3 from "d3";
    import { getContext } from "svelte";
    import { players, resetPlayers } from "../data";
  
    let thisSection;
    const sectionLabel = "player-lineup";
    const svg = getContext<Writable<SVGAElement>>("svg");

    onMount(() => {
      registerFn(sectionLabel, () => {
        resetPlayers();
        d3.select($svg)
            .select("g")
            .selectAll("circle")
            .data($players)
            .join("circle")
            .attr("r", 5)
            .attr("cx", (d, i) => {
                return i % 30 * 20;
            })
            .attr("cy", (d, i) => {
                return Math.floor(i / 30) * 20;
            })
            .attr("stroke", '#000000')
            .attr("fill", '#000000')
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
        Players
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>
