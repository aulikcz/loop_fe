const THEME_ALIASES: Record<string, string> = {
  loop: 'loop',
  'tales-from-the-loop': 'loop',
  vaesen: 'vaesen',
  'forbidden-lands': 'forbidden-lands',
};

/** Nastaví téma celé stránky podle herního systému. null = výchozí vzhled. */
export function applySystemTheme(systemCode: string | null) {
  const body = document.body;
  const key = systemCode?.toLowerCase().trim().replace(/\s+/g, '-') ?? '';
  const theme = THEME_ALIASES[key];
  if (theme) {
    body.dataset['system'] = theme;
  } else {
    delete body.dataset['system'];
  }
}