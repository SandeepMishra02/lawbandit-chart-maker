"use client";

/** Mount-time theme bootstrap (runs before paint) */
export default function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){
  try {
    var k='lb-theme';
    var saved = localStorage.getItem(k);
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(_) {}
})();`,
      }}
    />
  );
}




