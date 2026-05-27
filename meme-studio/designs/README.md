# Design files — Pencil.dev

Questa cartella contiene i file `.pen` di [Pencil.dev](https://pencil.dev), il
canvas di design AI-native che gira come estensione di Cursor.

## Setup

1. Apri il progetto in Cursor.
2. Vai su **Extensions** → cerca "Pencil" → **Install**.
3. Completa l'attivazione (login una volta sola).
4. Verifica la connessione MCP: **Settings → Tools & MCP** (deve apparire `Pencil`).
5. Apri uno dei file qui sotto: il canvas Pencil si apre nell'editor.

## File

- `landing.pen` — la landing page (`app/page.tsx`)
- `studio.pen` — l'editor (`components/editor/*`)

## Workflow workshop

Il workflow che mostriamo all'evento:

1. Apri `designs/landing.pen` in Cursor (Pencil)
2. Modifica visivamente: cambia colori, sposta blocchi, aggiungi nuovi elementi
3. Chiedi al chat di Cursor:
   > "Aggiorna `app/page.tsx` per riflettere il design aggiornato in
   > `designs/landing.pen`. Mantieni le stringhe in `lib/i18n/it.ts`."
4. Cursor legge il `.pen` tramite gli strumenti MCP di Pencil e modifica i
   componenti React. Hot reload nel browser ti mostra il risultato.

Stesso workflow per `studio.pen`: ridisegna toolbar/sidepanel/canvas e chiedi
all'agente di aggiornare i componenti in `components/editor/`.

## Stato dei file

Questi `.pen` sono i **brief di design** del progetto: descrivono in JSON la
struttura e l'intento di ogni sezione. Al primo apertura puoi:

- **Tenerli così** e usarli come reference scritta per l'agente
- **Sostituirli** con un canvas Pencil completo (clic destro → "Replace
  with new Pencil canvas") — la sostituzione mantiene il nome del file

In entrambi i casi i comandi al chat di Cursor funzionano: l'agente legge il
contenuto strutturato del file e lo applica al codice.
