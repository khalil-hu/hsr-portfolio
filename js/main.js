/* ============================================================
   声之命途 · 交互引擎
   ------------------------------------------------------------
   鼠标跟随 / 视差景深 / 卡片倾斜 / 滚动显现 / 视频缺失检测
   所有动效只作用于 transform 与 opacity。
   尊重 prefers-reduced-motion。
   ============================================================ */

(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- 数据渲染 ---------- */

  /* 属性面板字段:全部可选,删掉或留空的字段不会显示 */
  function statItems(song) {
    const fields = [
      ["曲名", song.title],
      ["原唱", song.artist],
      ["风格", song.genre],
      ["BPM", song.bpm],
      ["调性", song.key],
      ["时长", song.duration],
      ["音轨", song.tracks],
      ["工具", song.tools]
    ];
    return fields.filter(([, v]) => v !== undefined && v !== null && v !== "");
  }

  function statGrid(song, cls) {
    return `<dl class="${cls}">${statItems(song)
      .map(([k, v]) => `<div class="stat"><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("")}</dl>`;
  }

  function videoBlock(t) {
    return `
      <div class="player-frame gold-frame clip">
        <div class="frame-body">
          <video controls preload="metadata" poster="${t.poster}">
            <source src="${t.video}" type="video/mp4">
            你的浏览器不支持视频播放。
          </video>
          <div class="video-hint">
            <div>视频待放入<br>
              <code>${t.video}</code><br>
              把视频文件放到这个路径,刷新页面即可播放
            </div>
          </div>
          <div class="player-caption">
            <span>《${t.song.title}》扒带</span>
            <span>${t.song.date}</span>
          </div>
        </div>
      </div>`;
  }

  function charHead(t, extra, moon) {
    return `
      <header class="char-head">
        <h2 class="char-name">${t.char}${extra || ""}</h2>
        <div class="char-meta">${moon ? '<span class="moon" aria-hidden="true"></span>' : ""}${t.path} · ${t.element}</div>
        <p class="char-quote">${t.quote}</p>
      </header>`;
  }

  function notesBlock(t) {
    return `
      <div class="notes">
        <h3>扒带手记</h3>
        <p class="notes-stage">${t.stage}:${t.growth}</p>
        ${t.notes.map((p) => `<p>${p}</p>`).join("")}
      </div>`;
  }

  function buildNav() {
    const links = document.getElementById("nav-links");
    links.innerHTML =
      TRACKS.map(
        (t) => `<a href="#char-${t.id}" data-nav="${t.id}">${t.char}</a>`
      ).join("") + `<a href="#about" data-nav="about" class="about-link">关于</a>`;
  }

  function buildRoster() {
    const grid = document.getElementById("roster-grid");
    grid.innerHTML = TRACKS.map(
      (t) => `
      <a class="char-card clip" href="#char-${t.id}" data-char="${t.id}" style="--cc:${t.accent}">
        <img src="assets/characters/web/${t.id}-portrait.jpg" alt="${t.char} 立绘" loading="lazy">
        <div class="card-scrim"></div>
        <span class="card-stage">${t.stage}</span>
        <p class="card-quote">${t.quote}</p>
        <div class="card-info">
          <span class="card-path">${t.path} · ${t.element}</span>
          <h3 class="card-name">${t.char}</h3>
          <p class="card-song">《${t.song.title}》</p>
          <span class="card-enter"><i aria-hidden="true"></i>进入档案</span>
        </div>
      </a>`
    ).join("");
  }

  function buildDetails() {
    const host = document.getElementById("details");
    // 按 TRACKS 顺序(时间线)渲染;布局只看每首歌的 layout 字段
    host.innerHTML = TRACKS.map(renderSection).join("");
  }

  function renderSection(t) {
    const head = charHead(t);
    const stats = statGrid(t.song, "stat-grid");
    const video = videoBlock(t);
    const notes = notesBlock(t);
    switch (t.layout) {
      case "a":
        return `
      <section class="detail detail--a" id="char-${t.id}" data-char="${t.id}" data-wm="${t.char}">
        <div class="cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${t.id}-landscape.jpg')"></div>
          <div class="cover-tint" aria-hidden="true"></div>
          <div class="cover-shade"></div>
          <div class="gold-dust" aria-hidden="true"></div>
          <div class="suit-strip" aria-hidden="true"><span>♠</span><span>♥</span><span>♦</span><span>♣</span></div>
          <div class="cover-inner">
            <div>
              <div class="rv">${head}</div>
              <div class="rv">${notes}</div>
            </div>
            <div>
              <div class="rv">${stats}</div>
              <div class="rv">${video}</div>
            </div>
          </div>
        </div>
      </section>`;
      case "b":
        return `
      <section class="detail detail--b" id="char-${t.id}" data-char="${t.id}" data-wm="${t.char}">
        <div class="cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${t.id}-landscape.jpg')"></div>
          <div class="cover-tint" aria-hidden="true"></div>
          <div class="cover-shade"></div>
          <div class="moon-big" aria-hidden="true"></div>
          <div class="rain" aria-hidden="true"></div>
          <div class="cover-inner">
            <div>
              <div class="rv">${charHead(t, "", false)}</div>
              <div class="rv">${notes}</div>
            </div>
            <div>
              <div class="rv">${stats}</div>
              <div class="rv">${video}</div>
            </div>
          </div>
        </div>
      </section>`;
      case "c":
        return `
      <section class="detail detail--c" id="char-${t.id}" data-char="${t.id}" data-wm="${t.char}">
        <div class="cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${t.id}-landscape.jpg')"></div>
          <div class="cover-tint" aria-hidden="true"></div>
          <div class="cover-shade"></div>
          <div class="astrolabe" aria-hidden="true"><i></i></div>
          <div class="runes" aria-hidden="true"></div>
          <div class="cover-inner">
            <div class="rv">${charHead(t, `<span class="tri-field" aria-hidden="true"><i></i><i></i><i></i></span>`)}</div>
            <div class="rv">${statGrid(t.song, "c-statstrip")}</div>
            <div class="c-body">
              <div>
                <div class="rv">${video}</div>
              </div>
              <div>
                <div class="rv">${notes}</div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
      case "d":
        return `
      <section class="detail detail--d" id="char-${t.id}" data-char="${t.id}" data-wm="${t.char}">
        <div class="cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${t.id}-landscape.jpg')"></div>
          <div class="cover-tint" aria-hidden="true"></div>
          <div class="cover-shade"></div>
          <div class="star-motes" aria-hidden="true"></div>
          <div class="wave" aria-hidden="true"></div>
          <div class="wave w2" aria-hidden="true"></div>
          <div class="wave w3" aria-hidden="true"></div>
          <div class="ripple r1" aria-hidden="true"></div>
          <div class="ripple r2" aria-hidden="true"></div>
          <div class="ripple r3" aria-hidden="true"></div>
          <div class="cover-inner">
            <div class="d-head rv">${head}</div>
            <div class="d-triptych">
              <div class="rv">
                <div class="d-stat-tiles">
                  ${statItems(t.song)
                    .map(
                      ([k, v]) =>
                        `<div class="stat"><dt>${k}</dt><dd>${v}</dd></div>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="rv">${video}</div>
              <div class="rv">${notes}</div>
            </div>
          </div>
        </div>
      </section>`;
      case "e":
        return `
      <section class="detail detail--e" id="char-${t.id}" data-char="${t.id}" data-wm="${t.char}">
        <div class="cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${t.id}-portrait.jpg')"></div>
          <div class="cover-tint" aria-hidden="true"></div>
          <div class="cover-shade"></div>
          <div class="bubbles" aria-hidden="true"></div>
          <div class="cover-inner">
            <div class="e-head rv">${head}</div>
            <div class="rv">${video}</div>
            <div class="e-bottom">
              <div class="rv">${stats}</div>
              <div class="rv">${notes}</div>
            </div>
          </div>
        </div>
      </section>`;
    }
    return "";
  }

  /* ---------- 星尘 ---------- */

  function buildStars() {
    const layer = document.getElementById("bg-stars");
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 45; i++) {   // 收敛:数量减半,闪烁更缓
      const s = document.createElement("span");
      s.className = "star" + (i % 9 === 0 ? " tint" : "");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.width = s.style.height = (Math.random() * 1.6 + 0.8).toFixed(2) + "px";
      s.style.setProperty("--tw-dur", (3 + Math.random() * 4).toFixed(1) + "s");
      s.style.setProperty("--tw-delay", (Math.random() * 5).toFixed(1) + "s");
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }

  /* ---------- 长夜月雨丝 ---------- */

  function buildRain() {
    if (REDUCED) return;
    const wrap = document.querySelector(".detail--b .rain");
    if (!wrap) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 36; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.setProperty("--h", (34 + Math.random() * 46).toFixed(0) + "px");
      s.style.setProperty("--rd", (1.5 + Math.random() * 1.4).toFixed(2) + "s");
      s.style.setProperty("--rdelay", (Math.random() * 2.6).toFixed(2) + "s");
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
  }

  /* ---------- 章节氛围粒子(砂金金尘/爻光孔雀斑/昔涟星芒) ---------- */

  function injectAmbient(selector, count, cls, opts) {
    const wrap = document.querySelector(selector);
    if (!wrap || REDUCED) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("i");
      s.className = cls;
      if (opts.bands) {
        // 等宽列带:每个元素占一条横向带,保证互不靠近
        s.style.left = (((i + Math.random() * 0.7) / count) * 100).toFixed(1) + "%";
      } else {
        s.style.left = (Math.random() * (opts.x || 100)).toFixed(1) + "%";
      }
      if (opts.y) {
        const yMin = Array.isArray(opts.y) ? opts.y[0] : 0;
        const yMax = Array.isArray(opts.y) ? opts.y[1] : opts.y;
        s.style.top = (yMin + Math.random() * (yMax - yMin)).toFixed(1) + "%";
      }
      const size = opts.size[0] + Math.random() * (opts.size[1] - opts.size[0]);
      s.style.setProperty("--dw", size.toFixed(1) + "px");
      const dur = opts.dur[0] + Math.random() * (opts.dur[1] - opts.dur[0]);
      s.style.setProperty("--ddur", dur.toFixed(1) + "s");
      s.style.setProperty(
        "--ddelay",
        opts.negDelay
          ? "-" + (Math.random() * dur).toFixed(1) + "s"   // 负延迟:加载即散落在下落途中
          : (Math.random() * opts.dur[1]).toFixed(1) + "s"
      );
      s.style.setProperty("--dsway", (Math.random() * 40 - 20).toFixed(0) + "px");
      if (opts.sway) s.style.setProperty("--fsway", (opts.sway[0] + Math.random() * (opts.sway[1] - opts.sway[0])).toFixed(0) + "px");
      if (opts.rot) s.style.setProperty("--frot", (Math.random() * opts.rot).toFixed(0) + "deg");
      if (opts.palette) s.style.background = opts.palette[i % opts.palette.length];
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
  }

  /* ---------- 视频缺失检测 ---------- */

  function watchVideos() {
    document.querySelectorAll(".player-frame").forEach((frame) => {
      const mark = () => frame.classList.add("video-missing");
      const unmark = () => frame.classList.remove("video-missing");
      const video = frame.querySelector("video");
      if (video) {
        video.addEventListener("error", mark, { once: true });
        video.addEventListener("loadedmetadata", unmark);
      }
      frame.querySelectorAll("source").forEach((src) =>
        src.addEventListener("error", mark, { once: true })
      );
      // 兜底:1.5 秒后仍未取到任何数据则视为缺失
      setTimeout(() => {
        if (!video) return;
        const missing =
          video.networkState === 3 ||
          (video.error && video.error.code) ||
          (video.readyState === 0 && video.networkState !== 2);
        if (missing) mark();
      }, 1500);
    });
  }

  /* ---------- 滚动显现 / 章节追踪 / 导航高亮 ---------- */

  function observeSections() {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".rv").forEach((el) => revealObs.observe(el));

    // 章节居中时切换氛围色与导航高亮
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const sec = e.target;
          if (sec.id === "top" || sec.id === "about") {
            root.removeAttribute("data-char");
          } else if (sec.dataset.char) {
            root.setAttribute("data-char", sec.dataset.char);
          }
          document.querySelectorAll(".nav-links a").forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id);
          });
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    document
      .querySelectorAll("main > section, section.detail")
      .forEach((sec) => secObs.observe(sec));

    // 光标光晕只属于开场:滚出英雄区后淡出
    const hero = document.getElementById("top");
    if (hero) {
      new IntersectionObserver(
        (entries) => {
          document.body.classList.toggle("past-hero", !entries[0].isIntersecting);
        },
        { threshold: 0.02 }
      ).observe(hero);
    }
  }

  /* ---------- 鼠标跟随与视差 ---------- */

  function initPointer() {
    if (REDUCED) return;

    const layers = {
      stars: document.getElementById("bg-stars"),
      nebula: document.getElementById("bg-nebula")
    };
    const glowFast = document.getElementById("glow-fast");
    const glowSlow = document.getElementById("glow-slow");

    let tx = 0, ty = 0, mx = 0, my = 0;
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX / window.innerWidth * 2 - 1;
      ty = e.clientY / window.innerHeight * 2 - 1;
      glowFast.style.setProperty("--gx", e.clientX + "px");
      glowFast.style.setProperty("--gy", e.clientY + "px");
      glowSlow.style.setProperty("--gx", e.clientX + "px");
      glowSlow.style.setProperty("--gy", e.clientY + "px");
    });

    function frame() {
      mx += (tx - mx) * 0.055;   // 平滑跟随,避免生硬
      my += (ty - my) * 0.055;
      root.style.setProperty("--mx", mx.toFixed(4));
      root.style.setProperty("--my", my.toFixed(4));
      layers.stars.style.transform =
        "translate3d(" + (mx * 22).toFixed(2) + "px," + (my * 14).toFixed(2) + "px,0)";
      layers.nebula.style.transform =
        "translate3d(" + (mx * 40).toFixed(2) + "px," + (my * 26).toFixed(2) + "px,0) scale(1.15)";
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initTilt() {
    if (REDUCED) return;
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          "perspective(900px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 7).toFixed(2) + "deg)";
        el.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });

    // 目录卡片:倾斜 + 聚光
    document.querySelectorAll(".char-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(800px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg)";
        card.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- 入场 ---------- */

  function initEntry() {
    const enter = () => document.body.classList.add("entered");
    const btn = document.getElementById("entry-btn");
    const overlay = document.getElementById("entry");
    if (btn) btn.addEventListener("click", enter);
    if (overlay) overlay.addEventListener("click", enter);  // 点击任意处启程
  }

  /* ---------- 启动 ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    buildStars();
    buildNav();
    buildRoster();
    buildDetails();
    buildRain();
    injectAmbient(".detail--a .gold-dust", 22, "", { size: [3, 7], dur: [7, 14] });
    injectAmbient(".detail--c .runes", 5, "", {
      bands: true, y: [12, 72], size: [70, 120], dur: [8, 14], rot: 24, negDelay: true
    });
    injectAmbient(".detail--d .star-motes", 20, "", {
      size: [3, 6], dur: [9, 18],
      palette: [
        "radial-gradient(circle, #ffe6f2, rgba(240,168,200,.55) 60%, transparent)",
        "radial-gradient(circle, #eaf4ff, rgba(143,195,240,.55) 60%, transparent)"
      ]
    });
    injectAmbient(".detail--e .bubbles", 18, "", {
      x: 100, size: [8, 22], dur: [9, 16], negDelay: true
    });
    watchVideos();
    observeSections();
    initPointer();
    initTilt();
    initEntry();
  });
})();
