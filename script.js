// Hotel Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initHotelDashboard();
});

// Global variables
let foodItems = [];
let orders = [];
let inventory = [];
let vendors = [];
let notifications = [
    {
        id: 1,
        type: 'order',
        message: 'New order received from Spice Mart',
        time: '2 minutes ago',
        read: false
    },
    {
        id: 2,
        type: 'warning',
        message: 'Paneer stock expiring in 2 hours',
        time: '1 hour ago',
        read: false
    },
    {
        id: 3,
        type: 'success',
        message: 'Order #ORD-105 completed',
        time: '3 hours ago',
        read: false
    }
];

function initHotelDashboard() {
    // Load sample data
    loadSampleData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize UI components
    initUI();
    
    // Initialize charts
    initCharts();
    
    // Mark current section as active
    document.querySelector('.sidebar-menu li.active').click();
}

function loadSampleData() {
    // Sample food items
    foodItems = [
        {
            id: 1,
            name: "Vegetable Biryani",
            quantity: 5,
            price: 250,
            description: "Flavorful rice dish with mixed vegetables and spices",
            cookedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
            expiryTime: "6",
            status: "fresh",
            image: "images/biryani.jpg",
            category: "indian"
        },
        {
            id: 2,
            name: "Paneer Butter Masala",
            quantity: 3,
            price: 180,
            description: "Cottage cheese in rich tomato gravy",
            cookedTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().slice(0, 16),
            expiryTime: "4",
            status: "warning",
            image: "images/paneer.jpg",
            category: "indian"
        },
        {
            id: 3,
            name: "Chocolate Cake",
            quantity: 2,
            price: 120,
            description: "Rich chocolate cake with frosting",
            cookedTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString().slice(0, 16),
            expiryTime: "24",
            status: "fresh",
            image: "images/cake.jpg",
            category: "desserts"
        }
    ];

    // Sample orders
    orders = [
        {
            id: "ORD-001",
            vendor: "Spice Mart",
            items: ["Vegetable Biryani (3kg)", "Paneer Butter Masala (2kg)"],
            totalQty: "5kg",
            amount: 990,
            time: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(),
            status: "pending"
        },
        {
            id: "ORD-002",
            vendor: "Fresh Grocers",
            items: ["Chocolate Cake (2kg)"],
            totalQty: "2kg",
            amount: 240,
            time: new Date(Date.now() - 120 * 60 * 1000).toLocaleString(),
            status: "completed"
        }
    ];

    // Sample vendors
    vendors = [
        {
            id: "VEND-001",
            name: "Spice Mart",
            contact: "+91 9876543210",
            type: "Grocery Store",
            orders: 12,
            lastOrder: new Date().toLocaleDateString(),
            rating: 4.5
        },
        {
            id: "VEND-002",
            name: "Fresh Grocers",
            contact: "+91 8765432109",
            type: "Supermarket",
            orders: 8,
            lastOrder: new Date().toLocaleDateString(),
            rating: 4.2
        }
    ];

    // Sample inventory
    inventory = [
        {
            id: 1,
            name: "Basmati Rice",
            quantity: 25,
            unit: "kg",
            purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            location: "Pantry",
            status: "good"
        },
        {
            id: 2,
            name: "Paneer",
            quantity: 5,
            unit: "kg",
            purchaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            location: "Fridge",
            status: "warning"
        },
        {
            id: 3,
            name: "Milk",
            quantity: 10,
            unit: "l",
            purchaseDate: new Date().toISOString().slice(0, 10),
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            location: "Fridge",
            status: "good"
        }
    ];
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            
            // Refresh data when switching sections
            switch(sectionId) {
                case 'food':
                    loadFoodItems();
                    break;
                case 'orders':
                    loadOrders();
                    break;
                case 'customers':
                    loadVendors();
                    break;
                case 'groceries':
                    loadInventory();
                    break;
                case 'analytics':
                    initCharts();
                    break;
            }
        });
    });

    // Logout button
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real app, redirect to login page
            window.location.href = 'index.html';
        }
    });

    // Food form submission
    document.getElementById('foodForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addFoodItem();
    });

    // Inventory form submission
    document.getElementById('groceryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addInventoryItem();
    });

    // Notifications dropdown
    document.querySelector('.notifications').addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = document.querySelector('.notifications-dropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        
        // Mark notifications as read
        notifications.forEach(notif => notif.read = true);
        document.querySelector('.badge').textContent = '0';
    });

    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function() {
        document.querySelector('.notifications-dropdown').style.display = 'none';
    });

    // Quick add button
    document.getElementById('quickAddBtn').addEventListener('click', function() {
        // Scroll to food form and focus on first field
        document.getElementById('food').classList.add('active');
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('food').classList.add('active');
        document.getElementById('foodName').focus();
        window.scrollTo(0, document.getElementById('foodForm').offsetTop);
    });

    // Image upload
    document.getElementById('foodImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('imagePreview');
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                preview.setAttribute('data-image', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Food status filter
    document.getElementById('foodStatusFilter').addEventListener('change', function() {
        loadFoodItems();
    });

    // Order status filter
    document.getElementById('orderStatusFilter').addEventListener('change', function() {
        loadOrders();
    });

    // Inventory status filter
    document.getElementById('inventoryStatusFilter').addEventListener('change', function() {
        loadInventory();
    });
}

function initUI() {
    // Set current date/time for forms
    const now = new Date();
    document.getElementById('cookedTime').value = now.toISOString().slice(0, 16);
    document.getElementById('purchaseDate').value = now.toISOString().slice(0, 10);
    
    // Initialize notifications
    updateNotifications();
}

function initCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Food Saved (kg)',
                data: [12, 19, 15, 22, 18, 25, 30],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Waste Reduction Chart
    const wasteCtx = document.getElementById('wasteReductionChart').getContext('2d');
    new Chart(wasteCtx, {
        type: 'doughnut',
        data: {
            labels: ['Food Saved', 'Food Wasted'],
            datasets: [{
                data: [85, 15],
                backgroundColor: ['#4CAF50', '#e0e0e0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });

    // Revenue Trends Chart
    const revenueCtx = document.getElementById('revenueTrendsChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue (₹)',
                data: [12000, 15000, 14000, 16000, 17000, 18000],
                backgroundColor: '#9C27B0',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Vendor Distribution Chart
    const vendorCtx = document.getElementById('vendorDistributionChart').getContext('2d');
    new Chart(vendorCtx, {
        type: 'polarArea',
        data: {
            labels: ['Spice Mart', 'Fresh Grocers', 'Local Market', 'Food Bank', 'Others'],
            datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#607D8B'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });

    // Time to Sell Chart
    const timeCtx = document.getElementById('timeToSellChart').getContext('2d');
    new Chart(timeCtx, {
        type: 'radar',
        data: {
            labels: ['Biryani', 'Paneer', 'Cake', 'Salad', 'Curry', 'Bread'],
            datasets: [{
                label: 'Average Time to Sell (hours)',
                data: [2.5, 3.2, 1.8, 4.1, 2.9, 3.5],
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: '#2196F3',
                pointBackgroundColor: '#2196F3',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5
                }
            }
        }
    });
}

function loadFoodItems() {
    const statusFilter = document.getElementById('foodStatusFilter').value;
    let filteredItems = foodItems;
    
    if (statusFilter !== 'all') {
        filteredItems = foodItems.filter(item => {
            if (statusFilter === 'fresh') return item.status === 'fresh';
            if (statusFilter === 'expiring') return item.status === 'warning';
            if (statusFilter === 'expired') return item.status === 'expired';
            return true;
        });
    }
    
    const tbody = document.getElementById('foodItemsTableBody');
    tbody.innerHTML = '';
    
    filteredItems.forEach(item => {
        const timeLeft = calculateTimeLeft(item.cookedTime, item.expiryTime);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity} kg</td>
            <td><span class="rupee"></span>${item.price}</td>
            <td>${formatDateTime(item.cookedTime)}</td>
            <td>${timeLeft.text}</td>
            <td><span class="status ${timeLeft.status}">${getStatusText(timeLeft.status)}</span></td>
            <td>
                <button class="action-btn edit" onclick="editFoodItem(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteFoodItem(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    let filteredOrders = orders;
    
    if (statusFilter !== 'all') {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.vendor}</td>
            <td>${order.items.join(', ')}</td>
            <td>${order.totalQty}</td>
            <td><span class="rupee"></span>${order.amount}</td>
            <td>${order.time}</td>
            <td><span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
            <td>
                <button class="action-btn view" onclick="viewOrder('${order.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn print" onclick="printOrder('${order.id}')"><i class="fas fa-print"></i></button>
                ${order.status === 'pending' ? 
                    `<button class="action-btn complete" onclick="completeOrder('${order.id}')"><i class="fas fa-check"></i></button>` : 
                    ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function loadVendors() {
    const tbody = document.getElementById('vendorsTableBody');
    tbody.innerHTML = '';
    
    vendors.forEach(vendor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${vendor.id}</td>
            <td>${vendor.name}</td>
            <td>${vendor.contact}</td>
            <td>${vendor.type}</td>
            <td>${vendor.orders}</td>
            <td>${vendor.lastOrder}</td>
            <td>${renderStars(vendor.rating)} ${vendor.rating.toFixed(1)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function loadInventory() {
    const statusFilter = document.getElementById('inventoryStatusFilter').value;
    let filteredInventory = inventory;
    
    if (statusFilter !== 'all') {
        filteredInventory = inventory.filter(item => {
            if (statusFilter === 'good') return item.status === 'good';
            if (statusFilter === 'warning') return item.status === 'warning';
            if (statusFilter === 'expired') return item.status === 'expired';
            if (statusFilter === 'low') return item.quantity < 5; // Assuming low stock is < 5
            return true;
        });
    }
    
    const tbody = document.getElementById('inventoryTableBody');
    tbody.innerHTML = '';
    
    filteredInventory.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity} ${item.unit}</td>
            <td>${item.purchaseDate}</td>
            <td>${item.expiryDate}</td>
            <td>${item.location}</td>
            <td><span class="status ${item.status}">${getStatusText(item.status)}</span></td>
            <td>
                <button class="action-btn edit" onclick="editInventoryItem(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete" onclick="deleteInventoryItem(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addFoodItem() {
    const form = document.getElementById('foodForm');
    const name = document.getElementById('foodName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const cookedTime = document.getElementById('cookedTime').value;
    const expiryTime = document.getElementById('expiryTime').value;
    const image = document.getElementById('imagePreview').getAttribute('data-image') || 'images/food-placeholder.jpg';
    
    // Calculate status based on expiry
    const timeLeft = calculateTimeLeft(cookedTime, expiryTime);
    
    const newItem = {
        id: Date.now(),
        name,
        quantity,
        price,
        description,
        cookedTime,
        expiryTime,
        status: timeLeft.status,
        image,
        category: 'indian' // Default category, could add a field for this
    };
    
    foodItems.push(newItem);
    showAlert('Food item added successfully!', 'success');
    
    // Reset form
    form.reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').removeAttribute('data-image');
    document.getElementById('cookedTime').value = new Date().toISOString().slice(0, 16);
    
    // Reload food items
    loadFoodItems();
}

function addInventoryItem() {
    const form = document.getElementById('groceryForm');
    const name = document.getElementById('groceryName').value;
    const quantity = document.getElementById('groceryQuantity').value;
    const unit = document.getElementById('groceryUnit').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const location = document.getElementById('storageLocation').value || 'Unknown';
    
    // Calculate status based on expiry
    const status = calculateInventoryStatus(purchaseDate, expiryDate);
    
    const newItem = {
        id: Date.now(),
        name,
        quantity,
        unit,
        purchaseDate,
        expiryDate,
        location,
        status
    };
    
    inventory.push(newItem);
    showAlert('Inventory item added successfully!', 'success');
    
    // Reset form
    form.reset();
    document.getElementById('purchaseDate').value = new Date().toISOString().slice(0, 10);
    
    // Reload inventory
    loadInventory();
}

function calculateTimeLeft(cookedTime, expiryHours) {
    const cookedDate = new Date(cookedTime);
    const expiryDate = new Date(cookedDate.getTime() + expiryHours * 60 * 60 * 1000);
    const now = new Date();
    const diffMs = expiryDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let status = 'good';
    if (diffMs <= 0) {
        status = 'expired';
    } else if (diffHours < 2) {
        status = 'warning';
    }
    
    let text = '';
    if (diffMs <= 0) {
        text = 'Expired';
    } else if (diffHours > 0) {
        text = `${diffHours}h left`;
    } else {
        text = `${diffMinutes}m left`;
    }
    
    return { text, status };
}

function calculateInventoryStatus(purchaseDate, expiryDate) {
    if (!expiryDate) return 'good';
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 2) return 'warning';
    return 'good';
}

function getStatusText(status) {
    switch(status) {
        case 'good': return 'Good';
        case 'warning': return 'Expiring Soon';
        case 'expired': return 'Expired';
        case 'pending': return 'Pending';
        case 'completed': return 'Completed';
        default: return status;
    }
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

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

function updateNotifications() {
    const unreadCount = notifications.filter(n => !n.read).length;
    document.querySelector('.badge').textContent = unreadCount;
    
    const dropdown = document.querySelector('.notifications-dropdown');
    dropdown.innerHTML = '';
    
    notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notification-item ${notif.read ? 'read' : 'unread'}`;
        item.innerHTML = `
            <i class="fas ${getNotificationIcon(notif.type)} notification-icon ${notif.type}"></i>
            <div>
                <p>${notif.message}</p>
                <small>${notif.time}</small>
            </div>
        `;
        dropdown.appendChild(item);
    });
}

function getNotificationIcon(type) {
    switch(type) {
        case 'order': return 'fa-shopping-cart';
        case 'warning': return 'fa-exclamation-triangle';
        case 'success': return 'fa-check-circle';
        default: return 'fa-info-circle';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Action functions (to be implemented)
function editFoodItem(id) {
    const item = foodItems.find(i => i.id === id);
    if (item) {
        // Populate form with item data
        document.getElementById('foodName').value = item.name;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('price').value = item.price;
        document.getElementById('description').value = item.description;
        document.getElementById('cookedTime').value = item.cookedTime;
        document.getElementById('expiryTime').value = item.expiryTime;
        
        // Set image preview
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${item.image}" alt="Preview">`;
        preview.setAttribute('data-image', item.image);
        
        // Remove item from array
        foodItems = foodItems.filter(i => i.id !== id);
        
        // Scroll to form
        window.scrollTo(0, document.getElementById('foodForm').offsetTop);
        document.getElementById('foodName').focus();
        
        showAlert('Editing food item', 'info');
    }
}

function deleteFoodItem(id) {
    if (confirm('Are you sure you want to delete this food item?')) {
        foodItems = foodItems.filter(i => i.id !== id);
        loadFoodItems();
        showAlert('Food item deleted', 'warning');
    }
}

function viewOrder(id) {
    const order = orders.find(o => o.id === id);
    if (order) {
        alert(`Order Details:\n\nID: ${order.id}\nVendor: ${order.vendor}\nItems: ${order.items.join(', ')}\nTotal: ₹${order.amount}\nStatus: ${order.status}`);
    }
}

function printOrder(id) {
    const order = orders.find(o => o.id === id);
    if (order) {
        // In a real app, this would open a print dialog with formatted content
        alert(`Printing order ${id}`);
    }
}

function completeOrder(id) {
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = 'completed';
        loadOrders();
        showAlert(`Order ${id} marked as completed`, 'success');
        
        // Add notification
        notifications.unshift({
            id: Date.now(),
            type: 'success',
            message: `Order ${id} completed`,
            time: 'Just now',
            read: false
        });
        updateNotifications();
    }
}

function editInventoryItem(id) {
    const item = inventory.find(i => i.id === id);
    if (item) {
        // Populate form with item data
        document.getElementById('groceryName').value = item.name;
        document.getElementById('groceryQuantity').value = item.quantity;
        document.getElementById('groceryUnit').value = item.unit;
        document.getElementById('purchaseDate').value = item.purchaseDate;
        document.getElementById('expiryDate').value = item.expiryDate;
        document.getElementById('storageLocation').value = item.location;
        
        // Remove item from array
        inventory = inventory.filter(i => i.id !== id);
        
        // Scroll to form
        window.scrollTo(0, document.getElementById('groceryForm').offsetTop);
        document.getElementById('groceryName').focus();
        
        showAlert('Editing inventory item', 'info');
    }
}

function deleteInventoryItem(id) {
    if (confirm('Are you sure you want to delete this inventory item?')) {
        inventory = inventory.filter(i => i.id !== id);
        loadInventory();
        showAlert('Inventory item deleted', 'warning');
    }
}

// Make functions available globally
window.editFoodItem = editFoodItem;
window.deleteFoodItem = deleteFoodItem;
window.viewOrder = viewOrder;
window.printOrder = printOrder;
window.completeOrder = completeOrder;
window.editInventoryItem = editInventoryItem;
window.deleteInventoryItem = deleteInventoryItem;