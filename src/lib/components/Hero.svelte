<script lang="ts">
  import { onMount } from 'svelte';
  import { getAppStoreContext } from '../../store.svelte';

  interface Props {
    scrollY: number;
    revealThreshold?: number;
  }

  let { scrollY, revealThreshold = 420 }: Props = $props();

  const store = getAppStoreContext();

  let inputFocused = $state(false);

  let isQueryMode = $derived(store.isQuerying || store.showingQueryDumps);

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

  function handleClear() {
    store.clearQuery();
    const inputEl = document.getElementById("main-dump-input");
    if (inputEl) inputEl.focus();
  }

  onMount(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isQueryMode) {
        handleClear();
      }
    };
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  });

  function scrollToDumps() {
    window.scrollTo({ top: revealThreshold + 40, behavior: "smooth" });
  }
</script>

<!-- FOREGROUND LAYER: Searchbar that glides to top in query mode or lifts on scroll -->
<div 
  class="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none"
  style="
    transform: translate3d(0, {isQueryMode ? 'calc(-50vh + 4.25rem)' : `-${heroTranslateY}px`}, 0);
    opacity: {isQueryMode ? 1 : heroOpacity};
    transition: transform 450ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease;
  "
>
  <div class="w-full max-w-2xl {isQueryMode || heroOpacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'}">
    <!-- Title: smoothly collapses when in query mode -->
    <div class="text-center transition-all duration-300 {isQueryMode ? 'opacity-0 h-0 mb-0 -translate-y-2 overflow-hidden' : 'opacity-100 mb-6'}">
      <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
        dump
      </h1>
    </div>

    <!-- Functional Input Box -->
    <div class="relative w-full">
      <div 
        class="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 focus-within:border-slate-400 focus-within:shadow-[0_12px_36px_rgba(0,0,0,0.1)] dark:border-white/[0.1] dark:bg-[#0e111a] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] dark:focus-within:border-white/30 {isQueryMode ? 'shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.7)]' : ''}"
        onclick={(e) => {
          const target = e.target as HTMLElement | null;
          if (target && !target.closest('button') && target.id !== 'main-dump-input') {
            document.getElementById('main-dump-input')?.focus();
          }
        }}
        role="presentation"
      >
        
        <div class="flex items-start gap-2">
          <textarea
            id="main-dump-input"
            rows={isQueryMode ? 1 : 3}
            class="w-full resize-none border-0 bg-transparent p-1 text-base sm:text-lg font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-relaxed dark:text-slate-100 dark:placeholder:text-slate-500 transition-all duration-300 cursor-text"
            placeholder={isQueryMode ? "Search or enter query..." : "Type a dump or search query..."}
            bind:value={store.userinput}
            onfocus={() => (inputFocused = true)}
            onblur={() => (inputFocused = false)}
            onkeydown={handleKeyDown}
          ></textarea>

          {#if isQueryMode}
            <!-- 'X' Clear Button on the very right -->
            <button
              type="button"
              onclick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              title="Clear query and return (Esc)"
              class="mt-0.5 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 active:scale-95 dark:text-slate-500 dark:hover:bg-white/[0.08] dark:hover:text-slate-200 transition-all"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          {/if}
        </div>

        <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2.5 px-1 dark:border-white/[0.05]">
          <span class="font-mono text-xs text-slate-400 dark:text-slate-500">
            {#if store.isQuerying}
              <span class="inline-flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                <svg class="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Evaluating relevance...
              </span>
            {:else if isQueryMode}
              Press Esc or ✕ to clear
            {:else}
              Press Enter ↵
            {/if}
          </span>

          <button
            type="button"
            onclick={() => handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))}
            disabled={store.isQuerying || store.userinput.trim().length === 0}
            title="Submit dump or query"
            class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {#if store.isQuerying}
              <svg class="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            {:else}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator at bottom of initial viewport (hidden in query mode) -->
  {#if !isQueryMode}
    <div class="absolute bottom-8 left-0 right-0 flex justify-center {heroOpacity > 0.1 ? 'pointer-events-auto' : 'pointer-events-none'} transition-opacity duration-300">
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
  {/if}
</div>
