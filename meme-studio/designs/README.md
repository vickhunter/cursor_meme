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

### Marketing + editor (workshop)

- `landing.pen` — la landing page (`app/page.tsx`)
- `studio.pen` — l'editor (`components/editor/*`)

### SaaS (dashboard, onboarding, profilo)

- `dashboard.pen` — home progetti, dettaglio, cronologia export, empty state  
  Target: `app/(app)/*`, `/app`, `/app/projects/[id]`
- `onboarding.pen` — wizard 5 step post-signup  
  Target: `app/onboarding/[step]/*`
- `profile.pen` — impostazioni, billing ibrido (Pro + €2,99/meme), sicurezza  
  Target: `/app/settings`, `/app/billing`

### Anteprime PNG

Screenshot esportati dal canvas Pencil (riferimento visivo in repo):

- `previews/BdIQb.png` — dashboard progetti
- `previews/tewVv.png` — impostazioni profilo
- `previews/KcAYy.png` — piano e fatturazione
- `previews/DZW7f.png` — sicurezza

Per rigenerare il **canvas visivo** da un brief JSON: apri il `.pen` in Pencil →
clic destro → **Replace with new Pencil canvas**, poi chiedi all'agente di
ricostruire il layout dal brief o dalle PNG in `previews/`.

## Design system SaaS (condiviso)

| Token | Valore |
|-------|--------|
| Accent | `#c026d3` (fuchsia) |
| Background | `#ffffff` / dark `#0a0a0a` |
| Surface | `#fafafa` |
| Border | `#e4e4e7` |
| Display font | Anton |
| UI font | Inter |

**Billing ibrido** (come in landing + Stripe attuale):

- Abbonamento **Pro** (export HD illimitati, no watermark, cloud sync)
- **€2,99 per meme** per sblocco HD singolo su piano Free

## Workflow workshop

Il workflow che mostriamo all'evento:

1. Apri `designs/landing.pen` in Cursor (Pencil)
2. Modifica visivamente: cambia colori, sposta blocchi, aggiungi nuovi elementi
3. Chiedi al chat di Cursor:
   > "Aggiorna `app/page.tsx` per riflettere il design aggiornato in
   > `designs/landing.pen`. Mantieni le stringhe in `lib/i18n/it.ts`."
4. Cursor legge il `.pen` tramite gli strumenti MCP di Pencil e modifica i
   componenti React. Hot reload nel browser ti mostra il risultato.

Stesso workflow per `studio.pen`, `dashboard.pen`, `onboarding.pen` e
`profile.pen`: ridisegna e chiedi all'agente di aggiornare le route SaaS
quando implementerai auth + DB.

## Stato dei file

I file possono essere:

- **Brief JSON** (`format: pencil-design-brief`) — struttura e intento per l'agente
- **Canvas Pencil** — layout visivo editabile nell'estensione

In entrambi i casi i comandi al chat di Cursor funzionano: l'agente legge il
contenuto strutturato del file e lo applica al codice.
