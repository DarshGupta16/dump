<script lang="ts">
  import { getAppStoreContext } from '../../store.svelte';

  interface Props {
    scrollY: number;
    revealThreshold?: number;
  }

  let { scrollY, revealThreshold = 420 }: Props = $props();

  const store = getAppStoreContext();

  let inputFocused = $state(false);

  let heroTranslateY = $derived(scrollY * 1.4);
  let heroOpacity = $derived(
    Math.max(0, 1 - (scrollY / (revealThreshold * 0.8)))
  );

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      store.onInputSubmit(e);
    }
  }

  function scrollToDumps() {
    window.scrollTo({ top: revealThreshold + 40, behavior: "smooth" });
  }
</script>

<!-- FOREGROUND LAYER: Centered Input Dock that lifts up on scroll -->
<div 
  class="fixed inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none transition-opacity duration-150"
  style="transform: translate3d(0, -{heroTranslateY}px, 0); opacity: {heroOpacity};"
>
  <div class="w-full max-w-2xl {heroOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'}">
    <!-- Title -->
    <div class="mb-6 text-center">
      <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
        dump
      </h1>
    </div>

    <!-- Functional Input Box -->
    <div class="relative w-full">
      <div class="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-200 focus-within:border-slate-400 focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.1)] dark:border-white/[0.1] dark:bg-[#0e111a] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] dark:focus-within:border-white/30">
        <textarea
          id="main-dump-input"
          rows={3}
          class="w-full resize-none border-0 bg-transparent p-1 text-base sm:text-lg font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Type a dump or search query..."
          bind:value={store.userinput}
          onfocus={() => (inputFocused = true)}
          onblur={() => (inputFocused = false)}
          onkeydown={handleKeyDown}
        ></textarea>

        <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5 px-1 dark:border-white/[0.05]">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">
            Press Enter ↵
          </span>

          <button
            type="button"
            onclick={() => handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))}
            disabled={store.userinput.trim().length === 0}
            title="Submit dump or query"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator at bottom of initial viewport -->
  <div class="absolute bottom-8 left-0 right-0 flex justify-center {heroOpacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'}">
    <button
      type="button"
      onclick={scrollToDumps}
      class="group flex flex-col items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
    >
      <span>scroll to view dumps</span>
      <svg class="h-4 w-4 animate-bounce opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  </div>
</div>
