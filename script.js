const product = {
  id: "gl1tch-cyber-lime",
  name: "GL1TCH",
  variant: "Cyber Lime / Tropical",
  price: 2.99
};

const stores = [
  {
    id: 1,
    city: "Paris",
    name: "GL1TCH Store Châtelet",
    address: "12 Rue de Rivoli, 75004 Paris",
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=2.3280%2C48.8500%2C2.3650%2C48.8710&layer=mapnik",
    link:
      "https://www.openstreetmap.org/?mlat=48.8606&mlon=2.3522#map=14/48.8606/2.3522"
  },
  {
    id: 2,
    city: "Lille",
    name: "Gaming Market Lille Centre",
    address: "18 Place du Général de Gaulle, 59800 Lille",
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=3.0400%2C50.6280%2C3.0800%2C50.6500&layer=mapnik",
    link:
      "https://www.openstreetmap.org/?mlat=50.6292&mlon=3.0573#map=14/50.6292/3.0573"
  },
  {
    id: 3,
    city: "Lyon",
    name: "GL1TCH Corner Part-Dieu",
    address: "42 Rue de la République, 69002 Lyon",
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=4.8200%2C45.7480%2C4.8700%2C45.7720&layer=mapnik",
    link:
      "https://www.openstreetmap.org/?mlat=45.7640&mlon=4.8357#map=14/45.7640/4.8357"
  },
  {
    id: 4,
    city: "Marseille",
    name: "Cyber Drinks Marseille",
    address: "25 La Canebière, 13001 Marseille",
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=5.3600%2C43.2880%2C5.3950%2C43.3050&layer=mapnik",
    link:
      "https://www.openstreetmap.org/?mlat=43.2965&mlon=5.3698#map=14/43.2965/5.3698"
  },
  {
    id: 5,
    city: "Bordeaux",
    name: "Focus Drink Hub Bordeaux",
    address: "9 Cours de l'Intendance, 33000 Bordeaux",
    embed:
      "https://www.openstreetmap.org/export/embed.html?bbox=-0.5950%2C44.8330%2C-0.5600%2C44.8500&layer=mapnik",
    link:
      "https://www.openstreetmap.org/?mlat=44.8378&mlon=-0.5792#map=14/44.8378/-0.5792"
  }
];

let cart = [];
let selectedStoreId = stores[0].id;

const dyslexicToggle = document.getElementById("dyslexicToggle");

const openDetailsBtn = document.getElementById("openDetailsBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const detailsModal = document.getElementById("detailsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalOverlay = document.getElementById("closeModalOverlay");

const openStoreBtn = document.getElementById("openStoreBtn");
const storeModal = document.getElementById("storeModal");
const closeStoreBtn = document.getElementById("closeStoreBtn");
const closeStoreOverlay = document.getElementById("closeStoreOverlay");
const citySearch = document.getElementById("citySearch");
const storeResults = document.getElementById("storeResults");
const storeMap = document.getElementById("storeMap");
const storeMapLink = document.getElementById("storeMapLink");

const cartToggle = document.getElementById("cartToggle");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}

function openModal() {
  detailsModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  detailsModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function openStoreModal() {
  storeModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderStores(citySearch.value);
}

function closeStoreModal() {
  storeModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
  document.body.style.overflow = "";
}

function addToCart() {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  renderCart();
  openCart();
}

function increaseQuantity(id) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += 1;
  renderCart();
}

function decreaseQuantity(id) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  const totalItems = getCartCount();
  const totalPrice = getCartTotal();

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart">Ton panier est vide.</p>`;
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => {
    return `
      <div class="cart-item">
        <div class="cart-item-top">
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-sub">${item.variant}</div>
          </div>
          <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>

        <div class="cart-item-actions">
          <div class="qty-box">
            <button class="qty-btn" onclick="decreaseQuantity('${item.id}')">−</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="increaseQuantity('${item.id}')">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem('${item.id}')">Supprimer</button>
        </div>
      </div>
    `;
  }).join("");
}

function updateMap(store) {
  storeMap.src = store.embed;
  storeMapLink.href = store.link;
}

function renderStores(searchValue = "") {
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredStores = stores.filter(store => {
    return (
      store.city.toLowerCase().includes(normalizedSearch) ||
      store.name.toLowerCase().includes(normalizedSearch) ||
      store.address.toLowerCase().includes(normalizedSearch)
    );
  });

  if (filteredStores.length === 0) {
    storeResults.innerHTML = `<p class="store-empty">Aucun point de vente trouvé pour cette recherche.</p>`;
    return;
  }

  if (!filteredStores.some(store => store.id === selectedStoreId)) {
    selectedStoreId = filteredStores[0].id;
  }

  const selectedStore = filteredStores.find(store => store.id === selectedStoreId) || filteredStores[0];
  updateMap(selectedStore);

  storeResults.innerHTML = filteredStores.map(store => {
    const activeClass = store.id === selectedStoreId ? "active" : "";

    return `
      <div class="store-card ${activeClass}">
        <div class="store-city">${store.city}</div>
        <div class="store-name">${store.name}</div>
        <div class="store-address">${store.address}</div>
        <button class="store-select-btn" onclick="selectStore(${store.id}, '${escapeForAttribute(searchValue)}')">
          Voir sur la carte
        </button>
      </div>
    `;
  }).join("");
}

function selectStore(id, currentSearch = "") {
  selectedStoreId = id;
  renderStores(currentSearch);
}

function escapeForAttribute(value) {
  return value.replace(/'/g, "\\'");
}

dyslexicToggle.addEventListener("click", () => {
  document.body.classList.toggle("dyslexic-mode");
});

openDetailsBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
closeModalOverlay.addEventListener("click", closeModal);

openStoreBtn.addEventListener("click", openStoreModal);
closeStoreBtn.addEventListener("click", closeStoreModal);
closeStoreOverlay.addEventListener("click", closeStoreModal);

citySearch.addEventListener("input", (event) => {
  renderStores(event.target.value);
});

buyNowBtn.addEventListener("click", addToCart);

cartToggle.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeStoreModal();
    closeCart();
  }
});

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
window.selectStore = selectStore;

renderCart();
renderStores();