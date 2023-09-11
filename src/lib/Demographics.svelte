<script>
  import { writable } from "svelte/store";
  import * as Sankey from "d3-sankey";
  import { getContext, onMount } from "svelte";
  import { generateSankeyLinks } from "../utils";
  import { clickOutside } from "../utils/clickOutside";
  import { nationalityColors, teamColors, roleColors } from "../constants";
  import SankeyPath from "./Sankey/SankeyPath.svelte";

  let container;
  let paragraphTag;

  const containerHeight = writable(0);
  const containerWidth = writable(0);
  const listRef = writable(null);

  const showListOfPlayers = writable(false);
  const listOfPlayers = writable([]);
  const listLocation = writable({
    x: 0,
    y: 0,
  });

  const data = getContext("data");
  const links = generateSankeyLinks(data);
  const linkColors = {
    ...teamColors,
    ...nationalityColors,
    ...roleColors,
  };

  const sankeyNodes = {
    nodes: [
      { id: "GT" },
      { id: "CSK" },
      { id: "LSG" },
      { id: "MI" },
      { id: "RR" },
      { id: "RCB" },
      { id: "KKR" },
      { id: "PBKS" },
      { id: "DC" },
      { id: "SRH" },
      { id: "batter" },
      { id: "bowler" },
      { id: "wk/batter" },
      { id: "all-rounder" },
      { id: "Indian" },
      { id: "Overseas" },
    ],
    links: Object.values(links),
  };

  const colorNodes = (d) => {
    return linkColors?.[d.id] ?? "#333";
  };

  const colorText = (d) => "#263238";

  const nodeAlign = Sankey.sankeyLeft;
  const nodeWidth = 5;
  const nodePadding = 10;
  const nodeId = (d) => d.id;

  const toggleListOfPlayers = () => ($showListOfPlayers = !$showListOfPlayers);

  const handlePopoverData = (e, d) => {
    toggleListOfPlayers();
    const rect = container.getBoundingClientRect();

    $listOfPlayers = d.players;
    $listLocation = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  $: sankey = Sankey.sankey()
    .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .nodeId(nodeId)
    .size([$containerWidth, $containerHeight]);

  $: sankeyData = sankey(sankeyNodes);

  $: link = Sankey.sankeyLinkHorizontal();

  $: fontSize = $containerWidth <= 320 ? 8 : 12;

  $: listStyles = `
    transform: translate(${$listLocation.x}px, ${$listLocation.y}px);
  `;

  $: highlightLinksConfig = {
    source: null,
    target: null,
  };

  onMount(() => {
    const marks = paragraphTag.querySelectorAll("mark");

    const highlightLinks = (e) => {
      highlightLinksConfig = {
        source: e.target.dataset?.source,
        target: e.target.dataset?.target,
      };
    };

    const restLinks = () => {
      highlightLinksConfig = {
        source: null,
        target: null,
      };
    };

    marks.forEach((element) => {
      element.addEventListener("mouseover", highlightLinks);
      element.addEventListener("mouseout", restLinks);

      return () => {
        element.removeEventListener("mouseover", highlightLinks);
        element.removeEventListener("mouseout", restLinks);
      };
    });
  });
</script>

<div class="hero relative gap-20">
  <h1 class="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
    Demographics
  </h1>
  <p
    bind:this={paragraphTag}
    class="text-center max-w-2xl text-base md:text-lg"
  >
    The 2023 season of IPL featured a total of 198 players who participated in
    at least one match, with <mark
      style="background-color: {nationalityColors['Indian']}33;"
      data-source="Indian"
      data-target="Indian">133 being Indians</mark
    >
    and
    <mark
      style="background-color: {nationalityColors['Overseas']}33;"
      data-source="Overseas"
      data-target="Overseas">65 from overseas</mark
    >. The tournament showcased
    <mark
      style="background-color: {roleColors['all-rounder']}33;"
      data-target="all-rounder">72 all-rounders</mark
    >,
    <mark
      style="background-color: {roleColors['batter']}33;"
      data-target="batter">32 batters</mark
    >,
    <mark
      style="background-color: {roleColors['wk/batter']}33;"
      data-target="wk/batter">23 Wicket-Keeper batters</mark
    >, and
    <mark
      style="background-color: {roleColors['bowler']}33;"
      data-target="bowler">71 bowlers</mark
    >.
    <span class="hidden md:inline"
      >Click on any of the links to see the list of players.</span
    >
  </p>
  <div
    bind:this={container}
    bind:clientHeight={$containerHeight}
    bind:clientWidth={$containerWidth}
    class="aspect-[3/2] max-h-96 h-full relative w-full max-w-3xl"
  >
    {#if $showListOfPlayers}
      <div
        bind:this={$listRef}
        class="absolute top-0 hidden md:block shadow-md left-0 h-36 w-fit overflow-y-scroll bg-white rounded overflow-hidden no-scrollbar"
        use:clickOutside
        on:click_outside={toggleListOfPlayers}
        style={listStyles}
      >
        <ul class="w-full">
          <li
            class="p-2 flex flex-row text-xs border-b border-solid border-slate-200 sticky top-0 bg-white shadow-sm"
          >
            <span class="w-36">Name</span>
            <span class="w-14 text-slate-600">Team</span>
            <span class="w-24 text-slate-600">Role</span>
            <span class="w-24 text-slate-600">Right Handed</span>
            <span class="w-14 text-slate-600">Indian</span>
          </li>
          {#each $listOfPlayers as p}
            <li class="p-2 flex flex-row text-xs">
              <span class="w-36">
                {data[p].name}
              </span>
              <span class="w-14 text-slate-600">
                {data[p].TeamCode}
              </span>
              <span class="w-24 text-slate-600">
                {data[p].role}
              </span>
              <span class="w-24 text-slate-600">
                {data[p].RightHandedBat === "true" ? "Yes" : "No"}
              </span>
              <span class="w-14 text-slate-600">
                {data[p].Nationality === "Indian" ? "Yes" : "No"}
              </span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    <svg
      viewBox="0 0 {$containerWidth} {$containerHeight}"
      class="w-full h-full"
    >
      <g class="sankey-layer">
        <g class="link-group">
          {#each sankeyData.links as d}
            <SankeyPath
              d={link(d)}
              data={d}
              opacity={highlightLinksConfig.source ||
              highlightLinksConfig.target
                ? d.source.id === highlightLinksConfig.source ||
                  d.target.id === highlightLinksConfig.target
                  ? "7F"
                  : "33"
                : "33"}
              on:click={(e) => handlePopoverData(e, d)}
              on:keydown={(e) => handlePopoverData(e, d)}
            />
          {/each}
        </g>
        <g class="rect-group">
          {#each sankeyData.nodes as d, i}
            <rect
              x={d.x0}
              y={d.y0}
              height={d.y1 - d.y0}
              width={d.x1 - d.x0}
              fill={colorNodes(d)}
            />
            <text
              x={d.x0 < $containerWidth / 4 ? d.x1 + 6 : d.x0 - 6}
              y={(d.y1 + d.y0) / 2}
              dy={fontSize / 2 - 2}
              style="fill: {colorText(d)};
              font-size: {fontSize}px;
              text-anchor: {d.x0 < $containerWidth / 4 ? 'start' : 'end'};"
            >
              {d.id}
            </text>
          {/each}
        </g>
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
