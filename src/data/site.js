// ─────────────────────────────────────────────────────────────
//  Allgemeine Website-Einstellungen
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Compilot',

  contact: {
    // ► HIER EURE E-MAIL-ADRESSE EINTRAGEN.
    //   Anfragen aus dem Kontaktformular öffnen das E-Mail-Programm
    //   der Besucher mit einer vorausgefüllten Nachricht an diese Adresse.
    email: 'kontakt@compilot.example',

    // ► OPTIONAL: Formular-Dienst (z. B. Formspree, Tally, Getform).
    //   Wenn hier eine URL steht, wird das Formular direkt dorthin
    //   gesendet (POST, JSON) – ganz ohne E-Mail-Programm.
    //   Beispiel: 'https://formspree.io/f/abcdwxyz'
    formEndpoint: '',
  },

  // Platzhalter für rechtliche Angaben – vor Veröffentlichung ersetzen!
  legal: {
    placeholder: true,
  },
};
