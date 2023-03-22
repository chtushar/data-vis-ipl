<script lang="ts">
    import { onMount, getContext } from "svelte";
    import * as d3 from "d3";
    import sortBy from 'lodash/sortBy';
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { players, resetPlayers } from "../data";
    import { setXFromIndex, setYFromIndex } from "../utils/position";
  
    let thisSection;
    const sectionLabel = "unsold";
    const svg = getContext<any>("svg");
    const data = getContext<any>("data");

    onMount(() => {
        registerFn(sectionLabel, async () => {
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
                .attr("data-id", (d) => d.id)
                .duration(200)
                .attr("r", 5)
                .attr("cx", (d, i) => setXFromIndex(i))
                .attr("cy", (d, i) => setYFromIndex(i))
                .attr("stroke", (d) => (d.team_id !== "" ? 'blue' : '#777777'))
                .attr("fill", (d) => (d.team_id !== "" ? 'blue' : '#777777'))

            // const swapArrray = [];
            
            // $players.sort((a) => {
            //     return a.team_id === "" ? 1 : -1;
            // });

            // $players.forEach((player, index) => {
            //     const target = `[data-id="${player.id}"]`;
            //         swapArrray.push(
            //             $svg
            //                 .select("g")
            //                 .select(target)
            //                 .transition()
            //                 .delay(400)
            //                 .duration(400)
            //                 .attr("cx", setXFromIndex(index))
            //                 .attr("cy", setYFromIndex(index))
            //                 .end()
            //         )
            // });

            // await Promise.all(swapArrray);
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
