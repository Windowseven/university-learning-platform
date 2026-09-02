import Script from 'next/script'

const THEME_INIT = `(function(){try{var s=localStorage.getItem('platform-theme');var t=s==='light'||s==='dark'||s==='system'?s:'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(r);}catch(e){}})();`

export function ThemeScript() {
  return <Script id="platform-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
}
