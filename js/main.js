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
        ${t.notes.map((p) => `<p>${p}</p>`).join("")}
      </div>`;
  }

  function portraitPanel(t, img, caption) {
    return `
      <div class="portrait-panel gold-frame clip" data-tilt>
        <span class="corner tl"></span><span class="corner tr"></span>
        <span class="corner bl"></span><span class="corner br"></span>
        <div class="frame-body">
          <img src="${img}" alt="${t.char} 立绘" loading="lazy">
          <div class="p-caption">
            <span>命途:${t.path} · 属性:${t.element}</span>
            <span class="acc">${caption}</span>
          </div>
        </div>
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
        <img src="assets/characters/web/${t.id}-portrait.png" alt="${t.char} 立绘" loading="lazy">
        <div class="card-scrim"></div>
        <p class="card-quote">${t.quote}</p>
        <div class="card-info">
          <span class="card-path">${t.path} · ${t.element}</span>
          <h3 class="card-name">${t.char}</h3>
          <p class="card-song">《${t.song.title}》</p>
        </div>
      </a>`
    ).join("");
  }

  function buildDetails() {
    const host = document.getElementById("details");
    const [a, b, c, d] = TRACKS;
    host.innerHTML = `
      <section class="detail detail--a" id="char-${a.id}" data-char="${a.id}" data-wm="${a.char}">
        <div class="sticky-col">
          ${portraitPanel(a, `assets/characters/web/${a.id}-portrait.png`, "01")}
        </div>
        <div>
          <div class="suit-field" aria-hidden="true">♠</div>
          <div class="rv">${charHead(a)}</div>
          <div class="rv">${statGrid(a.song, "stat-grid")}</div>
          <div class="rv">${videoBlock(a)}</div>
          <div class="rv">${notesBlock(a)}</div>
        </div>
      </section>

      <section class="detail detail--b" id="char-${b.id}" data-char="${b.id}" data-wm="${b.char}">
        <div class="b-cover">
          <div class="cover-bg" style="background-image:url('assets/characters/web/${b.id}-landscape.png')"></div>
          <div class="cover-shade"></div>
          <div class="moon-big" aria-hidden="true"></div>
          <div class="rain" aria-hidden="true"></div>
          <div class="b-inner">
            <div>
              <div class="rv">${charHead(b, "", false)}</div>
              <div class="rv">${notesBlock(b)}</div>
            </div>
            <div>
              <div class="rv">${statGrid(b.song, "stat-grid")}</div>
              <div class="rv">${videoBlock(b)}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="detail detail--c" id="char-${c.id}" data-char="${c.id}" data-wm="${c.char}">
        <div class="rv">${charHead(c, `<span class="tri-field" aria-hidden="true"><i></i><i></i><i></i></span>`)}</div>
        <div class="rv">${statGrid(c.song, "c-statstrip")}</div>
        <div class="c-body">
          <div>
            <div class="rv">${videoBlock(c)}</div>
            <div class="rv">${notesBlock(c)}</div>
          </div>
          <div class="rv">
            ${portraitPanel(c, `assets/characters/web/${c.id}-vertical.png`, "03")}
          </div>
        </div>
      </section>

      <section class="detail detail--d" id="char-${d.id}" data-char="${d.id}" data-wm="${d.char}">
        <div class="d-head rv">
          ${charHead(d, "")}
        </div>
        <div class="d-triptych">
          <div class="rv">
            <div class="d-stat-tiles">
              ${statItems(d.song)
                .map(
                  ([k, v]) =>
                    `<div class="stat"><dt>${k}</dt><dd>${v}</dd></div>`
                )
                .join("")}
            </div>
          </div>
          <div class="rv" style="position:relative">
            <div class="ripple r1" style="left:50%;top:50%;transform:translate(-50%,-50%)" aria-hidden="true"></div>
            <div class="ripple r2" style="left:50%;top:50%;transform:translate(-50%,-50%)" aria-hidden="true"></div>
            <div class="ripple r3" style="left:50%;top:50%;transform:translate(-50%,-50%)" aria-hidden="true"></div>
            ${portraitPanel(d, `assets/characters/web/${d.id}-portrait.png`, "04")}
          </div>
          <div>
            <div class="rv">${videoBlock(d)}</div>
            <div class="rv">${notesBlock(d)}</div>
          </div>
        </div>
      </section>`;
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

  /* ---------- 开场角色名轮播 ---------- */

  function initNameCycle() {
    const el = document.getElementById("cycle-name");
    if (!el || REDUCED) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % TRACKS.length;
      el.textContent = TRACKS[i].char;
      el.style.color = TRACKS[i].accent;
      el.classList.remove("swap");
      void el.offsetWidth;   // 强制重排以重启动画
      el.classList.add("swap");
    }, 2600);
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
    initNameCycle();
    watchVideos();
    observeSections();
    initPointer();
    initTilt();
    initEntry();
  });
})();
