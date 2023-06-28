<script>
  import { writable } from "svelte/store";
  import { getContext } from "svelte";
  import { scaleLinear } from "d3-scale";
  import { line } from "d3";
  import Axis from "./Axis.svelte";

  const data = getContext("data");

  const margin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };

  const containerHeight = writable(0);
  const containerWidth = writable(0);
  const currentIndex = writable(0);

  const handleKeydown = () => {};

  const handleWheel = (e) => {
    const newIndex = Math.ceil($currentIndex + e.deltaX / 4 + e.deltaY / 4);
    if (newIndex < 0) {
      $currentIndex = 0;
    } else if (newIndex > $data.length - 1) {
      $currentIndex = Math.ceil($data.length - 1);
    } else {
      $currentIndex = newIndex;
    }
  };

  const handleKeyup = () => {};

  $: innerHeight = $containerHeight - margin.top - margin.bottom;
  $: innerWidth = $containerWidth - margin.left - margin.right;

  $: xScale = scaleLinear().domain([0, $data.length]).range([0, innerWidth]);
  $: yScale = scaleLinear().domain([0, 10]).range([innerHeight, 0]);

  $: points = $data.reduce((acc, p, i) => {
    const x = xScale(i);
    const y = yScale(p.score);

    return acc + `${x} ${y}` + (i === $data.length - 1 ? "" : ",");
  }, "");
</script>

<div class="hero relative gap-20">
  <p>
    {$currentIndex}
  </p>
  <div
    bind:clientHeight={$containerHeight}
    bind:clientWidth={$containerWidth}
    class="aspect-[3/2] max-h-8 h-full relative w-full max-w-3xl"
  >
    <svg
      viewBox="0 0 {$containerWidth} {$containerHeight}"
      class="w-full h-full cursor-ew-resize"
      on:wheel={handleWheel}
    >
      <g
        style="cursor: ew-resize; transform: translate({$containerWidth / 2 -
          $currentIndex * 4}px,{$containerHeight / 4}px)"
      >
        {#each $data as d, i}
          <line
            stroke={i === $currentIndex ? "#0000ff" : "#bbb"}
            stroke-width={2}
            x1={i * 4}
            x2={i * 4}
            y1={i < $currentIndex + 4 && i > $currentIndex - 4 ? 0 : 8}
            y2={i < $currentIndex + 4 && i > $currentIndex - 4 ? 32 : 24}
          />
        {/each}
      </g>
    </svg>
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
