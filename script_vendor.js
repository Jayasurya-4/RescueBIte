
const foodItems = [
    { 
        id: 1, 
        name: "Vegetable Biryani", 
        quantity: "5kg", 
        price: 250,
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop",
        rating: 4.5,
        hotel: "Taj Mahal Hotel",
        category: "Indian"
    },
    { 
        id: 2, 
        name: "Pasta with Sauce", 
        quantity: "3kg", 
        price: 180,
        image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&auto=format&fit=crop",
        rating: 4.2,
        hotel: "Italian Delight",
        category: "Italian"
    },
    { 
        id: 3, 
        name: "Mixed Salad", 
        quantity: "2kg", 
        price: 120,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&auto=format&fit=crop",
        rating: 3.9,
        hotel: "Green Leaf Cafe",
        category: "Healthy"
    },
    { 
        id: 4, 
        name: "Chicken Curry", 
        quantity: "4kg", 
        price: 280,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop",
        rating: 4.7,
        hotel: "Spice Kingdom",
        category: "Indian"
    },
    { 
        id: 5, 
        name: "Fruit Platter", 
        quantity: "3kg", 
        price: 150,
        image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=500&auto=format&fit=crop",
        rating: 4.0,
        hotel: "Fresh Bites",
        category: "Healthy"
    }
];

// DOM Elements
const foodListDiv = document.getElementById("food-list");
const orderItemsList = document.getElementById("order-items");
const toggleBtn = document.getElementById("toggle-btn");
const dropdownMenu = document.getElementById("dropdown-menu");
const feedbackBtn = document.getElementById("feedback-btn");
const logoutBtn = document.getElementById("logout-btn");
const feedbackModal = document.getElementById("feedback-modal");
const closeBtns = document.querySelectorAll(".close-btn");
const submitFeedbackBtn = document.getElementById("submit-feedback");
const totalAmountSpan = document.getElementById("total-amount");
const orderNotesText = document.getElementById("order-notes-text");
const categoryBtns = document.querySelectorAll(".category-btn");

// Order Page Elements
const orderPage = document.getElementById("order-page");
const orderDetails = document.getElementById("order-details");
const orderSubtotal = document.getElementById("order-subtotal");
const orderDeliveryFee = document.getElementById("order-delivery-fee");
const orderTotalAmount = document.getElementById("order-total-amount");
const deliveryMethodText = document.getElementById("delivery-method-text");
const paymentMethodText = document.getElementById("payment-method-text");
const orderNotesTextDisplay = document.getElementById("order-notes-text-display");

let order = [];
let deliveryFee = 0;

// Initialize the app
function init() {
    loadFoodItems();
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Toggle dropdown menu
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        dropdownMenu.style.display = 'none';
    });

    // Feedback button
    feedbackBtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.style.display = 'none';
        feedbackModal.style.display = 'block';
    });

    // Logout button
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            alert('Logged out successfully!');
            // In a real app, you would redirect to login page
        }
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (btn.parentElement.parentElement.id === 'feedback-modal') {
                feedbackModal.style.display = 'none';
            }
        });
    });

    // Submit feedback
    submitFeedbackBtn.addEventListener('click', function() {
        const feedbackText = document.getElementById('feedback-text').value;
        if (feedbackText.trim() !== '') {
            alert('Thank you for your feedback!');
            feedbackModal.style.display = 'none';
            document.getElementById('feedback-text').value = '';
        } else {
            alert('Please enter your feedback before submitting.');
        }
    });

    // Category filter buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            loadFoodItems(category);
        });
    });

    // Delivery option change
    document.getElementById('delivery').addEventListener('change', function() {
        deliveryFee = this.checked ? 50 : 0;
        updateOrderSummary();
    });
}

// Function to display star ratings
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Function to display available food items with category filter
function loadFoodItems(category = 'all') {
    foodListDiv.innerHTML = "";
    const filteredItems = category === 'all' 
        ? foodItems 
        : foodItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const foodDiv = document.createElement("div");
        foodDiv.classList.add("food-item");
        foodDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="food-image">
            <div class="food-details">
                <div class="food-info">
                    <div class="food-name">${item.name}</div>
                    <div class="hotel-name">${item.hotel}</div>
                    <div class="food-meta">
                        <div class="food-price">₹${item.price.toFixed(2)}</div>
                        <div class="food-quantity">${item.quantity}</div>
                    </div>
                    <div class="rating">
                        <div class="stars">${renderStars(item.rating)}</div>
                        <div class="rating-value">${item.rating}</div>
                    </div>
                </div>
                <button class="order-btn" onclick="orderFood(${item.id})">Order Now</button>
            </div>
        `;
        foodListDiv.appendChild(foodDiv);
    });
}

// Function to order food
function orderFood(id) {
    const item = foodItems.find(food => food.id === id);
    if (item) {
        // Check if item already exists in order
        const existingItem = order.find(i => i.id === item.id);
        
        if (existingItem) {
            // If exists, increase quantity
            existingItem.quantityOrdered = (existingItem.quantityOrdered || 1) + 1;
        } else {
            // If new, add to order with default quantity 1
            item.quantityOrdered = 1;
            order.push(item);
        }
        updateOrderSummary();
    }
}

// Function to update order summary with enhanced options
function updateOrderSummary() {
    orderItemsList.innerHTML = "";
    let subtotal = 0;
    
    order.forEach((item, index) => {
        const itemTotal = item.price * (item.quantityOrdered || 1);
        subtotal += itemTotal;
        
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="order-item-header">
                <span>${item.name} (${item.hotel})</span>
                <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-times"></i></button>
            </div>
            <div class="order-item-details">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="adjustQuantity(${index}, -1)">-</button>
                    <span class="item-qty">${item.quantityOrdered || 1}</span>
                    <button class="qty-btn" onclick="adjustQuantity(${index}, 1)">+</button>
                </div>
                <span class="item-price">₹${itemTotal.toFixed(2)}</span>
            </div>
            <div class="special-requests">
                <input type="text" 
                    placeholder="Special requests (spice level, allergies...)" 
                    onchange="updateSpecialRequest(${index}, this.value)"
                    value="${item.specialRequest || ''}">
            </div>
        `;
        orderItemsList.appendChild(listItem);
    });
    
    const total = subtotal + deliveryFee;
    totalAmountSpan.textContent = `₹${total.toFixed(2)}`;
}

// Adjust quantity of ordered item
function adjustQuantity(index, change) {
    const item = order[index];
    const newQty = (item.quantityOrdered || 1) + change;
    
    if (newQty < 1) {
        removeItem(index);
    } else {
        item.quantityOrdered = newQty;
        updateOrderSummary();
    }
}

// Remove item from order
function removeItem(index) {
    order.splice(index, 1);
    updateOrderSummary();
}

// Update special request for an item
function updateSpecialRequest(index, request) {
    order[index].specialRequest = request;
}

// Show order confirmation page
function confirmOrder() {
    if (order.length === 0) {
        alert("Please add items to your order first!");
        return;
    }

    // Hide main container and show order page
    document.querySelector('.container').style.display = 'none';
    orderPage.style.display = 'block';
    
    // Calculate delivery fee
    const isDelivery = document.getElementById('delivery').checked;
    deliveryFee = isDelivery ? 50 : 0;
    
    // Display order details
    orderDetails.innerHTML = '';
    
    let subtotal = 0;
    
    order.forEach(item => {
        const itemTotal = item.price * (item.quantityOrdered || 1);
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${item.name} × ${item.quantityOrdered || 1}</div>
                <div class="order-item-hotel">${item.hotel}</div>
                ${item.specialRequest ? `<div class="special-request">Note: ${item.specialRequest}</div>` : ''}
                <div class="order-item-meta">
                    <div class="order-item-price">₹${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
        orderDetails.appendChild(orderItem);
    });
    
    // Update summary information
    orderSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    orderDeliveryFee.textContent = `₹${deliveryFee.toFixed(2)}`;
    orderTotalAmount.textContent = `₹${(subtotal + deliveryFee).toFixed(2)}`;
    
    // Update delivery method
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked');
    deliveryMethodText.textContent = deliveryMethod.nextElementSibling.textContent;
    
    // Update payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    paymentMethodText.textContent = paymentMethod.nextElementSibling.textContent;
    
    // Update order notes
    orderNotesTextDisplay.textContent = orderNotesText.value || 'No special instructions';
}

// Go back to menu from order page
function goBackToMenu() {
    document.querySelector('.container').style.display = 'block';
    orderPage.style.display = 'none';
}

// Finalize the order
function placeOrder() {
    // Prepare order details for confirmation
    let orderDetailsText = "Order Details:\n\n";
    let subtotal = 0;
    
    order.forEach(item => {
        const itemTotal = item.price * (item.quantityOrdered || 1);
        subtotal += itemTotal;
        orderDetailsText += `${item.name} × ${item.quantityOrdered || 1} - ₹${itemTotal.toFixed(2)}\n`;
        if (item.specialRequest) {
            orderDetailsText += `  Special Request: ${item.specialRequest}\n`;
        }
    });
    
    orderDetailsText += `\nSubtotal: ₹${subtotal.toFixed(2)}`;
    orderDetailsText += `\nDelivery Fee: ₹${deliveryFee.toFixed(2)}`;
    orderDetailsText += `\nTotal: ₹${(subtotal + deliveryFee).toFixed(2)}`;
    orderDetailsText += `\n\nPayment Method: ${document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent}`;
    orderDetailsText += `\n\nOrder Notes: ${orderNotesText.value || 'None'}`;
    
    // Show final confirmation
    if (confirm(`${orderDetailsText}\n\nConfirm to place this order?`)) {
        alert('Order placed successfully! Thank you for your order.');
        
        // Reset order
        order = [];
        document.getElementById('pickup').checked = true;
        document.getElementById('cash').checked = true;
        orderNotesText.value = '';
        
        // Go back to menu
        goBackToMenu();
        updateOrderSummary();
    }
}

// Initialize the app when page loads
window.onload = init;
