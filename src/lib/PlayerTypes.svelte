<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import * as d3 from "d3";
    import { getContext } from "svelte";
    import { players } from "../data";
    import { colors, playerTypes } from "../constants";
  
    let thisSection;
    const sectionLabel = "type";
    const svg = getContext<any>("svg");
    const playerTypeColorScale = d3.scaleOrdinal(playerTypes, colors);

    onMount(() => {
        registerFn(sectionLabel, async () => {
        $players = $players.filter((d) => d.cost_in_cr !== "");

        const swapArrray = [];
        
        $svg
        .select("g.players")
        .selectAll("circle")
        .data($players)
        .join(
            (enter) => enter.append("circle"),
            (update) => update,
            (exit) => exit
                        .transition()
                        .duration(500)
                        .delay((d, i) => i)
                        .style("transform", "translateY(100px)")
                        .style("opacity", 0)
                        .remove()
        )
        .attr("data-id", (d) => d.id)
        .transition()
        .duration(500)
        .attr('fill', d => playerTypeColorScale(d.type))
        .attr('stroke', d => playerTypeColorScale(d.type))

        $players.sort((a, b) => {
            const aKey = a.type;
            const bKey = b.type;

            return playerTypes.indexOf(aKey) - playerTypes.indexOf(bKey);
        })
        
        $players.forEach((element, index) => {
            const target = `[data-id="${element.id}"]`;

            swapArrray.push(
                $svg
                    .select("g")
                    .select(target)
                    .transition()
                    .delay(700)
                    .duration(500)
                    .attr("cx", Math.floor(index / 10) * 20)
                    .attr("cy", index % 10 * 20)
            )
        });
        
        await Promise.all(swapArrray);
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
        Types
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>
