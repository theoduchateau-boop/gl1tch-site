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
    lat: 48.8606,
    lon: 2.3522
  },
  {
    id: 2,
    city: "Lille",
    name: "Gaming Market Lille Centre",
    address: "18 Place du Général de Gaulle, 59800 Lille",
    lat: 50.6369,
    lon: 3.0637
  },
  {
    id: 3,
    city: "Lyon",
    name: "GL1TCH Corner Part-Dieu",
    address: "42 Rue de la République, 69002 Lyon",
    lat: 45.764,
    lon: 4.8357
  },
  {
    id: 4,
    city: "Marseille",
    name: "Cyber Drinks Marseille",
    address: "25 La Canebière, 13001 Marseille",
    lat: 43.2965,
    lon: 5.3698
  },
  {
    id: 5,
    city: "Bordeaux",
    name: "Focus Drink Hub Bordeaux",
    address: "9 Cours de l'Intendance, 33000 Bordeaux",
    lat: 44.8378,
    lon: -0.5792
  }
];

const themeContent = {
  gaming: {
    buttonLabel: "Mode nature",
    image: "hero-bg.png",
    eyebrow: "ENERGY / CYBER / PREMIUM",
    systemLine: "SYSTEM ONLINE // GL1TCH MODE ACTIVATED",
    subtitle: "Boost plus propre. Focus plus stable. Style plus premium.",
    focus: "Stable",
    taste: "Cyber Lime"
  },
  nature: {
    buttonLabel: "Mode gaming",
    image: "hero-bg-nature.png",
    eyebrow: "NATURE / CLEAN / FRESH",
    systemLine: "NATURAL FLOW // GL1TCH GREEN MODE",
    subtitle: "Fraîcheur naturelle. Énergie maîtrisée. Sensation plus pure.",
    focus: "Équilibré",
    taste: "Fresh Lime"
  }
};

const voteStorageKey = "gl1tch-vote-results";
const voteUserChoiceKey = "gl1tch-user-vote";

const defaultVoteResults = {
  "neon-berry": 18,
  "arctic-mint": 14,
  "solar-mango": 11,
  "forest-lime": 16
};

let cart = [];
let selectedStoreId = stores[0].id;
let currentTheme = localStorage.getItem("gl1tch-theme") || "gaming";
let voteResults = loadVoteResults();
let userVote = localStorage.getItem(voteUserChoiceKey);

const themeToggle = document.getElementById("themeToggle");
const heroThemeImage = document.getElementById("heroThemeImage");
const heroEyebrow = document.getElementById("heroEyebrow");
const heroSystemLine = document.getElementById("heroSystemLine");
const heroSubtitle = document.getElementById("heroSubtitle");
const featureFocus = document.getElementById("featureFocus");
const featureTaste = document.getElementById("featureTaste");

const dyslexicToggle = document.getElementById("dyslexicToggle");

const openDetailsBtn = document.getElementById("openDetailsBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const detailsModal = document.getElementById("detailsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalOverlay = document.getElementById("closeModalOverlay");

const openHealthBtn = document.getElementById("openHealthBtn");
const healthModal = document.getElementById("healthModal");
const closeHealthBtn = document.getElementById("closeHealthBtn");
const closeHealthOverlay = document.getElementById("closeHealthOverlay");

const openStoreBtn = document.getElementById("openStoreBtn");
const storeModal = document.getElementById("storeModal");
const closeStoreBtn = document.getElementById("closeStoreBtn");
const closeStoreOverlay = document.getElementById("closeStoreOverlay");
const citySearch = document.getElementById("citySearch");
const storeResults = document.getElementById("storeResults");
const storeMap = document.getElementById("storeMap");
const storeMapLink = document.getElementById("storeMapLink");

const userAddressInput = document.getElementById("userAddress");
const routeBtn = document.getElementById("routeBtn");
const routeStatus = document.getElementById("routeStatus");

const openVoteBtn = document.getElementById("openVoteBtn");
const voteModal = document.getElementById("voteModal");
const closeVoteBtn = document.getElementById("closeVoteBtn");
const closeVoteOverlay = document.getElementById("closeVoteOverlay");
const voteGrid = document.getElementById("voteGrid");
const voteMessage = document.getElementById("voteMessage");

const cartToggle = document.getElementById("cartToggle");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function applyTheme(theme) {
  const selectedTheme = themeContent[theme];
  if (!selectedTheme) return;

  currentTheme = theme;

  document.body.classList.toggle("theme-nature", theme === "nature");
  themeToggle.textContent = selectedTheme.buttonLabel;
  heroThemeImage.src = selectedTheme.image;
  heroEyebrow.textContent = selectedTheme.eyebrow;
  heroSystemLine.textContent = selectedTheme.systemLine;
  heroSubtitle.textContent = selectedTheme.subtitle;
  featureFocus.textContent = selectedTheme.focus;
  featureTaste.textContent = selectedTheme.taste;

  localStorage.setItem("gl1tch-theme", theme);
}

function toggleTheme() {
  const nextTheme = currentTheme === "gaming" ? "nature" : "gaming";
  applyTheme(nextTheme);
}

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}

function setBodyLock(isLocked) {
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function anyModalOpen() {
  return !detailsModal.classList.contains("hidden") ||
    !healthModal.classList.contains("hidden") ||
    !storeModal.classList.contains("hidden") ||
    !voteModal.classList.contains("hidden");
}

function updateBodyLock() {
  const shouldLock = anyModalOpen() || cartPanel.classList.contains("open");
  setBodyLock(shouldLock);
}

function openModal() {
  detailsModal.classList.remove("hidden");
  updateBodyLock();
}

function closeModal() {
  detailsModal.classList.add("hidden");
  updateBodyLock();
}

function openHealthModal() {
  healthModal.classList.remove("hidden");
  updateBodyLock();
}

function closeHealthModal() {
  healthModal.classList.add("hidden");
  updateBodyLock();
}

function openStoreModal() {
  storeModal.classList.remove("hidden");
  updateBodyLock();
  renderStores(citySearch.value);
}

function closeStoreModal() {
  storeModal.classList.add("hidden");
  routeStatus.textContent = "";
  updateBodyLock();
}

function openVoteModal() {
  voteModal.classList.remove("hidden");
  renderVoteResults(true);
  updateBodyLock();
}

function closeVoteModal() {
  voteModal.classList.add("hidden");
  updateBodyLock();
}

function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
  updateBodyLock();
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
  updateBodyLock();
}

function addToCart() {
  const existingItem = cart.find((item) => item.id === product.id);

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
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity += 1;
  renderCart();
}

function decreaseQuantity(id) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
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

  cartItemsContainer.innerHTML = cart.map((item) => {
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

function getSelectedStore() {
  return stores.find((store) => store.id === selectedStoreId) || stores[0];
}

function buildEmbedMapUrl(lat, lon, zoomDelta = 0.08) {
  const left = lon - zoomDelta;
  const right = lon + zoomDelta;
  const bottom = lat - zoomDelta;
  const top = lat + zoomDelta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function buildOpenStreetMapLink(lat, lon) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;
}

function updateMap(store) {
  storeMap.src = buildEmbedMapUrl(store.lat, store.lon, 0.06);
  storeMapLink.href = buildOpenStreetMapLink(store.lat, store.lon);
}

function renderStores(searchValue = "") {
  const normalizedSearch = searchValue.trim().toLowerCase();

  const filteredStores = stores.filter((store) => {
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

  if (!filteredStores.some((store) => store.id === selectedStoreId)) {
    selectedStoreId = filteredStores[0].id;
  }

  const selectedStore = filteredStores.find((store) => store.id === selectedStoreId) || filteredStores[0];
  updateMap(selectedStore);

  storeResults.innerHTML = filteredStores.map((store) => {
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
  routeStatus.textContent = "";
}

function escapeForAttribute(value) {
  return value.replace(/'/g, "\\'");
}

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Erreur réseau");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Adresse introuvable");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

async function calculateRoute() {
  const address = userAddressInput.value.trim();
  const store = getSelectedStore();

  if (!address) {
    routeStatus.textContent = "Entre ton adresse pour calculer l’itinéraire.";
    return;
  }

  routeStatus.textContent = "Recherche de l’adresse...";

  try {
    const userLocation = await geocodeAddress(address);

    const directionsUrl =
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car` +
      `&route=${userLocation.lat}%2C${userLocation.lon}%3B${store.lat}%2C${store.lon}`;

    routeStatus.textContent = `Itinéraire prêt vers ${store.name}.`;
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    routeStatus.textContent = "Impossible de trouver cette adresse. Essaie avec une adresse plus précise.";
  }
}

/* Vote system */
function loadVoteResults() {
  const savedResults = localStorage.getItem(voteStorageKey);

  if (!savedResults) {
    localStorage.setItem(voteStorageKey, JSON.stringify(defaultVoteResults));
    return { ...defaultVoteResults };
  }

  try {
    const parsed = JSON.parse(savedResults);
    return {
      "neon-berry": Number(parsed["neon-berry"]) || 0,
      "arctic-mint": Number(parsed["arctic-mint"]) || 0,
      "solar-mango": Number(parsed["solar-mango"]) || 0,
      "forest-lime": Number(parsed["forest-lime"]) || 0
    };
  } catch (error) {
    localStorage.setItem(voteStorageKey, JSON.stringify(defaultVoteResults));
    return { ...defaultVoteResults };
  }
}

function saveVoteResults() {
  localStorage.setItem(voteStorageKey, JSON.stringify(voteResults));
}

function getTotalVotes() {
  return Object.values(voteResults).reduce((sum, value) => sum + value, 0);
}

function getVoteLabel(count) {
  return count > 1 ? `${count} votes` : `${count} vote`;
}

function getWinningFlavor() {
  const entries = Object.entries(voteResults);
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0] ? entries[0][0] : null;
}

function prettyFlavorName(flavor) {
  const labels = {
    "neon-berry": "Neon Berry",
    "arctic-mint": "Arctic Mint",
    "solar-mango": "Solar Mango",
    "forest-lime": "Forest Lime"
  };

  return labels[flavor] || flavor;
}

function updateVoteMessage() {
  if (userVote) {
    voteMessage.textContent = `Ton vote a bien été enregistré pour ${prettyFlavorName(userVote)}. Les résultats restent visibles mais tu ne peux pas voter une deuxième fois.`;
    return;
  }

  const winner = getWinningFlavor();
  const totalVotes = getTotalVotes();

  if (!winner || totalVotes === 0) {
    voteMessage.textContent = "Choisis ton goût préféré et regarde les résultats s’animer en direct.";
    return;
  }

  voteMessage.textContent = `${prettyFlavorName(winner)} est actuellement en tête. ${totalVotes} votes enregistrés sur ce navigateur partagé.`;
}

function renderVoteResults(animate = false) {
  const cards = Array.from(voteGrid.querySelectorAll(".vote-card"));
  const totalVotes = getTotalVotes();

  cards.forEach((card) => {
    const flavor = card.dataset.flavor;
    const count = voteResults[flavor] || 0;
    const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

    const percentNode = card.querySelector(".vote-percent");
    const countNode = card.querySelector(".vote-count");
    const fillNode = card.querySelector(".vote-bar-fill");
    const buttonNode = card.querySelector(".vote-btn");
    const choiceBadge = card.querySelector(".vote-choice-badge");

    percentNode.textContent = `${percent}%`;
    countNode.textContent = getVoteLabel(count);

    if (animate) {
      fillNode.style.width = "0%";
      requestAnimationFrame(() => {
        setTimeout(() => {
          fillNode.style.width = `${percent}%`;
        }, 60);
      });
    } else {
      fillNode.style.width = `${percent}%`;
    }

    const isUserChoice = userVote === flavor;

    card.classList.toggle("selected", isUserChoice);
    choiceBadge.classList.toggle("hidden", !isUserChoice);

    if (userVote) {
      buttonNode.disabled = true;
      buttonNode.textContent = isUserChoice ? "Vote enregistré" : "Vote terminé";
    } else {
      buttonNode.disabled = false;
      buttonNode.textContent = "Voter";
    }
  });

  updateVoteMessage();
}

function submitVote(flavor) {
  if (userVote) {
    renderVoteResults(true);
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(voteResults, flavor)) {
    return;
  }

  voteResults[flavor] += 1;
  userVote = flavor;

  localStorage.setItem(voteUserChoiceKey, flavor);
  saveVoteResults();
  renderVoteResults(true);
}

function bindVoteButtons() {
  const cards = Array.from(voteGrid.querySelectorAll(".vote-card"));

  cards.forEach((card) => {
    const button = card.querySelector(".vote-btn");
    const flavor = card.dataset.flavor;

    button.addEventListener("click", () => {
      submitVote(flavor);
    });
  });
}

themeToggle.addEventListener("click", toggleTheme);

dyslexicToggle.addEventListener("click", () => {
  document.body.classList.toggle("dyslexic-mode");
});

openDetailsBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
closeModalOverlay.addEventListener("click", closeModal);

openHealthBtn.addEventListener("click", openHealthModal);
closeHealthBtn.addEventListener("click", closeHealthModal);
closeHealthOverlay.addEventListener("click", closeHealthModal);

openStoreBtn.addEventListener("click", openStoreModal);
closeStoreBtn.addEventListener("click", closeStoreModal);
closeStoreOverlay.addEventListener("click", closeStoreModal);

openVoteBtn.addEventListener("click", openVoteModal);
closeVoteBtn.addEventListener("click", closeVoteModal);
closeVoteOverlay.addEventListener("click", closeVoteModal);

citySearch.addEventListener("input", (event) => {
  renderStores(event.target.value);
});

routeBtn.addEventListener("click", calculateRoute);

userAddressInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    calculateRoute();
  }
});

buyNowBtn.addEventListener("click", addToCart);

cartToggle.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeHealthModal();
    closeStoreModal();
    closeVoteModal();
    closeCart();
  }
});

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;
window.selectStore = selectStore;

applyTheme(currentTheme);
renderCart();
renderStores();
bindVoteButtons();
renderVoteResults();