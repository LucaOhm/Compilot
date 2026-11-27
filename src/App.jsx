import { useEffect } from 'react';
import { useRoute } from './lib/router.jsx';
import { DemoProvider } from './lib/store.jsx';
import { LangProvider } from './lib/i18n.jsx';
import Landing from './landing/Landing.jsx';
import DemoApp from './demo/DemoApp.jsx';
import Legal from './pages/Legal.jsx';

export default function App() {
  const path = useRoute();

  // Bei Seitenwechsel nach oben scrollen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  let page;
  if (path.startsWith('/demo')) page = <DemoApp path={path} />;
  else if (path === '/impressum') page = <Legal kind="impressum" />;
  else if (path === '/datenschutz') page = <Legal kind="datenschutz" />;
  else page = <Landing />;

  return (
    <LangProvider>
      <DemoProvider>{page}</DemoProvider>
    </LangProvider>
  );
}
