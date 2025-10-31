let chocolateBrands = [
    {
        name: "Cicek",
        image: "/images/cicek.webp",
        products: [ ]
    },
    {
        name: "coffee",
        image:"images/coffee.jpg",
        products: [
            { id: 4, name: "Diamond", price: 9.99, description: "Medium roast ", image:"images/diamond--new.jpg" },
            { id: 5, name: "Bahyia", price: 9.99, description: "Extra roast ", image:"images/Bahyia-new.jpg" },
            { id: 6, name: "Hararry", price: 14.99, description: "Light roast ", image:"images/Hararry-new.jpg" },
            { id: 20, name: "Santana", price: 12.99, description: "Medium roast extra cardamom ", image:"images/Santana--new.jpg" },
            { id: 21, name: "Serrado", price: 8.99, description: "Medium roast light cardamom ", image:"images/Serrado-new.jpg" }
        ]
    },
    {
        name: "Domo",
        image:"images/Domo.jpg",
        products: [
            { id: 7, name: "Cherry", price: 4.49, description: "Beef jelly 25g ", image:"images/Domo +bak11.png"},
            { id: 8, name: "Mixed cherries ", price: 4.49, description: "Beef jelly 25g", image:"images/Domo 2+bak.png" },
            { id: 9, name: "Strawberry  ", price: 4.49, description: "Beef jelly 25g ", image:"images/Domo 3+bak.png"}
        ]
    },
    {
        name: "fontaine santee",
        image:"images/fontaine santee.png",
        products: [ ]
    },
    {
        name: "Foster Clark",
        image:"images/Foster Clark.png", 
        products: [ ]
    },
    {
        name: "Gardenia",
        image:"images/Gardenia.png", 
        products: [ ]
    },
    {
        name: "others",
        image:"images/others.png", 
        products: [ ]
    },
    {
        name: "Mahmoud",
        image:"images/Mahmoud.png", 
        products: [ ]
    },
    {
        name: "Nestle",
        image:"images/Nestle.webp", 
        products: [ ]
    },
    {
        name: "Nido",
        image:"images/Nido.png", 
        products: [ ]
    },
    {
        name: "Oncu",
        image:"images/Oncu.png", 
        products: [ ]
    },
    {
        name: "soda drinks",
        image:"images/soda drinks logo.jpg", 
        products: [ ]
    }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;
let messages = JSON.parse(localStorage.getItem('messages')) || [];

function initializeApp() {
    displayBrands();
    updateCartCount();
    loadCurrentUser();
    updateAuthUI();
    setupSearchFunctionality();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        setupPurchaseButton();
    } else if (window.location.pathname.includes('add-product.html')) {
        setupAddProductForm();
    } else if (window.location.pathname.includes('contact.html')) {
        setupContactForm();
    } else if (window.location.pathname.includes('inbox-invoice.html')) {
        displayInboxInvoice();
    } else if (window.location.pathname.includes('order-history.html')) {
        displayOrderHistory();
    }
    setupEventListeners();
}

function setupEventListeners() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const userTypeSelect = document.getElementById('userType');
    const adminPasswordField = document.getElementById('adminPassword');
    if (userTypeSelect && adminPasswordField) {
        userTypeSelect.addEventListener('change', function() {
            adminPasswordField.style.display = this.value === 'admin' ? 'block' : 'none';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const userType = document.getElementById('userType').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.username === username)) {
        showPopup('Username already exists');
        return;
    }

    let finalUserType = 'user';

    if (userType === 'admin') {
        if (adminPassword !== '00100') {
            showPopup('Incorrect admin password. Please try again or register as a user.');
            return;
        }
        finalUserType = 'admin';
    }

    const newUser = { username, password, userType: finalUserType };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showPopup('Registration successful! Please log in.', () => {
        window.location.href = 'login.html';
    });
}

function loadCurrentUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showPopup('Login successful!', () => {
            window.location.href = 'index.html';
        });
    } else {
        showPopup('Invalid username or password');
    }
}

function handleLogout(event) {
    event.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    window.location.href = 'index.html';
}

function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutLink = document.getElementById('logoutLink');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const inboxInvoiceLink = document.getElementById('inboxInvoiceLink');
    const contactLink = document.querySelector('a[href="contact.html"]');

    if (currentUser) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${currentUser.username}`;
        if (inboxInvoiceLink) {
            if (currentUser.userType === 'admin') {
                inboxInvoiceLink.style.display = 'inline';
            } else {
                inboxInvoiceLink.style.display = 'none';
            }
        }
        if (contactLink) {
            if (currentUser.userType === 'admin') {
                contactLink.style.display = 'none';
            } else {
                contactLink.style.display = 'inline';
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline';
        if (registerLink) registerLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (welcomeMessage) welcomeMessage.textContent = '';
        if (inboxInvoiceLink) inboxInvoiceLink.style.display = 'none';
        if (contactLink) contactLink.style.display = 'inline';
    }

    const navLinks = document.querySelector('.nav-links');
    let addProductLink = document.getElementById('addProductLink');
    
    if (!addProductLink && navLinks) {
        addProductLink = document.createElement('a');
        addProductLink.id = 'addProductLink';
        addProductLink.href = 'add-product.html';
        addProductLink.textContent = 'Add Product';
        addProductLink.className = 'button';
        navLinks.appendChild(addProductLink);
    }

    if (addProductLink) {
        if (currentUser && currentUser.userType === 'admin') {
            addProductLink.style.display = 'inline';
        } else {
            addProductLink.style.display = 'none';
        }
    }
}

function showPopup(message, callback) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button>OK</button>
        </div>
    `;
    document.body.appendChild(popup);

    const okButton = popup.querySelector('button');
    okButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        if (callback) callback();
    });
}


function showPopup(message, callback) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button>OK</button>
        </div>
    `;
    document.body.appendChild(popup);

    const okButton = popup.querySelector('button');
    okButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        if (callback) callback();
    });
}

function displayBrands() {
    const storedBrands = localStorage.getItem('chocolateBrands');
    if (storedBrands) {
        chocolateBrands = JSON.parse(storedBrands);
    }

    const brandList = document.getElementById('brand-list');
    if (brandList) {
        brandList.innerHTML = '';
        chocolateBrands.forEach(brand => {
            const brandElement = document.createElement('div');
            brandElement.className = 'brand';
            brandElement.innerHTML = `
                <img src="${brand.image || 'images/default-brand.jpg'}" alt="${brand.name}" class="brand-image" onerror="this.src='images/default-brand.jpg'">
                <h3>${brand.name}</h3>
            `;
            brandElement.addEventListener('click', () => displayProducts(brand));
            brandList.appendChild(brandElement);
        });
    }
}
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        showPopup('Please enter a search term.');
        return;
    }

    const allProducts = chocolateBrands.flatMap(brand => brand.products);
    const foundProduct = allProducts.find(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );

    if (foundProduct) {
        const brand = chocolateBrands.find(brand => 
            brand.products.some(product => product.id === foundProduct.id)
        );
        displayProducts(brand);
        highlightProduct(foundProduct.id);
    } else {
        showPopup('No products found matching your search.');
    }
}

function highlightProduct(productId) {
    const productElements = document.querySelectorAll('.product');
    productElements.forEach(element => {
        if (element.querySelector(`button[onclick="addToCart(${productId})"]`)) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.boxShadow = '0 0 10px #3c2a21';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 3000);
        }
    });
}

function displayProducts(brand) {
    const brandsSection = document.getElementById('brands');
    const productsSection = document.getElementById('products');
    const brandTitle = document.getElementById('brand-title');
    const productList = document.getElementById('product-list');
    const backButton = document.getElementById('back-button');
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }  

    if (brandsSection && productsSection && brandTitle && productList && backButton) {
        brandsSection.style.display = 'none';
        productsSection.style.display = 'block';
        brandTitle.textContent = brand.name;

        productList.innerHTML = '';
        brand.products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.image || 'images/default-product.jpg'}" alt="${product.name}" class="product-image" onerror="this.src='images/default-product.jpg'">
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productElement);
        });

        backButton.addEventListener('click', () => {
            brandsSection.style.display = 'block';
            productsSection.style.display = 'none';
        });
    }
}

function addToCart(productId) {
    const product = chocolateBrands.flatMap(brand => brand.products).find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        showPopup('Product added to cart!');
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
        displayCart();
    }
}

function updateCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            showPopup('Cart storage quota exceeded. Please remove some items from your cart.');
        } else {
            showPopup('An error occurred while updating the cart.');
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    if (cartItems && totalAmount) {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                `;
                cartItems.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        totalAmount.textContent = total.toFixed(2);
    }
}

function setupAddProductForm() {
    const brandSelect = document.getElementById('productBrand');
    if (brandSelect) {
        chocolateBrands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.name;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
    }
}

async function handleAddProduct(event) {
    event.preventDefault();
    if (!currentUser || currentUser.userType !== 'admin') {
        showPopup('Only administrators can add products.');
        return;
    }

    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const brandName = document.getElementById('productBrand').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (!imageFile) {
        showPopup('Please select an image for the product.');
        return;
    }

    try {
        const compressedImage = await compressImage(imageFile, 300, 300, 0.7);
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            const brand = chocolateBrands.find(b => b.name === brandName);
            if (brand) {
                const newProductId = generateUniqueId();
                const newProduct = { id: newProductId, name, price, description, image: imageData };
                brand.products.push(newProduct);
                
                try {
                    localStorage.setItem('chocolateBrands', JSON.stringify(chocolateBrands));
                    showPopup('Product added successfully!', () => {
                        window.location.href = 'index.html';
                    });
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        showPopup('Storage quota exceeded. Please delete some products or clear your browser data.');
                    } else {
                        showPopup('An error occurred while saving the product.');
                    }
                }
            } else {
                showPopup('Error: Brand not found.');
            }
        };
        reader.readAsDataURL(compressedImage);
    } catch (error) {
        showPopup('Error processing image. Please try again.');
    }
}

function generateUniqueId() {
    return Math.max(...chocolateBrands.flatMap(brand => brand.products.map(product => product.id)), 0) + 1;
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const newMessage = { name, email, message, date: new Date().toISOString() };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    
    showPopup('Message sent successfully!', () => {document.getElementById('contactForm').reset();
    });
}

function displayInboxInvoice() {
    if (!currentUser || currentUser.userType !== 'admin') {
        showPopup('Only administrators can access this page.', () => {
            window.location.href = 'index.html';
        });
        return;
    }

    const orderHistory = document.getElementById('orderHistory');
    const contactMessages = document.getElementById('contactMessages');

    if (orderHistory && contactMessages) {
        // Display order history
        orderHistory.innerHTML = '';
        messages.filter(msg => msg.name === 'System').forEach((order, index) => {
            const orderElement = document.createElement('div');
            orderElement.className = 'message';
            orderElement.innerHTML = `
                <h4>Order #${index + 1}</h4>
                <p>${order.message}</p>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
                <button onclick="deleteMessage(${index})">Delete</button>
            `;
            orderHistory.appendChild(orderElement);
        });

        contactMessages.innerHTML = '';
        messages.filter(msg => msg.name !== 'System').forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <h4>From: ${msg.name} (${msg.email})</h4>
                <p>${msg.message}</p>
                <p>Date: ${new Date(msg.date).toLocaleString()}</p>
                <button onclick="deleteMessage(${index})">Delete</button>
            `;
            contactMessages.appendChild(messageElement);
        });
    }
}


function deleteMessage(index) {
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    displayAdminInbox();
}

function setupPurchaseButton() {
    const purchaseButton = document.createElement('button');
    purchaseButton.textContent = 'Purchase';
    purchaseButton.className = "purchase-button";
    purchaseButton.addEventListener('click', handlePurchase);
    document.getElementById('cart').appendChild(purchaseButton);
}

function handlePurchase() {
    if (!currentUser) {
        showPopup('Only logged-in users can make purchases. Please log in or register an account.', () => {
            window.location.href = 'login.html';
        });
        return;
    }

    if (cart.length === 0) {
        showPopup('Your cart is empty. Add some products before purchasing.');
        return;
    }

    const invoice = {
        user: currentUser.username,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        date: new Date().toISOString()
    };

    const invoiceMessage = `
New order received:
User: ${invoice.user}
Date: ${new Date(invoice.date).toLocaleString()}

Items:
${invoice.items.map(item => `- ${item.name} (x${item.quantity}) - $${item.subtotal.toFixed(2)}`).join('\n')}

Total: $${invoice.total.toFixed(2)}
    `;

    messages.push({
        name: 'System',
        email: 'system@chocolateparadise.com',
        message: invoiceMessage,
        date: invoice.date
    });

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
    if (!orderHistory[currentUser.username]) {
        orderHistory[currentUser.username] = [];
    }
    orderHistory[currentUser.username].push(invoice);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    localStorage.setItem('messages', JSON.stringify(messages));
    cart = [];
    updateCart();
    showPopup('Your order has been sent!', () => {
        window.location.href = 'order-history.html';
    });
}
function displayInboxInvoice() {
    if (!currentUser || currentUser.userType !== 'admin') {
        showPopup('Only administrators can access this page.', () => {
            window.location.href = 'index.html';
        });
        return;
    }

    const orderHistory = document.getElementById('orderHistory');
    const contactMessages = document.getElementById('contactMessages');

    if (orderHistory && contactMessages) {

        orderHistory.innerHTML = '<h3>Order History</h3>';
        messages.filter(msg => msg.name === 'System').forEach((order, index) => {
            const orderElement = document.createElement('div');
            orderElement.className = 'message order-message';
            orderElement.innerHTML = `
                <h4>Order #${index + 1}</h4>
                <pre>${order.message}</pre>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
            `;
            orderHistory.appendChild(orderElement);
        });

  
        contactMessages.innerHTML = '<h3>Contact Messages</h3>';
        messages.filter(msg => msg.name !== 'System').forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.className = 'message contact-message';
            messageElement.innerHTML = `
                <h4>From: ${msg.name} (${msg.email})</h4>
                <p>${msg.message}</p>
                <p>Date: ${new Date(msg.date).toLocaleString()}</p>
            `;
            contactMessages.appendChild(messageElement);
        });
    }
}

function displayOrderHistory() {
    if (!currentUser) {
        showPopup('Please log in to view your order history.', () => {
            window.location.href = 'login.html';
        });
        return;
    }

    const orderHistoryElement = document.getElementById('orderHistory');
    if (orderHistoryElement) {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
        const userOrders = orderHistory[currentUser.username] || [];

        orderHistoryElement.innerHTML = '<h2>Your Order History</h2>';
        if (userOrders.length === 0) {
            orderHistoryElement.innerHTML += '<p>You have no previous orders.</p>';
        } else {
            userOrders.forEach((order, index) => {
                const orderElement = document.createElement('div');
                orderElement.className = 'order-item';
                orderElement.innerHTML = `
                    <h3>Order #${index + 1}</h3>
                    <p>Date: ${new Date(order.date).toLocaleString()}</p>
                    <p>Total: $${order.total.toFixed(2)}</p>
                    <ul>
                        ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - $${item.subtotal.toFixed(2)}</li>`).join('')}
                    </ul>
                `;
                orderHistoryElement.appendChild(orderElement);
            });
        }
    }
}

function initializeApp() {
    displayBrands();
    updateCartCount();
    loadCurrentUser();
    updateAuthUI();
    setupSearchFunctionality();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
        setupPurchaseButton();
    } else if (window.location.pathname.includes('add-product.html')) {
        setupAddProductForm();
    } else if (window.location.pathname.includes('contact.html')) {
        setupContactForm();
    } else if (window.location.pathname.includes('inbox-invoice.html')) {
        displayInboxInvoice();
    } else if (window.location.pathname.includes('order-history.html')) {
        displayOrderHistory();
    }
    setupEventListeners();
}

function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(function (blob) {
                    resolve(blob);
                }, 'image/jpeg', quality);
            };
        };
        reader.onerror = function (error) {
            reject(error);
        };
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);
