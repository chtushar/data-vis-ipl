<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { teamMapping, Teams, } from "../constants";
    import * as d3 from "d3";
    import { getContext } from "svelte";

    let thisSection;
    const sectionLabel = "teams";
    const svg = getContext<any>("svg");
        
    onMount(() => {
        registerFn(sectionLabel, async () => {
            // const teamYScale = d3.scaleBand().domain(Object.values(Teams)).range([0, 500]);
            // const yAxis = d3.axisLeft(teamYScale);
            // yAxis.tickFormat(d => teamMapping[d]);

            // $svg.append("g").attr("transform", "translate(30, 0)").call(yAxis);
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
        Teams
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>
