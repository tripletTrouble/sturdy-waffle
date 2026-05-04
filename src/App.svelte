<script lang="ts">
  import Home from "./pages/Home.svelte";
  import SyncGuide from "./pages/SyncGuide.svelte";
  import Router from "svelte-spa-router";

  const routes = {
    '/': Home,
    '/sync-guide': SyncGuide,
  }
</script>

<Router {routes} />