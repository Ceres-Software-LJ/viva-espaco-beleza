# Viva Espaço de Beleza — Landing Page

Landing page estática, mobile-first, com foco total em conversão pelo **WhatsApp**.
HTML5 + Tailwind CSS + JavaScript puro. Sem framework, sem build obrigatório.

---

## 📁 Estrutura

```
VIVA ESPACO BELEZA/
├── index.html                 # a página inteira (comentada por seção)
├── assets/
│   ├── css/styles.css         # componentes, animações e acessibilidade
│   ├── js/main.js             # navbar, menu, fade-in, FAQ, carrossel
│   └── img/
│       ├── logo-viva.jpg      # logo (navbar, rodapé, favicon)
│       ├── hero.jpg/.webp     # foto do hero (900×1200)
│       ├── unhas.jpg/.webp    # unhas esmaltadas (1000×1250)
│       ├── unhas-sem-esmalte.jpg/.webp  # unhas naturais, mesmo enquadramento
│       └── og-viva.jpg        # imagem de compartilhamento (1200×630)
├── tailwind.config.js         # só para o build opcional de produção
├── src/input.css              # só para o build opcional de produção
└── README.md
```

---

## ▶️ Como rodar localmente

**Opção 1 — mais simples:** dê duplo clique em `index.html`. Funciona direto no navegador.

**Opção 2 — servidor local** (recomendado, evita bloqueios de arquivo local):

```bash
# com Node instalado
npx serve .

# ou com Python
python -m http.server 5500
```

Depois abra `http://localhost:3000` (serve) ou `http://localhost:5500` (Python).

> No VS Code, a extensão **Live Server** também resolve: botão direito em `index.html` → *Open with Live Server*.

---

## 🚀 Deploy

O projeto vive em **github.com/Ceres-Software-LJ/viva-espaco-beleza** e é publicado pela Vercel.
É site 100% estático: **não há build**, a Vercel só serve os arquivos.

### Primeira publicação

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório pela organização
2. **Framework Preset:** `Other` · **Build Command:** deixe vazio · **Output Directory:** `.`
3. Deploy

A partir daí, todo push na `main` republica sozinho.

### Configuração incluída

| Arquivo | Para quê |
|---|---|
| `vercel.json` | Cache de 1 dia + `stale-while-revalidate` em `/assets`, e headers de segurança |
| `.vercelignore` | Mantém `_fontes/`, `src/` e o README fora do CDN |
| `.gitignore` | Barra os masters de vídeo (22 MB) e saídas de build |

> O cache de `/assets` é deliberadamente **1 dia, não `immutable`**. Os nomes dos arquivos não têm
> hash, então quando você trocar uma foto ou o vídeo mantendo o mesmo nome, a mudança aparece em
> no máximo 24h em vez de ficar presa por um ano no navegador de quem já visitou.

### ⚠️ Confira a URL depois do primeiro deploy

O `canonical`, as tags Open Graph e o JSON-LD estão apontando para
`https://viva-espaco-beleza.vercel.app` — o endereço que a Vercel gera a partir do nome do repo.

**Se a URL real for diferente**, ou quando você apontar um domínio próprio, troque em um comando:

```bash
sed -i 's|https://viva-espaco-beleza.vercel.app|https://SEU-ENDERECO-REAL|g' index.html
```

Isso não é cosmético: o `canonical` diz ao Google qual é a página oficial, e o `og:image` é a
prévia que aparece quando o link é enviado no WhatsApp — que é o canal de conversão da página.

### Os masters de vídeo

Os três clipes originais do Veo (22 MB) estão em `_fontes/` **fora do Git**, de propósito: em
repositório eles tornariam todo clone lento para sempre. **Guarde uma cópia no Drive** — sem eles
não dá para regerar o loop do hero com outro corte.

As fotos originais, essas sim estão versionadas (são leves e você precisa delas para recortar de novo).

---

---|
| **Netlify** | Acesse [app.netlify.com/drop](https://app.netlify.com/drop) e arraste a pasta inteira. Sai no ar em segundos. |
| **Vercel** | `npx vercel` na pasta, ou suba num repositório Git e importe em vercel.com (sem configuração — é site estático). |
| **GitHub Pages** | Suba os arquivos num repositório → *Settings → Pages → Deploy from branch → main / (root)*. |
| **Hospedagem comum (cPanel/FTP)** | Envie todos os arquivos para a pasta `public_html`. |

Depois de publicar, volte ao `index.html` e troque `https://viva-espaco-beleza.vercel.app` pelo domínio real (aparece no `canonical`, nas tags Open Graph e no JSON-LD).

---

## ✏️ Checklist

### ✅ Já configurado

- **Fotos reais** — hero (`hero.jpg`/`.webp`, 900×1200) e experiência (`unhas.jpg`/`.webp`, 1000×1250),
  geradas a partir de `imagem modelo.jpg` e `imagem unha.jpg` com WebP + fallback JPG
- **Imagem de compartilhamento** — `og-viva.jpg` (1200×630), recortada da foto do hero
- **Instagram** — https://www.instagram.com/vivaespacodebeleza.cg/ (rodapé + JSON-LD)
- **Horário** — seg a sex 08:00–18:00, sáb 08:00–14:00 (seção de localização, rodapé e JSON-LD)

### ⬜ Falta você fazer

**1. Domínio** — procure por `viva-espaco-beleza.vercel.app` no `index.html` e troque pelo endereço real
(aparece no `canonical`, nas tags Open Graph e no JSON-LD).

**2. Duração dos serviços** — procure por `PREENCHER` (3 ocorrências, nos cards de serviço).
Cada card tem uma linha de duração pronta e comentada; confirme o tempo real, descomente e ajuste:

```html
<!-- PREENCHER a duração e descomentar:
<p class="service-time"><svg class="h-3.5 w-3.5"><use href="#i-clock"></use></svg> cerca de 1h</p>
-->
```

**3. Resposta de tempo no FAQ** — procure por `MELHORAR` no `index.html`. A resposta atual funciona
("a gente te diz quanto tempo reservar"), mas tempos concretos convertem melhor.

---

## 💅 Esmaltação progressiva (seção "A experiência Viva")

A foto das unhas é **pintada conforme o scroll**. São duas fotos idênticas empilhadas —
`unhas-sem-esmalte` embaixo e `unhas` em cima — e a de cima é revelada de baixo para cima
com `clip-path`. Uma faixa de brilho acompanha a linha do esmalte, como o reflexo do pincel.

| Tela | Comportamento |
|---|---|
| ≥ 1024px e ≥ 700px de altura | A seção fica presa por ~2 telas; a pintura acompanha o scroll e os 4 destaques entram em sequência |
| Menor que isso | Sem fixação — a pintura acontece enquanto a foto entra na tela |
| `prefers-reduced-motion` | Mostra direto a foto esmaltada, sem animação |
| Sem JavaScript | `<noscript>` mostra a foto esmaltada |

Onde mexer:

- **HTML** — `<figure id="esmalte">` dentro de `#experiencia`
- **CSS** — bloco *5b. Esmaltação progressiva* em `assets/css/styles.css`
- **JS** — `initEsmalte()` em `assets/js/main.js`. Ajuste `PINTURA_FIM` (0.62) para a pintura
  terminar antes ou depois, e `240vh` no CSS para a seção ficar presa por mais ou menos tempo

### Trocar o par de fotos

O efeito só funciona se as duas fotos estiverem **alinhadas ao pixel** — mesma pose, mesma luz,
mesmo enquadramento. O jeito confiável é gerar a segunda por edição de imagem (Nano Banana/Gemini),
partindo da primeira, com um prompt que proíbe mudar qualquer outra coisa:

```
Remove the dark nail polish from all fingernails. Keep the exact same hands,
pose, lighting, skin tone and background — change nothing except the nails.
Natural bare nails, photorealistic, identical camera angle and framing.
```

Para conferir o alinhamento antes de publicar, gere um blend de diferença: se só as unhas
aparecerem, está alinhado.

```bash
ffmpeg -y -i pintada.jpg -i sem-esmalte.jpg \
  -filter_complex "[1:v]scale=1440:1920[b];[0:v][b]blend=all_mode=difference,eq=contrast=2.2" diff.jpg
```

Depois, processe as duas com o mesmo corte:

```bash
ffmpeg -y -i sem-esmalte.jpg -vf "crop=896:1120:0:0,scale=1000:1250:flags=lanczos" -q:v 3 assets/img/unhas-sem-esmalte.jpg
ffmpeg -y -i sem-esmalte.jpg -vf "crop=896:1120:0:0,scale=1000:1250:flags=lanczos" -c:v libwebp -quality 80 -preset photo -frames:v 1 assets/img/unhas-sem-esmalte.webp
```

---

## 🎬 Vídeo de fundo do hero

O hero alterna **dois clipes** de unha sendo pintada, com dissolve entre eles, texto por cima e
véu verde garantindo o contraste. Ambos gerados no Veo 3.1 (Google Flow). Loop de 7,67s.

A montagem é: clipe A (3,6s) → dissolve 0,8s → clipe B (5,6s) → dissolve 0,8s de volta ao início.
Tudo para frente — **sem reverso**. A primeira versão usava vai-e-volta de um clipe só e o esmalte
"despintava" na volta, o que denunciava o truque.

| Contexto | O que carrega | Peso |
|---|---|---|
| Desktop | `hero-loop.webm` 1280×720 | 443 KB |
| Celular (< 768px) | `hero-loop-mobile.webm` 405×720 | 170 KB |
| `saveData` / rede 2G | Só o poster | 37 KB |
| `prefers-reduced-motion` | Só o poster | 37 KB |

O `<video>` **não tem `src` no HTML** — o `initHeroVideo()` mede a largura da tela e injeta as
fontes do tamanho certo, e pausa o vídeo quando o hero sai da tela. O `poster` cobre os casos
em que nada é baixado, então o LCP continua sendo uma imagem de 37 KB.

A versão mobile é um recorte 9:16 em 58% da largura — o ponto que mantém pincel e unha em quadro
nos dois clipes da montagem. Como o véu verde cobre ~75% no celular, ela é comprimida bem mais
forte (CRF 44) sem diferença perceptível.

**Contraste verificado sobre a cor média real do vídeo**, no quadro mais claro: texto creme em
7,2:1 e nude claro em 4,9:1 — os dois acima do mínimo AA. Foi essa medição que permitiu baixar
o véu de 88% para 72% no mobile, deixando o vídeo aparecer de verdade em vez de virar um fundo
verde quase liso.

### Refazer a montagem com outros clipes

```bash
# 1. dois trechos, ambos só para FRENTE (nunca reverso)
ffmpeg -y -ss 3.0 -t 3.6 -i clipeA.mp4 -vf "scale=1280:720:flags=lanczos,fps=24,setsar=1" -an segA.mp4
ffmpeg -y -ss 1.2 -t 5.6 -i clipeB.mp4 -vf "scale=1280:720:flags=lanczos,fps=24,setsar=1" -an segB.mp4

# 2. A -> B com dissolve de 0,8s   (offset = duração de A menos o dissolve)
ffmpeg -y -i segA.mp4 -i segB.mp4   -filter_complex "[0][1]xfade=transition=fade:duration=0.8:offset=2.8,format=yuv420p" -an montagem.mp4

# 3. emenda do loop: o fim dissolve para dentro do começo
#    o 6.8 abaixo = duração da montagem (8,4s) menos 2x o dissolve
ffmpeg -y -i montagem.mp4 -filter_complex   "[0]split[body][pre];   [pre]trim=duration=0.8,format=yuva420p,fade=in:st=0:d=0.8:alpha=1,setpts=PTS+6.8/TB[jt];   [body]trim=0.8,setpts=PTS-STARTPTS[main];   [main][jt]overlay,format=yuv420p" -an loop.mp4

# 4. versões finais + poster
ffmpeg -y -i loop.mp4 -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -an assets/img/hero-loop.webm
ffmpeg -y -i loop.mp4 -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an assets/img/hero-loop.mp4
ffmpeg -y -i loop.mp4 -frames:v 1 -q:v 4 assets/img/hero-loop-poster.jpg
```

**Nunca use reverso.** Esmalte que "despinta" é o que mais denuncia o loop. Dois clipes diferentes
alternando com dissolve resolvem isso e ainda dão variedade.

**Corte antes de o clipe estragar.** O clipe B original tinha 10s, mas a partir dos 7s o fundo
virava branco com brilhinhos — típico do Veo perdendo a cena. Sempre revise os últimos segundos.

Se trocar os clipes, confira também o `object-position: 58% center` em `.hero-midia` — é ele que
define qual parte do quadro 16:9 aparece no recorte vertical do celular, e precisa servir aos dois.

---

## ⭐ Esteira de avaliações

Os depoimentos rolam em loop contínuo da **esquerda para a direita**, pausando no hover
e ao navegar por teclado.

- **HTML** — `<div class="marquee">` com `#depo-track` dentro, na seção `#depoimentos`
- **CSS** — bloco *Depoimentos: esteira contínua* em `styles.css`
- **JS** — `initMarquee()` duplica os cards (a cópia entra com `aria-hidden`, para o leitor
  de tela não ler tudo duas vezes) e calcula a duração pela largura de uma volta

**Para adicionar ou remover depoimentos**, é só editar os `<figure class="depo-card">`.
A velocidade não muda: o JS recalcula a duração a partir da largura
(`MARQUEE_VELOCIDADE = 45` pixels por segundo — mexa aí se quiser mais rápido ou mais lento).

Dois detalhes que parecem bobos mas quebram o efeito se mudarem:

- O espaçamento entre cards é `margin-right`, **não `gap`**. Com `gap`, metade do trajeto
  não coincide com um ciclo inteiro e o loop dá um pulinho a cada volta.
- Os cards têm largura fixa (300px / 360px). É o que permite medir a volta antes de as
  fontes carregarem.

### As 7 avaliações

Todas reais, copiadas do perfil do Google do salão, com **correções mínimas de digitação**
(abreviações e concordância) para leitura em card. O sentido e a voz de cada pessoa foram mantidos.

Nomes no formato *primeiro nome + inicial* — o mesmo padrão que já estava na página. Se preferir
os nomes completos como aparecem no Google, é só editar os `<figcaption>`.

Duas coisas para conferir com o salão:

- **As datas são relativas** ("há 4 meses", "há 1 ano") e ficam desatualizadas. Revise de tempos
  em tempos ou troque por algo fixo.
- **Todos os cards mostram 5,0.** Os textos são claramente entusiasmados, mas a nota estrela a
  estrela não veio na cópia — confirme no Google se alguma dessas 7 é 4 estrelas e ajuste.

---

### Trocar fotos no futuro

As fotos estão em `assets/img/`. Para substituir, gere as duas versões e mantenha os mesmos nomes:

```bash
ffmpeg -y -i nova-foto.jpg -vf "scale=900:1200:flags=lanczos" -q:v 3 assets/img/hero.jpg
ffmpeg -y -i nova-foto.jpg -vf "scale=900:1200:flags=lanczos" -c:v libwebp -quality 80 -preset photo -frames:v 1 assets/img/hero.webp
```

Se a foto nova não for 3:4, adicione um `crop` antes do `scale`
(ex.: `crop=1440:1800:0:0,scale=...` para 4:5). Não esqueça de atualizar o `alt` no `index.html`.

### Depoimentos

Os três textos foram redigidos a partir das avaliações do Google. Se quiser usar os textos
originais, é só substituir dentro dos `<blockquote>` na seção `#depoimentos`.

---

## 💬 Links de WhatsApp

Todos apontam para `https://wa.me/5567998097880` com mensagem pré-preenchida.
Para trocar o número, faça um **localizar e substituir** de `5567998097880`
(aparece também em `tel:+5567998097880` e no JSON-LD).

Mensagens por contexto (parâmetro `?text=`):

| Onde | Mensagem |
|---|---|
| Navbar / Hero / Botão flutuante | `Oi! Vim pelo site e quero agendar meu horário 💅` |
| Card manicure | `Oi! Vim pelo site e quero agendar manicure/pedicure 💅` |
| Card cabelo | `Oi! Vim pelo site e quero agendar uma escova/tratamento 💇‍♀️` |
| Card unhas em gel | `Oi! Vim pelo site e quero agendar unhas em gel/alongamento ✨` |
| Card bem-estar | `Oi! Vim pelo site e quero agendar um dia de cuidados no Viva 💛` |
| A experiência Viva | `Oi! Vim pelo site, quero conhecer o Viva e agendar meu horário 💛` |
| Como funciona | `Oi! Vim pelo site e quero começar meu agendamento 💅` |
| Depoimentos | `Oi! Vim pelo site e quero ser a próxima cliente feliz do Viva 💛` |
| Localização | `Oi! Vim pelo site, vi o endereço e quero agendar um horário 💅` |
| FAQ | `Oi! Vim pelo site e tenho uma dúvida antes de agendar` |
| CTA final | `Oi! Vim pelo site e quero agendar meu horário no Viva 💛` |
| Rodapé | `Oi! Vim pelo site e quero falar com o Viva 💛` |

**Todas as 14 mensagens começam com "Vim pelo site"** — assim o salão sabe de onde veio o contato
antes mesmo de responder. O complemento de cada uma diz qual seção gerou o clique, o que serve
de métrica grátis enquanto não houver GA4 ou Pixel.

> Os espaços estão codificados como `%20`. Ao editar, mantenha esse padrão
> (acentos e emojis podem ficar como estão).

**Botão flutuante:** fica fixo no canto inferior direito, visível em toda a página,
com pulsação suave. Está no final do `index.html`, com o id `wa-fab`.

---

## 🎨 Identidade visual

| Cor | Hex | Uso |
|---|---|---|
| Verde Viva | `#2C5450` | Hero, experiência, CTA final, rodapé |
| Nude dourado | `#C9A47E` | Títulos de destaque, ícones, linhas finas |
| Off-white quente | `#F7F2EC` | Fundo padrão das seções claras |
| Sage | `#7A9691` | Blocos secundários e hover |
| Grafite | `#33322F` | Textos longos |
| Verde WhatsApp | `#25D366` | **Exclusivo** dos botões de WhatsApp |

**Tipografia:** Cormorant Garamond (títulos) + Montserrat (corpo e botões), via Google Fonts.
**Ícones:** SVG inline em linha fina (estilo Lucide), agrupados num sprite no topo do `<body>`.
Para adicionar um ícone novo, copie um `<symbol>` de [lucide.dev](https://lucide.dev) e use
`<svg class="h-6 w-6"><use href="#i-nome"></use></svg>`.

---

## ⚙️ Build opcional (produção)

A página usa o **Tailwind Play CDN** — zero configuração, ótimo para editar e publicar rápido.
Ele gera um aviso no console e é um pouco mais pesado. Para gerar um CSS enxuto:

```bash
npm install -D tailwindcss@3
npx tailwindcss -i ./src/input.css -o ./assets/css/tailwind.css --minify
```

Depois, no `index.html`:

1. **Remova** as duas linhas do CDN:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   <script> tailwind.config = { ... } </script>
   ```
2. **Adicione** antes do `styles.css`:
   ```html
   <link rel="stylesheet" href="assets/css/tailwind.css" />
   ```

O `tailwind.config.js` já está pronto e espelha as cores e fontes do config inline.

---

## ✅ O que já está incluído

- **SEO:** `title`, meta description, canonical, Open Graph, Twitter Card e
  dados estruturados **LocalBusiness** (JSON-LD) com endereço, telefone, horário e nota 4,7
- **Acessibilidade:** HTML semântico, link "pular para o conteúdo", foco visível,
  `aria-expanded`/`aria-controls` no FAQ e no menu, `alt` nas imagens, contraste conferido,
  áreas de toque de no mínimo 44–48px
- **Performance:** sem bibliotecas JS externas, ícones em SVG inline, `loading="lazy"`
  nas imagens abaixo da dobra e no mapa, fontes com `display=swap`
- **Animações leves:** fade-in escalonado ao rolar, hover discreto e pulsação no botão
  flutuante — tudo desativado automaticamente com `prefers-reduced-motion`
- **Mobile-first:** coluna única na ordem de conversão, carrossel de depoimentos com arraste,
  menu mobile e botão de WhatsApp sempre visível
