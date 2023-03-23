<script lang="ts">
    import { onMount, getContext } from "svelte";
    import * as d3 from "d3";
    import Section from "./Section.svelte";
    import { observer } from "../utils/observer";
    import { registerFn } from "../utils/register";
    import { players } from "../data";
    import { SectionLabels } from "../constants";


    let thisSection;
    const sectionLabel = SectionLabels.Role;
    const svg = getContext<any>("svg");
    const dimensions = getContext<any>("dimensions");
    const scales = getContext<any>("scales");
    const clean = getContext<any>("clean");

    onMount(() => {
        registerFn(sectionLabel, async () => {
            clean(sectionLabel);
            let swapArrray = [];
            const barWidth = 500 / $players.length;

            $players
            .forEach((element, i) => {
                const target = `[data-id="${element.id}"]`;
                const barHeight = scales.soldPriceYScale(element.sold_price);

                swapArrray.push(
                    $svg
                        .select("g")
                        .select(target)
                        .transition()
                        .duration(500)
                        .attr('fill', d => scales.playerTypeColorScale(d.role))
                        .attr("x", i * barWidth)
                        .attr("y", dimensions.height - 2 * dimensions.margin.top - dimensions.margin.bottom - barHeight)
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
        Role
    </div>
</Section>
  
<style>
    .section-content {
        height: 100%;
    }
</style>
