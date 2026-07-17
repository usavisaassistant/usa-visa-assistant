(() => {
  const GAME_URL = "interview-game.html";
  const CTA_ID = "interviewGameHomeCta";

  function injectStyles() {
    if (document.getElementById("interviewGameHomeStyles")) return;

    const style = document.createElement("style");
    style.id = "interviewGameHomeStyles";
    style.textContent = `
      .interview-game-home-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        margin: 24px 0 18px;
        padding: 17px 22px;
        border: 2px solid #b9152f;
        border-radius: 18px;
        color: #ffffff !important;
        background: linear-gradient(135deg, #e12643 0%, #b9152f 100%);
        box-shadow: 0 14px 28px rgba(185, 21, 47, 0.24);
        text-align: center;
        text-decoration: none !important;
        font-size: clamp(17px, 2vw, 22px);
        font-weight: 950;
        line-height: 1.25;
        transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
        animation: interviewCtaPulse 2.6s ease-in-out infinite;
      }

      .interview-game-home-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 34px rgba(185, 21, 47, 0.32);
        filter: brightness(1.04);
      }

      .interview-game-home-cta:active {
        transform: translateY(0) scale(.99);
      }

      .interview-game-home-cta .cta-icon {
        font-size: 25px;
        animation: interviewMicMove 1.8s ease-in-out infinite;
      }

      @keyframes interviewCtaPulse {
        0%, 100% { box-shadow: 0 14px 28px rgba(185, 21, 47, 0.22); }
        50% { box-shadow: 0 17px 38px rgba(225, 38, 67, 0.38); }
      }

      @keyframes interviewMicMove {
        0%, 100% { transform: rotate(-4deg); }
        50% { transform: rotate(5deg) scale(1.08); }
      }

      @media (max-width: 600px) {
        .interview-game-home-cta {
          margin: 19px 0 15px;
          padding: 15px 14px;
          border-radius: 15px;
          font-size: 17px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .interview-game-home-cta,
        .interview-game-home-cta .cta-icon {
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addHomeCta() {
    injectStyles();

    const homeCta = document.querySelector("#app .home-cta");
    if (!homeCta || document.getElementById(CTA_ID)) return;

    const link = document.createElement("a");
    link.id = CTA_ID;
    link.className = "interview-game-home-cta";
    link.href = GAME_URL;
    link.setAttribute("aria-label", "გაიარე გასაუბრება კონსულთან დღესვე");
    link.innerHTML = `
      <span class="cta-icon" aria-hidden="true">🎤</span>
      <span>გაიარე გასაუბრება კონსულთან დღესვე!</span>
    `;

    homeCta.parentNode.insertBefore(link, homeCta);
  }

  // ძველი ინტერვიუს ბარათიც პირდაპირ ახალ თამაშზე გადადის.
  document.addEventListener("click", (event) => {
    const interviewControl = event.target.closest('[data-action="interview"], #openInterviewBtn');
    if (!interviewControl) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href = GAME_URL;
  }, true);

  function initialize() {
    addHomeCta();

    const app = document.getElementById("app");
    if (!app) return;

    const observer = new MutationObserver(addHomeCta);
    observer.observe(app, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
