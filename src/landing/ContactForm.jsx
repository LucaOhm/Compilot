// Kontaktformular. Versandweg wird in src/data/site.js eingestellt:
//  – formEndpoint gesetzt → Versand direkt an den Formular-Dienst
//  – sonst → E-Mail-Programm öffnet sich mit vorausgefüllter Nachricht
import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { Button } from '../components/ui.jsx';
import { SITE } from '../data/site.js';
import { useT } from '../lib/i18n.jsx';

const T = {
  de: {
    interests: [['demo', 'Persönliche Demo'], ['pilot', 'Pilotphase testen'], ['info', 'Auf dem Laufenden bleiben']],
    title: 'Demo oder Pilotphase anfragen',
    sub: 'Wir melden uns persönlich – kein Newsletter, kein Vertrieb von der Stange.',
    name: 'Name', office: 'Büro', email: 'E-Mail', size: 'Personen im Büro', msg: 'Nachricht (optional)',
    placeholder: 'An welchen Verfahren nehmen Sie typischerweise teil? Was kostet Sie am meisten Zeit?',
    send: 'Anfrage senden', sending: 'Wird gesendet …',
    privacy: 'Mit dem Absenden willigen Sie ein, dass wir Ihre Angaben zur Bearbeitung der Anfrage verwenden. Details in der',
    privacyLink: 'Datenschutzerklärung',
    error: 'Das Senden hat nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie an',
    doneTitle: 'Danke für Ihr Interesse.',
    doneSent: 'Ihre Anfrage ist bei uns angekommen. Wir melden uns in Kürze persönlich.',
    doneMail: 'Ihr E-Mail-Programm sollte sich mit einer vorbereiteten Nachricht geöffnet haben. Bitte senden Sie diese ab – wir melden uns persönlich.',
    fallback: 'Kein E-Mail-Programm geöffnet? Schreiben Sie uns direkt an',
    again: 'Weitere Anfrage',
    sizes: ['1', '2–4', '5–9', '10 oder mehr'],
  },
  en: {
    interests: [['demo', 'Personal demo'], ['pilot', 'Join the pilot'], ['info', 'Keep me posted']],
    title: 'Request a demo or the pilot',
    sub: 'We get back to you personally – no newsletter, no generic sales pitch.',
    name: 'Name', office: 'Practice', email: 'Email', size: 'People in the practice', msg: 'Message (optional)',
    placeholder: 'Which procedures do you usually enter? What costs you the most time?',
    send: 'Send request', sending: 'Sending …',
    privacy: 'By submitting you agree that we use your details to process your request. Details in our',
    privacyLink: 'privacy policy',
    error: 'Sending failed. Please try again or write to',
    doneTitle: 'Thank you for your interest.',
    doneSent: 'Your request has arrived. We will get back to you personally soon.',
    doneMail: 'Your email client should have opened with a prepared message. Please send it – we will get back to you personally.',
    fallback: 'No email client opened? Write to us directly at',
    again: 'Another request',
    sizes: ['1', '2–4', '5–9', '10 or more'],
  },
};

export default function ContactForm() {
  const t = useT(T);
  const [form, setForm] = useState({ name: '', office: '', email: '', size: '2–4', interest: 'pilot', message: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent | mail | error
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const interestLabel = t.interests.find(([k]) => k === form.interest)[1];
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
      `${t.name}: ${form.name}`,
      `${t.office}: ${form.office}`,
      `${t.email}: ${form.email}`,
      `${t.size}: ${form.size}`,
      `Interesse / Interest: ${interestLabel}`,
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
        <h3>{t.doneTitle}</h3>
        <p>{state === 'sent' ? t.doneSent : t.doneMail}</p>
        {state === 'mail' && (
          <p className="form__fallback">
            {t.fallback} <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>.
          </p>
        )}
        <Button variant="secondary" size="sm" onClick={() => setState('idle')}>
          {t.again}
        </Button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form__title">
        <h3>{t.title}</h3>
        <p>{t.sub}</p>
      </div>
      <div className="form__seg" role="radiogroup">
        {t.interests.map(([k, l]) => (
          <button type="button" key={k} role="radio" aria-checked={form.interest === k} className={form.interest === k ? 'is-on' : ''} onClick={() => setForm({ ...form, interest: k })}>
            {l}
          </button>
        ))}
      </div>
      <div className="form__row">
        <label className="field">
          <span>{t.name}</span>
          <input className="input" required value={form.name} onChange={set('name')} autoComplete="name" />
        </label>
        <label className="field">
          <span>{t.office}</span>
          <input className="input" value={form.office} onChange={set('office')} autoComplete="organization" />
        </label>
      </div>
      <div className="form__row">
        <label className="field">
          <span>{t.email}</span>
          <input className="input" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </label>
        <label className="field">
          <span>{t.size}</span>
          <select className="select" value={form.size} onChange={set('size')}>
            {t.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>{t.msg}</span>
        <textarea className="textarea" value={form.message} onChange={set('message')} placeholder={t.placeholder} />
      </label>
      {state === 'error' && (
        <p className="form__error">
          {t.error} {SITE.contact.email}.
        </p>
      )}
      <Button type="submit" size="lg" icon="arrowRight" disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.send}
      </Button>
      <p className="form__privacy">
        {t.privacy} <a href="#/datenschutz">{t.privacyLink}</a>.
      </p>
    </form>
  );
}
