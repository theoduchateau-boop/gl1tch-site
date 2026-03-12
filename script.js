const product = {
  id: "gl1tch-cyber-lime",
  name: "GL1TCH",
  variant: "Cyber Lime / Tropical",
  price: 2.99
};

let cart = [];

const dyslexicToggle = document.getElementById("dyslexicToggle");

const openDetailsBtn = document.getElementById("openDetailsBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const detailsModal = document.getElementById("detailsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalOverlay = document.getElementById("closeModalOverlay");

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

dyslexicToggle.addEventListener("click", () => {
  document.body.classList.toggle("dyslexic-mode");
});

openDetailsBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
closeModalOverlay.addEventListener("click", closeModal);

buyNowBtn.addEventListener("click", addToCart);

cartToggle.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeCart();
  }
});

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeItem = removeItem;

renderCart();