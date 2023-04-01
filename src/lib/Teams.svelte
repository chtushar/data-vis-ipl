<script lang="ts">
    import { onMount, getContext } from "svelte";
    import * as d3 from "d3";
    import sortBy from 'lodash/sortBy'
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { players } from "../data";
    import { SectionLabels } from "../constants";


    let thisSection;
    const sectionLabel = SectionLabels.Teams;
    const svg = getContext<any>("svg");
    const dimensions = getContext<any>("dimensions");
    const scales = getContext<any>("scales");
    const clean = getContext<any>("clean");

    onMount(() => {
        registerFn(sectionLabel, async () => {
            $players = sortBy($players, 'team_id');
            clean(sectionLabel);
            let swapArrray = [];
            const barWidth = 500 / $players.length;

            $players
            .forEach((element, i) => {
                const target = `[data-id="${element.id}"]`;
                const yScaleValue = scales.soldPriceYScale(element.sold_price);
                const barHeight = dimensions.height - 2 * dimensions.margin.top - dimensions.margin.bottom - yScaleValue;

                swapArrray.push(
                    $svg
                        .select("g.players")
                        .select(target)
                        .transition()
                        .duration(500)
                        .attr('fill', d => scales.playerTypeColorScale(d.role))
                        .attr("x", i * barWidth)
                        .attr("y", yScaleValue)
                        .attr("rx", 0)
                        .attr("width", barWidth)
                        .attr("height", barHeight)
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
        Teams
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>