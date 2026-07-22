(function () {
  "use strict";

  const CTA_ID = "ukVisaCta";
  const STYLE_ID = "ukVisaCtaStyles";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${CTA_ID} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        margin: 22px 0 0;
        padding: 23px 25px;
        border: 1px solid #a9dfbd;
        border-radius: 22px;
        background: linear-gradient(135deg, #f1fff6, #dff5e8);
        color: #123c27;
        text-decoration: none;
        box-shadow: 0 14px 34px rgba(19, 126, 67, .13);
        transition: transform .2s ease, box-shadow .2s ease;
      }
      #${CTA_ID}:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 42px rgba(19, 126, 67, .2);
      }
      #${CTA_ID} .uk-cta-main {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      #${CTA_ID} .uk-cta-flag {
        flex: 0 0 auto;
        display: grid;
        place-items: center;
        width: 54px;
        height: 54px;
        border-radius: 17px;
        background: #ffffff;
        font-size: 29px;
        box-shadow: 0 8px 20px rgba(19, 126, 67, .12);
      }
      #${CTA_ID} strong {
        display: block;
        margin-bottom: 5px;
        color: #148044;
        font-size: 23px;
        font-weight: 950;
      }
      #${CTA_ID} small {
        display: block;
        color: #587062;
        font-size: 14px;
        line-height: 1.45;
      }
      #${CTA_ID} .uk-cta-button {
        flex: 0 0 auto;
        padding: 13px 18px;
        border-radius: 14px;
        background: linear-gradient(135deg, #209c59, #11683a);
        color: #ffffff;
        font-weight: 950;
        white-space: nowrap;
        box-shadow: 0 9px 20px rgba(17, 104, 58, .2);
      }
      @media (max-width: 680px) {
        #${CTA_ID} {
          align-items: stretch;
          flex-direction: column;
          padding: 20px;
        }
        #${CTA_ID} strong { font-size: 20px; }
        #${CTA_ID} .uk-cta-button { text-align: center; }
      }
    `;
    document.head.appendChild(style);
  }

  function addUkVisaCta() {
    if (document.getElementById(CTA_ID)) return;

    const homeActions = document.querySelector(".home-cta");
    if (!homeActions || !homeActions.parentNode) return;

    addStyles();

    const link = document.createElement("a");
    link.id = CTA_ID;
    link.href = "./uk-visa.html";
    link.setAttribute("aria-label", "ბრიტანეთის ვიზის შეფასების დაწყება");
    link.innerHTML = `
      <span class="uk-cta-main">
        <span class="uk-cta-flag" aria-hidden="true">🇬🇧</span>
        <span>
          <strong>ბრიტანეთის ვიზა</strong>
          <small>გაიარე 11-კითხვიანი შეფასება და მიიღე მკაცრი სიმულაციური დასკვნა.</small>
        </span>
      </span>
      <span class="uk-cta-button">შეფასების დაწყება →</span>
    `;

    homeActions.parentNode.insertBefore(link, homeActions);
  }

  addUkVisaCta();

  const observer = new MutationObserver(addUkVisaCta);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
