const form = document.getElementById("item-form");
const editId = document.getElementById("edit-id");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const urlInput = document.getElementById("url");
const adminList = document.getElementById("admin-list");
const adminCount = document.getElementById("admin-count");
const cancelEdit = document.getElementById("cancel-edit");
const clearAll = document.getElementById("clear-all");

function renderAdmin() {
  const items = getItems();
  adminCount.textContent = `${items.length} ${items.length === 1 ? "item" : "items"}`;

  adminList.innerHTML = items.length
    ? items.map(item => `
      <div class="admin-item">
        <div>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${item.reserved ? `Reserved by ${escapeHtml(item.reservedBy)}` : "Available"}</p>
        </div>
        <div class="admin-item-actions">
          <button class="button secondary" data-edit="${item.id}">Edit</button>
          <button class="button danger" data-delete="${item.id}">Delete</button>
        </div>
      </div>
    `).join("")
    : `<p>No wishlist items yet.</p>`;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const items = getItems();
  const existingId = editId.value;

  const itemData = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: priceInput.value === "" ? "" : Number(priceInput.value),
    image: imageInput.value.trim(),
    url: urlInput.value.trim()
  };

  if (existingId) {
    const item = items.find(x => x.id === existingId);
    if (item) Object.assign(item, itemData);
  } else {
    items.push({
      id: crypto.randomUUID(),
      ...itemData,
      reserved: false,
      reservedBy: ""
    });
  }

  saveItems(items);
  resetForm();
  renderAdmin();
});

adminList.addEventListener("click", event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) startEdit(editButton.dataset.edit);

  if (deleteButton) {
    const items = getItems();
    const next = items.filter(item => item.id !== deleteButton.dataset.delete);
    saveItems(next);
    renderAdmin();
  }
});

function startEdit(id) {
  const item = getItems().find(x => x.id === id);
  if (!item) return;

  editId.value = item.id;
  nameInput.value = item.name;
  descriptionInput.value = item.description;
  priceInput.value = item.price;
  imageInput.value = item.image;
  urlInput.value = item.url;
  cancelEdit.classList.remove("hidden");
  nameInput.focus();
}

function resetForm() {
  form.reset();
  editId.value = "";
  cancelEdit.classList.add("hidden");
}

cancelEdit.onclick = resetForm;

clearAll.onclick = () => {
  if (!confirm("Delete every wishlist item?")) return;
  saveItems([]);
  resetForm();
  renderAdmin();
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

renderAdmin();
