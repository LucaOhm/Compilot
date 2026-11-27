// Kontaktformular. Versandweg wird in src/data/site.js eingestellt:
//  – formEndpoint gesetzt → Versand direkt an den Formular-Dienst
//  – sonst → E-Mail-Programm öffnet sich mit vorausgefüllter Nachricht
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button } from '../components/ui.jsx';
import { SITE } from '../data/site.js';

const INTERESTS = [
  ['demo', 'Persönliche Demo'],
  ['pilot', 'Pilotbüro werden'],
  ['info', 'Auf dem Laufenden bleiben'],
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', office: '', email: '', size: '2–4', interest: 'pilot', message: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | mail | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const interestLabel = INTERESTS.find(([k]) => k === form.interest)[1];
    if (SITE.contact.formEndpoint) {
      setState('sending');
      try {
        const res = await fetch(SITE.contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...form, interest: interestLabel }),
        });
        setState(res.ok ? 'sent' : 'error');
      } catch {
        setState('error');
      }
      return;
    }
    const subject = `Compilot – ${interestLabel}${form.office ? ` (${form.office})` : ''}`;
    const body = [
      `Name: ${form.name}`,
      `Büro: ${form.office}`,
      `E-Mail: ${form.email}`,
      `Bürogröße: ${form.size} Mitarbeitende`,
      `Interesse: ${interestLabel}`,
      '',
      form.message,
    ].join('\n');
    window.location.href = `mailto:${SITE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState('mail');
  };

  if (state === 'sent' || state === 'mail') {
    return (
      <div className="form form--done">
        <span className="form__doneicon">
          <Icon name="check" size={26} stroke={2} />
        </span>
        <h3 className="serif">Danke für euer Interesse.</h3>
        <p>
          {state === 'sent'
            ? 'Eure Anfrage ist bei uns angekommen. Wir melden uns in Kürze persönlich.'
            : 'Euer E-Mail-Programm sollte sich mit einer vorbereiteten Nachricht geöffnet haben. Bitte sendet sie ab – wir melden uns persönlich.'}
        </p>
        {state === 'mail' && (
          <p className="form__fallback">
            Kein E-Mail-Programm geöffnet? Schreibt uns direkt an <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
          </p>
        )}
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__title">
        <h3>Demo oder Pilotprojekt anfragen</h3>
        <p>Wir melden uns persönlich – kein Newsletter, kein Vertrieb von der Stange.</p>
      </div>
      <div className="form__seg" role="radiogroup" aria-label="Interesse">
        {INTERESTS.map(([k, l]) => (
          <button
            type="button"
            key={k}
            role="radio"
            aria-checked={form.interest === k}
            className={form.interest === k ? 'is-on' : ''}
            onClick={() => setForm({ ...form, interest: k })}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="form__row">
        <label className="field">
          <span>Name</span>
          <input className="input" required value={form.name} onChange={set('name')} autoComplete="name" />
        </label>
        <label className="field">
          <span>Büro</span>
          <input className="input" value={form.office} onChange={set('office')} autoComplete="organization" />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>E-Mail</span>
          <input className="input" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </label>
        <label className="field">
          <span>Mitarbeitende</span>
          <select className="select" value={form.size} onChange={set('size')}>
            {['1', '2–4', '5–9', '10 oder mehr'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Nachricht (optional)</span>
        <textarea className="textarea" value={form.message} onChange={set('message')} placeholder="Woran nehmt ihr typischerweise teil? Was kostet euch am meisten Zeit?" />
      </label>
      {state === 'error' && <p className="form__error">Senden hat nicht geklappt. Bitte versucht es erneut oder schreibt an {SITE.contact.email}.</p>}
      <Button type="submit" size="lg" icon="arrowRight" disabled={state === 'sending'}>
        {state === 'sending' ? 'Wird gesendet …' : 'Anfrage senden'}
      </Button>
      <p className="form__privacy">
        Mit dem Absenden willigt ihr ein, dass wir eure Angaben zur Bearbeitung der Anfrage verwenden. Details in der{' '}
        <a href="#/datenschutz">Datenschutzerklärung</a>.
      </p>
    </form>
  );
}
