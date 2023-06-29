<script>
  import { writable } from "svelte/store";
  import { getContext } from "svelte";
  import uniq from "lodash/uniq";
  import { scaleLinear } from "d3-scale";
  import { getBallWiseRunScored } from "../utils/data";
  import Axis from "./Axis.svelte";

  const data = getContext("data");

  let container;
  const margin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };
  const maxDomainRuns = 950;
  const maxDomainStrikeRate = 600;

  // Calculated to avoid calculations at the runtime
  const meanRuns = 146.17;
  const stdDeviationRuns = 177.46;
  const meanStrikeRate = 105.71;
  const stdDeviationStrikeRate = 52.03;
  const meanBoundaryPercentage = 50.87;
  const stdDeviationBoundaryPercentage = 25.201;

  const changingBall = writable(false);
  const changingMatch = writable(false);
  const currentBall = writable(1);
  const currentMatch = writable(1);
  const containerHeight = writable(0);
  const containerWidth = writable(0);

  const matchWiseCumulativeBalls = {};
  const allBatters = uniq($data.map(({ batter }) => batter));
  const ballWiseBattersScore = getBallWiseRunScored($data);

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

<div class="hero relative gap-20">
  <div
    bind:this={container}
    bind:clientHeight={$containerHeight}
    bind:clientWidth={$containerWidth}
    class="aspect-[3/2] max-h-96 h-full relative w-full max-w-3xl"
  >
    <svg
      viewBox="0 0 {$containerWidth} {$containerHeight}"
      class="w-full h-full"
    >
      <g transform="translate({margin.left} {margin.top})">
        {#each Object.keys(ballWiseBattersScore[$currentBall - 1]) as d, i}
          <circle
            cx={xScale(ballWiseBattersScore[$currentBall - 1][d].runs)}
            cy={yScale(
              (ballWiseBattersScore[$currentBall - 1][d].runs /
                ballWiseBattersScore[$currentBall - 1][d].balls) *
                100
            )}
            r="2"
          />
        {/each}
        <Axis
          margin={10}
          {innerHeight}
          position="left"
          scale={yScale}
          ticks={5}
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
  <div>
    <p>
      Ball No.: {$currentBall}
    </p>
    <p>
      Match No.: {$data[$currentBall - 1].match_number}
    </p>
  </div>
  <div
    bind:clientWidth={$containerWidth}
    class="aspect-[3/2] space-y-4 relative w-full max-w-3xl"
  >
    <div>
      <input
        class="w-full"
        type="range"
        bind:value={$currentMatch}
        min={1}
        max={$data[$data.length - 1]["match_number"]}
        on:mousedown={() => {
          $changingMatch = true;
        }}
        on:mouseup={() => {
          $changingMatch = false;
        }}
      />
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
    </div>
  </div>
</div>

<style lang="postcss">
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
