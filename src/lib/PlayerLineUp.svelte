<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { getContext } from "svelte";
    import { players, resetPlayers } from "../data";
    import { setXFromIndex, setYFromIndex } from "../utils/position";
    import { SectionLabels } from "../constants";
  
    let thisSection;
    const sectionLabel = SectionLabels.Lineup;
    const svg = getContext<any>("svg");
    const clean = getContext<any>("clean");

    onMount(() => {
      registerFn(sectionLabel, () => {
        resetPlayers();
        clean(sectionLabel);
        
            $svg
            .select("g.players")
            .selectAll("rect")
            .data($players)
            .join(
                (enter) => enter.append("rect"),
                (update) => update,
                (exit) => exit.remove()
            )
            .style("opacity", 0)
            .transition()
            .duration(200)
            .attr("data-id", (d) => d.id)
            .attr("rx", 5)
            .attr("x", (d, i) => setXFromIndex(i))
            .attr("y", (d, i) => setYFromIndex(i))
            .attr("width", 10)
            .attr("height", 10)
            .attr('stroke-width', '0')
            .attr("fill", '#34a0a4ff')
            .delay((d, i) => i/2)
            .style("opacity", 1);
            
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
        <h1>
            State of IPL 2023
        </h1>
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }

    h1 {
        color: white;
        font-size: 2rem;
    }

</style>
