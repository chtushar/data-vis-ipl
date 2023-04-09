<script lang="ts">
</script>

<section>
  <slot />
</section>

<style>
  section {
    --margin: calc((100vh - 400px) / 2);
    margin: var(--margin) 0;
    height: 400px;
    padding: 24px;
  }
</style>
