# Deploy guide — MemeForge

Questo doc spiega come pubblicare entrambi i repo prima del workshop.

## Locale (per attendees)

Il `.envrc` versionato contiene già la chiave Pexels condivisa del
workshop. L'attendee installa Devbox + direnv una volta sola:

```bash
curl -fsSL https://get.jetify.com/devbox | bash
brew install direnv
echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
```

Poi:

```bash
git clone <repo> && cd meme-studio
direnv allow         # carica Devbox + .envrc
pnpm install && pnpm dev
```

Tutto pronto. Niente da configurare.

## TL;DR — deploy Vercel

```bash
cd meme-studio
pnpm dlx vercel link --yes
pnpm dlx vercel env add STRIPE_SECRET_KEY production
pnpm dlx vercel env add PEXELS_API_KEY production
pnpm dlx vercel env add UNLOCK_SECRET production
pnpm dlx vercel --prod
```

(Stesso flusso per `meme-studio-starter`, ma le env vars sono **opzionali** —
serve mostrare che gira anche senza.)

## Prerequisiti

1. Account [Vercel](https://vercel.com)
2. Account [Stripe](https://dashboard.stripe.com) con chiave **test**
   (`sk_test_…`)
3. Chiave [Pexels](https://www.pexels.com/api/) — quella del workshop è già
   nel `.envrc` per il locale, su Vercel imposta la tua personale
4. Una stringa casuale per firmare i JWT:
   ```bash
   openssl rand -base64 32
   ```

## Passo 1 — Repo GitHub

Crea due repo pubblici:

- `github.com/<tu>/meme-studio-starter`
- `github.com/<tu>/meme-studio`

```bash
cd meme-studio
git init -b main
git add . && git commit -m "feat: initial commit"
gh repo create yourusername/meme-studio --public --source=. --push

cd ../meme-studio-starter
git init -b main
git add . && git commit -m "feat: initial commit"
gh repo create yourusername/meme-studio-starter --public --source=. --push
```

## Passo 2 — Deploy "finished" su Vercel

```bash
cd meme-studio
vercel link --yes
vercel env add STRIPE_SECRET_KEY production
# incolla la sk_test_… di Stripe
vercel env add PEXELS_API_KEY production
# incolla la chiave Pexels
vercel env add UNLOCK_SECRET production
# incolla la stringa generata con `openssl rand -base64 32`
vercel --prod
```

Output: `https://meme-studio-<hash>.vercel.app` — testa:

1. Apri `/studio`, crea un meme
2. Click "Sblocca HD" → vai su Stripe Checkout
3. Usa la carta test `4242 4242 4242 4242` exp `12/34` cvc `123`
4. Vieni reindirizzato a `/studio/[memeId]?session_id=…&unlock=1`
5. Verifica che il badge "HD sbloccato" appaia e il download sia senza watermark

## Passo 3 — Deploy "starter" su Vercel (no env)

```bash
cd ../meme-studio-starter
vercel link --yes
vercel --prod
```

Nessuna env var: il bottone "Sblocca HD" mostra "modalità locale" e scarica il
file senza watermark. Le immagini sono SVG placeholder. Tutto deve funzionare lo
stesso — questo è il punto del setup ship-and-go.

## Passo 4 — Bottoni "Deploy to Vercel"

Aggiorna i link nei README:

- `meme-studio/README.md`: cambia
  `https://github.com/yourusername/meme-studio` con il tuo URL
- `meme-studio-starter/README.md`: idem

Il bottone preserva le env vars come "opzionali" — l'attendee può deployare
senza configurarle.

## Passo 5 — Dominio (opzionale)

```bash
vercel domains add memeforge.it meme-studio
```

Configura i DNS come indicato da Vercel.

## Demo plan per l'evento

1. **Apri la versione live finita** (`memeforge.it` o l'URL Vercel)
2. Mostra la landing in italiano
3. Crea un meme rapido
4. Esporta ZIP → mostra i 6 file con watermark
5. Click "Sblocca HD" → mostra Stripe checkout (mode test)
6. Completa il pagamento (carta test) → ZIP HD scaricato
7. **Apri Cursor + meme-studio-starter** → fai il tour dei 5 TODO
8. **Apri designs/landing.pen** con Pencil → modifica visivamente → chiedi al
   chat di sincronizzare il codice → mostra il diff
9. Lancia `pnpm dev` localmente → tutti vedono la stessa cosa nel browser

## Troubleshooting

- **Stripe redirect 404**: la `success_url` usa `VERCEL_URL`. Se hai un dominio
  custom, setta `NEXT_PUBLIC_APP_URL=https://memeforge.it` come env var.
- **JWT scaduto**: il claim `exp` è 1 anno; rigenera Stripe Checkout.
- **`canvas` build fails**: react-konva richiede polyfills. Il nostro
  `next.config.ts` è già configurato; se Vercel fallisce, controlla che
  `lib/export.ts` e `Canvas.tsx` siano marcati `"use client"`.
- **Build su Vercel rallenta**: aggiungi al `pnpm-workspace.yaml`:
  ```yaml
  ignoredBuiltDependencies:
    - sharp
    - canvas
  ```
