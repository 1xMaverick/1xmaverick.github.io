const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme || "dark";
root.dataset.theme = initialTheme;
updateThemeLabel();

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("portfolio-theme", next);
  updateThemeLabel();
});

function updateThemeLabel() {
  themeLabel.textContent = root.dataset.theme === "dark" ? "LIGHT" : "DARK";
}

/* Starfield: intentionally subtle, inspired by the reference's sparse editorial sky. */
let stars = [];
let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(55, Math.floor((width * height) / 15000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.15 + 0.15,
    a: Math.random() * 0.7 + 0.12,
    speed: Math.random() * 0.11 + 0.015
  }));
}

function drawStars(time = 0) {
  ctx.clearRect(0, 0, width, height);

  const light = root.dataset.theme === "light";
  for (const star of stars) {
    const twinkle = Math.sin(time * 0.0007 * star.speed * 20 + star.x) * 0.14;
    const alpha = Math.max(0.03, star.a + twinkle);

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = light
      ? `rgba(35, 48, 68, ${alpha * 0.22})`
      : `rgba(215, 226, 247, ${alpha})`;
    ctx.fill();

    star.y += star.speed;
    if (star.y > height + 2) {
      star.y = -2;
      star.x = Math.random() * width;
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawStars);

/* Small reveal effect — restrained, not a template-y scroll animation. */
const revealTargets = document.querySelectorAll(
  ".section-content, .timeline-item, .skill-block, .project, .signal-card, .certificate-row > div"
);

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 700,
        easing: "cubic-bezier(.2,.7,.2,1)",
        fill: "forwards"
      }
    );
    obs.unobserve(entry.target);
  });
}, { threshold: 0.08 });

revealTargets.forEach((el) => {
  el.style.opacity = "0";
  observer.observe(el);
});
