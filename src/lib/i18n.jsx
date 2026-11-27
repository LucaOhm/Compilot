// Sprachumschaltung Deutsch / Englisch.
// Texte liegen je Bereich in src/i18n/*.js als { de: {...}, en: {...} }.
import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'compilot-lang';
const Ctx = createContext({ lang: 'de', setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'en' ? 'en' : 'de';
    } catch {
      return 'de';
    }
  });
  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* ignorieren */
    }
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

/** Liefert die Texte eines Wörterbuchs in der aktuellen Sprache. */
export function useT(dict) {
  const { lang } = useContext(Ctx);
  return dict[lang] || dict.de;
}

export function LangToggle({ className = '' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`langtoggle ${className}`} role="group" aria-label="Sprache / Language">
      {['de', 'en'].map((l) => (
        <button key={l} className={lang === l ? 'is-on' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
