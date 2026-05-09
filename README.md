# Álbum Digital Colaborativo — Copa do Mundo FIFA 2026

PWA responsivo (iOS/Android via navegador) que reproduz a experiência do álbum
da Panini da Copa 2026, com colaboração multi-usuário em tempo real.

> 48 seleções • ~670 figurinhas • Trocas com matching automático • Sincronização live entre celulares
>
> **Roda 100% no plano Firebase Spark (gratuito, sem cartão).**

## Stack

- **Frontend:** React 18 + TypeScript + Vite, Tailwind CSS, shadcn-style components, Framer Motion, Recharts
- **Estado:** Zustand + TanStack Query
- **Backend:** Firebase (plano Spark)
  - **Firestore** — banco NoSQL realtime + offline persistence
  - **Authentication** — Google, Apple, e-mail/senha
  - **Hosting** — deploy do app
- **CI/CD:** GitHub Actions (deploy live no merge + preview channels em PRs)
- **PWA:** vite-plugin-pwa (manifest + service worker + Workbox)

> Storage, Cloud Functions e FCM ficaram fora do MVP porque exigem o plano
> Blaze (pago, com cartão). O matching de trocas é feito client-side e
> notificações são in-app (lendo `/notifications`). Para reativar Storage/FCM/Functions
> depois é só fazer upgrade do plano e adicionar de volta.

## Estrutura do repositório

```
.
├── .github/workflows/
│   ├── firebase-hosting-merge.yml         # deploy prod no merge para main
│   └── firebase-hosting-pull-request.yml  # preview channels em PRs
├── public/
│   └── icons/                             # ícones PWA
├── scripts/
│   ├── seed.ts                            # popula Firestore via Admin SDK
│   └── generate-icons.mjs                 # gera PNGs do ícone via sharp
├── src/
│   ├── components/                        # UI (BottomNav, StickerCard, ui/*)
│   ├── pages/                             # Login, Onboarding, Album, etc.
│   ├── hooks/                             # useAuth, useCollection, useTrades…
│   ├── lib/
│   │   ├── firebase.ts                    # init Firebase (offline persistence)
│   │   ├── i18n.ts                        # PT-BR / EN / ES
│   │   └── data/                          # 48 seleções + catálogo de figurinhas
│   ├── stores/                            # Zustand (auth, ui)
│   └── types/                             # tipos TS compartilhados
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── .firebaserc
├── .env.example
└── README.md
```

## Setup local (~10min)

### 1. Pré-requisitos

- Node.js 20+
- Conta Firebase (plano Spark — não exige cartão)
- Firebase CLI: `npm i -g firebase-tools`

### 2. Clone e dependências

```bash
git clone <seu-fork>
cd album26
npm install
```

### 3. Crie o projeto Firebase

1. https://console.firebase.google.com → **Adicionar projeto**
2. Habilite os produtos:
   - **Authentication:** Google, Apple, e-mail/senha
   - **Firestore Database** (modo de produção, região `southamerica-east1`)
   - **Hosting** (criar site)
3. Adicione um app Web e copie o `firebaseConfig`.

### 4. `.env`

```bash
cp .env.example .env
```

Cole os valores de `firebaseConfig`.

### 5. Configure o `.firebaserc`

Edite e troque `album-copa-2026` pelo `projectId` do seu Firebase.

### 6. Seed do banco

Baixe a service-account JSON em **Project Settings → Service accounts → Generate new private key**.
Salve em `./.firebase/service-account.json` (já está no `.gitignore`).

```bash
npm run seed
```

Cria as 48 seleções e ~670 figurinhas no Firestore (idempotente).

### 7. Deploy das regras

```bash
firebase login
npm run deploy:rules
```

### 8. Rodar local

```bash
npm run dev
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
no GitHub. Adicione também os secrets `VITE_FIREBASE_*` em
**Settings → Secrets and variables → Actions**.

### Fluxo

- **`main`:** `firebase-hosting-merge.yml` builda e faz deploy em produção.
- **PRs:** `firebase-hosting-pull-request.yml` cria preview channel temporário.

Regras do Firestore não fazem deploy automático; rode manualmente quando mudar:

```bash
npm run deploy:rules
```

### Deploy manual

```bash
npm run deploy            # builda e deploya hosting
npm run deploy:rules      # só regras Firestore
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
/notifications/{uid}/items/{notifId}             # notificações in-app
```

Regras (`firestore.rules`):
- `users/{uid}/collection`: leitura aberta a autenticados (necessário para o
  matching client-side cruzar coleções dos membros do grupo); escrita só pelo dono.
- `groups`: leitura para autenticados (necessário pra entrar via código);
  só membros atualizam; só o criador deleta.
- `stickers`, `teams`, `players`: leitura pública, escrita só via Admin SDK (seed).
- `trades`: só as duas partes envolvidas.

## Matching de trocas (client-side)

`src/hooks/useTrades.ts → useMatchSuggestionsForGroup` abre listeners reactivos
nas coleções de cada membro do grupo e cruza repetidas/faltantes em tempo real.
Cada cliente recalcula localmente quando alguém atualiza a coleção.

## Internacionalização

`src/lib/i18n.ts` com PT-BR (default), EN e ES. Troca em **Perfil → Idioma**.

## PWA

`vite-plugin-pwa` gera service worker (Workbox) e manifest. "Adicionar à tela inicial":

- iOS: Safari → Compartilhar → Adicionar à Tela de Início
- Android: Chrome → menu → Instalar app

Cache runtime configurado para flagcdn.com. Firestore tem offline persistence
habilitado.

## Comandos úteis

```bash
npm run dev              # dev server
npm run build            # build prod (typecheck + bundle)
npm run typecheck        # só TS
npm run preview          # preview do build local
npm run seed             # popular Firestore
npm run deploy           # build + deploy hosting
npm run deploy:rules     # deploy regras Firestore
node scripts/generate-icons.mjs   # gera PNGs (precisa de sharp: npm i -D sharp)
```

## Roadmap

- [x] Auth + Firestore + Hosting + offline persistence
- [x] CI/CD GitHub Actions (preview channels em PRs)
- [x] Login + Onboarding
- [x] Álbum + coleção pessoal
- [x] 48 seleções com bandeiras
- [x] Grupos com código de convite
- [x] Mural de Trocas com matching client-side em tempo real
- [x] Dashboard + gráficos
- [x] PWA + service worker
- [ ] Push notifications (precisa de Blaze + Cloud Messaging)
- [ ] Upload de fotos próprias (precisa de Blaze + Storage)
- [ ] Cloud Functions p/ matching server-side e push automático (precisa de Blaze)
- [ ] Estatísticas probabilísticas (quantos pacotes pra completar)
- [ ] Exportar coleção em PDF
- [ ] Share card pra redes sociais

## Custos

Plano Spark (gratuito):
- **50.000 leituras/dia** no Firestore
- **20.000 escritas/dia**
- **1 GB armazenado**
- **10 GB/mês de banda no Hosting**

Pra um grupo de amigos é mais que suficiente. Se ultrapassar, o Firebase
**para de servir até o dia seguinte** — não cobra automaticamente.

## Licença

MIT.
