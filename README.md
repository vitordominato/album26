# Álbum da Copa 2026

App colaborativo para gerenciar o álbum de figurinhas da FIFA World Cup 2026. Crie um álbum, compartilhe o código com amigos, e todos podem editar o mesmo álbum em tempo real, em qualquer celular.

**Stack:** React + Vite + Tailwind + Firebase Firestore + Netlify

---

## Funcionalidades

- 48 seleções × 20 figurinhas = **960 cromos**
- 19 figurinhas FWC especiais (emblema, slogan, bola Trionda, mascotes Maple/Zayu/Clutch, países-sede, 10 momentos históricos)
- **979 cromos colados** no contador de progresso (a capa do álbum, que totaliza os 980 oficiais, não é colável e fica de fora)
- Numeração por seleção (1–20): #1 escudo metalizado, #13 time posado **exclusivo McDonald's**, demais são jogadores
- 12 grupos da Copa (A–L) com filtro próprio na lista de seleções
- Bandeira de cada seleção e nomes prováveis dos jogadores (revisar quando o álbum oficial sair)
- Sincronização em tempo real entre celulares (Firestore `onSnapshot`)
- Cada álbum tem código de 6 caracteres para compartilhar
- Dashboard com progresso total, por confederação e por seleção
- Lista de faltantes e repetidas, formatada para WhatsApp
- Funciona como PWA (dá pra "instalar" na tela inicial do celular)

> **Sobre os nomes dos jogadores:** as listas em `src/players.js` foram montadas a partir de convocações recentes de cada seleção (18 jogadores por time: posições #2-#12 e #14-#20). Antes de publicar oficialmente, revise comparando com o álbum Panini lançado.

---

## Setup local (5 minutos)

### 1. Pré-requisitos

- Node.js 20 ou superior — instale em [nodejs.org](https://nodejs.org)
- Git — instale em [git-scm.com](https://git-scm.com)
- Conta Google (para Firebase)
- Conta GitHub
- Conta Netlify

### 2. Instalar dependências

```bash
cd album-copa-2026
npm install
```

### 3. Criar o projeto no Firebase

1. Vá em [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto** → dê um nome (ex: `album-copa-2026`) → desabilite Google Analytics → criar
3. Quando o projeto estiver criado, clique no ícone **`</>`** (Web) para adicionar um app web
4. Dê um apelido (ex: `web`), **não** marque hosting → registrar app
5. Copie o objeto `firebaseConfig` que aparece — vai parecer assim:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSyD...",
     authDomain: "album-copa-2026.firebaseapp.com",
     projectId: "album-copa-2026",
     storageBucket: "album-copa-2026.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

6. No menu lateral do Firebase Console, vá em **Build → Firestore Database** → **Criar banco de dados**
7. Escolha **Iniciar em modo de teste** (vamos ajustar as regras depois) → próximo
8. Escolha a região mais próxima (ex: `southamerica-east1` São Paulo) → ativar

### 4. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Abra o `.env` e cole os valores do `firebaseConfig` que você copiou:

```
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=album-copa-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=album-copa-2026
VITE_FIREBASE_STORAGE_BUCKET=album-copa-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Rodar localmente

```bash
npm run dev
```

Abra `http://localhost:5173` no navegador. Pra testar a sincronização entre dois "celulares", abra a mesma URL em duas abas (uma normal e uma anônima) e edite figurinhas em uma — você deve ver a outra atualizar em tempo real.

---

## Regras do Firestore (importante para produção)

O modo de teste expira em 30 dias. Antes disso (ou direto agora), atualize as regras:

1. Firebase Console → **Firestore Database** → aba **Regras**
2. Cole isto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /albums/{albumId} {
      // Qualquer um com o código pode ler/escrever
      // (a "segurança" é o código de 6 caracteres ser difícil de adivinhar)
      allow read: if true;
      allow create: if request.resource.data.code == albumId
                    && request.resource.data.keys().hasAll(['code', 'name', 'stickers', 'createdAt', 'updatedAt']);
      allow update: if resource.data.code == albumId;
      allow delete: if false;
    }
  }
}
```

3. **Publicar**

Essas regras permitem que qualquer pessoa com o código de 6 caracteres edite o álbum (que é o comportamento desejado), mas impedem deletar e validam a estrutura mínima na criação.

> **Aviso de segurança honesto:** com 32⁶ ≈ 1 bilhão de combinações, brute force é inviável na prática mas não impossível. Pra um app de uso entre amigos, é OK. Se quiser segurança forte, adicione autenticação Firebase Auth depois.

---

## Subir para o GitHub

### 1. Criar o repositório

1. Vá em [github.com/new](https://github.com/new)
2. Nome: `album-copa-2026` (ou outro)
3. Visibilidade: **Privado** ou **Público** (sua escolha)
4. **Não** inicialize com README/license/.gitignore (já temos)
5. Criar

### 2. Push do código

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Versão inicial do álbum Copa 2026"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/album-copa-2026.git
git push -u origin main
```

> O `.env` está no `.gitignore`, então **não vai pro GitHub** (que é o correto — chaves de API ficam só no seu computador e no painel do Netlify).

---

## Deploy no Netlify

### 1. Conectar ao GitHub

1. Vá em [app.netlify.com](https://app.netlify.com) e faça login
2. **Add new site → Import an existing project**
3. Escolha **GitHub** e autorize o Netlify a acessar seus repositórios
4. Selecione o repositório `album-copa-2026`

### 2. Configurar build

O Netlify vai detectar automaticamente as configurações pelo `netlify.toml` que já está no projeto:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Não mude nada, só clique em **Deploy**.

### 3. Adicionar variáveis de ambiente

**Importante:** o Netlify precisa das mesmas variáveis do `.env` para o build funcionar.

1. No painel do site recém-criado, vá em **Site configuration → Environment variables**
2. Clique em **Add a variable** → **Add a single variable** para cada uma:

   - `VITE_FIREBASE_API_KEY` → cole o valor
   - `VITE_FIREBASE_AUTH_DOMAIN` → cole o valor
   - `VITE_FIREBASE_PROJECT_ID` → cole o valor
   - `VITE_FIREBASE_STORAGE_BUCKET` → cole o valor
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` → cole o valor
   - `VITE_FIREBASE_APP_ID` → cole o valor

3. Vá em **Deploys → Trigger deploy → Deploy site** para refazer o build com as variáveis

### 4. Autorizar o domínio do Netlify no Firebase

O Firebase, por padrão, só aceita requisições de domínios autorizados:

1. Firebase Console → ícone de engrenagem → **Configurações do projeto** → aba **Geral**
2. Role até **Seus apps** → clique no app web → seção **Domínios autorizados** (ou no topo da página, **Authentication → Settings → Authorized domains**)
3. Adicione o domínio do Netlify: `seu-site.netlify.app`
4. Salvar

### 5. Pronto!

Acesse `https://seu-site.netlify.app` no celular. Pra "instalar" como app:

- **iOS (Safari):** botão de compartilhar → **Adicionar à Tela de Início**
- **Android (Chrome):** menu (⋮) → **Adicionar à tela inicial** ou **Instalar app**

---

## Domínio personalizado (opcional)

Se você tem um domínio (ex: `albumdacopa.com.br`):

1. Netlify → **Domain settings → Add custom domain**
2. Siga as instruções pra configurar o DNS no seu registrador
3. Volte no Firebase e adicione o novo domínio aos autorizados

---

## Comandos úteis

```bash
npm run dev       # Desenvolvimento local (porta 5173)
npm run build     # Build de produção (gera pasta dist/)
npm run preview   # Preview do build local
```

Toda vez que você fizer `git push` na branch `main`, o Netlify automaticamente faz redeploy.

---

## Estrutura do projeto

```
album-copa-2026/
├── index.html              # HTML entry
├── package.json
├── vite.config.js          # Config Vite
├── tailwind.config.js      # Config Tailwind
├── postcss.config.js
├── netlify.toml            # Config Netlify
├── .env.example            # Template de variáveis
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            # Entry React
    ├── index.css           # Tailwind + estilos globais
    ├── App.jsx             # Componentes da UI
    ├── data.js             # Seleções, jogadores, FWC, helpers
    └── firebase.js         # Firebase init + storage helpers
```

---

## Custos

Firebase plano Spark (gratuito) cobre tranquilo um grupo de amigos:

- **50.000 leituras/dia** — cada figurinha marcada gera ~1 leitura via onSnapshot
- **20.000 escritas/dia**
- **1 GiB armazenado**

Pra ter ideia: 10 amigos jogando ativamente um dia inteiro consomem ~1% das cotas. Se passar, o Firebase apenas para de funcionar até o dia seguinte (não cobra automaticamente).

Netlify plano gratuito: 100 GB de banda/mês, builds ilimitados.

---

## Problemas comuns

**Build no Netlify falha com `Missing environment variable`**
→ Você esqueceu de adicionar as variáveis `VITE_FIREBASE_*` no Netlify (passo 3 do deploy).

**App carrega mas dá erro `Missing or insufficient permissions`**
→ As regras do Firestore estão bloqueando. Volte na seção "Regras do Firestore" e publique as regras corretas.

**App não sincroniza entre celulares**
→ Verifique no console do navegador (F12) se há erros relacionados ao Firebase. Se sim, geralmente é variável de ambiente ausente ou domínio não autorizado.

**Quero resetar um álbum**
→ Vá no Firebase Console → Firestore Database → coleção `albums` → ache o documento com o código → delete.
