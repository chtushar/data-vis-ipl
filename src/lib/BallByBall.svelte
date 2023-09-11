<script>
  import { writable } from "svelte/store";
  import uniq from "lodash/uniq";
  import { scaleLinear } from "d3-scale";
  import { countBall, getLastFilledIndex } from "../utils/data";
  import Axis from "./Axis.svelte";
  import RangeSlider from "svelte-range-slider-pips";

  const cache = writable([]);
  const data = writable([]);

  const fetchJson = async () => {
    const res = await fetch("/ball-by-ball-2.json");
    const newData = await res.json();
    if (res.ok) {
      $data = newData;
      return true;
    } else {
      throw new Error(newData);
    }
  };

  let container;
  const margin = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  };
  const maxDomainRuns = 950;
  const maxDomainStrikeRate = 300;

  const changingBall = writable(false);
  const showHovercard = writable(false);
  const currentBall = writable([1]);
  const containerHeight = writable(0);
  const containerWidth = writable(0);

  const allBatters = uniq($data.map(({ batter }) => batter));

  $: innerHeight = $containerHeight - margin.top - margin.bottom;
  $: innerWidth = $containerWidth - margin.left - margin.right;

  $: xScale = scaleLinear()
    .domain([-100, maxDomainRuns])
    .range([0, innerWidth]);
  $: yScale = scaleLinear()
    .domain([0, maxDomainStrikeRate])
    .range([innerHeight, 0]);

  $: {
    if (typeof $cache[$currentBall[0] - 1] === "undefined") {
      const lastFilledIndex = getLastFilledIndex($currentBall[0] - 1, $cache);
      for (let i = lastFilledIndex + 1; i < $currentBall[0]; i++) {
        const currentBatterScore =
          $cache?.[i - 1]?.[$data[i].batter]?.runs ?? 0;
        const currentBatterBalls =
          $cache?.[i - 1]?.[$data[i].batter]?.balls ?? 0;
        const ballFactor = countBall($data[i].extras);

        $cache[i] = {
          ...$cache[i - 1],
          [$data[i].batter]: {
            runs: currentBatterScore + ($data?.[i].runs.batter ?? 0),
            balls: currentBatterBalls + 1 + ballFactor,
          },
        };
      }
    }
  }
</script>

<main class="w-full h-full">
  <div class="sections">
    <div
      class="col-span-4 col-start-3 col-end-7 flex flex-col items-center justify-center"
    >
      <div class="aspect-[675/610] h-full max-h-[610px] w-full flex flex-col">
        <div
          class="border border-solid border-[#E0E0E0] flex-1 flex flex-col items-stretch rounded-[20px]"
        >
          <div class="flex flex-col gap-6 items-stretch p-6 pb-0">
            <div>
              <h2 class="text-2xl font-bold">IPL Ball by Ball</h2>
            </div>
            <div class="flex justify-between">
              <div class="text-sm text-[#212121] flex gap-4">
                <span>
                  <span class="text-[#949494]">X</span>
                  <span>Runs Scored</span>
                </span>
                <span>
                  <span class="text-[#949494]">Y</span>
                  <span>Strike Rate</span>
                </span>
              </div>
            </div>
          </div>
          <div class="w-full h-full p-6">
            {#await fetchJson()}
              <p>loading</p>
            {:then show}
              {#if show}
                <div class="relative w-full h-full">
                  <div
                    bind:this={container}
                    bind:clientHeight={$containerHeight}
                    bind:clientWidth={$containerWidth}
                    class="h-full relative w-full"
                  >
                    {#if $showHovercard}
                      <div class="absolute">Tushar</div>
                    {/if}
                    <svg
                      viewBox="0 0 {$containerWidth} {$containerHeight}"
                      class="w-full h-full"
                    >
                      <g transform="translate({margin.left} {margin.top})">
                        <Axis
                          margin={10}
                          {innerHeight}
                          {innerWidth}
                          position="left"
                          scale={yScale}
                          ticks={5}
                        />
                        <Axis
                          margin={10}
                          {innerHeight}
                          {innerWidth}
                          position="bottom"
                          scale={xScale}
                          ticks={maxDomainRuns / 100}
                        />
                        {#if typeof $cache[$currentBall[0] - 1] !== "undefined"}
                          {#each Object.keys($cache[$currentBall[0] - 1]) as d, i}
                            <circle
                              cx={xScale($cache[$currentBall[0] - 1][d].runs)}
                              cy={yScale(
                                ($cache[$currentBall[0] - 1][d].runs /
                                  $cache[$currentBall[0] - 1][d].balls) *
                                  100
                              )}
                              r="3"
                              on:mouseenter={() => {
                                $showHovercard = true;
                              }}
                              on:mouseleave={() => {
                                $showHovercard = false;
                              }}
                              stroke="#006d77"
                              fill="#83c5be"
                            />
                          {/each}
                        {/if}
                      </g>
                    </svg>
                  </div>
                </div>
              {/if}
            {:catch error}
              <p style="color: red">{error.message}</p>
            {/await}
          </div>
        </div>
        <div
          class="border border-solid border-[#E0E0E0] rounded-[20px] p-6 -translate-y-[1px]"
        >
          <div class="w-full flex justify-between">
            <span class="text-xs text-[#949494]">1 ball</span>
            <span class="text-xs text-[#949494]">17863 balls</span>
          </div>
          <RangeSlider
            range="min"
            bind:values={$currentBall}
            min={1}
            max={$data.length}
            on:mousedown={() => {
              $changingBall = true;
            }}
            on:mouseup={() => {
              $changingBall = false;
            }}
          />
          <div class="w-full flex justify-between">
            <span class="text-xs text-[#949494]">First Match</span>
            <span class="text-xs text-[#949494]">Final Match</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style lang="postcss">
  main {
    display: grid;
  }
  .sections {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    @apply items-center;
  }
  .hero {
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @apply col-start-2 col-end-8 py-20;
  }

  mark {
    cursor: default;
  }
</style>
