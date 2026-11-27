// ─────────────────────────────────────────────────────────────
//  Simulierte Unterlagen-Analyse
//  In der Demo wird KEIN Dokument gelesen. Die „Analyse“ setzt
//  sich aus den strukturierten Wettbewerbsdaten (competitions.js)
//  und den Vorgaben der Verfahrensart (procedures.js) zusammen
//  und zeigt, wie ein Ergebnis im echten Produkt aussehen könnte.
// ─────────────────────────────────────────────────────────────
import { PROCEDURES } from '../data/procedures.js';
import { hash, formatDate } from './format.js';

const DOC_TEMPLATES = {
  offen: [
    ['Auslobung', 'PDF', 48],
    ['Raumprogramm', 'XLSX', 0],
    ['Lageplan und Bestandspläne', 'DWG', 0],
    ['Formblätter und Verfassererklärung', 'PDF', 6],
    ['Fotodokumentation', 'ZIP', 0],
  ],
  nichtoffen: [
    ['Bekanntmachung', 'PDF', 6],
    ['Auslobung (Entwurf)', 'PDF', 52],
    ['Bewerbungsbogen', 'PDF', 8],
    ['Raumprogramm', 'XLSX', 0],
    ['Lageplan', 'DWG', 0],
  ],
  vgv: [
    ['Bekanntmachung', 'PDF', 5],
    ['Bewerbungsbedingungen', 'PDF', 18],
    ['Teilnahmeantrag (Formblätter)', 'PDF', 14],
    ['Leistungsbeschreibung', 'PDF', 22],
    ['Vertragsentwurf Architektenvertrag', 'PDF', 26],
  ],
  einladung: [
    ['Einladungsschreiben', 'PDF', 2],
    ['Auslobung', 'PDF', 34],
    ['Raumprogramm', 'XLSX', 0],
    ['Lageplan und Bestand', 'DWG', 0],
  ],
  mehrfach: [
    ['Aufgabenbeschreibung', 'PDF', 40],
    ['Verfahrensbedingungen', 'PDF', 12],
    ['Planungsgrundlagen (Geodaten)', 'ZIP', 0],
    ['Ergebnisse Bürgerbeteiligung', 'PDF', 28],
  ],
};

export function getDocuments(comp) {
  const tpl = DOC_TEMPLATES[comp.procedure] || DOC_TEMPLATES.offen;
  const h = hash(comp.id);
  return tpl.map(([name, format, basePages], i) => ({
    name,
    format,
    pages: basePages ? basePages + ((h >> i) % 17) : null,
    size: `${((((h >> (i + 3)) % 90) + 8) / 10).toLocaleString('de-DE')} MB`,
  }));
}

function src(comp, doc, i) {
  const h = hash(comp.id + doc);
  return `${doc}, S. ${((h >> i) % 30) + 4}`;
}

export function buildAnalysis(comp, evaluation) {
  const proc = PROCEDURES[comp.procedure];
  const mainDoc = getDocuments(comp).find((d) => d.format === 'PDF' && d.pages > 10)?.name || 'Auslobung';

  const milestones = proc.milestones.map((m) => {
    const days = comp.deadlineInDays + m.offset;
    return { ...m, days, date: formatDate(days), past: days < 0 };
  });

  const sections = [
    {
      key: 'anforderungen',
      title: 'Wettbewerbsaufgabe & Anforderungen',
      items: comp.requirements.map((t, i) => ({ text: t, source: src(comp, mainDoc, i) })),
    },
    {
      key: 'teilnahme',
      title: 'Teilnahmebedingungen',
      items: proc.eligibility.map((t, i) => ({ text: t, source: src(comp, mainDoc, i + 5) })),
    },
    {
      key: 'referenzen',
      title: 'Referenz- und Eignungsanforderungen',
      items: comp.refRequirements.length
        ? comp.refRequirements.map((r, i) => ({ text: r.text, met: r.met, source: src(comp, 'Bekanntmachung', i) }))
        : [{ text: 'Keine Referenznachweise gefordert (offenes Verfahren).', source: src(comp, mainDoc, 9) }],
    },
    {
      key: 'ausschluss',
      title: 'Ausschlusskriterien',
      items: comp.exclusions.map((t, i) => ({ text: t, source: src(comp, mainDoc, i + 11) })),
    },
    {
      key: 'dokumente',
      title: 'Benötigte Unterlagen',
      items: proc.documents.map((t, i) => ({ text: t, source: src(comp, mainDoc, i + 14) })),
    },
    {
      key: 'risiken',
      title: 'Risiken & Hinweise',
      items: comp.risks.length
        ? comp.risks.map((t, i) => ({ text: t, source: i === 0 ? 'Compilot-Einschätzung' : src(comp, mainDoc, i + 18) }))
        : [{ text: 'Keine besonderen Risiken erkannt.', source: 'Compilot-Einschätzung' }],
    },
  ];

  return { sections, milestones, recommendation: buildAction(comp, evaluation, milestones) };
}

function buildAction(comp, ev, milestones) {
  const next = milestones.find((m) => !m.past);
  if (ev.knockout) {
    return 'Nicht teilnehmen. Die Mindestanforderungen können mit dem aktuellen Büroprofil nicht nachgewiesen werden. Den Wettbewerb ggf. als Hinweis für eine spätere ARGE-Partnerschaft vormerken.';
  }
  if (comp.eligibility?.status === 'risk') {
    return `Teilnahme nur mit Partner sinnvoll. Bis ${next ? next.date : 'zur Frist'} klären, ob eine Arbeitsgemeinschaft die fehlenden Nachweise abdeckt – danach Entscheidung treffen.`;
  }
  if (ev.level === 'hoch') {
    return `Teilnahme empfohlen. Nächster Schritt: ${next ? `${next.label} am ${next.date}` : 'Unterlagen vorbereiten'}. Referenzen „${ev.references[0].ref.title}“${ev.references[1] ? ` und „${ev.references[1].ref.title}“` : ''} als Nachweise vorbereiten.`;
  }
  if (ev.level === 'mittel') {
    return `Im Team abwägen. Fachlich interessant, aber ${ev.cons[0] ? ev.cons[0].toLowerCase() : 'mit Einschränkungen'}. Entscheidung spätestens eine Woche vor ${next ? `„${next.label}“ (${next.date})` : 'Fristende'} treffen.`;
  }
  return 'Eher nicht teilnehmen. Kapazität besser in Wettbewerbe mit höherem Fit investieren.';
}
