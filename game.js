(function () {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function sortear(a) { return a[rnd(a.length)]; }
  function embaralhar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function amostra(a, n) { return embaralhar(a).slice(0, n); }
  function el(tag, classe, html) {
    var e = document.createElement(tag);
    if (classe) { e.className = classe; }
    if (html !== undefined) { e.innerHTML = html; }
    return e;
  }
  function mostrarTela(id) {
    var telas = document.querySelectorAll('.tela');
    for (var i = 0; i < telas.length; i++) { telas[i].classList.remove('ativa'); }
    $('#' + id).classList.add('ativa');
    window.scrollTo(0, 0);
  }

  var ENTRADAS = {
    desce: [[{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }],
      { duration: 500, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'backwards' }],
    zoom: [[{ opacity: 0, transform: 'scale(.7)' }, { opacity: 1, transform: 'none' }],
      { duration: 500, delay: 100, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'backwards' }],
    pop: [[{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }],
      { duration: 400, easing: 'cubic-bezier(.3,1.7,.5,1)', fill: 'backwards' }]
  };
  function reanimar(e, tipo) {
    if (typeof e === 'string') { e = $(e); }
    if (!e || reduzirMovimento || !e.animate) { return; }
    var a = ENTRADAS[tipo || 'pop'];
    e.animate(a[0], a[1]);
  }

  function reiniciarClasse(e, classe) {
    if (!e) { return; }
    e.classList.remove(classe);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { e.classList.add(classe); });
    });
  }

  function surgir(e, i) {
    e.style.setProperty('--i', i);
    e.classList.add('surge');
    e.addEventListener('animationend', function fim(ev) {
      if (ev.animationName === 'surge') { e.classList.remove('surge'); e.removeEventListener('animationend', fim); }
    });
  }

  function letrasOnda(e) {
    if (!e) { return; }
    var letras = Array.from ? Array.from(e.textContent) : e.textContent.split(''), html = '', k = 0;
    letras.forEach(function (ch) {
      if (ch === ' ') { html += ' '; return; }
      html += '<i style="--i:' + (k++) + '">' + ch + '</i>';
    });
    e.innerHTML = html;
  }

  var PALETA = {
    k: '#241a4d',  w: '#f8f3ff',
    s: '#cdbdf0',  o: '#ffb454',
    d: '#e08a2e',  h: '#6b4fc4',
    l: '#9d8bea',  g: '#4a2fa6',
    c: '#ff9ec4',  y: '#ffd45e'
  };

  var MARRECO = [
    '..........khk...........',
    '.........klhhk..........',
    '.........klhhk.....y....',
    '........klhhhhk.........',
    '.......klhhhhhhk........',
    '......kkkkkkkkkkk.......',
    '.....kwwwwwwwwwwwk......',
    '....kwwwwwwwwwwwwwk.....',
    '...kwwwwwwwwwwwwwwwk....',
    '...kwwkkwwwwwwwkkwwk....',
    '...kwwkkwwwwwwwkkwwk....',
    '...kwccwwwwwwwwwccwk....',
    '...kwwwwwoooooowwwwk....',
    '...kwwwwwwddddwwwwwk....',
    '....kwwwwwwwwwwwwwk.....',
    '...kkwwwwwwwwwwwwwkk....',
    '..kkswwwwwwwwwwwwwskk...',
    '..kswwwwwwwwwwwwwwwsk...',
    '..kswwwwwwwwwwwwwwwsk...',
    '...kkwwwwwwwwwwwwwkk....',
    '....kwwwwwwwwwwwwwk.....',
    '.....kkkkkkkkkkkkk......',
    '.......oo.....oo........',
    '......dddd...dddd.......'
  ];

  function comLinhas(base, trocas) {
    var g = base.slice();
    for (var i in trocas) { if (trocas.hasOwnProperty(i)) { g[i] = trocas[i]; } }
    return g;
  }

  var POSES = {
    normal: MARRECO,

    feliz: comLinhas(MARRECO, {
      6: '..y..kwwwwwwwwwwwk......',
      10: '...kwkwwkwwwwwkwwkwk....',
      12: '...kwwwwwoooooowwwwk.y..'
    }),

    ops: comLinhas(MARRECO, { 9: '...kwwwwwwwwwwwwwwwk....' }),

    pisca: comLinhas(MARRECO, { 9: '...kwwwwwwwwwwwwwwwk....', 10: '...kwkkkwwwwwwwkkkwk....' })
  };

  function spriteSVG(grade) {
    var larg = grade[0].length, alt = grade.length, corpo = '';
    for (var y = 0; y < alt; y++) {
      var x = 0;
      while (x < larg) {
        var ch = grade[y].charAt(x);
        if (ch === '.') { x++; continue; }
        var ini = x;
        while (x < larg && grade[y].charAt(x) === ch) { x++; }
        corpo += '<rect x="' + ini + '" y="' + y + '" width="' + (x - ini) + '" height="1" fill="' + PALETA[ch] + '"/>';
      }
    }
    return '<svg viewBox="0 0 ' + larg + ' ' + alt + '" xmlns="http://www.w3.org/2000/svg" ' +
      'shape-rendering="crispEdges" role="img" aria-label="Pipo, o marreco mágico">' + corpo + '</svg>';
  }

  var cacheSprite = {};
  function urlSprite(pose) {
    if (!cacheSprite[pose]) {
      cacheSprite[pose] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(spriteSVG(POSES[pose]));
    }
    return cacheSprite[pose];
  }
  function imgSprite(pose) {
    return '<img class="sprite" alt="" draggable="false" src="' + urlSprite(pose) + '">';
  }

  function prepararSprites() {
    Object.keys(POSES).forEach(function (pose) { var im = new window.Image(); im.src = urlSprite(pose); });
  }
  function pintarMascote(seletor, pose) {
    var e = typeof seletor === 'string' ? $(seletor) : seletor;
    if (!e) { return; }
    pose = pose || 'normal';
    var img = e.firstElementChild;
    if (img && img.tagName === 'IMG') { img.src = urlSprite(pose); } else { e.innerHTML = imgSprite(pose); }
    e.setAttribute('data-pose', pose);
  }

  var MOV_MASCOTE = {
    pula: [[{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-24px) scale(1.08,.94)', offset: 0.3 },
      { transform: 'translateY(0) scale(1.14,.86)', offset: 0.55 }, { transform: 'translateY(-6px) scale(.97,1.04)', offset: 0.75 },
      { transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.3,1.6,.5,1)' }],
    balanca: [[{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)', offset: 0.2 }, { transform: 'rotate(10deg)', offset: 0.4 },
      { transform: 'rotate(-7deg)', offset: 0.6 }, { transform: 'rotate(4deg)', offset: 0.8 }, { transform: 'rotate(0)' }],
      { duration: 600, easing: 'ease-in-out' }]
  };
  function animarMascote(seletor, tipo) {
    var e = typeof seletor === 'string' ? $(seletor) : seletor;
    if (!e || reduzirMovimento || !e.animate || !MOV_MASCOTE[tipo]) { return; }
    e.animate(MOV_MASCOTE[tipo][0], MOV_MASCOTE[tipo][1]);
  }

  function piscarDeVezEmQuando() {
    window.setInterval(function () {
      var ms = document.querySelectorAll('.tela.ativa .mascote[data-pose="normal"]');
      Array.prototype.forEach.call(ms, function (m) {
        var img = m.firstElementChild;
        if (!img || img.tagName !== 'IMG') { return; }
        img.src = urlSprite('pisca');
        window.setTimeout(function () {
          if (m.getAttribute('data-pose') === 'normal') { img.src = urlSprite('normal'); }
        }, 170);
      });
    }, 3300);
  }

  var P_FUNDO = 4, P_EFEITO = 3, PI2 = Math.PI * 2;
  var reduzirMovimento = false;
  try { reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }

  function ruido(s) {
    return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  }
  function circulo(g, cx, cy, raio, cor) {
    g.fillStyle = cor;
    for (var y = -raio; y <= raio; y++) {
      var dx = Math.floor(Math.sqrt(Math.max(0, raio * raio - y * y)));
      g.fillRect(cx - dx, cy + y, dx * 2 + 1, 1);
    }
  }

  function semicirculo(g, cx, cy, raio, cor) {
    g.fillStyle = cor;
    for (var y = -raio; y <= 0; y++) {
      var dx = Math.floor(Math.sqrt(Math.max(0, raio * raio - y * y)));
      g.fillRect(cx - dx, cy + y, dx * 2 + 1, 1);
    }
  }
  function nuvem(g, x, y, larg, alt, cor) {
    g.fillStyle = cor;
    g.fillRect(x, y, larg, alt);
    var passos = Math.max(3, Math.round(larg / 12));
    for (var i = 0; i < passos; i++) {
      var raio = Math.round(alt * (0.5 + 0.45 * Math.sin((i + 1) * 2.1)));
      circulo(g, Math.round(x + larg * (i + 0.5) / passos), y, Math.max(2, raio), cor);
    }
  }

  function pinheiro(g, x, base, altura, cor, corTronco) {
    var camadas = 2 + Math.round(altura / 9);
    var meiaMax = Math.max(2, Math.round(altura * 0.30));
    var copa = Math.round(altura * 0.88);
    g.fillStyle = corTronco;
    g.fillRect(x - 1, base - Math.round(altura * 0.14), 3, Math.round(altura * 0.14) + 1);
    g.fillStyle = cor;
    for (var i = 0; i < camadas; i++) {
      var topo = Math.round(base - altura + copa * i / camadas);
      var altCamada = Math.max(2, Math.ceil(copa / camadas) + 1);
      var meia = Math.max(1, Math.round(meiaMax * (i + 1) / camadas));
      var passos = Math.max(2, Math.round(altCamada / 2));
      for (var s = 0; s < passos; s++) {
        var mm = Math.max(1, Math.round(meia * (s + 1) / passos));
        g.fillRect(x - mm, topo + Math.round(altCamada * s / passos),
          mm * 2 + 1, Math.ceil(altCamada / passos));
      }
    }
  }

  function faixas(g, w, y0, y1, cores) {
    for (var i = 0; i < cores.length; i++) {
      var a = Math.round(y0 + (y1 - y0) * i / cores.length);
      var b = Math.round(y0 + (y1 - y0) * (i + 1) / cores.length);
      g.fillStyle = cores[i]; g.fillRect(0, a, w, b - a);
    }
  }

  function morros(g, w, h, base, amp, freq, fase, cor) {
    var topos = [];
    g.fillStyle = cor;
    for (var x = 0; x < w; x++) {
      var y = Math.round(base - amp * (0.55 + 0.35 * Math.sin(x * freq + fase) + 0.15 * Math.sin(x * freq * 2.7 + fase * 1.9)));
      topos.push(y);
      g.fillRect(x, y, 1, h - y);
    }
    return topos;
  }
  function pontilhar(g, r, x0, y0, larg, alt, n, cor) {
    g.fillStyle = cor;
    for (var i = 0; i < n; i++) {
      g.fillRect(Math.round(x0 + r() * larg), Math.round(y0 + r() * alt), 1 + Math.round(r()), 1);
    }
  }
  function sol(g, sx, sy, raio, corpo, miolo, halo) {
    circulo(g, sx, sy, raio + 6, halo || 'rgba(255,236,150,0.16)');
    circulo(g, sx, sy, raio + 3, 'rgba(255,240,170,0.30)');
    circulo(g, sx, sy, raio, corpo || '#ffe27a');
    circulo(g, sx, sy, Math.round(raio * 0.66), miolo || '#fff3bd');
    g.fillStyle = 'rgba(255,240,170,0.45)';
    g.fillRect(sx - raio - 5, sy, raio * 2 + 11, 1);
    g.fillRect(sx, sy - raio - 5, 1, raio * 2 + 11);
  }
  function arcoIris(g, cx, cy, raio, esp, alfa) {
    var cores = ['#ff5a5a', '#ff9d4d', '#ffd84d', '#6fd36f', '#4fb3ff', '#6b6bff', '#b06bff'];
    g.globalAlpha = alfa;
    for (var y = cy - raio; y <= cy; y++) {
      for (var x = cx - raio; x <= cx + raio; x++) {
        var d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
        if (d > raio) { continue; }
        var b = Math.floor((raio - d) / esp);
        if (b < cores.length) { g.fillStyle = cores[b]; g.fillRect(x, y, 1, 1); }
      }
    }
    g.globalAlpha = 1;
  }
  function flor(g, x, y, cor) {
    g.fillStyle = '#3d8f4f'; g.fillRect(x, y + 1, 1, 3);
    g.fillStyle = cor; g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3);
    g.fillStyle = '#ffe066'; g.fillRect(x, y, 1, 1);
  }
  function arvoreRedonda(g, x, base, raio, cor, luz, tronco) {
    g.fillStyle = tronco; g.fillRect(x - 1, base - raio, 3, raio + 1);
    circulo(g, x, base - raio - Math.round(raio * 0.5), raio, cor);
    circulo(g, x - Math.round(raio * 0.35), base - raio - Math.round(raio * 0.85),
      Math.max(1, Math.round(raio * 0.4)), luz);
  }
  function montanha(g, r, x, base, alt, larg, cor, sombra, neve) {
    var corte = Math.round(alt * 0.3);
    for (var i = 0; i <= alt; i++) {
      var meia = Math.round(larg * i / alt), y = base - alt + i;
      g.fillStyle = cor; g.fillRect(x - meia, y, meia * 2 + 1, 1);
      g.fillStyle = sombra; g.fillRect(x + 1, y, meia, 1);
      if (neve && i <= corte + 3) {
        for (var k = -meia; k <= meia; k++) {
          if (i < corte || r() < (corte + 3 - i) / 4) {
            g.fillStyle = k > 0 ? '#dfe6ff' : '#ffffff';
            g.fillRect(x + k, y, 1, 1);
          }
        }
      }
    }
  }
  function palmeira(g, x, base, alt) {
    var i, tx = x;
    for (i = 0; i < alt; i++) {
      tx = x + Math.round(Math.sin(i / alt * 1.6) * alt * 0.18);
      g.fillStyle = i % 3 === 0 ? '#7a4e22' : '#a0703f';
      g.fillRect(tx - 1, base - i, 3, 1);
    }
    var ty = base - alt, L = Math.round(alt * 0.5);
    var folhas = [[-1, -0.25], [1, -0.25], [-0.85, 0.45], [0.85, 0.45], [-0.35, -0.8], [0.35, -0.8]];
    folhas.forEach(function (f, n) {
      g.fillStyle = n % 2 ? '#2f9a4f' : '#3fb35f';
      for (var s = 0; s < L; s++) {
        g.fillRect(tx + Math.round(f[0] * s), ty + Math.round(f[1] * s + (s * s) / (L * 1.6)), 2, 2);
      }
    });
    circulo(g, tx - 1, ty + 2, 1, '#6b4a26'); circulo(g, tx + 2, ty + 2, 1, '#6b4a26');
  }
  function guardaSol(g, x, base, raio) {
    g.fillStyle = '#f8f3ff'; g.fillRect(x, base - raio * 2, 1, raio * 2);
    var topo = base - raio * 2;
    for (var y = -raio; y <= 0; y++) {
      var dx = Math.floor(Math.sqrt(Math.max(0, raio * raio - y * y)));
      for (var k = -dx; k <= dx; k++) {
        g.fillStyle = Math.floor((k + raio) / 3) % 2 ? '#ffffff' : '#ff5a6e';
        g.fillRect(x + k, topo + y, 1, 1);
      }
    }
  }
  function estrelaMar(g, x, y, cor) {
    g.fillStyle = cor;
    g.fillRect(x - 2, y, 5, 1); g.fillRect(x, y - 2, 1, 4); g.fillRect(x - 1, y + 1, 1, 1); g.fillRect(x + 1, y + 1, 1, 1);
  }
  function alga(g, x, base, alt, cor, fase) {
    g.fillStyle = cor;
    for (var i = 0; i < alt; i++) { g.fillRect(x + Math.round(Math.sin(i * 0.35 + fase) * 2), base - i, 2, 1); }
  }
  function coral(g, x, base, alt, cor) {
    g.fillStyle = cor;
    g.fillRect(x, base - alt, 2, alt);
    g.fillRect(x - 4, base - Math.round(alt * 0.7), 2, Math.round(alt * 0.7));
    g.fillRect(x - 4, base - Math.round(alt * 0.3), 5, 2);
    g.fillRect(x + 4, base - Math.round(alt * 0.55), 2, Math.round(alt * 0.55));
    g.fillRect(x + 1, base - Math.round(alt * 0.25), 5, 2);
    circulo(g, x + 1, base - alt, 1, cor); circulo(g, x - 3, base - Math.round(alt * 0.7), 1, cor);
    circulo(g, x + 5, base - Math.round(alt * 0.55), 1, cor);
  }
  function cogumelo(g, x, base, tam, cor) {
    g.fillStyle = '#fff1d6'; g.fillRect(x - Math.round(tam * 0.3), base - tam, Math.round(tam * 0.6) + 1, tam);
    semicirculo(g, x, base - tam, tam, cor);
    g.fillStyle = '#ffffff';
    g.fillRect(x - Math.round(tam * 0.5), base - tam - Math.round(tam * 0.5), 2, 1);
    g.fillRect(x + Math.round(tam * 0.3), base - tam - Math.round(tam * 0.7), 2, 1);
    g.fillRect(x, base - tam - Math.round(tam * 0.3), 1, 1);
  }
  function casinha(g, x, base, larg, parede, telhado) {
    var alt = Math.round(larg * 0.75);
    g.fillStyle = parede; g.fillRect(x - Math.round(larg / 2), base - alt, larg, alt);
    g.fillStyle = telhado;
    for (var i = 0; i <= Math.round(larg * 0.55); i++) {
      var meia = Math.round((larg / 2 + 2) * i / (larg * 0.55));
      g.fillRect(x - meia, base - alt - Math.round(larg * 0.55) + i, meia * 2 + 1, 1);
    }
    g.fillStyle = '#ffd86b';
    g.fillRect(x - Math.round(larg * 0.3), base - Math.round(alt * 0.7), 3, 3);
    g.fillRect(x + Math.round(larg * 0.1), base - Math.round(alt * 0.7), 3, 3);
    g.fillStyle = 'rgba(255,216,107,0.25)';
    g.fillRect(x - Math.round(larg * 0.3) - 1, base - Math.round(alt * 0.7) - 1, 5, 5);
    g.fillRect(x + Math.round(larg * 0.1) - 1, base - Math.round(alt * 0.7) - 1, 5, 5);
  }
  function torre(g, x, base, larg, alt, cor, sombra, telhado) {
    g.fillStyle = cor; g.fillRect(x - Math.floor(larg / 2), base - alt, larg, alt);
    g.fillStyle = sombra; g.fillRect(x + Math.floor(larg / 4), base - alt, Math.ceil(larg / 4), alt);
    var tAlt = Math.round(larg * 1.1);
    g.fillStyle = telhado;
    for (var i = 0; i <= tAlt; i++) {
      var meia = Math.round((larg / 2 + 1) * i / tAlt);
      g.fillRect(x - meia, base - alt - tAlt + i, meia * 2 + 1, 1);
    }
    g.fillStyle = '#2a1c5e'; g.fillRect(x, base - alt - tAlt - 5, 1, 5);
    g.fillStyle = '#ff6fa8'; g.fillRect(x + 1, base - alt - tAlt - 5, 3, 2);
    g.fillStyle = '#ffd86b'; g.fillRect(x - 1, base - Math.round(alt * 0.6), 2, 3);
  }
  function castelo(g, cx, base, A) {
    var larg = Math.round(A * 0.9), alt = Math.round(A * 0.45);
    g.fillStyle = '#efe6ff'; g.fillRect(cx - Math.round(larg / 2), base - alt, larg, alt);
    g.fillStyle = '#d6c8f7'; g.fillRect(cx + Math.round(larg / 4), base - alt, Math.round(larg / 4), alt);
    for (var x = cx - Math.round(larg / 2); x < cx + Math.round(larg / 2); x += 4) {
      g.fillStyle = '#efe6ff'; g.fillRect(x, base - alt - 2, 2, 2);
    }
    torre(g, cx - Math.round(larg / 2), base, Math.round(A * 0.22), Math.round(A * 0.7), '#e4d8ff', '#c9b6f5', '#6b4fc4');
    torre(g, cx + Math.round(larg / 2), base, Math.round(A * 0.22), Math.round(A * 0.7), '#e4d8ff', '#c9b6f5', '#6b4fc4');
    torre(g, cx, base - Math.round(alt * 0.4), Math.round(A * 0.26), Math.round(A * 0.75), '#f3edff', '#d6c8f7', '#ff6fa8');
    semicirculo(g, cx, base, Math.round(A * 0.12), '#6b4fc4');
    g.fillStyle = '#ffd86b'; g.fillRect(cx - Math.round(larg * 0.3), base - Math.round(alt * 0.65), 2, 3);
    g.fillRect(cx + Math.round(larg * 0.25), base - Math.round(alt * 0.65), 2, 3);
  }
  function pirulito(g, x, base, alt, raio, c1, c2) {
    g.fillStyle = '#ffffff'; g.fillRect(x, base - alt, 1, alt);
    for (var k = raio; k > 0; k -= 2) { circulo(g, x, base - alt, k, (k / 2) % 2 ? c1 : c2); }
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(x - Math.round(raio * 0.5), base - alt - Math.round(raio * 0.5), 2, 1);
  }
  function bengala(g, x, base, alt) {
    for (var i = 0; i < alt; i++) {
      g.fillStyle = Math.floor(i / 2) % 2 ? '#ffffff' : '#ff4f6a';
      g.fillRect(x, base - i, 2, 1);
    }
    for (var k = 0; k < 5; k++) {
      g.fillStyle = k % 2 ? '#ffffff' : '#ff4f6a';
      g.fillRect(x + k, base - alt - (k === 0 || k === 4 ? 0 : 2), 2, 2);
    }
    g.fillStyle = '#ff4f6a'; g.fillRect(x + 5, base - alt + 1, 2, 3);
  }
  function bonecoNeve(g, x, base, t) {
    circulo(g, x, base - t, t, '#ffffff');
    circulo(g, x, base - t * 2 - Math.round(t * 0.55), Math.round(t * 0.7), '#ffffff');
    circulo(g, x, base - t * 3 - Math.round(t * 0.6), Math.round(t * 0.5), '#ffffff');
    var cab = base - t * 3 - Math.round(t * 0.6);
    g.fillStyle = '#2a1c5e'; g.fillRect(x - 2, cab - 1, 1, 1); g.fillRect(x + 1, cab - 1, 1, 1);
    g.fillStyle = '#ff9d4d'; g.fillRect(x, cab, 3, 1);
    g.fillStyle = '#2a1c5e'; g.fillRect(x - 3, cab - Math.round(t * 0.5) - 1, 7, 1);
    g.fillRect(x - 2, cab - Math.round(t * 0.5) - 4, 5, 3);
    g.fillStyle = '#ff5a6e'; g.fillRect(x - 3, cab + Math.round(t * 0.5), 7, 1);
    g.fillStyle = '#2a1c5e'; g.fillRect(x, base - t * 2, 1, 1); g.fillRect(x, base - t * 2 - 3, 1, 1);
  }

  function cenaFloresta(g, w, h, r) {
    var horizonte = Math.round(h * 0.58), i, x, y;
    faixas(g, w, 0, horizonte, ['#3f7ade', '#4f88e4', '#5f96e9', '#71a5ee', '#83b3f2', '#96c2f6',
      '#a9d0f9', '#bddefb', '#d3ebfc', '#ecf0f7', '#ffe6c8']);
    for (i = 0; i < Math.round(w * 0.18); i++) {
      x = Math.round(r() * w); y = Math.round(r() * horizonte * 0.8);
      var brilho = r();
      g.fillStyle = brilho > 0.8 ? 'rgba(255,255,255,0.95)' : 'rgba(255,236,180,0.75)';
      g.fillRect(x, y, 1, 1);
      if (brilho > 0.93) { g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
    }
    sol(g, Math.round(w * 0.14), Math.round(h * 0.15), Math.max(5, Math.round(h * 0.055)));
    for (i = 0; i < 9; i++) {
      x = Math.round(r() * w);
      var lt = 2 + Math.round(r() * 4);
      g.fillStyle = 'rgba(94,72,150,0.18)'; g.fillRect(x, 0, lt, horizonte + Math.round(h * 0.10));
      g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(x, 0, 1, horizonte + Math.round(h * 0.10));
    }
    for (i = 0; i < 9; i++) {
      nuvem(g, Math.round(r() * w) - 20, Math.round(horizonte * (0.52 + r() * 0.42)),
        22 + Math.round(r() * 62), 4 + Math.round(r() * 6), 'rgba(226,236,255,0.92)');
    }
    g.fillStyle = 'rgba(255,245,214,0.75)'; g.fillRect(0, horizonte - 2, w, 3);
    g.fillStyle = 'rgba(255,236,190,0.45)'; g.fillRect(0, horizonte + 1, w, Math.round(h * 0.05));
    for (x = -6; x < w + 6; x += 5 + Math.round(r() * 5)) {
      pinheiro(g, x, horizonte + 3, 9 + Math.round(r() * 8), '#93cdb4', '#7ab79c');
    }
    for (x = -8; x < w + 8; x += 8 + Math.round(r() * 6)) {
      pinheiro(g, x, horizonte + Math.round(h * 0.13), 14 + Math.round(r() * 14), '#4aa37f', '#3a8566');
    }
    g.fillStyle = '#79c795'; g.fillRect(0, horizonte + Math.round(h * 0.12), w, h);
    pontilhar(g, r, 0, horizonte + Math.round(h * 0.12), w, h - horizonte, Math.round(w * 0.6), '#66b483');
    for (i = 0; i < Math.round(w / 14); i++) {
      cogumelo(g, Math.round(r() * w), horizonte + Math.round(h * 0.16) + Math.round(r() * h * 0.2), 2 + Math.round(r() * 2),
        r() > 0.5 ? '#e8484f' : '#b06bff');
    }
    for (x = -10; x < w + 10; x += 11 + Math.round(r() * 8)) {
      pinheiro(g, x, h + 2, 20 + Math.round(r() * 20), '#23664f', '#1a4f3d');
    }
  }

  function cenaFlores(g, w, h, r) {
    var hz = Math.round(h * 0.55), i, x, y;
    faixas(g, w, 0, hz + 10, ['#4f9be8', '#62a9ee', '#77b8f2', '#8cc6f5', '#a3d3f8', '#bbe0fa', '#d4ecfc', '#ecf6ff']);
    sol(g, Math.round(w * 0.86), Math.round(h * 0.14), Math.max(5, Math.round(h * 0.05)));
    arcoIris(g, Math.round(w * 0.42), hz + Math.round(h * 0.06), Math.round(Math.min(w * 0.4, h * 0.5)),
      Math.max(2, Math.round(h * 0.018)), 0.6);
    for (i = 0; i < 4; i++) {
      nuvem(g, Math.round(r() * w) - 10, Math.round(hz * (0.55 + r() * 0.35)), 20 + Math.round(r() * 40), 3 + Math.round(r() * 4), 'rgba(255,255,255,0.9)');
    }
    morros(g, w, h, hz + 4, Math.round(h * 0.10), 0.035, 1, '#a8e0a0');
    for (i = 0; i < Math.round(w / 30); i++) {
      arvoreRedonda(g, Math.round(r() * w), hz + Math.round(h * 0.03), 3 + Math.round(r() * 3), '#6cbf6a', '#90d68c', '#8a5a3a');
    }
    morros(g, w, h, hz + Math.round(h * 0.13), Math.round(h * 0.09), 0.05, 3, '#86d083');
    var topos = morros(g, w, h, hz + Math.round(h * 0.26), Math.round(h * 0.08), 0.07, 5, '#66bf63');
    pontilhar(g, r, 0, hz + Math.round(h * 0.2), w, h, Math.round(w * 0.4), '#58ad56');
    var cores = ['#ff6fa8', '#ffd84d', '#ffffff', '#b06bff', '#ff8f5a', '#6fc8ff'];
    for (i = 0; i < Math.round(w * 1.1); i++) {
      x = Math.round(r() * w);
      y = Math.round(hz + h * 0.15 + r() * (h - hz - h * 0.15));
      if (x >= 0 && x < w && y > topos[x] + 2) { flor(g, x, y, cores[Math.floor(r() * cores.length)]); }
    }
  }

  function cenaPraia(g, w, h, r) {
    var hz = Math.round(h * 0.48), areia = Math.round(h * 0.78), i, x, y;
    faixas(g, w, 0, hz, ['#3fa0e8', '#55aeed', '#6cbcf1', '#84c9f4', '#9dd6f7', '#b8e3fa', '#d6f0fc', '#fff3d6']);
    var sx = Math.round(w * 0.76);
    sol(g, sx, Math.round(h * 0.17), Math.max(6, Math.round(h * 0.06)), '#ffd25e', '#fff0b0');
    for (i = 0; i < 4; i++) {
      nuvem(g, Math.round(r() * w) - 10, Math.round(hz * (0.25 + r() * 0.5)), 18 + Math.round(r() * 36), 3 + Math.round(r() * 3), 'rgba(255,255,255,0.92)');
    }
    semicirculo(g, Math.round(w * 0.18), hz + 1, Math.round(h * 0.05), '#5aa56f');
    palmeira(g, Math.round(w * 0.18), hz - Math.round(h * 0.04), Math.round(h * 0.06));
    faixas(g, w, hz, areia, ['#2f9bd6', '#38a6dc', '#44b1e2', '#52bce7', '#62c7ec', '#76d2f0']);
    for (y = hz + 2; y < areia - 2; y += 3) {
      for (x = Math.round(r() * 10); x < w; x += 6 + Math.round(r() * 12)) {
        g.fillStyle = 'rgba(255,255,255,' + (0.25 + r() * 0.35) + ')';
        g.fillRect(x, y, 2 + Math.round(r() * 3), 1);
      }
    }
    for (i = 0; i < 8; i++) {
      var meia = Math.round((8 - i) * h * 0.006) + 1;
      g.fillStyle = 'rgba(255,236,150,0.7)'; g.fillRect(sx - meia, hz + 1 + i * 3, meia * 2, 1);
    }
    faixas(g, w, areia, h, ['#ffe7b3', '#fbdc9f', '#f5cf8a', '#efc37a']);
    g.fillStyle = '#ffffff';
    for (x = 0; x < w; x++) { g.fillRect(x, areia - 1 + Math.round(Math.sin(x * 0.18) * 1.2), 1, 2); }
    pontilhar(g, r, 0, areia + 3, w, h - areia, Math.round(w * 0.5), '#e2b46a');
    palmeira(g, Math.round(w * 0.06), h - 2, Math.round(h * 0.42));
    palmeira(g, Math.round(w * 0.93), h - 2, Math.round(h * 0.36));
    guardaSol(g, Math.round(w * 0.64), h - Math.round(h * 0.06), Math.max(6, Math.round(h * 0.06)));
    estrelaMar(g, Math.round(w * 0.3), h - Math.round(h * 0.07), '#ff8f5a');
    estrelaMar(g, Math.round(w * 0.8), h - Math.round(h * 0.12), '#ff6fa8');
    circulo(g, Math.round(w * 0.45), h - Math.round(h * 0.05), 2, '#fff1e0');
  }

  function cenaNeve(g, w, h, r) {
    var hz = Math.round(h * 0.62), i, x;
    faixas(g, w, 0, hz, ['#7fb3ec', '#8fbff0', '#a1caf3', '#b3d5f6', '#c6e0f9', '#d8eafb', '#e9f3fd']);
    sol(g, Math.round(w * 0.2), Math.round(h * 0.14), Math.max(5, Math.round(h * 0.045)), '#fff1b0', '#ffffff');
    for (i = 0; i < 6; i++) {
      x = Math.round(w * (i + 0.3) / 5.5 + (r() - 0.5) * 20);
      montanha(g, r, x, hz + 4, Math.round(h * (0.28 + r() * 0.12)), Math.round(h * (0.25 + r() * 0.1)), '#b2bdf0', '#9ca9e3', true);
    }
    for (i = 0; i < 5; i++) {
      x = Math.round(w * (i + 0.1) / 4.2 + (r() - 0.5) * 20);
      montanha(g, r, x, hz + Math.round(h * 0.06), Math.round(h * (0.22 + r() * 0.1)), Math.round(h * (0.24 + r() * 0.08)), '#8597d6', '#7183c6', true);
    }
    morros(g, w, h, hz + Math.round(h * 0.10), Math.round(h * 0.06), 0.04, 2, '#eef4ff');
    for (x = -6; x < w + 6; x += 9 + Math.round(r() * 10)) {
      var a1 = 12 + Math.round(r() * 10), b1 = hz + Math.round(h * 0.12);
      pinheiro(g, x, b1, a1, '#3f7f72', '#2f5f55');
      pinheiro(g, x, b1 - Math.round(a1 * 0.6), Math.round(a1 * 0.34), '#ffffff', '#ffffff');
    }
    morros(g, w, h, hz + Math.round(h * 0.24), Math.round(h * 0.07), 0.06, 4, '#ffffff');
    pontilhar(g, r, 0, hz + Math.round(h * 0.2), w, h, Math.round(w * 0.5), '#dce6ff');
    bonecoNeve(g, Math.round(w * 0.72), h - Math.round(h * 0.08), Math.max(4, Math.round(h * 0.035)));
    for (x = -10; x < w + 10; x += 14 + Math.round(r() * 12)) {
      if (Math.abs(x - w * 0.72) < 14) { continue; }
      var a2 = 22 + Math.round(r() * 18);
      pinheiro(g, x, h + 2, a2, '#2f6f5f', '#1a4f3d');
      pinheiro(g, x, h + 2 - Math.round(a2 * 0.6), Math.round(a2 * 0.34), '#ffffff', '#ffffff');
    }
  }

  function cenaMar(g, w, h, r) {
    var i, x, y;
    faixas(g, w, 0, h, ['#4ccbe8', '#3ebadf', '#32a8d5', '#2896ca', '#2084bd', '#1873b0', '#1263a2', '#0e5594']);
    for (y = 1; y < 6; y += 2) {
      for (x = Math.round(r() * 8); x < w; x += 5 + Math.round(r() * 8)) {
        g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x, y, 3, 1);
      }
    }
    for (i = 0; i < 6; i++) {
      var x0 = Math.round(r() * w), larg = 4 + Math.round(r() * 6);
      g.fillStyle = 'rgba(255,255,255,0.07)';
      for (y = 0; y < h * 0.85; y++) { g.fillRect(Math.round(x0 + y * 0.35), y, larg, 1); }
    }
    var topos = morros(g, w, h, Math.round(h * 0.88), Math.round(h * 0.07), 0.04, 2, '#f2d59a');
    pontilhar(g, r, 0, Math.round(h * 0.84), w, h, Math.round(w * 0.6), '#d9b778');
    for (i = 0; i < Math.round(w / 40) + 2; i++) {
      x = Math.round(r() * w);
      semicirculo(g, x, topos[Math.min(w - 1, Math.max(0, x))] + 3, 4 + Math.round(r() * 6), r() > 0.5 ? '#6f6fb0' : '#5a5a99');
    }
    var coresAlga = ['#2fae6f', '#3fc47f', '#249b5f', '#56d08a'];
    for (x = 2; x < w; x += 4 + Math.round(r() * 9)) {
      alga(g, x, topos[Math.min(w - 1, x)] + 3, 10 + Math.round(r() * h * 0.22), coresAlga[Math.floor(r() * 4)], r() * 6);
    }
    var coresCoral = ['#ff6f8f', '#ff9d4d', '#c46fff', '#ffd84d'];
    for (i = 0; i < Math.round(w / 35) + 2; i++) {
      x = 6 + Math.round(r() * (w - 12));
      coral(g, x, topos[x] + 4, 8 + Math.round(r() * 10), coresCoral[Math.floor(r() * 4)]);
    }

    var bx = Math.round(w * 0.7), by = topos[Math.round(w * 0.7)] + 4;
    g.fillStyle = '#8a5a2b'; g.fillRect(bx - 7, by - 8, 14, 8);
    g.fillStyle = '#a8703a'; g.fillRect(bx - 7, by - 11, 14, 3);
    g.fillStyle = '#ffd84d'; g.fillRect(bx - 1, by - 7, 2, 3); g.fillRect(bx - 7, by - 9, 14, 1);
    g.fillStyle = 'rgba(255,216,77,0.35)'; g.fillRect(bx - 9, by - 14, 18, 3);
    estrelaMar(g, Math.round(w * 0.25), topos[Math.round(w * 0.25)] + 6, '#ff8f5a');
    estrelaMar(g, Math.round(w * 0.88), topos[Math.round(w * 0.88)] + 7, '#ffd84d');
  }

  function cenaEntardecer(g, w, h, r) {
    var hz = Math.round(h * 0.56), lago = Math.round(h * 0.82), i, x;
    faixas(g, w, 0, hz, ['#4b3c9e', '#6a47a8', '#8c52ad', '#b05fa8', '#d06f9b', '#ea8a8a', '#f6a877', '#ffc76b', '#ffe08a']);
    for (i = 0; i < Math.round(w * 0.06); i++) {
      g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(Math.round(r() * w), Math.round(r() * hz * 0.35), 1, 1);
    }
    var sx = Math.round(w * 0.5), R = Math.max(8, Math.round(h * 0.11));
    circulo(g, sx, hz, R + 8, 'rgba(255,220,140,0.18)');
    circulo(g, sx, hz, R + 4, 'rgba(255,220,140,0.30)');
    circulo(g, sx, hz, R, '#ffcf5e'); circulo(g, sx, hz, Math.round(R * 0.7), '#ffe9a0');
    for (i = 0; i < 4; i++) {
      nuvem(g, Math.round(r() * w) - 10, Math.round(hz * (0.3 + r() * 0.5)), 24 + Math.round(r() * 40), 2 + Math.round(r() * 3), 'rgba(255,190,200,0.55)');
    }
    morros(g, w, h, hz + 2, Math.round(h * 0.09), 0.03, 0.5, '#6a4a9a');
    morros(g, w, h, hz + 3, Math.round(h * 0.05), 0.06, 2, '#553b88');
    faixas(g, w, hz, lago, ['#f0a088', '#d98591', '#b96e9a', '#9a5f9e', '#7c519c', '#62459a']);
    for (i = 0; i < 10; i++) {
      var meia = Math.round((10 - i) * R * 0.09) + 1;
      g.fillStyle = 'rgba(255,225,140,' + (0.8 - i * 0.06) + ')';
      g.fillRect(sx - meia + Math.round(Math.sin(i) * 2), hz + 2 + i * 3, meia * 2, 1);
    }
    for (i = 0; i < Math.round(w * 0.15); i++) {
      g.fillStyle = 'rgba(255,255,255,0.25)';
      g.fillRect(Math.round(r() * w), Math.round(hz + 3 + r() * (lago - hz - 4)), 3, 1);
    }
    morros(g, w, h, lago + 2, Math.round(h * 0.04), 0.05, 1, '#3b2f6b');
    for (x = -8; x < w + 8; x += 10 + Math.round(r() * 12)) {
      pinheiro(g, x, h + 2, 18 + Math.round(r() * 18), '#2e2457', '#241c45');
    }
    for (x = 0; x < w; x += 3 + Math.round(r() * 6)) {
      var a = 6 + Math.round(r() * 8);
      g.fillStyle = '#2e2457'; g.fillRect(x, lago + 3 - a, 1, a);
      if (r() > 0.5) { g.fillStyle = '#7a4e22'; g.fillRect(x, lago + 3 - a, 1, 3); }
    }
  }

  function cenaDoces(g, w, h, r) {
    var hz = Math.round(h * 0.55), i, x;
    faixas(g, w, 0, hz + 10, ['#c9a4ff', '#dca8f5', '#f0aee8', '#ffb6dd', '#ffc4e3', '#ffd4ea', '#ffe4f1', '#fff2f8']);
    sol(g, Math.round(w * 0.8), Math.round(h * 0.15), Math.max(5, Math.round(h * 0.05)), '#ffe066', '#fff6c8', 'rgba(255,255,255,0.25)');
    for (i = 0; i < 6; i++) {
      var nx = Math.round(r() * w) - 10, ny = Math.round(hz * (0.2 + r() * 0.6)), nl = 18 + Math.round(r() * 36), na = 3 + Math.round(r() * 4);
      nuvem(g, nx, ny, nl, na, r() > 0.5 ? '#ffd1ec' : '#d9f3ff');
    }
    function cobertura(topos, cor) {
      g.fillStyle = cor;
      for (var xx = 0; xx < w; xx++) {
        g.fillRect(xx, topos[xx], 1, 2);
        if (xx % 7 < 3) { g.fillRect(xx, topos[xx] + 2, 1, 1 + ((xx * 13) % 4)); }
      }
    }
    var t1 = morros(g, w, h, hz + 6, Math.round(h * 0.12), 0.03, 1, '#ff9ccc');
    cobertura(t1, '#ffffff');
    for (i = 0; i < Math.round(w / 45) + 2; i++) {
      x = Math.round(r() * w);
      pirulito(g, x, t1[Math.min(w - 1, Math.max(0, x))] + 2, 10 + Math.round(r() * 10), 4 + Math.round(r() * 3),
        r() > 0.5 ? '#ff5a8a' : '#6fc8ff', '#ffffff');
    }
    var t2 = morros(g, w, h, hz + Math.round(h * 0.18), Math.round(h * 0.09), 0.05, 3, '#9ee8c8');
    cobertura(t2, '#fff7fb');
    var t3 = morros(g, w, h, hz + Math.round(h * 0.33), Math.round(h * 0.07), 0.06, 5, '#8a4f3a');
    cobertura(t3, '#ff9ccc');
    var granulado = ['#ffd84d', '#6fc8ff', '#ff5a8a', '#6fd36f', '#ffffff', '#b06bff'];
    for (i = 0; i < Math.round(w * 0.7); i++) {
      x = Math.round(r() * w);
      var y = Math.round(t3[Math.min(w - 1, x)] + 4 + r() * h * 0.2);
      g.fillStyle = granulado[Math.floor(r() * granulado.length)];
      g.fillRect(x, y, 2, 1);
    }
    for (i = 0; i < Math.round(w / 40) + 2; i++) {
      x = Math.round(r() * (w - 8));
      bengala(g, x, t2[Math.min(w - 1, x)] + 4, 12 + Math.round(r() * 10));
    }
    for (i = 0; i < Math.round(w / 30) + 2; i++) {
      x = Math.round(r() * w);
      var cor = granulado[Math.floor(r() * 4)];
      semicirculo(g, x, t3[Math.min(w - 1, x)] + 10 + Math.round(r() * 12), 3 + Math.round(r() * 2), cor);
    }
    pirulito(g, Math.round(w * 0.1), h + 2, Math.round(h * 0.35), Math.max(7, Math.round(h * 0.07)), '#ff5a8a', '#ffd84d');
    pirulito(g, Math.round(w * 0.9), h + 2, Math.round(h * 0.28), Math.max(6, Math.round(h * 0.06)), '#b06bff', '#ffffff');
  }

  function cenaNoite(g, w, h, r) {
    var hz = Math.round(h * 0.62), i, x;
    faixas(g, w, 0, hz + 10, ['#120d38', '#17124a', '#1d185a', '#251f6c', '#2f287d', '#3b338e', '#4a409c', '#5a4aa6']);
    for (i = 0; i < Math.round(w * 0.12); i++) {
      g.fillStyle = r() > 0.7 ? '#fff6c8' : 'rgba(255,255,255,0.6)';
      g.fillRect(Math.round(r() * w), Math.round(r() * hz), 1, 1);
    }
    var lx = Math.round(w * 0.8), ly = Math.round(h * 0.17), lr = Math.max(6, Math.round(h * 0.06));
    circulo(g, lx, ly, lr + 8, 'rgba(255,246,200,0.08)');
    circulo(g, lx, ly, lr + 4, 'rgba(255,246,200,0.15)');
    circulo(g, lx, ly, lr, '#fff6c8');
    circulo(g, lx - Math.round(lr * 0.35), ly - Math.round(lr * 0.2), Math.max(1, Math.round(lr * 0.22)), '#efe3a8');
    circulo(g, lx + Math.round(lr * 0.3), ly + Math.round(lr * 0.35), Math.max(1, Math.round(lr * 0.15)), '#efe3a8');
    nuvem(g, Math.round(w * 0.1), Math.round(h * 0.3), 40, 3, 'rgba(160,150,230,0.25)');
    nuvem(g, Math.round(w * 0.55), Math.round(h * 0.42), 50, 3, 'rgba(160,150,230,0.2)');
    var t1 = morros(g, w, h, hz, Math.round(h * 0.1), 0.03, 2, '#2d2668');
    for (i = 0; i < Math.round(w / 60) + 2; i++) {
      x = 8 + Math.round(r() * (w - 16));
      casinha(g, x, t1[x] + 3, 8 + Math.round(r() * 4), '#4a3f8f', '#7a4fb0');
    }
    var t2 = morros(g, w, h, hz + Math.round(h * 0.16), Math.round(h * 0.08), 0.05, 4, '#1f1a4d');
    for (x = -8; x < w + 8; x += 12 + Math.round(r() * 14)) {
      pinheiro(g, x, t2[Math.min(w - 1, Math.max(0, x))] + 4, 14 + Math.round(r() * 12), '#17133c', '#120f30');
    }
    for (i = 0; i < Math.round(w / 22) + 3; i++) {
      x = Math.round(r() * w);
      var by = Math.round(t2[Math.min(w - 1, x)] + 8 + r() * h * 0.16), tam = 2 + Math.round(r() * 3);
      circulo(g, x, by - tam, tam + 4, 'rgba(120,230,255,0.12)');
      cogumelo(g, x, by, tam, r() > 0.5 ? '#4fd8ff' : '#ff6fd0');
    }
  }

  function cenaNuvens(g, w, h, r) {
    var i, x;
    faixas(g, w, 0, h, ['#5aa8f0', '#6db4f2', '#82c1f5', '#98cdf7', '#afd9f9', '#c7e5fb', '#def0fd', '#eef7ff']);
    sol(g, Math.round(w * 0.12), Math.round(h * 0.14), Math.max(5, Math.round(h * 0.05)));
    arcoIris(g, Math.round(w * 0.5), Math.round(h * 0.7), Math.round(Math.min(w * 0.45, h * 0.55)),
      Math.max(2, Math.round(h * 0.02)), 0.5);
    for (i = 0; i < 5; i++) {
      nuvem(g, Math.round(r() * w) - 10, Math.round(h * (0.15 + r() * 0.3)), 20 + Math.round(r() * 40), 3 + Math.round(r() * 3), 'rgba(255,255,255,0.85)');
    }
    var base = Math.round(h * 0.66);
    for (x = -20; x < w + 20; x += 14 + Math.round(r() * 10)) {
      nuvem(g, x, base - 4 + Math.round(r() * 8), 30 + Math.round(r() * 30), 7 + Math.round(r() * 5), '#e6efff');
    }
    castelo(g, Math.round(w * 0.5), base + 2, Math.round(Math.min(h * 0.38, w * 0.5)));

    function ilha(cx, cy, L) {
      g.fillStyle = '#8a5a3a';
      for (var k = 0; k < Math.round(L * 0.5); k++) { var m = Math.round(L * (1 - k / (L * 0.5))); g.fillRect(cx - m, cy + k, m * 2, 1); }
      g.fillStyle = '#6fd36f'; g.fillRect(cx - L, cy - 1, L * 2, 2);
      arvoreRedonda(g, cx - Math.round(L * 0.4), cy - 1, 3, '#4fb860', '#7ed68a', '#8a5a3a');
    }
    ilha(Math.round(w * 0.14), Math.round(h * 0.42), Math.max(8, Math.round(w * 0.05)));
    ilha(Math.round(w * 0.86), Math.round(h * 0.36), Math.max(7, Math.round(w * 0.04)));
    for (x = -30; x < w + 30; x += 12 + Math.round(r() * 10)) {
      nuvem(g, x, base + 8 + Math.round(r() * 10), 34 + Math.round(r() * 30), 8 + Math.round(r() * 6), '#ffffff');
    }
    g.fillStyle = '#ffffff'; g.fillRect(0, base + 14, w, h);
    for (x = -30; x < w + 30; x += 18 + Math.round(r() * 10)) {
      nuvem(g, x, h - Math.round(h * 0.12) + Math.round(r() * 8), 34 + Math.round(r() * 30), 6, '#eef4ff');
    }
  }

  var CENAS = {
    floresta: { nome: '🌲 Floresta Mágica', desenhar: cenaFloresta, semente: 20260824,
      amb: [['raios', 1, 0.14, 0.15], ['nuvem', 5, 0.05, 0.35], ['borboleta', 5, 0.62, 0.92],
        ['coelho', 2, 0.8, 0.95], ['brilho', 26, 0, 0.55, '#fff6c0']] },
    flores: { nome: '🌸 Campo de Flores', desenhar: cenaFlores, semente: 777,
      amb: [['raios', 1, 0.86, 0.14], ['nuvem', 4, 0.05, 0.3], ['balaoAr', 1, 0.12, 0.3], ['pipa', 1, 0.18, 0.3],
        ['borboleta', 8, 0.6, 0.95], ['coelho', 2, 0.82, 0.96], ['petala', 14, 0, 1]] },
    praia: { nome: '🏖️ Praia do Sol', desenhar: cenaPraia, semente: 4242,
      amb: [['raios', 1, 0.76, 0.17], ['nuvem', 3, 0.04, 0.3], ['passaro', 4, 0.08, 0.35], ['pipa', 1, 0.2, 0.32],
        ['reflexo', 36, 0.49, 0.76, '#ffffff'], ['caranguejo', 1, 0.9, 0.95]] },
    neve: { nome: '❄️ Montanhas de Neve', desenhar: cenaNeve, semente: 1212,
      amb: [['nuvem', 2, 0.04, 0.2], ['coelho', 1, 0.86, 0.95, '#b98a5e'], ['floco', 90, 0, 1]] },
    mar: { nome: '🐠 Fundo do Mar', desenhar: cenaMar, semente: 9090,
      amb: [['algaViva', 14, 0.93, 1], ['aguaViva', 3, 0, 1], ['peixe', 11, 0.12, 0.75], ['bolha', 34, 0, 1]] },
    entardecer: { nome: '🌅 Lago do Pôr do Sol', desenhar: cenaEntardecer, semente: 3131,
      amb: [['reflexo', 22, 0.58, 0.8, '#ffe39a'], ['patos', 1, 0.7, 0.74], ['passaro', 4, 0.1, 0.4, '#3b2f6b'],
        ['vagalume', 18, 0.6, 0.95]] },
    doces: { nome: '🍭 Reino dos Doces', desenhar: cenaDoces, semente: 5656,
      amb: [['raios', 1, 0.8, 0.15], ['balaoAr', 1, 0.12, 0.3], ['doce', 24, 0, 1], ['brilho', 26, 0, 0.6, '#ffffff']] },
    noite: { nome: '🌙 Noite Estrelada', desenhar: cenaNoite, semente: 8080,
      amb: [['aurora', 1, 0, 0], ['brilho', 60, 0, 0.6, '#fff6c8'], ['cadente', 1, 0, 0.3], ['vagalume', 14, 0.65, 0.95]] },
    nuvens: { nome: '🏰 Castelo nas Nuvens', desenhar: cenaNuvens, semente: 6161,
      amb: [['raios', 1, 0.12, 0.14], ['nuvem', 4, 0.05, 0.4], ['balaoAr', 2, 0.1, 0.35], ['balao', 8, 0, 1],
        ['passaro', 3, 0.1, 0.3], ['brilho', 18, 0, 0.6, '#ffffff']] }
  };

  var JORNADA = ['flores', 'praia', 'neve', 'mar', 'entardecer', 'doces', 'noite', 'nuvens', 'floresta'];

  var CORES_VIVAS = ['#ff5a6e', '#ffd84d', '#4fb3ff', '#6fd36f', '#b06bff', '#ff9d4d', '#ff6fd0'];

  function criarParticula(cfg, w, h) {
    var y0 = h * cfg[2], y1 = h * cfg[3];
    var p = { tipo: cfg[0], x: Math.random() * w, y: y0 + Math.random() * (y1 - y0), fase: Math.random() * 6.28, cor: cfg[4] };
    switch (p.tipo) {
      case 'raios': p.x = w * cfg[2]; p.y = h * cfg[3]; break;
      case 'nuvem': p.larg = 14 + rnd(30); p.alt = 3 + rnd(4); p.v = 1.5 + Math.random() * 3; break;
      case 'borboleta': p.v = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 6); p.cor = p.cor || sortear(CORES_VIVAS); p.by = p.y; break;
      case 'floco': p.v = 5 + Math.random() * 9; p.tam = Math.random() < 0.25 ? 2 : 1; break;
      case 'petala': p.v = 4 + Math.random() * 5; p.cor = p.cor || sortear(['#ff9ec4', '#ffd1e6', '#ffffff', '#ffe066']); break;
      case 'bolha': p.v = 6 + Math.random() * 10; p.tam = Math.random() < 0.3 ? 2 : 1; break;
      case 'peixe': p.v = (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 10); p.tam = 1 + rnd(2); p.cor = sortear(['#ff9d4d', '#ffd84d', '#ff6f8f', '#6fe0ff', '#b06bff']); break;
      case 'passaro': p.v = 7 + Math.random() * 7; p.cor = p.cor || '#2a1c5e'; break;
      case 'vagalume': p.cor = p.cor || '#fff27a'; p.bx = p.x; p.by = p.y; break;
      case 'balao': p.v = 3 + Math.random() * 4; p.cor = sortear(CORES_VIVAS); break;
      case 'doce': p.v = 3 + Math.random() * 5; p.cor = sortear(CORES_VIVAS); break;
      case 'cadente': p.espera = 1 + Math.random() * 4; p.ativa = false; break;
      case 'brilho': p.vel = 1 + Math.random() * 2.5; break;
      case 'reflexo': p.larg = 2 + Math.random() * 5; p.cor = p.cor || '#ffffff'; break;
      case 'coelho': p.v = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 5); p.cor = p.cor || sortear(['#c89a6a', '#ffffff', '#a98b7a']); break;
      case 'pipa': p.bx = w * (0.25 + Math.random() * 0.5); p.by = p.y; p.c1 = sortear(CORES_VIVAS); p.c2 = sortear(CORES_VIVAS); break;
      case 'balaoAr': p.v = 1.5 + Math.random() * 2; p.by = p.y; p.c1 = sortear(CORES_VIVAS); p.c2 = sortear(['#ffffff', '#ffd84d']); p.tam = 0.9 + Math.random() * 0.5; break;
      case 'aguaViva': p.v = 2 + Math.random() * 2.5; p.cor = sortear(['255,140,200', '190,150,255', '140,220,255']); break;
      case 'algaViva': p.alt = 8 + Math.random() * h * 0.2; p.cor = sortear(['#2fae6f', '#3fc47f', '#56d08a']); break;
      case 'patos': p.v = 3.5; p.x = Math.random() * w; break;
      case 'caranguejo': p.v = 4; break;
    }
    return p;
  }

  function moverDesenhar(g, p, dt, t, w, h) {
    var x, y, a, k, s;
    switch (p.tipo) {
      case 'nuvem':
        p.x += p.v * dt;
        if (p.x > w + 4) { p.x = -p.larg - 10; }
        nuvem(g, Math.round(p.x), Math.round(p.y), p.larg, p.alt, p.cor || 'rgba(255,255,255,0.85)');
        break;
      case 'brilho':
        a = Math.sin(t * p.vel + p.fase);
        if (a > 0.2) {
          x = Math.round(p.x); y = Math.round(p.y);
          g.globalAlpha = Math.min(1, a); g.fillStyle = p.cor || '#ffffff';
          g.fillRect(x, y, 1, 1);
          if (a > 0.85) { g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
          g.globalAlpha = 1;
        }
        break;
      case 'borboleta':
        p.x += p.v * dt;
        if (p.x > w + 4) { p.x = -4; } else if (p.x < -4) { p.x = w + 4; }
        x = Math.round(p.x); y = Math.round(p.by + Math.sin(t * 2 + p.fase) * 5 + Math.sin(t * 5 + p.fase) * 1.5);
        g.fillStyle = p.cor;
        if (Math.floor(t * 9 + p.fase) % 2 === 0) { g.fillRect(x - 2, y - 1, 2, 2); g.fillRect(x + 1, y - 1, 2, 2); }
        else { g.fillRect(x - 1, y - 1, 1, 2); g.fillRect(x + 1, y - 1, 1, 2); }
        g.fillStyle = '#2a1c5e'; g.fillRect(x, y - 1, 1, 2);
        break;
      case 'floco':
        p.y += p.v * dt; p.x += Math.sin(t * 1.3 + p.fase) * dt * 4;
        if (p.y > h + 2) { p.y = -2; p.x = Math.random() * w; }
        g.fillStyle = '#ffffff'; g.fillRect(Math.round(p.x), Math.round(p.y), p.tam, p.tam);
        break;
      case 'petala':
        p.y += p.v * dt; p.x += (6 + Math.sin(t * 2 + p.fase) * 5) * dt;
        if (p.y > h + 2) { p.y = -2; p.x = Math.random() * w; }
        if (p.x > w + 2) { p.x = -2; }
        g.fillStyle = p.cor; g.fillRect(Math.round(p.x), Math.round(p.y), Math.floor(t * 3 + p.fase) % 2 ? 2 : 1, 1);
        break;
      case 'bolha':
        p.y -= p.v * dt; p.x += Math.sin(t * 2 + p.fase) * dt * 3;
        if (p.y < -4) { p.y = h + 3; p.x = Math.random() * w; }
        x = Math.round(p.x); y = Math.round(p.y);
        if (p.tam === 1) { g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x, y, 1, 1); }
        else {
          g.fillStyle = 'rgba(255,255,255,0.55)';
          g.fillRect(x, y - 1, 2, 1); g.fillRect(x - 1, y, 1, 2); g.fillRect(x + 2, y, 1, 2); g.fillRect(x, y + 2, 2, 1);
          g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(x, y, 1, 1);
        }
        break;
      case 'peixe':
        p.x += p.v * dt;
        if (p.v > 0 && p.x > w + 8) { p.x = -8; } else if (p.v < 0 && p.x < -8) { p.x = w + 8; }
        var s = p.tam, dir = p.v > 0 ? 1 : -1;
        x = Math.round(p.x); y = Math.round(p.y + Math.sin(t * 1.5 + p.fase) * 2);
        g.fillStyle = p.cor;
        g.fillRect(x - 2 * s, y - s, 4 * s, 2 * s);
        g.fillRect(x - s, y - s - 1, 2 * s, 1);
        var cauda = x - dir * (2 * s) - (dir > 0 ? s : 0);
        var bate = Math.floor(t * 6 + p.fase) % 2;
        g.fillRect(cauda, y - s - bate, s, 2 * s + bate * 2);
        g.fillStyle = '#2a1c5e'; g.fillRect(x + dir * s, y - Math.ceil(s / 2), 1, 1);
        break;
      case 'passaro':
        p.x += p.v * dt;
        if (p.x > w + 4) { p.x = -4; }
        x = Math.round(p.x); y = Math.round(p.y + Math.sin(t + p.fase) * 2);
        k = Math.floor(t * 6 + p.fase) % 2 ? -1 : 1;
        g.fillStyle = p.cor;
        g.fillRect(x - 2, y + k, 1, 1); g.fillRect(x - 1, y, 3, 1); g.fillRect(x + 2, y + k, 1, 1);
        break;
      case 'vagalume':
        x = Math.round(p.bx + Math.sin(t * 0.5 + p.fase) * 10 + Math.sin(t * 1.3 + p.fase * 2) * 4);
        y = Math.round(p.by + Math.cos(t * 0.6 + p.fase * 1.5) * 6);
        a = 0.5 + 0.5 * Math.sin(t * 3 + p.fase);
        g.globalAlpha = 0.3 * a; g.fillStyle = p.cor; g.fillRect(x - 1, y - 1, 3, 3);
        g.globalAlpha = 0.3 + 0.7 * a; g.fillRect(x, y, 1, 1);
        g.globalAlpha = 1;
        break;
      case 'balao':
        p.y -= p.v * dt;
        if (p.y < -14) { p.y = h + 10; p.x = Math.random() * w; }
        x = Math.round(p.x + Math.sin(t * 0.8 + p.fase) * 3); y = Math.round(p.y);
        circulo(g, x, y, 3, p.cor);
        g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(x - 1, y - 2, 1, 1);
        g.fillStyle = 'rgba(42,28,94,0.6)'; g.fillRect(x, y + 4, 1, 1); g.fillRect(x + (Math.floor(t * 2 + p.fase) % 2), y + 5, 1, 4);
        break;
      case 'doce':
        p.y += p.v * dt;
        if (p.y > h + 3) { p.y = -3; p.x = Math.random() * w; }
        x = Math.round(p.x + Math.sin(t + p.fase) * 3); y = Math.round(p.y);
        g.fillStyle = p.cor; g.fillRect(x, y, 3, 2);
        g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(x - 1, y, 1, 2); g.fillRect(x + 3, y, 1, 2);
        break;
      case 'cadente':
        if (!p.ativa) {
          p.espera -= dt;
          if (p.espera <= 0) { p.ativa = true; p.x = w * (0.3 + Math.random() * 0.7); p.y = Math.random() * h * 0.25; p.vida = 0.9; }
          break;
        }
        p.x -= 70 * dt; p.y += 30 * dt; p.vida -= dt;
        for (k = 0; k < 10; k++) {
          g.globalAlpha = Math.max(0, 1 - k / 10) * Math.min(1, p.vida * 2);
          g.fillStyle = k < 2 ? '#ffffff' : '#fff6c8';
          g.fillRect(Math.round(p.x + k * 2.3), Math.round(p.y - k), 1, 1);
        }
        g.globalAlpha = 1;
        if (p.vida <= 0) { p.ativa = false; p.espera = 3 + Math.random() * 6; }
        break;
      case 'raios':
        g.save(); g.translate(p.x, p.y); g.rotate(t * 0.05);
        var R = Math.max(w, h) * 0.7;
        g.fillStyle = 'rgba(255,248,210,0.07)'; g.beginPath();
        for (k = 0; k < 12; k++) { a = k / 12 * PI2; g.moveTo(0, 0); g.arc(0, 0, R, a, a + 0.12); g.lineTo(0, 0); }
        g.fill(); g.restore();
        break;
      case 'reflexo':
        a = 0.5 + 0.5 * Math.sin(t * 1.8 + p.fase);
        g.globalAlpha = a * 0.75; g.fillStyle = p.cor;
        g.fillRect(Math.round(p.x + Math.sin(t * 0.6 + p.fase) * 2), Math.round(p.y), Math.round(p.larg), 1);
        g.globalAlpha = 1;
        break;
      case 'coelho':
        var dirC = p.v > 0 ? 1 : -1;
        var ciclo = (t * 1.8 + p.fase) % 1.4, salto = ciclo < 1 ? Math.sin(ciclo * Math.PI) : 0;
        p.x += p.v * dt * (salto > 0.02 ? 1.4 : 0);
        if (p.x > w + 6) { p.x = -6; } else if (p.x < -6) { p.x = w + 6; }
        x = Math.round(p.x); y = Math.round(p.y - salto * 4);
        var px = function (dx, dy, lw, lh, cor) {
          g.fillStyle = cor; g.fillRect(dirC > 0 ? x + dx : x - dx - lw + 1, y + dy, lw, lh);
        };
        g.fillStyle = 'rgba(30,40,40,0.18)'; g.fillRect(x - 2, Math.round(p.y) + 1, 5, 1);
        px(-2, -1, 4, 2, p.cor); px(-1, -2, 3, 1, p.cor);
        px(2, -3, 2, 2, p.cor); px(2, -5, 1, 2, p.cor); px(3, -5, 1, 2, p.cor);
        px(2, -4, 1, 1, '#ffb3c8');
        px(-3, -1, 1, 1, '#ffffff');
        px(3, -3, 1, 1, '#2a1c5e');
        break;
      case 'pipa':
        x = Math.round(p.bx + Math.sin(t * 0.5 + p.fase) * 6); y = Math.round(p.by + Math.sin(t * 0.8 + p.fase) * 3);
        g.fillStyle = 'rgba(255,255,255,0.6)';
        var fimX = p.bx - 18, fimY = h + 4;
        for (k = 0; k <= 40; k++) {
          var f = k / 40;
          g.fillRect(Math.round(x + (fimX - x) * f + Math.sin(f * Math.PI) * -4), Math.round(y + 4 + (fimY - y - 4) * f), 1, 1);
        }
        for (k = 1; k <= 9; k++) {
          var cx = Math.round(x + Math.sin(t * 3 + k * 0.9) * 1.6), cy = y + 4 + k;
          g.fillStyle = 'rgba(42,28,94,0.6)'; g.fillRect(cx, cy, 1, 1);
          if (k % 3 === 0) { g.fillStyle = k % 2 ? p.c1 : p.c2; g.fillRect(cx - 1, cy, 3, 1); }
        }
        for (k = -4; k <= 4; k++) {
          var meia = 3 - Math.round(Math.abs(k) * 0.75);
          if (meia < 0) { continue; }
          g.fillStyle = p.c2; g.fillRect(x - meia, y + k, meia + 1, 1);
          g.fillStyle = p.c1; g.fillRect(x + 1, y + k, meia, 1);
        }
        g.fillStyle = 'rgba(42,28,94,0.5)'; g.fillRect(x, y - 4, 1, 9); g.fillRect(x - 3, y, 7, 1);
        break;
      case 'balaoAr':
        p.x += p.v * dt;
        if (p.x > w + 12) { p.x = -12; }
        x = Math.round(p.x); y = Math.round(p.by + Math.sin(t * 0.4 + p.fase) * 3);
        for (k = -6; k <= 5; k++) {
          var hw = Math.round(5 * Math.sqrt(Math.max(0, 1 - (k / 6.5) * (k / 6.5))));
          for (s = -hw; s <= hw; s++) {
            g.fillStyle = Math.floor((s + 7) / 2) % 2 ? p.c2 : p.c1;
            g.fillRect(x + s, y + k, 1, 1);
          }
          if (k > -4 && k < 3) { g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(x - hw + 1, y + k, 1, 1); }
        }
        g.fillStyle = p.c1; g.fillRect(x - 2, y + 6, 5, 1);
        g.fillStyle = '#2a1c5e'; g.fillRect(x - 2, y + 7, 1, 2); g.fillRect(x + 2, y + 7, 1, 2);
        g.fillStyle = '#8a5a2b'; g.fillRect(x - 2, y + 9, 5, 2);
        g.fillStyle = '#b07a42'; g.fillRect(x - 2, y + 9, 5, 1);
        break;
      case 'aguaViva':
        p.y -= p.v * dt;
        if (p.y < -12) { p.y = h + 8; p.x = Math.random() * w; }
        x = Math.round(p.x + Math.sin(t * 0.7 + p.fase) * 2); y = Math.round(p.y);
        var abre = Math.sin(t * 3 + p.fase) > 0.3 ? 1 : 0;
        g.fillStyle = 'rgba(' + p.cor + ',0.55)';
        for (k = 0; k < 4; k++) {
          for (s = 1; s <= 5; s++) { g.fillRect(x - 3 + k * 2 + Math.round(Math.sin(t * 3 + s * 0.8 + k) * 0.8), y + s, 1, 1); }
        }
        g.fillStyle = 'rgba(' + p.cor + ',0.8)';
        g.fillRect(x - 1 - abre, y - 3, 3 + abre * 2, 1);
        g.fillRect(x - 3 - abre, y - 2, 7 + abre * 2, 2);
        g.fillRect(x - 4 - abre, y, 9 + abre * 2, 1);
        g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x - 2, y - 2, 1, 1);
        break;
      case 'algaViva':
        g.fillStyle = p.cor;
        var balanco = Math.sin(t * 1.2 + p.fase) * 3;
        for (k = 0; k < p.alt; k++) {
          g.fillRect(Math.round(p.x + balanco * (k / p.alt) + Math.sin(k * 0.35 + p.fase) * 1), Math.round(p.y) - k, 2, 1);
        }
        break;
      case 'patos':
        p.x += p.v * dt;
        if (p.x > w + 26) { p.x = -6; }
        for (k = 0; k < 4; k++) {
          x = Math.round(p.x) - k * 6; y = Math.round(p.y + Math.sin(t * 2 + k) * 0.4);
          var corPato = k ? '#ffd84d' : '#ffffff';
          g.fillStyle = 'rgba(255,255,255,' + (0.2 + 0.15 * Math.sin(t * 3 + k)) + ')'; g.fillRect(x - 4, y + 1, 9, 1);
          if (!k) {
            g.fillStyle = corPato; g.fillRect(x - 3, y - 1, 6, 2); g.fillRect(x - 4, y - 2, 1, 1); g.fillRect(x + 1, y - 4, 2, 3);
            g.fillStyle = '#e0d8ff'; g.fillRect(x - 1, y - 1, 2, 1);
            g.fillStyle = '#ff9d2e'; g.fillRect(x + 3, y - 3, 1, 1);
            g.fillStyle = '#2a1c5e'; g.fillRect(x + 2, y - 4, 1, 1);
          } else {
            g.fillStyle = corPato; g.fillRect(x - 2, y - 1, 4, 2); g.fillRect(x + 1, y - 3, 2, 2);
            g.fillStyle = '#ff9d2e'; g.fillRect(x + 3, y - 2, 1, 1);
            g.fillStyle = '#2a1c5e'; g.fillRect(x + 2, y - 3, 1, 1);
          }
        }
        break;
      case 'caranguejo':
        var anda = Math.sin(t * 0.5 + p.fase);
        p.x += p.v * dt * (anda > 0 ? 1 : -1);
        if (p.x > w + 6) { p.x = -6; } else if (p.x < -6) { p.x = w + 6; }
        x = Math.round(p.x); y = Math.round(p.y);
        var perna = Math.floor(t * 10) % 2;
        g.fillStyle = '#d9443b';
        g.fillRect(x - 3, y + 1 - perna, 1, 1); g.fillRect(x + 3, y + perna, 1, 1);
        g.fillRect(x - 3, y + perna, 1, 1); g.fillRect(x + 3, y + 1 - perna, 1, 1);
        g.fillStyle = '#ff5a4a';
        g.fillRect(x - 2, y - 1, 5, 2); g.fillRect(x - 5, y - 3, 2, 2); g.fillRect(x + 4, y - 3, 2, 2);
        g.fillRect(x - 1, y - 2, 1, 1); g.fillRect(x + 1, y - 2, 1, 1);
        g.fillStyle = '#ffffff'; g.fillRect(x - 1, y - 3, 1, 1); g.fillRect(x + 1, y - 3, 1, 1);
        break;
      case 'aurora':
        g.save(); g.globalCompositeOperation = 'lighter';
        var coresA = ['rgba(80,255,170,0.09)', 'rgba(110,200,255,0.08)', 'rgba(200,120,255,0.08)'];
        for (k = 0; k < 3; k++) {
          g.beginPath();
          for (x = -4; x <= w + 4; x += 3) {
            y = h * (0.1 + 0.07 * k) + Math.sin(x * 0.025 + t * 0.25 + k * 1.7) * h * 0.035 + Math.sin(x * 0.06 - t * 0.4 + k) * h * 0.015;
            if (x === -4) { g.moveTo(x, y); } else { g.lineTo(x, y); }
          }
          g.strokeStyle = coresA[k];
          g.lineWidth = h * 0.07; g.stroke(); g.lineWidth = h * 0.035; g.stroke(); g.lineWidth = h * 0.012; g.stroke();
        }
        g.restore();
        break;
    }
  }

  var fundo = { c: null, g: null, w: 0, h: 0, id: null, img: null, ant: null, mix: 1, t0: null, parts: [] };

  function medirFundo() {
    var c = $('#cenario');
    if (!c || !c.getContext) { return false; }
    fundo.c = c; fundo.g = c.getContext('2d', { alpha: false });
    fundo.w = Math.max(90, Math.ceil(window.innerWidth / P_FUNDO));
    fundo.h = Math.max(90, Math.ceil(window.innerHeight / P_FUNDO));
    c.width = fundo.w; c.height = fundo.h;
    return true;
  }

  var cacheCenas = {};
  function renderizarCena(id) {
    if (cacheCenas[id]) { return cacheCenas[id]; }
    var off = document.createElement('canvas');
    off.width = fundo.w; off.height = fundo.h;
    var g = off.getContext('2d', { alpha: false });
    g.fillStyle = '#8dbaf1'; g.fillRect(0, 0, fundo.w, fundo.h);
    CENAS[id].desenhar(g, fundo.w, fundo.h, ruido(CENAS[id].semente));
    cacheCenas[id] = off;
    return off;
  }

  function prepararCenas() {
    var fila = Object.keys(CENAS).filter(function (id) { return !cacheCenas[id]; });
    var agendar = window.requestIdleCallback
      ? function (f) { window.requestIdleCallback(f, { timeout: 4000 }); }
      : function (f) { window.setTimeout(f, 500); };
    function proximo(prazo) {
      do {
        var id = fila.shift();
        if (id && fundo.g && !cacheCenas[id]) { renderizarCena(id); }
      } while (fila.length && prazo && prazo.timeRemaining && prazo.timeRemaining() > 12);
      if (fila.length) { agendar(proximo); }
    }
    if (fila.length) { agendar(proximo); }
  }
  function criarAmbiente(id) {
    var lista = [];
    CENAS[id].amb.forEach(function (cfg) {
      if (modoLeve && (cfg[0] === 'aurora' || cfg[0] === 'raios')) { return; }
      var n = modoLeve ? Math.ceil(cfg[1] / 2) : cfg[1];
      for (var i = 0; i < n; i++) { lista.push(criarParticula(cfg, fundo.w, fundo.h)); }
    });
    return lista;
  }
  function anunciarCena(nome) {
    var e = $('#nome-cena');
    if (!e || !$('#tela-jogo').classList.contains('ativa')) { return; }
    e.textContent = nome;
    reiniciarClasse(e, 'mostra');
  }
  function trocarCena(id, anunciar) {
    if (!fundo.g || !CENAS[id] || fundo.id === id) { return; }
    fundo.ant = fundo.img;
    fundo.mix = (fundo.ant && !reduzirMovimento) ? 0 : 1;
    fundo.t0 = null;
    fundo.id = id;
    fundo.img = renderizarCena(id);
    fundo.parts = criarAmbiente(id);
    if (anunciar) { anunciarCena(CENAS[id].nome); }
    if (reduzirMovimento) { desenharFundo(0, 0); }
  }
  function desenharFundo(dt, t) {
    var g = fundo.g;
    if (!g || !fundo.img) { return; }
    if (fundo.ant && fundo.mix < 1) {
      g.drawImage(fundo.ant, 0, 0);
      g.globalAlpha = fundo.mix; g.drawImage(fundo.img, 0, 0); g.globalAlpha = 1;
      if (fundo.t0 === null) { fundo.t0 = t; }
      fundo.mix = Math.min(1, Math.max(0.02, (t - fundo.t0) / 0.8));
      if (fundo.mix >= 1) { fundo.ant = null; }
    } else {
      g.drawImage(fundo.img, 0, 0);
    }
    if (reduzirMovimento) { return; }
    for (var i = 0; i < fundo.parts.length; i++) { moverDesenhar(g, fundo.parts[i], dt, t, fundo.w, fundo.h); }
  }

  var LIMITE_EFEITOS = 700;
  var efe = { c: null, g: null, w: 0, h: 0, lista: [], chuva: 0, fogos: 0, prox: 0, limpo: true };

  function medirEfeitos() {
    var c = $('#efeitos');
    if (!c || !c.getContext) { return; }
    efe.c = c; efe.g = c.getContext('2d');
    efe.w = Math.ceil(window.innerWidth / P_EFEITO); efe.h = Math.ceil(window.innerHeight / P_EFEITO);
    c.width = efe.w; c.height = efe.h;
    efe.limpo = true;
  }
  function soltarConfete(xTela, yTela, n, forca) {
    if (reduzirMovimento || !efe.g) { return; }
    var x = xTela / P_EFEITO, y = yTela / P_EFEITO;
    forca = forca || 1;
    if (modoLeve) { n = Math.ceil(n / 2); }
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2, v = (15 + Math.random() * 55) * forca;
      efe.lista.push({ x: x, y: y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 35 * forca, gr: 80,
        vida: 1 + Math.random() * 0.9, cor: sortear(CORES_VIVAS), tam: 1 + rnd(2), gira: Math.random() * 6 });
    }
  }
  function faisca(xTela, yTela) {
    if (reduzirMovimento || !efe.g) { return; }
    var x = xTela / P_EFEITO, y = yTela / P_EFEITO;
    for (var i = 0; i < 8; i++) {
      var ang = i / 8 * Math.PI * 2, v = 22 + Math.random() * 10;
      efe.lista.push({ x: x, y: y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, gr: 0, vida: 0.4,
        cor: i % 2 ? '#ffffff' : '#ffd84d', tam: 1, brilho: true });
    }
  }
  function chuvaConfete(seg) { if (!reduzirMovimento) { efe.chuva = seg; } }
  function soltarFogos(seg) { if (!reduzirMovimento) { efe.fogos = seg; efe.prox = 0; } }
  function explodirFogo(x, y, cor) {
    for (var i = 0; i < 40; i++) {
      var ang = i / 40 * Math.PI * 2, v = 30 + Math.random() * 14;
      efe.lista.push({ x: x, y: y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, gr: 22, arrasto: true,
        vida: 1 + Math.random() * 0.4, cor: i % 5 === 0 ? '#ffffff' : cor, tam: 1, brilho: true });
    }
  }
  function desenharEfeitos(dt, t) {
    var g = efe.g, L = efe.lista, i, p;
    if (!g) { return; }
    if (efe.chuva > 0) {
      efe.chuva -= dt;
      for (i = 0; i < 3; i++) {
        L.push({ x: Math.random() * efe.w, y: -3, vx: (Math.random() - 0.5) * 20, vy: 18 + Math.random() * 25, gr: 12,
          vida: 5, cor: sortear(CORES_VIVAS), tam: 1 + rnd(2), gira: Math.random() * 6 });
      }
    }
    if (efe.fogos > 0) {
      efe.fogos -= dt; efe.prox -= dt;
      if (efe.prox <= 0) {
        efe.prox = 0.45 + Math.random() * 0.5;
        L.push({ foguete: true, x: efe.w * (0.15 + Math.random() * 0.7), y: efe.h + 2, vy: -(90 + Math.random() * 40),
          alvo: efe.h * (0.12 + Math.random() * 0.3), cor: sortear(CORES_VIVAS), vida: 9 });
      }
    }
    if (!L.length) {
      if (!efe.limpo) { g.clearRect(0, 0, efe.w, efe.h); efe.limpo = true; }
      return;
    }
    efe.limpo = false;
    g.clearRect(0, 0, efe.w, efe.h);
    for (i = L.length - 1; i >= 0; i--) {
      p = L[i];
      if (p.foguete) {
        p.y += p.vy * dt;
        g.fillStyle = p.cor; g.fillRect(Math.round(p.x), Math.round(p.y), 1, 2);
        g.fillStyle = 'rgba(255,240,180,0.6)'; g.fillRect(Math.round(p.x), Math.round(p.y) + 2, 1, 3);
        if (p.y <= p.alvo) { L[i] = L[L.length - 1]; L.pop(); explodirFogo(p.x, p.y, p.cor); }
        continue;
      }
      if (p.arrasto) { p.vx *= Math.pow(0.25, dt); p.vy *= Math.pow(0.25, dt); }
      else if (!p.brilho) { p.vx *= Math.pow(0.6, dt); }
      p.vy += p.gr * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vida -= dt;
      if (p.vida <= 0 || p.y > efe.h + 4) { L[i] = L[L.length - 1]; L.pop(); continue; }
      g.globalAlpha = Math.min(1, p.vida * 2);
      g.fillStyle = p.cor;
      if (p.gira !== undefined) {
        var larg = Math.abs(Math.sin(t * 8 + p.gira)) > 0.4 ? p.tam + 1 : 1;
        g.fillRect(Math.round(p.x), Math.round(p.y), larg, p.tam);
      } else {
        g.fillRect(Math.round(p.x), Math.round(p.y), p.tam, p.tam);
      }
    }
    g.globalAlpha = 1;
    if (L.length > LIMITE_EFEITOS) { L.length = LIMITE_EFEITOS; }
  }

  var ultimoQuadro = 0, modoLeve = false, somaIntervalos = 0, nIntervalos = 0;

  function ativarModoLeve() {
    if (modoLeve) { return; }
    modoLeve = true;
    document.body.classList.add('modo-leve');
    LIMITE_EFEITOS = 250;
    fundo.parts = fundo.parts.filter(function (p, i) { return i % 2 === 0 && p.tipo !== 'aurora' && p.tipo !== 'raios'; });
  }
  function medirRitmo(intervalo) {
    if (modoLeve || intervalo > 400) { return; }
    somaIntervalos += intervalo; nIntervalos++;
    if (nIntervalos >= 90) {
      if (somaIntervalos / nIntervalos > 55) { ativarModoLeve(); }
      somaIntervalos = 0; nIntervalos = 0;
    }
  }
  function quadro(ts) {
    if (ts - ultimoQuadro >= 32) {
      if (ultimoQuadro) { medirRitmo(ts - ultimoQuadro); }
      var dt = ultimoQuadro ? Math.min(0.06, (ts - ultimoQuadro) / 1000) : 0.033;
      ultimoQuadro = ts;
      desenharFundo(dt, ts / 1000);
      desenharEfeitos(dt, ts / 1000);
    }
    window.requestAnimationFrame(quadro);
  }
  function redimensionar() {
    if (!medirFundo()) { return; }
    medirEfeitos();
    var id = fundo.id;
    cacheCenas = {};
    fundo.id = null; fundo.img = null; fundo.ant = null;
    if (id) { trocarCena(id); }
    prepararCenas();
  }

  var mudo = false, ctxAudio = null;

  function tocar(notas) {
    if (mudo || falando()) { return; }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { return; }
      ctxAudio = ctxAudio || new AC();
      var t0 = ctxAudio.currentTime;
      notas.forEach(function (n, i) {
        var osc = ctxAudio.createOscillator(), gan = ctxAudio.createGain();
        osc.type = 'square';
        osc.frequency.value = n;
        gan.gain.setValueAtTime(0.0001, t0 + i * 0.1);
        gan.gain.exponentialRampToValueAtTime(0.12, t0 + i * 0.1 + 0.02);
        gan.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.1 + 0.16);
        osc.connect(gan); gan.connect(ctxAudio.destination);
        osc.start(t0 + i * 0.1); osc.stop(t0 + i * 0.1 + 0.18);
      });
    } catch (e) { }
  }
  function somFesta() { tocar([523, 659, 784, 1046, 1318]); }
  function somToque() { tocar([880]); }
  function somQuack() {
    if (mudo || falando()) { return; }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { return; }
      ctxAudio = ctxAudio || new AC();
      var t0 = ctxAudio.currentTime;
      [0, 0.2].forEach(function (d) {
        var osc = ctxAudio.createOscillator(), gan = ctxAudio.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(560, t0 + d);
        osc.frequency.exponentialRampToValueAtTime(300, t0 + d + 0.15);
        gan.gain.setValueAtTime(0.0001, t0 + d);
        gan.gain.exponentialRampToValueAtTime(0.09, t0 + d + 0.02);
        gan.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.16);
        osc.connect(gan); gan.connect(ctxAudio.destination);
        osc.start(t0 + d); osc.stop(t0 + d + 0.18);
      });
    } catch (e) { }
  }

  var PASTA_AUDIOS = 'audios/';
  var AUDIO = {
    entrada: 'geral-voz-de-entrada.mp3',
    aventura: 'geral-escolha-de-aventura.mp3',
    cadastro: 'geral-quem-vai-jogar.mp3',

    elogios: [
      { arq: 'geral-mandou-bem.mp3', texto: 'Mandou bem!' },
      { arq: 'geral-elogio-muito-inteligente.mp3', texto: 'Parabéns! Você foi muito inteligente!' },
      { arq: 'geral-elogio-voce-conseguiu.mp3', texto: 'Você conseguiu! Parabéns!' },
      { arq: 'geral-elogio-muito-bem.mp3', texto: 'Você foi muito bem!' }
    ],
    erro: 'geral-tente-de-novo.mp3',
    estrelas: [null, 'fim-uma-estrela.mp3', 'fim-duas-estrelas.mp3', 'fim-tres-estrelas.mp3']
  };

  var tocadorVoz = null, vezDaFala = 0, ultimoElogio = -1;

  function sortearElogio() {
    var n = AUDIO.elogios.length, i = rnd(n);
    if (n > 1 && i === ultimoElogio) { i = (i + 1 + rnd(n - 1)) % n; }
    ultimoElogio = i;
    return AUDIO.elogios[i];
  }
  var urlsAudio = {};
  function caminhoAudio(arq) {
    if (urlsAudio[arq]) { return urlsAudio[arq]; }
    var dado = window.AUDIOS_EMBUTIDOS && window.AUDIOS_EMBUTIDOS[arq];
    if (!dado) { return PASTA_AUDIOS + arq; }

    try {
      var bin = window.atob(dado.slice(dado.indexOf(',') + 1)), n = bin.length, bytes = new Uint8Array(n);
      for (var i = 0; i < n; i++) { bytes[i] = bin.charCodeAt(i); }
      urlsAudio[arq] = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
      window.AUDIOS_EMBUTIDOS[arq] = null;
      return urlsAudio[arq];
    } catch (e) { return dado; }
  }
  function falando() {
    return !!tocadorVoz && !tocadorVoz.paused && !tocadorVoz.ended;
  }
  function pararFala() {
    vezDaFala++;
    if (tocadorVoz) { try { tocadorVoz.pause(); } catch (e) { } }
  }

  function falar(arq, aoTerminar) {
    var fim = aoTerminar || function () {};
    pararFala();
    if (mudo || !arq) { fim(); return; }
    var minhaVez = vezDaFala, feito = false;
    function terminar() {
      if (feito || minhaVez !== vezDaFala) { return; }
      feito = true; fim();
    }
    try {
      if (!tocadorVoz) { tocadorVoz = new window.Audio(); tocadorVoz.preload = 'auto'; }
      tocadorVoz.onended = terminar;
      tocadorVoz.onerror = terminar;
      tocadorVoz.src = caminhoAudio(arq);
      tocadorVoz.setAttribute('data-arquivo', arq);
      var tocando = tocadorVoz.play();
      if (tocando && tocando.catch) { tocando.catch(terminar); }
    } catch (e) { terminar(); }
  }

  function itens(lista) {
    return lista.map(function (f) { return '<span class="item">' + f + '</span>'; }).join('');
  }
  function rotulado(rotulo, html) {
    return '<span class="figura-rot"><span class="fig">' + html + '</span><span class="rot">' + rotulo + '</span></span>';
  }
  function casaSVG(janelas) {
    var j = '';
    if (janelas >= 1) { j += '<rect x="10" y="34" width="12" height="12" fill="#bfe6ff" stroke="#241a4d" stroke-width="2"/>'; }
    if (janelas >= 2) { j += '<rect x="42" y="34" width="12" height="12" fill="#bfe6ff" stroke="#241a4d" stroke-width="2"/>'; }
    return '<svg class="desenho" viewBox="0 0 64 64" width="84" height="84" xmlns="http://www.w3.org/2000/svg">' +
      '<polygon points="4,30 32,6 60,30" fill="#d9483b" stroke="#241a4d" stroke-width="2"/>' +
      '<rect x="8" y="30" width="48" height="30" fill="#fff3d6" stroke="#241a4d" stroke-width="2"/>' + j +
      '<rect x="26" y="40" width="12" height="20" fill="#3b6fd8" stroke="#241a4d" stroke-width="2"/></svg>';
  }
  function bolaSVG(oval) {
    return '<svg class="desenho" viewBox="0 0 64 64" width="72" height="72" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="32" cy="32" rx="' + (oval ? 29 : 22) + '" ry="' + (oval ? 15 : 22) + '" fill="#e53935" stroke="#241a4d" stroke-width="2"/>' +
      '<ellipse cx="' + (oval ? 22 : 25) + '" cy="' + (oval ? 26 : 24) + '" rx="5" ry="3" fill="#ffffff" opacity=".7"/></svg>';
  }
  function balaoSVG(cor, destaque) {
    var t = destaque ? 104 : 70;
    return '<svg class="desenho" viewBox="0 0 40 64" width="' + Math.round(t * 0.62) + '" height="' + t + '" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="20" cy="20" rx="17" ry="19" fill="' + cor + '" stroke="#241a4d" stroke-width="' + (destaque ? 3 : 2) + '"/>' +
      '<polygon points="17,38 23,38 20,42" fill="' + cor + '" stroke="#241a4d" stroke-width="1"/>' +
      '<path d="M20 42 Q15 50 20 56 Q25 62 20 64" fill="none" stroke="#241a4d" stroke-width="1.5"/></svg>';
  }
  var QUADRADO = '<span class="desenho" style="display:inline-block;width:120px;height:120px;background:#7b5cd6;box-shadow:0 0 0 4px #241a4d"></span>';
  var CACHORRO_NA_CASINHA = '<span class="sobreposto"><span style="font-size:5.5rem">🏠</span>' +
    '<span class="dentro" style="font-size:2rem">🐶</span></span>';
  var BOLA_NA_CAIXA = '<span class="empilhado"><span style="font-size:2.6rem">⚽</span><span style="font-size:4.2rem">📦</span></span>';

  var PERGUNTAS = {

    matematica: [
      {
        enunciado: 'Conte quantas estrelas aparecem na imagem.',
        palco: itens(['⭐', '⭐', '⭐', '⭐']),
        opcoes: [{ texto: '3' }, { texto: '4', correta: true }, { texto: '5' }, { texto: '6' }]
      },
      {
        enunciado: 'Observe a imagem. Qual é o nome dessa forma?',
        palco: QUADRADO,
        opcoes: [{ texto: 'Círculo' }, { texto: 'Triângulo' }, { texto: 'Quadrado', correta: true }, { texto: 'Retângulo' }]
      },
      {
        enunciado: 'Qual número vem depois do número 4?',
        opcoes: [{ texto: '3' }, { texto: '5', correta: true }, { texto: '6' }, { texto: '7' }]
      },
      {
        enunciado: 'Observe os dois grupos de frutas. Qual grupo tem mais frutas?',
        palco: rotulado('Grupo A', '🍎🍎') + rotulado('Grupo B', '🍎🍎🍎🍎'),
        opcoes: [{ texto: 'Grupo A' }, { texto: 'Grupo B', correta: true },
          { texto: 'Os dois têm a mesma quantidade' }, { texto: 'Não é possível saber' }]
      },
      {
        enunciado: 'João tinha 2 carrinhos. Ele ganhou mais 2 carrinhos. Com quantos carrinhos João ficou?',
        opcoes: [{ texto: '2' }, { texto: '3' }, { texto: '4', correta: true }, { texto: '5' }]
      },
      {
        enunciado: 'Maria tinha 5 balões. Um balão estourou. Quantos balões sobraram?',
        opcoes: [{ texto: '3' }, { texto: '4', correta: true }, { texto: '5' }, { texto: '6' }]
      },
      {
        enunciado: 'Qual número vem depois?',
        palco: '<span class="item">1 – 2 – 3 – 4 – _</span>',
        opcoes: [{ texto: '3' }, { texto: '4' }, { texto: '5', correta: true }, { texto: '6' }]
      },
      {
        enunciado: 'Lucas tinha 4 lápis. Sua mãe deu mais 3 lápis para ele. Com quantos lápis Lucas ficou?',
        opcoes: [{ texto: '5' }, { texto: '6' }, { texto: '7', correta: true }, { texto: '8' }]
      }
    ],

    portugues: [
      {
        enunciado: 'Com qual letra começa a palavra BOLA?',
        fala: 'Com qual letra começa a palavra bola?',
        opcoes: [{ texto: 'A' }, { texto: 'B', correta: true }, { texto: 'L' }, { texto: 'O' }]
      },
      {
        enunciado: '🔊 Ouça a pergunta e toque na resposta.',
        fala: 'Qual destas é a letra A?',
        opcoes: [{ texto: 'M' }, { texto: 'O' }, { texto: 'A', correta: true }, { texto: 'P' }]
      },
      {
        memoriaLetras: true
      },
      {
        enunciado: 'Qual palavra começa com o mesmo som de SAPO?',
        fala: 'Qual palavra começa com o mesmo som de sapo?',
        opcoes: [{ texto: 'Sacola', correta: true }, { texto: 'Casa' }, { texto: 'Rato' }, { texto: 'Mala' }]
      },
      {
        enunciado: 'Quantas sílabas tem a palavra BOLA?',
        fala: 'Quantas sílabas tem a palavra bola?',
        opcoes: [{ texto: '1' }, { texto: '2', correta: true }, { texto: '3' }, { texto: '4' }]
      },
      {
        enunciado: 'Qual palavra rima com PATO?',
        fala: 'Qual palavra rima com pato?',
        opcoes: [{ texto: 'Gato', correta: true }, { texto: 'Casa' }, { texto: 'Mesa' }, { texto: 'Bola' }]
      },
      {
        enunciado: 'Observe as letras: G–A–T–O. Qual palavra podemos formar?',
        fala: 'Observe as letras: G, A, T, O. Qual palavra podemos formar?',
        palco: '<span class="item">G – A – T – O</span>',
        opcoes: [{ texto: 'CATAR' }, { texto: 'TOCA' }, { texto: 'TACO' }, { texto: 'GOTA', correta: true }]
      },
      {
        enunciado: 'Ouça com atenção: O que Pedro levou para o parque?',
        fala: 'Ouça com atenção: Pedro foi ao parque. Ele levou sua bola azul para brincar. O que Pedro levou para o parque?',
        palco: '<span class="historia">"Pedro foi ao parque. Ele levou sua bola azul para brincar."</span>',
        opcoes: [{ texto: 'Um carrinho' }, { texto: 'Uma bola', correta: true }, { texto: 'Um cachorro' }, { texto: 'Uma bicicleta' }]
      }
    ],

    cores: [
      {
        enunciado: 'Observe a imagem. Qual é a cor do carro?',
        palco: '<span class="item" style="font-size:5rem">🚗</span>',
        opcoes: [{ texto: 'Azul' }, { texto: 'Verde' }, { texto: 'Vermelho', correta: true }, { texto: 'Amarelo' }]
      },
      {
        enunciado: 'Qual objeto é amarelo?',
        opcoes: [{ emoji: '🍌', legenda: 'A banana', correta: true }, { emoji: '🍎', legenda: 'A maçã' },
          { emoji: '🔵', legenda: 'A bola' }, { emoji: '🍃', legenda: 'A folha' }]
      },
      {
        enunciado: 'Qual destas formas possui três lados?',
        opcoes: [{ texto: 'Círculo' }, { texto: 'Quadrado' }, { texto: 'Triângulo', correta: true }, { texto: 'Retângulo' }]
      },
      {
        enunciado: 'Observe as duas imagens. Elas são iguais ou diferentes?',
        palco: casaSVG(1) + casaSVG(1),
        opcoes: [{ texto: 'Iguais', correta: true }, { texto: 'Diferentes' }, { texto: 'Uma é maior' }, { texto: 'Uma não tem porta' }]
      },
      {
        enunciado: 'Observe as quatro figuras. Qual é diferente das outras?',
        opcoes: [{ grupo: bolaSVG(false), legenda: 'Figura A' }, { grupo: bolaSVG(false), legenda: 'Figura B' },
          { grupo: bolaSVG(false), legenda: 'Figura C' }, { grupo: bolaSVG(true), legenda: 'Figura D', correta: true }]
      },
      {
        enunciado: 'Observe as quatro figuras. Três são iguais e uma é diferente. Qual é a diferente?',
        opcoes: [{ grupo: casaSVG(2), legenda: 'Figura A' }, { grupo: casaSVG(2), legenda: 'Figura B' },
          { grupo: casaSVG(1), legenda: 'Figura C', correta: true }, { grupo: casaSVG(2), legenda: 'Figura D' }]
      }
    ],

    espaco: [
      {
        enunciado: 'Observe a imagem. Onde está o cachorro?',
        palco: CACHORRO_NA_CASINHA,
        opcoes: [{ texto: 'Em cima da casinha' }, { texto: 'Dentro da casinha', correta: true },
          { texto: 'Atrás da casinha' }, { texto: 'Longe da casinha' }]
      },
      {
        enunciado: 'Onde está a bola?',
        palco: BOLA_NA_CAIXA,
        opcoes: [{ texto: 'Dentro da caixa' }, { texto: 'Embaixo da caixa' },
          { texto: 'Em cima da caixa', correta: true }, { texto: 'Atrás da caixa' }]
      },
      {
        enunciado: 'Observe a imagem. O gato está do lado esquerdo ou direito do cachorro?',
        palco: itens(['🐱', '🐶']),
        opcoes: [{ texto: 'Esquerdo', correta: true }, { texto: 'Direito' }, { texto: 'Em cima' }, { texto: 'Embaixo' }]
      },
      {
        enunciado: 'Observe a imagem. Onde está a maçã em relação à caixa?',
        palco: itens(['📦', '🍎']),
        opcoes: [{ texto: 'À esquerda da caixa' }, { texto: 'À direita da caixa', correta: true },
          { texto: 'Embaixo da caixa' }, { texto: 'Dentro da caixa' }]
      },
      {
        enunciado: 'Observe a imagem. Onde está o cachorro?',
        palco: itens(['🐱', '🐶', '🏠']),
        opcoes: [{ texto: 'Na esquerda' }, { texto: 'No meio', correta: true },
          { texto: 'Na direita' }, { texto: 'Em cima da casa' }]
      },
      {
        enunciado: 'Na sua esquerda tem uma bola e um vaso. O vaso está à direita da bola. Onde está o vaso?',
        palco: itens(['⚽', '🪴']),
        opcoes: [{ texto: 'À esquerda' }, { texto: 'À direita', correta: true },
          { texto: 'Em cima' }, { texto: 'No meio' }]
      }
    ],

    animais: [
      {
        enunciado: 'Qual animal faz "miau"?',
        fala: 'Qual animal faz miau?',
        opcoes: [{ texto: 'Cachorro' }, { texto: 'Gato', correta: true }, { texto: 'Vaca' }, { texto: 'Pato' }]
      },
      {
        enunciado: 'Onde o peixe vive?',
        opcoes: [{ texto: 'Na árvore' }, { texto: 'Na água', correta: true }, { texto: 'No céu' }, { texto: 'Na toca' }]
      },
      {
        enunciado: 'Qual destes animais pode voar?',
        opcoes: [{ texto: 'Cachorro' }, { texto: 'Peixe' }, { texto: 'Pássaro', correta: true }, { texto: 'Coelho' }]
      },
      {
        enunciado: 'Qual animal tem quatro patas?',
        opcoes: [{ texto: 'Peixe' }, { texto: 'Pássaro' }, { texto: 'Cachorro', correta: true }, { texto: 'Borboleta' }]
      },
      {
        enunciado: 'Observe os animais. Qual deles vive na água?',
        opcoes: [{ emoji: '🐶', legenda: 'Cachorro' }, { emoji: '🐱', legenda: 'Gato' },
          { emoji: '🐰', legenda: 'Coelho' }, { emoji: '🐟', legenda: 'Peixe', correta: true }]
      },
      {
        enunciado: 'Qual destes animais costuma comer cenoura?',
        opcoes: [{ texto: 'Coelho', correta: true }, { texto: 'Peixe' }, { texto: 'Pássaro' }, { texto: 'Gato' }]
      }
    ],

    atencao: [
      {
        observar: 'Observe a imagem por alguns segundos e depois responda:',
        enunciado: 'Qual objeto estava na mesa?',
        palco: '<span class="empilhado"><span>⚽ 📖 🥛</span><span class="mesa"></span></span>',
        opcoes: [{ texto: 'Uma boneca' }, { texto: 'Uma bola', correta: true }, { texto: 'Um sapato' }, { texto: 'Um carrinho' }]
      },
      {
        observar: 'Observe a imagem por alguns segundos.',
        enunciado: 'Qual era a cor do balão?',
        palco: balaoSVG('#e53935') + balaoSVG('#2f6fe0', true) + balaoSVG('#f6c90e'),
        opcoes: [{ texto: 'Vermelho' }, { texto: 'Verde' }, { texto: 'Azul', correta: true }, { texto: 'Amarelo' }]
      },
      {
        enunciado: 'Observe a sequência: Qual figura vem depois do vermelho?',
        palco: itens(['🔴', '🔵', '🔴', '🔵', '🔴', '_']),
        opcoes: [{ emoji: '🔴', legenda: 'Vermelha' }, { emoji: '🔵', legenda: 'Azul', correta: true },
          { emoji: '🟢', legenda: 'Verde' }, { emoji: '🟡', legenda: 'Amarela' }]
      },
      {
        enunciado: 'Qual objeto não pertence ao mesmo grupo?',
        opcoes: [{ emoji: '🍎', legenda: 'Maçã' }, { emoji: '🍌', legenda: 'Banana' },
          { emoji: '🍊', legenda: 'Laranja' }, { emoji: '🚗', legenda: 'Carrinho', correta: true }]
      },
      {
        enunciado: 'Ouça com atenção: Com o que Ana brincou no parque?',
        fala: 'Ouça com atenção: Ana foi ao parque com sua mãe. Ela levou uma boneca e uma bola. ' +
          'No parque, Ana brincou com a bola. Com o que Ana brincou no parque?',
        palco: '<span class="historia">"Ana foi ao parque com sua mãe. Ela levou uma boneca e uma bola. No parque, Ana brincou com a bola."</span>',
        opcoes: [{ texto: 'Com a boneca' }, { texto: 'Com a bola', correta: true }, { texto: 'Com um carrinho' }, { texto: 'Com um cachorro' }]
      },
      {
        enunciado: 'Ouça com atenção: Quantas borboletas ficaram no jardim?',
        fala: 'Ouça com atenção: No jardim havia 2 borboletas. Depois, chegaram mais 2 borboletas. ' +
          'Quantas borboletas ficaram no jardim?',
        palco: '<span class="historia">"No jardim havia 2 borboletas. Depois, chegaram mais 2 borboletas. Quantas borboletas ficaram no jardim?"</span>',
        opcoes: [{ texto: '2' }, { texto: '3' }, { texto: '4', correta: true }, { texto: '5' }]
      }
    ]
  };

  var AUDIOS_PERGUNTAS = {
    matematica: ['matematica-01-quantas-estrelas.mp3', 'matematica-02-forma-da-imagem.mp3', 'matematica-03-numero-depois-do-4.mp3',
      'matematica-04-grupo-de-frutas.mp3', 'matematica-05-joao-e-os-carrinhos.mp3', 'matematica-06-maria-e-os-baloes.mp3',
      'matematica-07-sequencia-numerica.mp3', 'matematica-08-lapis-do-lucas.mp3'],
    portugues: ['portugues-09-letra-da-palavra-bola.mp3', 'portugues-10-qual-e-a-letra-a.mp3', 'portugues-11-jogo-da-memoria.mp3',
      'portugues-12-som-de-sapo.mp3', 'portugues-13-silabas-de-bola.mp3', 'portugues-14-rima-com-pato.mp3',
      'portugues-15-formar-palavra-gato.mp3', 'portugues-16-pedro-no-parque.mp3'],
    cores: ['cores-17-cor-do-carro.mp3', 'cores-18-objeto-amarelo.mp3', 'cores-19-forma-de-tres-lados.mp3',
      'cores-20-duas-imagens.mp3', 'cores-21-figura-diferente.mp3', 'cores-22-tres-iguais-uma-diferente.mp3'],
    espaco: ['espaco-23-onde-esta-o-cachorro.mp3', 'espaco-24-bola-e-caixa.mp3', 'espaco-25-gato-e-cachorro.mp3',
      'espaco-26-maca-e-caixa.mp3', 'espaco-27-cachorro-no-meio.mp3', 'espaco-28-onde-esta-o-vaso.mp3'],
    animais: ['animais-29-animal-que-faz-miau.mp3', 'animais-30-onde-o-peixe-vive.mp3', 'animais-31-animal-que-voa.mp3',
      'animais-32-quatro-patas.mp3', 'animais-33-qual-vive-na-agua.mp3', 'animais-34-come-cenoura.mp3'],
    atencao: [['atencao-35-objeto-na-mesa-1-observe.mp3', 'atencao-35-objeto-na-mesa-2-pergunta.mp3'],
      ['atencao-36-cor-do-balao-1-observe.mp3', 'atencao-36-cor-do-balao-2-pergunta.mp3'],
      'atencao-37-depois-do-vermelho.mp3', 'atencao-38-nao-pertence-ao-grupo.mp3', 'atencao-39-ana-no-parque.mp3',
      'atencao-40-quantas-borboletas.mp3']
  };
  Object.keys(AUDIOS_PERGUNTAS).forEach(function (mundo) {
    AUDIOS_PERGUNTAS[mundo].forEach(function (arq, i) {
      var q = PERGUNTAS[mundo][i];
      if (Array.isArray(arq)) { q.audioObservar = arq[0]; q.audio = arq[1]; } else { q.audio = arq; }
    });
  });

  var NIVEIS_PERGUNTAS = {
    matematica: 'ffffmmmd',
    portugues: 'fffmmmdd',
    cores: 'fffmmd',
    espaco: 'ffmmdm',
    animais: 'fffmmd',
    atencao: 'fmmmdd'
  };
  Object.keys(NIVEIS_PERGUNTAS).forEach(function (mundo) {
    NIVEIS_PERGUNTAS[mundo].split('').forEach(function (n, i) { PERGUNTAS[mundo][i].nivel = n; });
  });
  var NOME_NIVEL = { f: 'Nível Fácil', m: 'Nível Médio', d: 'Nível Difícil' };

  function montarRodada(q) {
    if (q.memoriaLetras) {
      var pares = amostra('ABCDEFGLMPST'.split(''), 4), cartas = [];
      pares.forEach(function (l, i) {
        cartas.push({ texto: l, par: i });
        cartas.push({ texto: l, par: i });
      });
      return {
        tipo: 'memoria',
        nivel: q.nivel,
        enunciado: 'Jogo da memória: ache os pares de letras iguais',
        audio: q.audio,
        opcoes: embaralhar(cartas)
      };
    }
    return {
      tipo: 'escolha',
      nivel: q.nivel,
      manterOrdem: true,
      observar: q.observar,
      enunciado: q.enunciado,
      audio: q.audio,
      audioObservar: q.audioObservar,
      palco: q.palco,
      opcoes: q.opcoes.map(function (o) {
        var c = {};
        for (var k in o) { if (o.hasOwnProperty(k)) { c[k] = o[k]; } }
        return c;
      })
    };
  }

  var MUNDOS = [
    {
      id: 'matematica', nome: 'Matemática', ico: '🔢', hab: 'Matemática e Quantidades',
      c1: '#3f7fd8', c2: '#6b4fc4'
    },
    {
      id: 'portugues', nome: 'Português', ico: '🔤', hab: 'Português e Linguagem',
      c1: '#5f6fd8', c2: '#2a1f63'
    },
    {
      id: 'cores', nome: 'Cores e Formas', ico: '🎨', hab: 'Cores, Formas e Percepção Visual',
      c1: '#ff9d4d', c2: '#c44f9a'
    },
    {
      id: 'espaco', nome: 'Onde Está?', ico: '🧭', hab: 'Noções de Espaço e Direção',
      c1: '#b04fc4', c2: '#6b4fc4'
    },
    {
      id: 'animais', nome: 'Animais', ico: '🐾', hab: 'Animais e Conhecimentos do Mundo',
      c1: '#2f9fc0', c2: '#3fbf8f'
    },
    {
      id: 'atencao', nome: 'Atenção', ico: '🧠', hab: 'Atenção, Memória e Raciocínio',
      c1: '#e0a92e', c2: '#c4584f'
    }
  ];

  var DECOR = {
    inicio: ['✨', '⭐', '🌟', '💫', '🎈', '🌈', '🍀', '🦋'],
    matematica: ['➕', '➖', '🔢', '🧮', '1', '2', '3', '4', '5', '⭐'],
    portugues: ['🔤', '📖', '✏️', 'A', 'B', 'C', 'O', '📚', '💬'],
    cores: ['🎨', '🖍️', '🔺', '🟦', '🟡', '🟢', '🔶', '🌈', '🟣'],
    espaco: ['🧭', '⬅️', '➡️', '⬆️', '⬇️', '🗺️', '📍', '🚀'],
    animais: ['🐾', '🐶', '🐱', '🐰', '🐟', '🐦', '🦋', '🐞', '🐸'],
    atencao: ['🧠', '💡', '🔍', '🧩', '👀', '⭐', '❓', '✨']
  };
  var CORES_LETRA = ['#ff5a8a', '#ff9d4d', '#4fc66f', '#39b6cf', '#9d6bff', '#ffc93c'];
  function decorar(chave) {
    var box = $('#decor');
    if (!box || box._chave === chave) { return; }
    box._chave = chave;
    box.innerHTML = '';
    if (reduzirMovimento) { return; }
    var lista = DECOR[chave] || DECOR.inicio, n = window.innerWidth < 600 ? 6 : 10;
    for (var i = 0; i < n; i++) {
      var ico = lista[i % lista.length], letra = /^[A-Z0-9]$/.test(ico);
      var e = el('span', 'decor-item' + (letra ? ' letra' : ''), ico);
      e.style.left = (i / n * 96 + Math.random() * (90 / n)) + '%';
      e.style.top = (10 + Math.random() * 82) + '%';
      e.style.fontSize = (1.4 + Math.random() * 1.6).toFixed(2) + 'rem';
      e.style.animationDuration = (6 + Math.random() * 6).toFixed(1) + 's';
      e.style.animationDelay = (-Math.random() * 8).toFixed(1) + 's';
      if (letra) { e.style.color = sortear(CORES_LETRA); }
      box.appendChild(e);
    }
  }

  var estado = {
    jogador: null, mundo: null, rodadas: [], roteiro: [], indice: 0, seguidas: 0, trocandoNivel: false,
    acertos: 0, errosRodada: 0, inicio: 0, bloqueado: false
  };

  function abrirCadastro() {
    $('#form-cadastro').reset();
    pintarMascote('#mascote-cadastro', 'normal');
    mostrarTela('tela-cadastro');
    falar(AUDIO.cadastro);

    try { if (window.matchMedia('(pointer: fine)').matches) { $('#cad-nome').focus(); } } catch (e) { }
  }
  function jogar() {
    var nome = $('#cad-nome').value.trim();
    var j = { nome: nome, avatar: '🦆', estrelas: {} };
    entrar(j);
  }

  function entrar(jogador) {
    estado.jogador = jogador;
    $('#mapa-nome').textContent = jogador.nome || 'Vamos jogar!';
    $('#mapa-avatar').textContent = jogador.avatar;
    irParaMapa();
    falar(AUDIO.aventura);
  }

  function estrelasDe(jogador, mundoId) {
    if (!jogador || !jogador.estrelas) { return 0; }
    return jogador.estrelas[mundoId] || 0;
  }

  function irParaMapa() {
    pararFala();
    $('#novo-nivel').hidden = true;
    estado.trocandoNivel = false;
    pularNivel = null;
    desenharMapa();
    mostrarTela('tela-mapa');
    trocarCena('floresta');
    decorar('inicio');
  }

  function desenharMapa() {
    var box = $('#mundos');
    box.innerHTML = '';
    MUNDOS.forEach(function (m, idx) {
      var e = estrelasDe(estado.jogador, m.id), estr = '';
      for (var i = 0; i < 3; i++) { estr += (i < e ? '★' : '☆'); }
      var b = el('button', 'mundo',
        '<span class="ico">' + m.ico + '</span>' +
        '<span class="nome">' + m.nome + '</span>' +
        '<span class="est">' + estr + '</span>');
      b.style.background = 'linear-gradient(160deg,' + m.c1 + ',' + m.c2 + ')';
      b.style.setProperty('--i', idx);
      b.addEventListener('click', function () { iniciarMundo(m); });
      box.appendChild(b);
    });
  }

  function iniciarMundo(mundo) {
    estado.mundo = mundo;

    estado.rodadas = [];
    ['f', 'm', 'd'].forEach(function (n) {
      var doNivel = PERGUNTAS[mundo.id].filter(function (q) { return q.nivel === n; });
      estado.rodadas = estado.rodadas.concat(embaralhar(doNivel).map(montarRodada));
    });

    estado.roteiro = embaralhar(JORNADA);
    estado.indice = 0;
    estado.acertos = 0;
    estado.seguidas = 0;
    estado.inicio = Date.now();
    mostrarTela('tela-jogo');
    decorar(mundo.id);
    desenharRodada();
  }

  function desenharPassos() {
    var box = $('#passos');
    box.innerHTML = '';
    for (var i = 0; i < estado.rodadas.length; i++) {
      var c = 'passo', txt = '';
      if (i < estado.indice) {
        if (estado.rodadas[i].acertou) { c += ' feito'; txt = '★'; } else { c += ' falhou'; txt = '✓'; }
        if (i === estado.indice - 1) { c += ' novo'; }
      }
      if (i === estado.indice) { c += ' atual'; txt = imgSprite('normal'); }
      box.appendChild(el('span', c, txt));
    }
  }

  function elOpcao(o) {
    var b = el('button', 'card');
    var html = '';
    if (o.grupo) { html += '<span class="grupo">' + o.grupo + '</span>'; }
    if (o.emoji) { html += '<span class="emoji" style="font-size:' + (3.0 * (o.escala || 1)) + 'rem">' + o.emoji + '</span>'; }
    if (o.texto) { html += '<span class="texto' + (o.texto.length > 3 ? ' longo' : '') + '">' + o.texto + '</span>'; }
    if (o.legenda) { html += '<span class="legenda">' + o.legenda + '</span>'; }
    b.innerHTML = html;
    return b;
  }

  function limparAreas() {
    $('#palco').innerHTML = ''; $('#palco').hidden = true;
    $('#opcoes').innerHTML = '';
    $('#opcoes').className = 'opcoes';
    $('#opcoes').hidden = false;
  }

  function desenharRodada() {
    var r = estado.rodadas[estado.indice];
    estado.errosRodada = 0;
    estado.bloqueado = false;
    pintarMascote('#mascote-jogo', 'normal');
    ['#cabecalho-jogo', '#palco', '#opcoes'].forEach(function (sel) { $(sel).classList.remove('saindo'); });
    trocarCena(estado.roteiro[estado.indice % estado.roteiro.length], true);
    desenharPassos();
    limparAreas();
    reanimar('#cabecalho-jogo', 'desce');
    reanimar('#palco', 'zoom');
    $('#enunciado').innerHTML = r.enunciado;
    if (r.palco) { $('#palco').innerHTML = r.palco; $('#palco').hidden = false; }

    if (r.observar) {
      var indice = estado.indice;
      estado.bloqueado = true;
      $('#enunciado').innerHTML = r.observar;
      falar(r.audioObservar);
      window.setTimeout(function () {
        if (estado.indice !== indice || estado.rodadas[indice] !== r ||
          !$('#tela-jogo').classList.contains('ativa')) { return; }
        estado.bloqueado = false;
        $('#palco').innerHTML = ''; $('#palco').hidden = true;
        $('#enunciado').innerHTML = r.enunciado;
        renderEscolha(r);
        falar(r.audio);
      }, 5000);
      return;
    }

    if (r.tipo === 'escolha') { renderEscolha(r); }
    else if (r.tipo === 'memoria') { renderMemoria(r); }

    falar(r.audio);
  }

  function treme(elemento) {
    elemento.classList.add('tremendo');
    window.setTimeout(function () { elemento.classList.remove('tremendo'); }, 320);
  }

  function renderEscolha(r) {
    var box = $('#opcoes');
    box.className = 'opcoes' + (r.opcoes.length === 2 ? ' cols-2' : '');
    (r.manterOrdem ? r.opcoes : embaralhar(r.opcoes)).forEach(function (o, i) {
      var b = elOpcao(o);
      surgir(b, i);
      b.addEventListener('click', function () {
        if (estado.bloqueado || b.classList.contains('errado')) { return; }
        if (o.correta) { b.classList.add('certo'); concluirRodada(b); }
        else { b.classList.add('errado'); treme(b); registrarErro(); if (r.observar) { olharDeNovo(r); } }
      });
      box.appendChild(b);
    });
  }

  function olharDeNovo(r) {
    var indice = estado.indice;
    estado.bloqueado = true;
    function aindaAqui() {
      return estado.indice === indice && estado.rodadas[indice] === r && $('#tela-jogo').classList.contains('ativa');
    }
    window.setTimeout(function () {
      if (!aindaAqui()) { return; }
      $('#enunciado').innerHTML = 'Olhe de novo com atenção!';
      $('#opcoes').hidden = true;
      $('#palco').innerHTML = r.palco; $('#palco').hidden = false;
      reanimar('#palco', 'zoom');
      window.setTimeout(function () {
        if (!aindaAqui()) { return; }
        $('#palco').innerHTML = ''; $('#palco').hidden = true;
        $('#enunciado').innerHTML = r.enunciado;
        $('#opcoes').hidden = false;
        estado.bloqueado = false;
      }, 4000);
    }, 900);
  }

  function renderMemoria(r) {
    var box = $('#opcoes');
    box.className = 'opcoes memoria';
    var viradas = [], achados = 0, total = r.opcoes.length / 2;

    function girar(b, mostrar) {
      if (b.animate && !reduzirMovimento) {
        b.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)', offset: 0.47 },
          { transform: 'scaleX(0)', offset: 0.53 }, { transform: 'scaleX(1)' }], { duration: 300, easing: 'ease-in-out' });
      }
      window.setTimeout(function () { b.classList.toggle('virada', mostrar); }, 140);
    }

    r.opcoes.forEach(function (o, i) {
      var b = el('button', 'card',
        '<span class="verso">✦</span><span class="face">' + (o.texto || o.emoji) + '</span>');
      surgir(b, i);
      b.addEventListener('click', function () {
        if (estado.bloqueado || b._aberta || viradas.length >= 2) { return; }
        b._aberta = true;
        girar(b, true);
        somToque();
        viradas.push({ b: b, o: o });
        if (viradas.length === 2) {
          var a = viradas[0], c = viradas[1];
          if (a.o.par === c.o.par) {

            viradas = []; achados++;
            window.setTimeout(function () {
              a.b.classList.add('par'); c.b.classList.add('par');
              tocar([760, 980]);
              var rc = c.b.getBoundingClientRect();
              soltarConfete(rc.left + rc.width / 2, rc.top + rc.height / 2, 14, 0.6);
              if (achados === total) { concluirRodada(c.b); }
            }, 320);
          } else {

            window.setTimeout(function () {
              girar(a.b, false); girar(c.b, false);
              a.b._aberta = false; c.b._aberta = false;
              window.setTimeout(function () { viradas = []; }, 300);
            }, 1200);
          }
        }
      });
      box.appendChild(b);
    });
  }

  function registrarErro() {
    estado.errosRodada++;
    pintarMascote('#mascote-jogo', 'ops');
    animarMascote('#mascote-jogo', 'balanca');
    mostrarFeedback('ops', 'Tente de novo!', 900);
    falar(AUDIO.erro);
  }

  function mostrarFeedback(pose, texto, ms) {
    var f = $('#feedback');
    pintarMascote('#mascote-feedback', pose);
    $('#feedback-texto').textContent = texto;
    f.className = 'feedback feedback--' + pose;
    f.hidden = false;
    if (pose === 'feliz') { animarMascote('#mascote-feedback', 'pula'); }
    window.clearTimeout(mostrarFeedback._t);
    mostrarFeedback._t = window.setTimeout(function () { f.hidden = true; }, ms);
  }

  function concluirRodada(elemento) {
    if (estado.bloqueado) { return; }
    estado.bloqueado = true;
    var r = estado.rodadas[estado.indice];
    r.acertou = estado.errosRodada === 0;
    if (r.acertou) { estado.acertos++; }

    var rc = elemento ? elemento.getBoundingClientRect() : null;
    var passo = $('#passos').children[estado.indice];
    var ra = (r.acertou && passo) ? passo.getBoundingClientRect() : null;
    pintarMascote('#mascote-jogo', 'feliz');
    animarMascote('#mascote-jogo', 'pula');
    if (rc) {
      soltarConfete(rc.left + rc.width / 2, rc.top + rc.height / 2, r.acertou ? 50 : 28);
      if (ra) { estrelaVoa(rc, ra, passo); }
    }
    estado.seguidas = r.acertou ? estado.seguidas + 1 : 0;
    if (estado.seguidas >= 3) { mostrarSequencia(estado.seguidas); }
    var elogio = sortearElogio();
    mostrarFeedback('feliz', elogio.texto, 1400);

    var inicio = Date.now(), avancou = false, rodadas = estado.rodadas, indice = estado.indice;
    function avancar() {
      if (avancou) { return; }
      avancou = true;
      var espera = Math.max(0, 1200 - (Date.now() - inicio));
      window.setTimeout(function () {
        if (estado.rodadas !== rodadas || estado.indice !== indice) { return; }
        ['#cabecalho-jogo', '#palco', '#opcoes'].forEach(function (sel) { $(sel).classList.add('saindo'); });
      }, Math.max(0, espera - 350));
      window.setTimeout(function () {
        if (!$('#tela-jogo').classList.contains('ativa') || estado.rodadas !== rodadas || estado.indice !== indice) { return; }
        estado.indice++;
        if (estado.indice >= estado.rodadas.length) { finalizarFase(); return; }
        var antes = estado.rodadas[estado.indice - 1].nivel, agora = estado.rodadas[estado.indice].nivel;
        if (agora !== antes) { mostrarNovoNivel(agora, desenharRodada); } else { desenharRodada(); }
      }, espera);
    }
    falar(elogio.arq, avancar);
    window.setTimeout(avancar, 6500);
  }

  var AUDIO_NIVEL = { m: 'nivel-medio.mp3', d: 'nivel-dificil.mp3' };
  function mostrarNovoNivel(nivel, depois) {
    var caixa = $('#novo-nivel'), rodadas = estado.rodadas, indice = estado.indice;
    var t0 = Date.now(), seguiu = false;
    estado.bloqueado = true;
    estado.trocandoNivel = true;
    $('#feedback').hidden = true;
    $('#nivel-titulo').textContent = 'Parabéns!';
    letrasOnda($('#nivel-titulo'));
    $('#nivel-selo').innerHTML = NOME_NIVEL[nivel] + ' <span>' + (nivel === 'd' ? '★★★' : '★★') + '</span>';
    caixa.className = 'novo-nivel nivel-' + nivel;
    caixa.hidden = false;
    pintarMascote('#mascote-nivel', 'feliz');
    animarMascote('#mascote-nivel', 'pula');
    chuvaConfete(2.5);
    soltarConfete(window.innerWidth / 2, window.innerHeight * 0.45, 70, 1.2);
    tocar([523, 659, 784, 1046, 1318, 1568]);
    function seguir() {
      if (seguiu) { return; }
      seguiu = true;
      caixa.hidden = true;
      caixa.onclick = null;
      pularNivel = null;
      estado.trocandoNivel = false;

      if (!$('#tela-jogo').classList.contains('ativa') || estado.rodadas !== rodadas || estado.indice !== indice) { return; }
      depois();
    }

    window.setTimeout(function () {
      if (seguiu) { return; }
      falar(AUDIO_NIVEL[nivel], function () {
        window.setTimeout(seguir, Math.max(700, 3600 - (Date.now() - t0)));
      });
    }, 800);
    window.setTimeout(seguir, 9000);

    pularNivel = function () {
      if (seguiu || Date.now() - t0 < 600) { return; }
      pararFala();
      seguir();
    };
    caixa.onclick = pularNivel;
  }
  var pularNivel = null;

  function estrelaVoa(rc, ra, alvo) {
    if (!alvo || reduzirMovimento || !document.body.animate) { return; }
    var x0 = rc.left + rc.width / 2, y0 = rc.top + rc.height / 2;
    var e = el('span', 'estrela-voa', '⭐');
    e.style.left = x0 + 'px'; e.style.top = y0 + 'px';
    document.body.appendChild(e);
    var dx = ra.left + ra.width / 2 - x0, dy = ra.top + ra.height / 2 - y0;
    var anim = e.animate([
      { transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 0 },
      { transform: 'translate(-50%,-50%) scale(1.8) rotate(90deg)', opacity: 1, offset: 0.25 },
      { transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(.7) rotate(360deg)', opacity: 1 }
    ], { duration: 900, easing: 'cubic-bezier(.5,0,.6,1)' });
    anim.onfinish = function () {
      e.remove();
      alvo.classList.add('recebe');
      soltarConfete(ra.left + ra.width / 2, ra.top + ra.height / 2, 10, 0.4);
    };
  }

  function mostrarSequencia(n) {
    var e = $('#sequencia');
    if (!e) { return; }
    e.textContent = '🌟 ' + n + ' acertos seguidos! 🌟';
    reiniciarClasse(e, 'mostra');

    chuvaConfete(0.7);
  }

  function finalizarFase() {
    var segundos = Math.round((Date.now() - estado.inicio) / 1000);
    var total = estado.rodadas.length, acertos = estado.acertos;
    var estrelas = acertos >= total ? 3 : (acertos >= total - 1 ? 2 : (acertos >= Math.ceil(total / 2) ? 1 : 0));

    var j = estado.jogador;
    if (!j.estrelas) { j.estrelas = {}; }
    if ((j.estrelas[estado.mundo.id] || 0) < estrelas) { j.estrelas[estado.mundo.id] = estrelas; }

    var quem = j.nome ? ', ' + j.nome : '';
    $('#fim-titulo').textContent = (estrelas >= 2 ? 'Parabéns' : 'Muito bem') + quem + '!';
    letrasOnda($('#fim-titulo'));
    var estr = '';
    for (var i = 0; i < 3; i++) {
      estr += '<span class="' + (i < estrelas ? 'cheia' : 'vazia') + '" style="--i:' + i + '">' + (i < estrelas ? '★' : '☆') + '</span>';
    }
    $('#fim-estrelas').innerHTML = estr;
    $('#fim-placar').textContent = 'Acertou ' + acertos + ' de ' + total + ' na primeira tentativa • ' + segundos + 's';
    pintarMascote('#mascote-fim', estrelas >= 2 ? 'feliz' : 'normal');
    mostrarTela('tela-fim');
    trocarCena('noite');
    pararFala();
    somFesta();

    chuvaConfete(estrelas >= 1 ? 3.5 : 2);
    soltarFogos(estrelas >= 2 ? 6 : 3);
    animarMascote('#mascote-fim', 'pula');
    window.setTimeout(function () {
      if ($('#tela-fim').classList.contains('ativa')) { falar(estrelas ? AUDIO.estrelas[estrelas] : AUDIO.erro); }
    }, 800);
  }

  function alternarSom() {
    mudo = !mudo;
    if (mudo) { pararFala(); }
    $('#btn-som').textContent = mudo ? '🔇' : '🔊';
    $('#btn-som').classList.toggle('mudo', mudo);
  }

  function telaCheia() {
    try {
      if (!document.fullscreenElement) {
        (document.documentElement.requestFullscreen ||
          document.documentElement.webkitRequestFullscreen).call(document.documentElement);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      }
    } catch (e) { }
  }

  function ligar() {
    $('#btn-som').addEventListener('click', alternarSom);
    $('#btn-tela').addEventListener('click', telaCheia);

    $('#mascote-inicio').addEventListener('click', function () {
      jaApresentou = true;
      pintarMascote('#mascote-inicio', 'feliz');
      animarMascote('#mascote-inicio', 'pula');
      var rc = this.getBoundingClientRect();
      soltarConfete(rc.left + rc.width / 2, rc.top + rc.height * 0.3, 20, 0.7);
      $('#balao-inicio').textContent = 'Oi pessoal, me chamo Pipo! Vamos brincar!';
      reanimar('#balao-inicio');
      falar(AUDIO.entrada);
      window.clearTimeout(this._t);
      this._t = window.setTimeout(function () { pintarMascote('#mascote-inicio', 'normal'); }, 1300);
    });

    document.addEventListener('pointerdown', function (ev) { faisca(ev.clientX, ev.clientY); });

    var jaApresentou = false;
    document.addEventListener('pointerdown', function (ev) {
      if (jaApresentou || !$('#tela-inicio').classList.contains('ativa')) { return; }
      if (ev.target.closest && ev.target.closest('#btn-jogar, #mascote-inicio, .topo-mini')) { return; }
      jaApresentou = true;
      falar(AUDIO.entrada);
    });

    $('#btn-jogar').addEventListener('click', abrirCadastro);
    $('#cadastro-voltar').addEventListener('click', function () { pararFala(); mostrarTela('tela-inicio'); });

    $('#mascote-cadastro').addEventListener('click', function () {
      animarMascote('#mascote-cadastro', 'pula');
      falar(AUDIO.cadastro);
    });
    $('#form-cadastro').addEventListener('submit', function (ev) {
      ev.preventDefault();
      jogar();
    });

    $('#cad-idade').addEventListener('input', function () {
      var limpo = this.value.replace(/\D/g, '').slice(0, 2);
      if (limpo !== this.value) { this.value = limpo; }
    });

    $('#mapa-voltar').addEventListener('click', function () { mostrarTela('tela-inicio'); trocarCena('floresta'); decorar('inicio'); });
    $('#mascote-mapa').addEventListener('click', function () {
      somQuack();
      animarMascote('#mascote-mapa', 'pula');
      var rc = this.getBoundingClientRect();
      soltarConfete(rc.left + rc.width / 2, rc.top + rc.height * 0.3, 14, 0.5);
    });
    $('#jogo-sair').addEventListener('click', irParaMapa);
    $('#jogo-ouvir').addEventListener('click', function () {
      var r = estado.rodadas[estado.indice];
      if (!r || estado.trocandoNivel) { return; }
      var observando = r.observar && !$('#palco').hidden && estado.bloqueado;
      falar(observando ? r.audioObservar : r.audio);
    });

    $('#fim-repetir').addEventListener('click', function () { iniciarMundo(estado.mundo); });
    $('#fim-mapa').addEventListener('click', irParaMapa);

    document.addEventListener('keydown', function (ev) {
      if (pularNivel && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); pularNivel(); return; }
      if (ev.key === 'Escape' && $('#tela-jogo').classList.contains('ativa')) {
        irParaMapa();
      }
    });

    var t = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(t);
      t = window.setTimeout(redimensionar, 150);
    });
  }

  if (medirFundo()) {
    medirEfeitos();
    trocarCena('floresta');
    prepararCenas();
    if (!reduzirMovimento && window.requestAnimationFrame) { window.requestAnimationFrame(quadro); }
  }
  letrasOnda($('.logo .l1'));
  letrasOnda($('.logo .l2'));
  letrasOnda($('#titulo-mapa'));
  prepararSprites();
  pintarMascote('#mascote-inicio', 'normal');
  pintarMascote('#mascote-mapa', 'normal');
  decorar('inicio');
  piscarDeVezEmQuando();
  ligar();

  window.MarrecoMagico = { MUNDOS: MUNDOS, PERGUNTAS: PERGUNTAS, estado: estado, POSES: POSES,
    CENAS: CENAS, trocarCena: trocarCena };

}());
