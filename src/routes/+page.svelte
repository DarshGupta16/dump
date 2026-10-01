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

  let revealProgress = $derived(
    Math.min(1, Math.max(0, scrollY / REVEAL_THRESHOLD))
  );

  let dumpsPinOffset = $derived(
    Math.min(scrollY, REVEAL_THRESHOLD)
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

<div class="relative min-h-[180vh] bg-[#f8fafc] text-slate-900 transition-colors duration-200 dark:bg-[#090a0f] dark:text-slate-100">
  <Background />
  <Header />
  <Hero {scrollY} revealThreshold={REVEAL_THRESHOLD} />

  <!-- BACKGROUND REVEAL LAYER: Dumps Masonry Grid -->
  <main 
    id="dumps-list"
    class="relative z-10 mx-auto w-full max-w-[94rem] px-6 sm:px-10 lg:px-14 xl:px-16 pb-32 pt-32 sm:pt-36 will-change-transform"
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
        Dumps ({store.dumpsBeingDisplayed.length})
      </h2>
    </div>

    <!-- Dumps Masonry Grid -->
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
  </main>

  <ScrollToTop threshold={REVEAL_THRESHOLD + 120} />
</div>
