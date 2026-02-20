export function confirm(message, title) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";

    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-title">${title || "Confirm"}</div>
        <div class="confirm-message">${message}</div>
        <div class="confirm-actions">
          <button class="confirm-yes">Yes</button>
          <button class="confirm-no">No</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      .confirm-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.35);
        z-index: 10000;
      }

      .confirm-box {
        background: #fff;
        padding: 18px 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 420px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      }

      .confirm-title {
        font-weight: 700;
        margin-bottom: 8px;
      }

      .confirm-message {
        margin-bottom: 14px;
        color: #111827;
      }

      .confirm-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .confirm-actions button {
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        font-weight: 600;
      }

      .confirm-yes {
        background: #04a129;
        color: white;
      }

      .confirm-no {
        background: #e5e7eb;
        color: #111827;
      }
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(style);

    const yesBtn = overlay.querySelector(".confirm-yes");
    const noBtn = overlay.querySelector(".confirm-no");

    const cleanup = (value) => {
      try {
        document.body.removeChild(overlay);
        document.body.removeChild(style);
      } catch (e) {}
      resolve(value);
    };

    yesBtn.focus();

    yesBtn.addEventListener("click", () => cleanup(true));
    noBtn.addEventListener("click", () => cleanup(false));

    // allow Esc to cancel
    const onKey = (e) => {
      if (e.key === "Escape") {
        window.removeEventListener("keydown", onKey);
        cleanup(false);
      }
    };

    window.addEventListener("keydown", onKey);
  });
}
