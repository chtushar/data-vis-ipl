<script>
  import { sankyLinkColors } from "../../constants";
  export let data;
  export let opacity = 33;

  const handleSankeyHover = (e) => {
    e.target.style = `stroke: ${
      sankyLinkColors?.[data.source.id] + "7F" ?? "#0000007F"
    };`;
  };

  const handleSankeyOut = (e) => {
    e.target.style = `stroke: ${
      sankyLinkColors?.[data.source.id] + 33 ?? "#00000033"
    };`;
  };

  $: style = `
    stroke: ${sankyLinkColors?.[data?.source.id]}${opacity};
  `;
</script>

<path
  {style}
  fill="none"
  stroke-width={data.width}
  class="outline-none"
  on:mouseout={handleSankeyOut}
  on:blur={handleSankeyOut}
  on:mouseover={handleSankeyHover}
  on:focus={handleSankeyHover}
  on:click
  on:keydown
  {...$$props}
/>
