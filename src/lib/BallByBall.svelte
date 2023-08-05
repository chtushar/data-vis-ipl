<script>
  import { writable } from "svelte/store";
  import uniq from "lodash/uniq";
  import { scaleLinear } from "d3-scale";
  import { getBallWiseRunScored } from "../utils/data";
  import Axis from "./Axis.svelte";

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
  const changingMatch = writable(false);
  const currentBall = writable(1);
  const currentMatch = writable(1);
  const containerHeight = writable(0);
  const containerWidth = writable(0);

  const matchWiseCumulativeBalls = {};
  const allBatters = uniq($data.map(({ batter }) => batter));

  $: ballWiseBattersScore = getBallWiseRunScored($data);
  for (const ball in $data) {
    matchWiseCumulativeBalls[$data?.[ball].match_number] = parseInt(ball) + 1;
  }

  $: innerHeight = $containerHeight - margin.top - margin.bottom;
  $: innerWidth = $containerWidth - margin.left - margin.right;

  $: xScale = scaleLinear()
    .domain([-100, maxDomainRuns])
    .range([0, innerWidth]);
  $: yScale = scaleLinear()
    .domain([0, maxDomainStrikeRate])
    .range([innerHeight, 0]);

  $: {
    if ($changingBall && !$changingMatch) {
      $currentMatch = $data[$currentBall - 1].match_number;
    } else if (!$changingBall && $changingMatch) {
      $currentBall = matchWiseCumulativeBalls[$currentMatch];
    }
  }
</script>

<main class="w-full h-full">
  <div class="sections">
    <div
      class="col-span-4 aspect-[675/610] h-full max-h-[610px] col-start-3 col-end-7 flex flex-col"
    >
      <div class="border border-solid border-[#E0E0E0] flex-1 rounded-[20px]">
        <div />
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
                  <svg
                    viewBox="0 0 {$containerWidth} {$containerHeight}"
                    class="w-full h-full"
                  >
                    <g transform="translate({margin.left} {margin.top})">
                      {#each Object.keys(ballWiseBattersScore[$currentBall - 1]) as d, i}
                        <circle
                          cx={xScale(
                            ballWiseBattersScore[$currentBall - 1][d].runs
                          )}
                          cy={yScale(
                            (ballWiseBattersScore[$currentBall - 1][d].runs /
                              ballWiseBattersScore[$currentBall - 1][d].balls) *
                              100
                          )}
                          r="3"
                          stroke="#006d77"
                          fill="#83c5be"
                        />
                      {/each}
                      <Axis
                        margin={10}
                        {innerHeight}
                        position="left"
                        scale={yScale}
                        ticks={5}
                        hideDomain={true}
                        showGridLines={true}
                      />
                      <Axis
                        margin={10}
                        {innerHeight}
                        position="bottom"
                        scale={xScale}
                        ticks={maxDomainRuns / 100}
                      />
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
        <input
          class="w-full"
          type="range"
          bind:value={$currentBall}
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
