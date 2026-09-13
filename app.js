const wishlist = document.getElementById("wishlist");
const emptyState = document.getElementById("empty-state");
const itemCount = document.getElementById("item-count");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");

function money(value) {
  if (value === "" || value === null || value === undefined) return "";
  return `$${Number(value).toFixed(2)}`;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const items = getItems();
  const filtered = items.filter(item =>
    `${item.name} ${item.description}`.toLowerCase().includes(query)
  );

  itemCount.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;
  wishlist.innerHTML = "";

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";

    const image = item.image
      ? `<img class="card-image" src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}">`
      : `<div class="card-image" aria-hidden="true"></div>`;

    card.innerHTML = `
      ${image}
      <div class="card-body">
        <h3>${escapeHtml(item.name)}</h3>
        ${item.price !== "" && item.price !== undefined ? `<p class="price">${money(item.price)}</p>` : ""}
        <p>${escapeHtml(item.description)}</p>
        <div class="card-actions">
          ${item.url ? `<a class="button secondary" href="${escapeAttr(item.url)}" target="_blank" rel="noopener">View Item</a>` : ""}
          ${
            item.reserved
              ? `<button class="button reserved" disabled>Reserved</button>`
              : `<button class="button primary" data-reserve="${item.id}">I’ll Buy This</button>`
          }
        </div>
      </div>
    `;

    wishlist.appendChild(card);
  });

  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

function reserveItem(id) {
  const items = getItems();
  const item = items.find(x => x.id === id);
  if (!item || item.reserved) return;

  modalContent.innerHTML = `
    <h2>Reserve ${escapeHtml(item.name)}</h2>
    <p>This marks the item as reserved so other people know someone is buying it.</p>
    <label>Your name
      <input id="buyer-name" maxlength="80" placeholder="Your name">
    </label>
    <div class="form-actions">
      <button class="button primary" id="confirm-reserve">Reserve Item</button>
      <button class="button secondary" id="cancel-reserve">Cancel</button>
    </div>
  `;

  modal.classList.remove("hidden");

  document.getElementById("cancel-reserve").onclick = () => modal.classList.add("hidden");
  document.getElementById("confirm-reserve").onclick = () => {
    const name = document.getElementById("buyer-name").value.trim();
    if (!name) return;

    item.reserved = true;
    item.reservedBy = name;
    saveItems(items);
    modal.classList.add("hidden");
    render();
  };
}

wishlist.addEventListener("click", event => {
  const button = event.target.closest("[data-reserve]");
  if (button) reserveItem(button.dataset.reserve);
});

search.addEventListener("input", render);
closeModal.onclick = () => modal.classList.add("hidden");
modal.addEventListener("click", event => {
  if (event.target === modal) modal.classList.add("hidden");
});

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

render();
