<script lang="ts">
  import { onMount } from 'svelte';
  import { themeStore } from '$lib/theme.svelte';

  onMount(() => {
    themeStore.init();
  });
</script>

<!-- Minimal Top Header -->
<header class="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4">
  <div class="font-mono text-sm font-semibold tracking-wider opacity-60">
    dump
  </div>

  <!-- Theme Switcher: System / Light / Dark -->
  <div class="flex items-center rounded-full border border-slate-200/90 bg-white/80 p-1 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.04]">
    <button
      type="button"
      onclick={() => themeStore.setTheme('system')}
      title="Follow system theme"
      class="flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors {themeStore.mode === 'system' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'}"
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    </button>

    <button
      type="button"
      onclick={() => themeStore.setTheme('light')}
      title="Light theme"
      class="flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors {themeStore.mode === 'light' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'}"
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>

    <button
      type="button"
      onclick={() => themeStore.setTheme('dark')}
      title="Dark theme"
      class="flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors {themeStore.mode === 'dark' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200'}"
    >
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  </div>
</header>
