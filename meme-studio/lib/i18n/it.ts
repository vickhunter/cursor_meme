export const t = {
  app: {
    name: "MemeForge",
    tagline: "Crea meme per ogni social, in un click",
  },
  nav: {
    studio: "Studio",
    pricing: "Prezzi",
    github: "GitHub",
    privacy: "Privacy",
    openStudio: "Apri lo Studio",
  },
  legal: {
    privacyTitle: "Informativa sulla privacy",
    privacyIntro:
      "Questa informativa spiega come MemeForge tratta i dati personali quando usi il sito, in conformità al Regolamento (UE) 2016/679 (GDPR) e alla normativa italiana applicabile.",
    backHome: "Torna alla home",
    lastUpdated: "Ultimo aggiornamento",
    contactLabel: "Contatti privacy",
    footerPrivacy: "Privacy Policy",
  },
  landing: {
    heroBadge: "Costruito al workshop AI Builder",
    heroTitle: "Un meme. Tutti i formati. Zero fatica.",
    heroSub:
      "Editor drag-and-drop, esportazione simultanea per Instagram, TikTok, LinkedIn, X e Facebook. Senza account, senza setup.",
    heroCta: "Apri lo Studio",
    heroCtaSecondary: "Guarda i formati",
    feature1Title: "Esportazione multi-formato",
    feature1Desc:
      "Un design, sei file pronti per ogni social. Instagram Post, Story, TikTok, Facebook, LinkedIn, X.",
    feature2Title: "Editor drag-and-drop",
    feature2Desc:
      "Trascina immagini, testo, sticker. Cambia colori e font in tempo reale.",
    feature3Title: "Nessun account, nessun database",
    feature3Desc:
      "I tuoi meme restano sul tuo browser. Paga solo se vuoi la versione HD senza watermark.",
    formatsTitle: "Sei formati, un click",
    formatsDesc:
      "Disegna una volta. Scarica un ZIP con tutti i ritagli pronti per la pubblicazione.",
    pricingTitle: "Semplice come deve essere",
    pricingFreeTitle: "Gratis",
    pricingFreeDesc: "Tutti gli strumenti, export con watermark MemeForge.",
    pricingFreeCta: "Inizia gratis",
    pricingHdTitle: "HD senza watermark",
    pricingHdPrice: "€2,99",
    pricingHdPer: "per meme",
    pricingHdDesc:
      "Stesso meme, sei file in HD senza watermark. Pagamento unico, niente abbonamento.",
    pricingHdCta: "Sblocca HD",
    footerMadeWith: "Costruito con Cursor + Pencil.dev",
  },
  studio: {
    backHome: "Home",
    title: "Studio",
    search: "Cerca",
    searchPlaceholder: "es. gatto, pizza, cane",
    searchPlaceholderVideo: "es. mare, festa, danza",
    upload: "Carica immagine",
    tabImages: "Immagini",
    tabVideos: "Video",
    seedNotice:
      "Modalità locale: stai vedendo i contenuti di esempio. Aggiungi una chiave Pexels per la ricerca live in",
    preview: {
      title: "Anteprima social",
      on: "Mostra cornice",
      off: "Nascondi cornice",
      hint: "L'export ZIP non include la cornice: è solo per anteprima.",
    },
    video: {
      play: "Riproduci",
      pause: "Pausa",
      exporting: "Registrazione video in corso…",
      multiFormatHint:
        "I meme video vengono esportati come .webm per ogni formato selezionato.",
    },
    add: {
      text: "Aggiungi testo",
      rect: "Aggiungi rettangolo",
    },
    panel: {
      design: "Design",
      images: "Immagini",
      text: "Testo",
      export: "Esporta",
    },
    text: {
      content: "Contenuto",
      contentPlaceholder: "Il tuo testo qui",
      font: "Font",
      size: "Dimensione",
      color: "Colore",
      stroke: "Bordo",
      strokeColor: "Colore bordo",
    },
    layers: {
      title: "Livelli",
      empty: "Nessun livello. Aggiungi immagini o testo.",
      delete: "Elimina",
      front: "Avanti",
      back: "Indietro",
    },
    format: "Formato di lavoro",
    download: "Scarica ZIP (con watermark)",
    downloadHd: "Sblocca HD (€2,99)",
    downloadLocal: "Scarica HD (locale, gratis)",
    downloadUnlocked: "Scarica ZIP (senza watermark)",
    downloadedToast: "Meme scaricati nel tuo computer",
    exporting: "Generazione in corso…",
    exportingProgress: "Esportazione",
    exportError:
      "Errore durante l'esportazione. Riprova o controlla la console per dettagli.",
    unlockedBadge: "HD sbloccato",
    localModeBadge: "Modalità locale",
    saved: "Salvato automaticamente",
    canvas: {
      empty: "Trascina un'immagine o aggiungi del testo per iniziare",
    },
  },
  unlock: {
    successTitle: "Pagamento completato",
    successDesc: "Stiamo sbloccando il tuo meme…",
    failTitle: "Qualcosa è andato storto",
    failDesc: "Non siamo riusciti a verificare il pagamento. Riprova.",
  },
  errors: {
    pexels: "Nessuna immagine trovata.",
    generic: "Si è verificato un errore.",
  },
} as const
