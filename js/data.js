const DEFAULT_ITEMS = [
  {
    id: "1",
    name: "Example Wishlist Item",
    description: "Replace this example with something you actually want.",
    price: 50,
    image: "",
    url: "",
    reserved: false,
    reservedBy: ""
  }
];

function getItems() {
  const saved = localStorage.getItem("wishlistItems");
  if (!saved) {
    localStorage.setItem("wishlistItems", JSON.stringify(DEFAULT_ITEMS));
    return [...DEFAULT_ITEMS];
  }
  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem("wishlistItems", JSON.stringify(DEFAULT_ITEMS));
    return [...DEFAULT_ITEMS];
  }
}

function saveItems(items) {
  localStorage.setItem("wishlistItems", JSON.stringify(items));
}
