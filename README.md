# 🦆 Marreco Mágico — Aventura do Saber

Jogo educacional para a **Educação Infantil — Pré-escola II (5 e 6 anos)**, desenvolvido
como solução tecnológica para escolas municipais: roda no navegador, **sem instalação,
sem internet e sem cadastro**.

![feito com HTML, CSS e JavaScript puro](https://img.shields.io/badge/HTML-CSS-JavaScript-blue)

---

## ▶️ Como jogar

**Opção 1 — arquivo único (mais simples para as escolas):**
abra `marreco-magico-arquivo-unico.html` com duplo clique. É tudo o que precisa.

**Opção 2 — projeto completo:**
abra `index.html`. Os arquivos `index.html`, `style.css`, `game.js` e a pasta `audios/`
precisam estar juntos.

Recomenda-se usar o botão **⛶ tela cheia** com as crianças.

---

## 🎯 As 6 aventuras

As 40 perguntas vêm do documento de Curricularização. Cada aventura apresenta as perguntas
da sua categoria **em ordem sorteada** — a cada partida a sequência muda, para a criança
não decorar a ordem.

| Aventura | Categoria | Perguntas |
|---|---|---|
| 🔢 **Matemática** | Matemática e Quantidades | 1 a 8 |
| 🔤 **Português** | Português e Linguagem | 9 a 16 (inclui o jogo da memória com letras) |

**Jogo da memória:** quando as duas cartas não formam par, não aparece mensagem de erro;
elas simplesmente desviram sozinhas depois de pouco mais de 1 segundo, como num jogo da
memória de verdade. Completar o jogo da memória conta como acerto.
| 🎨 **Cores e Formas** | Cores, Formas e Percepção Visual | 17 a 22 |
| 🧭 **Onde Está?** | Noções de Espaço e Direção | 23 a 28 |
| 🐾 **Animais** | Animais e Conhecimentos do Mundo | 29 a 34 |
| 🧠 **Atenção** | Atenção, Memória e Raciocínio | 35 a 40 |

**Conteúdos transversais:** compreensão auditiva (todo enunciado é falado),
percepção visual (figura igual, diferente, sequências, memória), cores e animais
(presentes nas figuras das atividades).

---

## 🌈 Uma viagem por cenários mágicos

A cada pergunta o fundo muda, com uma transição suave e o nome do lugar aparecendo no topo.
São 9 cenários em pixel art, todos animados e sorteados a cada partida:

| Cenário | O que se mexe |
|---|---|
| 🌲 Floresta Mágica (início e mapa) | raios de sol girando, nuvens, borboletas, coelhinhos pulando |
| 🌸 Campo de Flores | arco-íris, balão de ar quente, pipa, borboletas, coelhos, pétalas ao vento |
| 🏖️ Praia do Sol | raios de sol, gaivotas, pipa, brilho no mar, caranguejo andando de lado |
| ❄️ Montanhas de Neve | neve caindo, coelhinho, boneco de neve |
| 🐠 Fundo do Mar | peixes, águas-vivas, algas balançando, bolhas, baú do tesouro |
| 🌅 Lago do Pôr do Sol | família de patinhos nadando, reflexos na água, pássaros, vaga-lumes |
| 🍭 Reino dos Doces | balão de ar quente, pirulitos, balinhas caindo |
| 🌙 Noite Estrelada | aurora colorida, estrelas piscando, estrela cadente, cogumelos que brilham |
| 🏰 Castelo nas Nuvens | balões de ar quente, balões subindo, ilhas flutuantes |

**Outras animações e decorações:**

- o título pula letra por letra, com estrelinhas orbitando o Pipo na tela inicial;
- o Pipo flutua, pisca, pula de alegria quando a criança acerta e balança quando erra;
  tocar nele (no início ou no mapa) faz ele dar "quá-quá";
- ícones temáticos flutuam no fundo de cada aventura (números na Matemática, letras no
  Português, bichinhos em Animais...);
- o Pipo caminha pela barra de progresso; cada acerto solta confete e uma ⭐ voa da
  resposta até a barra;
- 3 ou mais acertos seguidos mostram uma faixa colorida comemorando;
- as perguntas saem e entram com animação; as cartas da memória giram ao virar;
- o fim da aventura tem estrelas aparecendo uma a uma, Pipo dançando, confete e fogos;
- todo toque na tela solta um brilhinho mágico.

> Cada acerto é contabilizado **na primeira tentativa**, e a criança nunca fica
> travada: o erro apenas convida a tentar de novo.

Em computadores configurados para "reduzir movimento", as animações são desligadas
automaticamente.

---

## 🪜 Níveis

Em cada aventura, as perguntas vêm em três níveis, seguindo a classificação do documento
de Curricularização: **Fácil → Médio → Difícil** (dentro de cada nível a ordem é sorteada).
Ao terminar um nível, o Pipo aparece comemorando ("Parabéns! Você passou para o Nível
Médio/Difícil") e o jogo segue sozinho para o próximo nível — ou a criança toca na
mensagem para ir direto à pergunta. Depois do Nível Difícil vem a
tela final de sempre, com as estrelas.

| Aventura | Fácil | Médio | Difícil |
|---|---|---|---|
| 🔢 Matemática | 1–4 | 5–7 | 8 |
| 🔤 Português | 9–11 | 12–14 | 15–16 |
| 🎨 Cores e Formas | 17–19 | 20–21 | 22 |
| 🧭 Onde Está? | 23–24 | 25, 26, 28 | 27 |
| 🐾 Animais | 29–31 | 32–33 | 34 |
| 🧠 Atenção | 35 | 36–38 | 39–40 |

---

## 🗣️ Os áudios do Pipo

As falas do jogo são os áudios gravados da pasta **`audios/`**. Cada pergunta tem o seu
áudio (que lê a pergunta e as opções), e há áudios para os momentos especiais:

| Arquivo | Quando toca |
|---|---|
| `geral-voz-de-entrada.mp3` | tela inicial: no primeiro toque na tela ou ao tocar no Pipo |
| `geral-quem-vai-jogar.mp3` | ao abrir a tela "Quem vai jogar?" (tocar no Pipo dessa tela repete) |
| `geral-escolha-de-aventura.mp3` | ao entrar no mapa de aventuras |
| `geral-mandou-bem.mp3`, `geral-elogio-muito-inteligente.mp3`, `geral-elogio-voce-conseguiu.mp3`, `geral-elogio-muito-bem.mp3` | resposta certa: um deles é sorteado (sem repetir o mesmo seguido); a próxima pergunta espera o áudio terminar |
| `geral-tente-de-novo.mp3` | resposta errada (e no fim, se a criança não ganhou estrelas) |
| `fim-uma-estrela.mp3`, `fim-duas-estrelas.mp3`, `fim-tres-estrelas.mp3` | fim da aventura |
| `matematica-01-…` até `atencao-40-…` | cada pergunta, pelo número do documento |
| `nivel-medio.mp3`, `nivel-dificil.mp3` *(opcionais, ainda não gravados)* | na animação de troca de nível; sem eles, toca só uma musiquinha de festa |

As perguntas 35 e 36 (memória) têm duas partes: `…-1-observe.mp3` toca enquanto a
criança observa a imagem e `…-2-pergunta.mp3` quando a imagem some.

Nas perguntas 35 e 36, se a criança errar, a imagem aparece de novo por alguns segundos
para ela olhar outra vez e tentar de novo.

O botão 🔊 repete o áudio da pergunta. Para trocar um áudio, basta substituir o arquivo
mantendo o mesmo nome.

- No projeto completo, a pasta `audios/` precisa ficar junto do `index.html`.
- No `marreco-magico-arquivo-unico.html` os áudios já estão embutidos (uma cópia mais
  leve); se trocar algum áudio da pasta, o arquivo único precisa ser gerado de novo.

---

## 🔒 Privacidade

Depois de clicar em **▶ Jogar** aparece a tela **"Quem vai jogar?"**, com nome da criança,
idade e escola — **nada é obrigatório**, dá para seguir com tudo em branco. Só o **nome**
é usado (aparece no mapa e na tela final); idade e escola **não são guardadas nem
enviadas** para lugar nenhum. **Nada é salvo**: as estrelas valem só para a partida
atual e somem ao começar uma nova partida ou fechar o jogo.
Nada é enviado para a internet — não há servidor, contas nem coleta de dados.

---

## 🎨 Estilo visual

- Arte em **pixel art** desenhada por código — nenhuma imagem externa.
- Título em fonte de pixel **Pixelify Sans** (licença SIL Open Font License 1.1, texto da
  licença em `fontes/`), embutida no CSS para funcionar sem internet.
- 9 cenários gerados em `<canvas>` (céu em faixas, sol/lua, morros, árvores, mar...)
  com partículas animadas por cima, redesenhados ao redimensionar.
- Uma segunda camada de efeitos (confete, fogos, brilhos) fica por cima da interface.
- Mascote **Pipo, o marreco mágico**: sprite 24×24 definido por uma grade de letras
  e convertido em SVG, com quatro poses (normal, feliz, "ops" e piscadinha).
- Interface com alvos grandes de toque, alto contraste e navegação sem leitura.

---

## 🧩 Estrutura do código

```
index.html   → telas: início, mapa, jogo e fim de fase
audios/      → falas gravadas do Pipo (uma por pergunta e por momento do jogo)
style.css    → paleta mágica, layout responsivo, componentes em estilo pixel, animações
game.js      → mascote (sprites), cenários animados e efeitos (canvas), perguntas
               das 6 aventuras e motor de rodadas
```

Os dois tipos de atividade (`escolha` e `memoria`) são genéricos: para criar
conteúdo novo basta acrescentar as perguntas em `PERGUNTAS` (com o áudio em
`AUDIOS_PERGUNTAS` e o nível em `NIVEIS_PERGUNTAS`) e registrar a aventura em `MUNDOS`.
Para um cenário novo, crie a função de desenho e registre-a em `CENAS` e `JORNADA`.

### ⚡ Desempenho

O jogo foi pensado para rodar bem em computadores simples de escola:

- o Pipo é uma única imagem gerada uma vez (e não centenas de elementos na página);
- cada cenário é desenhado uma só vez e guardado; os demais são preparados enquanto o
  computador está ocioso, então a troca de pergunta não engasga;
- o fundo animado roda a ~30 quadros por segundo numa tela de baixa resolução;
- as animações usam apenas propriedades leves (movimento e transparência);
- **modo leve automático:** se o computador não conseguir manter o ritmo, o jogo diminui
  as partículas e desliga os enfeites animados, sem afetar as perguntas;
- no arquivo único, cada áudio é convertido para a memória só na primeira vez que toca.

---

## ✅ Compatibilidade

Chrome, Edge e Firefox atuais, em computadores, notebooks e tablets.
Funciona offline e em máquinas modestas (sem dependências, sem downloads).
As falas são áudios gravados (MP3). Sem som, o jogo continua normalmente com
os enunciados escritos.

---

## 📄 Licença

MIT — uso livre para fins educacionais.
