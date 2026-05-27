/**
 * Informativa privacy (Reg. UE 2016/679 — GDPR) per MemeForge.
 * Aggiorna i dati del titolare in LEGAL_OWNER prima della pubblicazione.
 */
export const LEGAL_OWNER = {
  name: "Titolare del sito MemeForge",
  email: process.env.NEXT_PUBLIC_PRIVACY_EMAIL ?? "privacy@example.com",
  /** Indirizzo o sede (facoltativo ma consigliato per soggetti italiani) */
  address: "",
}

export const PRIVACY_LAST_UPDATED = "27 maggio 2026"

export type PrivacySection = {
  id: string
  title: string
  paragraphs: string[]
  list?: string[]
}

export const privacySections: PrivacySection[] = [
  {
    id: "intro",
    title: "1. Introduzione",
    paragraphs: [
      "La presente informativa descrive come vengono trattati i dati personali quando utilizzi MemeForge (il «Sito»), l’editor web per la creazione e l’esportazione di meme disponibile all’indirizzo del servizio che ospiti (ad es. su Vercel).",
      "MemeForge è progettato per funzionare senza registrazione e senza database utenti: la maggior parte delle informazioni relative ai tuoi progetti resta sul tuo dispositivo. Alcuni trattamenti avvengono comunque sul server o presso fornitori terzi, come indicato di seguito.",
    ],
  },
  {
    id: "titolare",
    title: "2. Titolare del trattamento",
    paragraphs: [
      `Il titolare del trattamento è ${LEGAL_OWNER.name}.`,
      LEGAL_OWNER.address
        ? `Sede: ${LEGAL_OWNER.address}.`
        : "Per qualsiasi richiesta relativa alla privacy puoi contattarci all’indirizzo email indicato sotto.",
      `Email di contatto: ${LEGAL_OWNER.email}.`,
    ],
  },
  {
    id: "dati",
    title: "3. Quali dati trattiamo",
    paragraphs: [
      "A seconda di come usi il Sito, possiamo trattare le categorie di dati seguenti.",
    ],
    list: [
      "Dati tecnici di navigazione: indirizzo IP, tipo di browser, sistema operativo, data e ora della richiesta, URL richiesto ed eventuali codici di errore, raccolti automaticamente dal provider di hosting (Vercel) nei log del server.",
      "Dati relativi ai meme: titolo del progetto, composizione della scena (testi, posizioni, colori, riferimenti a immagini o video), formato di lavoro e timestamp di aggiornamento. Questi dati sono salvati principalmente nel localStorage del tuo browser e non vengono inviati a un database centralizzato gestito da noi.",
      "Token di sblocco HD: dopo un pagamento (o in modalità locale di sviluppo), nel localStorage può essere memorizzato un token JWT che attesta lo sblocco dell’export senza watermark per un determinato meme.",
      "Dati di pagamento: se acquisti lo sblocco HD (€2,99 per meme), il pagamento è gestito da Stripe. Non conserviamo numeri di carta né dati di pagamento completi sui nostri server; riceviamo da Stripe solo le informazioni necessarie a verificare che il pagamento sia andato a buon fine (es. identificativo sessione, stato del pagamento, identificativo del meme nei metadati).",
      "Query di ricerca media: quando cerchi immagini o video, la stringa di ricerca viene inviata alle nostre API che, se configurato, la inoltrano a Pexels per restituire risultati. Non associamo la ricerca a un account utente.",
      "Immagini caricate: se carichi un file dal tuo dispositivo, il file resta nel browser per l’editing e l’export; non lo carichiamo su un server nostro salvo che non sia già incluso nella scena salvata in locale.",
    ],
  },
  {
    id: "finalita",
    title: "4. Finalità e basi giuridiche",
    paragraphs: [
      "Trattiamo i dati per le finalità indicate e sulle basi giuridiche previste dal GDPR.",
    ],
    list: [
      "Erogazione del servizio (art. 6, par. 1, lett. b GDPR): permetterti di creare, modificare ed esportare meme, salvare i progetti sul dispositivo e verificare lo sblocco HD.",
      "Pagamenti (art. 6, par. 1, lett. b e c GDPR): gestire l’acquisto dello sblocco HD tramite Stripe e adempiere agli obblighi fiscali e contabili applicabili.",
      "Sicurezza e funzionamento tecnico (art. 6, par. 1, lett. f GDPR — legittimo interesse): prevenire abusi, diagnosticare errori, mantenere l’infrastruttura (log di hosting).",
      "Ricerca contenuti su Pexels (art. 6, par. 1, lett. b GDPR): rispondere alle tue ricerche di immagini e video stock quando usi la funzione di ricerca integrata.",
    ],
  },
  {
    id: "destinatari",
    title: "5. Destinatari e responsabili del trattamento",
    paragraphs: [
      "Possiamo condividere dati, limitatamente a quanto necessario, con i seguenti soggetti.",
    ],
    list: [
      "Vercel Inc. — hosting del Sito e log di infrastruttura. Informativa: https://vercel.com/legal/privacy-policy",
      "Stripe, Inc. — elaborazione dei pagamenti quando lo sblocco HD è attivo. Informativa: https://stripe.com/it/privacy",
      "Pexels GmbH (o società del gruppo Pexels) — fornitura di immagini e video tramite API quando è configurata una chiave Pexels. Informativa: https://www.pexels.com/privacy-policy/",
      "GitHub (facoltativo) — se segui il link al repository open source dal Sito, si applica la policy di GitHub.",
    ],
  },
  {
    id: "trasferimenti",
    title: "6. Trasferimenti extra-UE",
    paragraphs: [
      "Alcuni fornitori (in particolare Vercel e Stripe) possono trattare dati negli Stati Uniti o in altri Paesi extra-UE. In tali casi il trasferimento avviene sulla base di decisioni di adeguatezza, Clausole Contrattuali Standard o altri strumenti previsti dal GDPR, come indicato nelle rispettive informative dei fornitori.",
    ],
  },
  {
    id: "conservazione",
    title: "7. Periodo di conservazione",
    paragraphs: [
      "I meme e i token di sblocco nel localStorage restano sul tuo dispositivo finché non li cancelli (cancellazione dati del sito, pulizia del browser o funzione di eliminazione meme nello Studio).",
      "Il token JWT di sblocco ha una validità massima di 365 giorni dalla emissione, salvo rimozione anticipata da parte tua.",
      "I log di Vercel e i dati conservati da Stripe seguono i periodi di retention definiti da ciascun fornitore e dagli obblighi di legge applicabili al titolare.",
      "Le query inviate a Pexels non vengono da noi archiviate in un database persistente oltre quanto strettamente necessario per evadere la singola richiesta API.",
    ],
  },
  {
    id: "cookie",
    title: "8. Cookie e tecnologie simili",
    paragraphs: [
      "MemeForge non utilizza cookie di profilazione o analytics di terze parti da noi installati.",
      "Utilizziamo il localStorage del browser per memorizzare i tuoi progetti meme e, se applicabile, il token di sblocco HD. Si tratta di dati memorizzati sul tuo dispositivo, non di cookie HTTP classici, ma producono effetti analoghi per la persistenza delle preferenze e dei contenuti.",
      "I caratteri tipografici (Inter, Anton) sono serviti tramite il meccanismo di Next.js che li incorpora nell’applicazione, senza richieste runtime a Google Fonts da parte del browser.",
      "Stripe Checkout, quando usi il pagamento, può impostare cookie tecnici necessari alla sicurezza e al completamento della transazione secondo l’informativa Stripe.",
    ],
  },
  {
    id: "diritti",
    title: "9. Diritti dell’interessato",
    paragraphs: [
      "In qualità di interessato hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati, nei casi previsti dal GDPR, nonché di revocare il consenso ove il trattamento si basi sul consenso.",
      "Per i dati salvati solo nel tuo browser puoi esercitare gran parte di questi diritti cancellando i dati del sito dalle impostazioni del browser o eliminando i singoli meme dallo Studio.",
      "Per richieste relative a dati trattati da noi o dai fornitori (es. pagamenti Stripe), scrivi a " +
        LEGAL_OWNER.email +
        ". Risponderemo entro i termini di legge (di norma un mese, prorogabile di due mesi in casi complessi).",
      "Hai inoltre diritto di proporre reclamo all’Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it) se ritieni che il trattamento violi la normativa applicabile.",
    ],
  },
  {
    id: "minori",
    title: "10. Minori",
    paragraphs: [
      "Il Sito non è destinato a minori di 14 anni. Se sei un genitore o tutore e ritieni che un minore ci abbia fornito dati personali, contattaci per richiederne la cancellazione.",
    ],
  },
  {
    id: "sicurezza",
    title: "11. Sicurezza",
    paragraphs: [
      "Adottiamo misure tecniche e organizzative adeguate al rischio (es. HTTPS, segreto server per la firma dei token, minimizzazione dei dati raccolti). Nessun sistema è tuttavia completamente sicuro: ti invitiamo a proteggere il tuo dispositivo e a non condividere token o link di sblocco con terzi non autorizzati.",
    ],
  },
  {
    id: "modifiche",
    title: "12. Modifiche all’informativa",
    paragraphs: [
      "Possiamo aggiornare questa informativa per riflettere cambiamenti del servizio o della normativa. La data dell’ultimo aggiornamento è indicata in calce. Ti invitiamo a consultare periodicamente questa pagina.",
    ],
  },
]
