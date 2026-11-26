const revelar = document.querySelectorAll(".titulo, .subtitulo, .sobre > div, .projeto, .linha-tempo > li, .contato-card");
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
