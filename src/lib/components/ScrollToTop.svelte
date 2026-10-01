<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    threshold?: number;
  }

  let { threshold = 500 }: Props = $props();

  let show = $state(false);

  onMount(() => {
    const handleScroll = () => {
      show = window.scrollY > threshold;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

{#if show}
  <button
    type="button"
    onclick={scrollToTop}
    title="Back to top"
    class="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 dark:border-white/[0.1] dark:bg-[#111622]/90 dark:text-slate-300"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
{/if}
