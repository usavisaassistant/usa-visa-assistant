(() => {
  "use strict";

  function selectedCityName() {
    const citySelect = document.querySelector(".fields.four select");
    if (!citySelect || citySelect.value === "auto") {
      return (
        document.querySelector(".result-hero h2")?.childNodes?.[0]?.textContent?.trim() ||
        document.querySelector(".route-end b")?.textContent?.trim() ||
        "New York"
      );
    }

    return citySelect.options[citySelect.selectedIndex]?.text
      .split(",")[0]
      .trim();
  }

  function updateBudgetFeedback() {
    const summary = document.querySelector(".budget-summary");
    const tier = document.querySelector(".tier-badge");
    if (!summary || !tier) return;

    const message = summary.querySelector("span:last-child");
    if (!message) return;

    const city = selectedCityName();
    let feedback;

    if (tier.classList.contains("premium")) {
      feedback = `${city}-ისთვის ძალიან კარგი პრემიუმ ბიუჯეტია — მაღალი კლასის სასტუმრო, უკეთესი ბილეთები და პრემიუმ საღამოები.`;
    } else if (tier.classList.contains("comfort")) {
      feedback = `${city}-ისთვის კარგი ბიუჯეტია — კარგი სასტუმრო, მთავარი ფასიანი გამოცდილებები და თავისუფალი ბიუჯეტი.`;
    } else {
      feedback = `${city}-ისთვის ეკონომიური ბიუჯეტია — უფასო სანახაობები, გონივრული გადაადგილება და შერჩეული ფასიანი აქტივობები.`;
    }

    if (message.textContent !== feedback) message.textContent = feedback;
  }

  window.addEventListener("load", () => {
    document.addEventListener("input", updateBudgetFeedback);
    document.addEventListener("change", updateBudgetFeedback);

    const observer = new MutationObserver(updateBudgetFeedback);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    window.setTimeout(updateBudgetFeedback, 300);
  });
})();
