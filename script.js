const roles = [
  "CyberSecurity Student",
  "CTF Player",
  "Bug Hunter",
  "Cyb3r S3cur1ty Stud3nt",
  "CTF Pl4y3r",
  "Bug Hxnt3r"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const dynamicText = document.getElementById("dynamic-text");

function typeEffect() {
  const current = roles[roleIndex];

  if (!deleting) {
    dynamicText.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      setTimeout(() => deleting = true, 1200);
    }
  } else {
    dynamicText.textContent = current.slice(0, charIndex--);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeEffect, deleting ? 60 : 100);
}

typeEffect();
