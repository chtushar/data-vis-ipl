<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { getContext } from "svelte";
    import { players, resetPlayers } from "../data";
    import { setXFromIndex, setYFromIndex } from "../utils/position";
  
    let thisSection;
    const sectionLabel = "player-lineup";
    const svg = getContext<any>("svg");

    onMount(() => {
      registerFn(sectionLabel, () => {
        resetPlayers();
        
            $svg
            .select("g.players")
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
