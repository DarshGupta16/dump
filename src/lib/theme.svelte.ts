export type ThemeMode = 'system' | 'light' | 'dark';

class ThemeStore {
  mode = $state<ThemeMode>('system');
  resolved = $state<'light' | 'dark'>('dark');

  init() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('dump_theme') as ThemeMode | null;
    if (saved && (saved === 'system' || saved === 'light' || saved === 'dark')) {
      this.mode = saved;
    } else {
      this.mode = 'system';
    }

    this.apply();

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', () => {
      if (this.mode === 'system') {
        this.apply();
      }
    });
  }

  setTheme(newMode: ThemeMode) {
    this.mode = newMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dump_theme', newMode);
      this.apply();
    }
  }

  cycleTheme() {
    if (this.mode === 'system') {
      this.setTheme('dark');
    } else if (this.mode === 'dark') {
      this.setTheme('light');
    } else {
      this.setTheme('system');
    }
  }

  apply() {
    if (typeof window === 'undefined') return;

    let isDark = true;
    if (this.mode === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = this.mode === 'dark';
    }

    this.resolved = isDark ? 'dark' : 'light';
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }
}

export const themeStore = new ThemeStore();
