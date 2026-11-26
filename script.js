const revelar = document.querySelectorAll(".titulo, .subtitulo, .sobre > div, .projeto, .linha-tempo > li, .contato-card, .github-atividade");
revelar.forEach((el) => el.classList.add("revelar"));

const observador = new IntersectionObserver((itens) => {
  itens.forEach((item) => {
    if (item.isIntersecting) {
      item.target.classList.add("visivel");
      observador.unobserve(item.target);
    }
  });
}, { threshold: 0.15 });
revelar.forEach((el) => observador.observe(el));

const links = document.querySelectorAll("nav a");
const secoes = document.querySelectorAll("section[id]");
const marcarAtivo = new IntersectionObserver((itens) => {
  itens.forEach((item) => {
    if (item.isIntersecting) {
      links.forEach((a) => a.classList.toggle("ativo", a.getAttribute("href") === "#" + item.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
secoes.forEach((s) => marcarAtivo.observe(s));

document.querySelectorAll("[data-detalhes]").forEach((botao) => {
  botao.addEventListener("click", () => document.getElementById(botao.dataset.detalhes).showModal());
});

document.querySelectorAll("dialog.detalhes").forEach((janela) => {
  janela.querySelector(".fechar").addEventListener("click", () => janela.close());
  janela.addEventListener("click", (e) => {
    if (e.target === janela) janela.close();
  });
});

const contar = new IntersectionObserver((itens) => {
  itens.forEach((item) => {
    if (!item.isIntersecting) return;
    const el = item.target;
    const alvo = Number(el.dataset.alvo);
    const inicio = performance.now();
    const passo = (agora) => {
      const t = Math.min((agora - inicio) / 1200, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(passo);
    };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(passo);
    contar.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-alvo]").forEach((el) => contar.observe(el));

document.querySelector(".tema").addEventListener("click", () => {
  const novo = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
  document.documentElement.dataset.tema = novo;
  try { localStorage.setItem("tema", novo); } catch (e) {}
});

const filtros = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".projeto");
filtros.forEach((botao) => {
  botao.addEventListener("click", () => {
    filtros.forEach((b) => b.setAttribute("aria-pressed", b === botao));
    let visiveis = 0;
    projetos.forEach((projeto) => {
      const mostrar = botao.dataset.filtro === "todos" || projeto.dataset.categoria === botao.dataset.filtro;
      projeto.hidden = !mostrar;
      if (mostrar) {
        projeto.classList.toggle("invertido", visiveis % 2 === 1);
        projeto.classList.add("visivel");
        visiveis++;
      }
    });
  });
});

const listaRepos = document.querySelector("[data-repos]");
const tempo = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function haQuanto(data) {
  const dias = Math.round((new Date(data) - Date.now()) / 86400000);
  if (dias > -1) return "hoje";
  if (dias > -30) return tempo.format(dias, "day");
  return tempo.format(Math.round(dias / 30), "month");
}

fetch("https://api.github.com/users/guilhermenunes-jpn/repos?sort=pushed&per_page=10")
  .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
  .then((repos) => {
    const itens = repos.filter((r) => !r.fork && !["site_projeto", "portfolio"].includes(r.name)).slice(0, 5).map((r) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = r.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = r.name.replace(/[_-]/g, " ");
      const info = document.createElement("span");
      info.textContent = [r.language, "atualizado " + haQuanto(r.pushed_at)].filter(Boolean).join(" · ");
      li.append(a, info);
      return li;
    });
    if (itens.length) listaRepos.prepend(...itens);
  })
  .catch(() => {});
