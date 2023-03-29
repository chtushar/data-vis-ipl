<script lang="ts">
    import { onMount, getContext } from "svelte";
    import * as d3 from "d3";
    import sortBy from 'lodash/sortBy';
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { players, resetPlayers } from "../data";
    import { setXFromIndex, setYFromIndex } from "../utils/position";
  import { SectionLabels } from "../constants";
  
    let thisSection;
    const sectionLabel = SectionLabels.Unsold;
    const svg = getContext<any>("svg");
    const clean = getContext<any>("clean");

    onMount(() => {
        registerFn(sectionLabel, async () => {
            resetPlayers();
            clean(sectionLabel);

            $svg
                .select("g.players")
                .selectAll("rect")
                .data($players)
                .join('rect')
                .transition()
                .attr("data-id", (d) => d.id)
                .duration(300)
                .attr("rx", 5)
                .style("opacity", 1)
                .attr("width", 10)
                .attr("height", 10)
                .attr("x", (d, i) => setXFromIndex(i))
                .attr("y", (d, i) => setYFromIndex(i))
                .attr("fill", (d) => (d.team_id !== "" ? '#34a0a4ff' : '#222222'))

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
