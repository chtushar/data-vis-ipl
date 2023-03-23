<script lang="ts">
    import { onMount } from "svelte";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import * as d3 from "d3";
    import { getContext } from "svelte";
    import { players } from "../data";
    import { colors, playerTypes, SectionLabels } from "../constants";
  
    let thisSection;
    const sectionLabel = SectionLabels.Type;
    const svg = getContext<any>("svg");
    const playerTypeColorScale = d3.scaleOrdinal(playerTypes, colors);
    const clean = getContext<any>("clean");

    onMount(() => {
        registerFn(sectionLabel, async () => {
            $players = $players.filter((d) => d.team_id !== "")
            clean(sectionLabel);

            $svg
            .select("g.players")
            .selectAll("rect")
            .join('rect')
            .attr("data-id", (d) => d.id)
            .transition()
            .filter((d) => d.team_id === "")
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
            
            let swapArrray = [];
            
            $players.sort((a, b) => {
                const aKey = a.role;
                const bKey = b.role;
    
                return playerTypes.indexOf(aKey) - playerTypes.indexOf(bKey);
            })
            
            $players.forEach((element, index) => {
                const target = `[data-id="${element.id}"]`;
                swapArrray.push(
                    $svg
                        .select("g")
                        .select(target)
                        .transition()
                        .duration(500)
                        .attr("x", Math.floor(index / 10) * 20)
                        .attr("y", index % 10 * 20)
                        .attr("rx", 5)
                        .attr("width", 10)
                        .attr("height", 10)
                        .delay(600)
                        .attr('fill', d => playerTypeColorScale(d.role))
                        .end()
                )
            });

            await Promise
                    .all(swapArrray)
                    .catch((error) => {
                        console.log(error);
                    });
        
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
