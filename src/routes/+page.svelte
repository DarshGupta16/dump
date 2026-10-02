<script lang="ts">
  import { onMount } from 'svelte';
  import { getAppStoreContext } from '../store.svelte';
  import Background from '$lib/components/Background.svelte';
  import Header from '$lib/components/Header.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import ScrollToTop from '$lib/components/ScrollToTop.svelte';
  import DumpCard from '$lib/components/DumpCard.svelte';

  const store = getAppStoreContext();

  let scrollY = $state(0);
  const REVEAL_THRESHOLD = 420;

  let isQueryMode = $derived(store.isQuerying || store.showingQueryDumps);

  let revealProgress = $derived(
    isQueryMode ? 1 : Math.min(1, Math.max(0, scrollY / REVEAL_THRESHOLD))
  );

  let dumpsPinOffset = $derived(
    isQueryMode ? 0 : Math.min(scrollY, REVEAL_THRESHOLD)
  );

  onMount(() => {
    scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<div class="relative {isQueryMode ? 'min-h-screen' : 'min-h-[180vh]'} bg-[#f8fafc] text-slate-900 transition-colors duration-200 dark:bg-[#090a0f] dark:text-slate-100">
  <Background />
  <Header />
  <Hero {scrollY} revealThreshold={REVEAL_THRESHOLD} />

  <!-- DUMPS DISPLAY LAYER -->
  <main 
    id="dumps-list"
    class="relative z-10 mx-auto w-full px-6 sm:px-10 lg:px-14 xl:px-16 pb-32 pt-32 sm:pt-36 will-change-transform transition-all duration-300 {isQueryMode ? 'max-w-4xl' : 'max-w-[94rem]'}"
    style="
      transform: perspective(1100px) translate3d(0, {dumpsPinOffset}px, {(1 - revealProgress) * -120}px) scale({0.86 + 0.14 * revealProgress});
      opacity: {revealProgress};
      filter: blur({(1 - revealProgress) * 6}px);
      pointer-events: {revealProgress > 0.45 ? 'auto' : 'none'};
    "
  >
    <!-- Section Header with clear breathing room -->
    <div class="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/[0.06]">
      <h2 class="text-sm font-mono tracking-wider uppercase text-slate-500 dark:text-slate-400">
        {#if store.isQuerying}
          Evaluating relevance for "{store.userinput}"...
        {:else if store.showingQueryDumps}
          Query Results ({store.dumpsBeingDisplayed.length})
        {:else}
          Dumps ({store.dumpsBeingDisplayed.length})
        {/if}
      </h2>

      {#if store.showingQueryDumps}
        <button
          type="button"
          onclick={() => store.clearQuery()}
          class="font-mono text-xs text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
        >
          ✕ Clear Query
        </button>
      {/if}
    </div>

    <!-- Query Loading State: Skeleton Cards -->
    {#if store.isQuerying}
      <div class="flex flex-col gap-4">
        {#each [1, 2, 3] as _}
          <div class="rounded-xl border border-slate-200/80 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0d1017]/70 animate-pulse">
            <div class="mb-3 flex items-center justify-between">
              <div class="h-3 w-24 rounded bg-slate-200 dark:bg-white/10"></div>
              <div class="h-3 w-10 rounded bg-slate-200 dark:bg-white/10"></div>
            </div>
            <div class="mb-4 h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10"></div>
            <div class="space-y-2 mb-4">
              <div class="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/10"></div>
              <div class="h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10"></div>
            </div>
            <div class="flex justify-between pt-3 border-t border-slate-100 dark:border-white/[0.05]">
              <div class="h-3 w-14 rounded bg-slate-200 dark:bg-white/10"></div>
              <div class="h-3 w-10 rounded bg-slate-200 dark:bg-white/10"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if store.showingQueryDumps}
      <!-- Query Results: Wider cards, one after the other -->
      {#if store.dumpsBeingDisplayed.length === 0}
        <div class="rounded-xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400 dark:border-white/[0.08] dark:text-slate-500">
          No relevant dumps found for "{store.userinput}".
          <div class="mt-4">
            <button
              type="button"
              onclick={() => store.clearQuery()}
              class="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Clear query
            </button>
          </div>
        </div>
      {:else}
        <div class="flex flex-col gap-4">
          {#each store.dumpsBeingDisplayed as dump (dump.id)}
            <DumpCard {dump} />
          {/each}
        </div>
      {/if}
    {:else}
      <!-- Default Masonry Grid (Preserved) -->
      {#if store.dumpsBeingDisplayed.length === 0}
        <div class="rounded-xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400 dark:border-white/[0.08] dark:text-slate-500">
          No dumps yet. Type something above and hit Enter.
        </div>
      {:else}
        <div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
          {#each store.dumpsBeingDisplayed as dump (dump.id)}
            <div class="break-inside-avoid mb-6">
              <DumpCard {dump} />
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </main>

  <ScrollToTop threshold={REVEAL_THRESHOLD + 120} />
</div>
