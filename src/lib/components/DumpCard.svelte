<script lang="ts">
  export interface DumpItem {
    id: string;
    dump: string;
    created: string;
    updated?: string;
    [key: string]: any;
  }

  interface Props {
    dump: DumpItem;
  }

  let { dump }: Props = $props();

  let copied = $state(false);
  let isExpanded = $state(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(dump.dump);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 1800);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  function formatDate(isoStr: string): string {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    } catch {
      return "";
    }
  }

  function formatContentWithLinks(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex);
  }

  let isLong = $derived(dump.dump.length > 240);
</script>

<article 
  class="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 
         shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 
         hover:border-slate-300 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] 
         dark:border-white/[0.08] dark:bg-[#0d1017] dark:shadow-none 
         dark:hover:border-white/20 dark:hover:bg-[#111622] overflow-hidden"
>
  <!-- Content -->
  <div class="mb-4">
    <div class="text-[15px] font-normal leading-relaxed text-slate-800 dark:text-slate-200 selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 whitespace-pre-wrap break-words">
      {#each formatContentWithLinks(dump.dump) as part}
        {#if part.startsWith('http://') || part.startsWith('https://')}
          <a 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex max-w-full items-center gap-1 font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-4 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-500/40 dark:hover:text-indigo-300 align-baseline"
            title={part}
          >
            <span class="truncate">{part.replace(/^https?:\/\//, '')}</span>
            <svg class="h-3.5 w-3.5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        {:else}
          <span class={!isExpanded && isLong ? "line-clamp-4" : ""}>{part}</span>
        {/if}
      {/each}
    </div>

    {#if isLong}
      <button 
        type="button"
        onclick={() => (isExpanded = !isExpanded)}
        class="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        {isExpanded ? "Show less" : "Show full"}
      </button>
    {/if}
  </div>

  <!-- Footer: Timestamp & Copy action -->
  <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-white/[0.05] dark:text-slate-500">
    <span class="font-mono text-[11px]">
      {formatDate(dump.created)}
    </span>

    <button
      type="button"
      onclick={copyToClipboard}
      title="Copy to clipboard"
      class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-95 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
    >
      {#if copied}
        <svg class="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="text-emerald-500 font-medium text-[11px]">Copied</span>
      {:else}
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="text-[11px]">Copy</span>
      {/if}
    </button>
  </div>
</article>
