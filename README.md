# Álbum Digital Colaborativo — Copa do Mundo FIFA 2026

PWA responsivo (iOS/Android via navegador) que reproduz a experiência do álbum
da Panini da Copa 2026, com colaboração multi-usuário em tempo real.

> 48 seleções • ~670 figurinhas • Trocas com matching automático • Sincronização live entre celulares

## Stack

- **Frontend:** React 18 + TypeScript + Vite, Tailwind CSS, shadcn-style components, Framer Motion, Recharts
- **Estado:** Zustand + TanStack Query
- **Backend:** Firebase
  - Firestore (banco realtime + offline persistence)
  - Authentication (Google, Apple, e-mail/senha)
  - Storage (imagens)
  - Cloud Functions (matching de trocas)
  - Cloud Messaging (push)
  - Hosting
- **CI/CD:** GitHub Actions
- **PWA:** vite-plugin-pwa (manifest + service worker + Workbox)

## Estrutura do repositório

```
.
├── .github/workflows/
│   ├── firebase-hosting-merge.yml         # deploy prod no merge para main
│   ├── firebase-hosting-pull-request.yml  # preview channels em PRs
│   └── functions-deploy.yml               # deploy de Functions/rules/indexes
├── functions/                             # Cloud Functions (Node.js 20)
│   └── src/index.ts                       # matching de trocas + notificações
├── public/
│   └── icons/                             # ícones PWA (svg + pngs gerados)
├── scripts/
│   ├── seed.ts                            # popula Firestore via Admin SDK
│   └── generate-icons.mjs                 # gera PNGs do ícone via sharp
├── src/
│   ├── components/                        # UI (BottomNav, StickerCard, ui/*)
│   ├── pages/                             # Login, Onboarding, Album, etc.
│   ├── hooks/                             # useAuth, useCollection, useTrades…
│   ├── lib/
│   │   ├── firebase.ts                    # init Firebase (com offline persistence)
│   │   ├── i18n.ts                        # PT-BR / EN / ES
│   │   └── data/                          # 48 seleções + catálogo de figurinhas
│   ├── stores/                            # Zustand (auth, ui)
│   └── types/                             # tipos TS compartilhados
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── .firebaserc
├── .env.example
└── README.md
```

## Setup local (~10min)

### 1. Pré-requisitos

- Node.js 20+
- Conta Firebase (plano Spark serve para começar)
- Firebase CLI: `npm i -g firebase-tools`

### 2. Clone e dependências

```bash
git clone <seu-fork>
cd album26
npm install
cd functions && npm install && cd ..
```

### 3. Crie o projeto Firebase

1. https://console.firebase.google.com → **Adicionar projeto**
2. Habilite os produtos:
   - **Authentication:** Google, Apple, e-mail/senha
   - **Firestore Database** (modo de produção)
   - **Storage**
   - **Cloud Messaging** (gere uma Web Push certificate / VAPID key)
   - **Hosting** (criar site)
3. Adicione um app Web e copie o `firebaseConfig`.

### 4. `.env`

```bash
cp .env.example .env
```

Cole os valores de `firebaseConfig` (e a `VAPID_KEY` do FCM).

### 5. Configure o `.firebaserc`

Edite e troque `album-copa-2026` pelo `projectId` do seu Firebase.

### 6. Seed do banco

Baixe a service-account JSON em **Project Settings → Service accounts → Generate new private key**.
Salve em `./.firebase/service-account.json` (já está no `.gitignore`).

```bash
npm run seed
```

Cria as 48 seleções, jogadores placeholder e ~670 figurinhas no Firestore
(idempotente — pode rodar de novo sem duplicar).

### 7. Rodar local

```bash
# App (porta 5173)
npm run dev

# (Opcional) emuladores Firebase em paralelo:
firebase emulators:start
```

Para testar sincronização: abra a mesma URL em duas abas (uma anônima) e veja
as figurinhas atualizando em tempo real.

## Deploy

### Setup do CI/CD (uma vez)

```bash
firebase login
firebase init hosting:github
```

Esse comando cria automaticamente o secret `FIREBASE_SERVICE_ACCOUNT_ALBUM_COPA_2026`
no GitHub. Adicione também os secrets das variáveis `VITE_FIREBASE_*` em
**Settings → Secrets and variables → Actions**.

### Fluxo

- **`main`:** `firebase-hosting-merge.yml` builda e faz deploy em produção.
- **PRs:** `firebase-hosting-pull-request.yml` cria preview channel temporário.
- **Mudanças em `functions/`:** `functions-deploy.yml` deploya Functions, rules e indexes.

### Deploy manual

```bash
npm run deploy            # só hosting
npm run deploy:all        # hosting + functions + rules
```

## Modelagem de dados

```
/users/{uid}                                     # perfil
  /collection/{stickerId}                        # quantidade da figurinha
/groups/{groupId}                                # nome, inviteCode, memberIds[]
  /members/{uid}                                 # role, displayName, photoURL
/teams/{teamId}                                  # 48 seleções
  /players/{playerId}                            # jogadores
/stickers/{stickerId}                            # catálogo (~670 figurinhas)
/trades/{tradeId}                                # propostas de troca
/notifications/{uid}/items/{notifId}             # notificações
/matches/{uid}/suggestions/{matchId}             # sugestões geradas pela CF
```

Regras (`firestore.rules`):
- `users/{uid}/collection`: só o dono
- `groups`: leitura para membros; criação livre para autenticados
- `stickers`, `teams`, `players`: leitura pública, escrita só via Admin SDK (seed)
- `trades`: só as duas partes envolvidas
- `matches`: só o dono lê (a CF escreve)

## Cloud Function de matching

`functions/src/index.ts` exporta `recalculateMatches`: trigger disparado
quando alguém atualiza a coleção. Para cada grupo do usuário cruza repetidas
dele com faltantes dos outros e armazena em
`/matches/{uid}/suggestions/{matchId}`. Quando aparece um match novo com
score ≥ 3, dispara push (FCM) e cria uma notificação.

`onTradeUpdated` notifica as partes quando uma troca muda de status.

## Internacionalização

`src/lib/i18n.ts` tem dicionários PT-BR (default), EN e ES. Troca em
**Perfil → Idioma**.

## PWA

`vite-plugin-pwa` gera service worker (Workbox) e manifest. "Adicionar à tela inicial":

- iOS: Safari → Compartilhar → Adicionar à Tela de Início
- Android: Chrome → menu → Instalar app

Cache runtime configurado para Firebase Storage e flagcdn.com. Firestore tem
offline persistence (indexedDB) habilitado.

## Comandos úteis

```bash
npm run dev              # dev server
npm run build            # build prod (typecheck + bundle)
npm run typecheck        # só TS
npm run preview          # preview do build local
npm run seed             # popular Firestore
npm run functions:build  # builda Cloud Functions
npm run functions:deploy # só deploya Functions
node scripts/generate-icons.mjs   # gera PNGs (precisa de sharp: npm i -D sharp)
```

## Roadmap

- [x] Auth + Firestore + Hosting + offline persistence
- [x] CI/CD GitHub Actions (preview channels em PRs)
- [x] Login + Onboarding
- [x] Álbum + coleção pessoal
- [x] 48 seleções com bandeiras
- [x] Grupos com código de convite
- [x] Cloud Function de matching + Mural de Trocas
- [x] Dashboard + gráficos
- [x] PWA + service worker
- [x] FCM (notificações push)
- [ ] Estatísticas probabilísticas (quantos pacotes pra completar)
- [ ] Exportar coleção em PDF
- [ ] Share card pra redes sociais
- [ ] Scanner de código de barras (BarcodeDetector API)

## Custos

Firebase plano Spark cobre tranquilo um grupo de amigos. Para grupos grandes
ou matching frequente, considere migrar para Blaze e configurar
quotas/alertas.

## Licença

MIT.
