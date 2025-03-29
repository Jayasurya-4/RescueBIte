document.addEventListener('DOMContentLoaded', function() {
    // Get user email from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get('email') || localStorage.getItem('orphanageEmail');
    
    // Set organization details
    if (userEmail) {
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${userEmail.split('@')[0]}!`;
        document.getElementById('orgName').textContent = userEmail.split('@')[0];
    }

    // Sample data - in a real app, this would come from an API
    const notifications = [
        {
            id: 1,
            type: 'donation',
            title: 'New Donation Available!',
            message: 'Fresh Bakery has 20 meals available for pickup today.',
            time: '10 min ago',
            isNew: true
        },
        {
            id: 2,
            type: 'schedule',
            title: 'Scheduled Donation',
            message: 'Green Grocers scheduled a weekly donation every Tuesday.',
            time: '2 hours ago',
            isNew: true
        },
        {
            id: 3,
            type: 'delivery',
            title: 'Delivery Update',
            message: 'Your donation from City Cafe is on its way (ETA: 30 min).',
            time: 'Yesterday',
            isNew: false
        },
        {
            id: 4,
            type: 'waste',
            title: 'High Food Waste Detected',
            message: 'Our system detected 15kg of food waste this week. Click for details.',
            time: 'Just now',
            isNew: true
        }
    ];

    const donations = [
        {
            id: 1,
            donator: 'Fresh Bakery',
            donatorImage: 'https://randomuser.me/api/portraits/women/43.jpg',
            items: 'Bread, Pastries, Sandwiches',
            quantity: '20 meals',
            status: 'pending'
        },
        {
            id: 2,
            donator: 'Green Grocers',
            donatorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            items: 'Fruits, Vegetables',
            quantity: '15 kg',
            status: 'scheduled'
        },
        {
            id: 3,
            donator: 'City Cafe',
            donatorImage: 'https://randomuser.me/api/portraits/women/65.jpg',
            items: 'Prepared Meals',
            quantity: '25 servings',
            status: 'in-transit'
        },
        {
            id: 4,
            donator: 'Organic Restaurant',
            donatorImage: 'https://randomuser.me/api/portraits/men/75.jpg',
            items: 'Lunch Meals',
            quantity: '15 plates',
            status: 'completed'
        }
    ];

    // Render notifications
    function renderNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        const notificationCount = notifications.filter(n => n.isNew).length;
        document.getElementById('notificationCount').textContent = notificationCount;

        notificationsList.innerHTML = '';
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.isNew ? 'new' : ''} ${notification.type === 'waste' ? 'waste' : ''}`;
            
            notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h6>${notification.title}</h6>
                    <p>${notification.message}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-sm ${notification.type === 'waste' ? 'btn-danger' : ''}">View</button>
                </div>
            `;
            
            // Add click event for waste notifications
            if (notification.type === 'waste') {
                notificationItem.querySelector('button').addEventListener('click', showWasteAlert);
            }
            
            notificationsList.appendChild(notificationItem);
        });
    }

    // Render donations table
    function renderDonations() {
        const donationsTableBody = document.getElementById('donationsTableBody');
        donationsTableBody.innerHTML = '';
        
        donations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="donator-info">
                        <img src="${donation.donatorImage}" alt="${donation.donator}">
                        <span>${donation.donator}</span>
                    </div>
                </td>
                <td>${donation.items}</td>
                <td>${donation.quantity}</td>
                <td><span class="status-badge ${donation.status}">${formatStatus(donation.status)}</span></td>
                <td><button class="btn btn-sm btn-outline">${getActionText(donation.status)}</button></td>
            `;
            donationsTableBody.appendChild(row);
        });
    }

    // Waste alert functionality
    const wasteAlertModal = document.getElementById('wasteAlertModal');
    const closeWasteAlert = document.getElementById('closeWasteAlert');
    const dismissAlert = document.getElementById('dismissAlert');
    const viewSuggestions = document.getElementById('viewSuggestions');

    function showWasteAlert() {
        wasteAlertModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideWasteAlert() {
        wasteAlertModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Check for high waste (in a real app, this would be from an API)
    function checkForWasteAlerts() {
        const hasHighWaste = notifications.some(n => n.type === 'waste' && n.isNew);
        if (hasHighWaste) {
            setTimeout(showWasteAlert, 2000); // Show after 2 seconds
        }
    }

    // Menu navigation
    function setupMenuNavigation() {
        const menuItems = document.querySelectorAll('.dashboard-menu a');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                menuItems.forEach(i => i.parentNode.classList.remove('active'));
                this.parentNode.classList.add('active');
                // In a real app, you would load the appropriate content here
            });
        });
    }

    // Button event listeners
    function setupButtonEvents() {
        document.getElementById('notificationsBtn').addEventListener('click', function() {
            // In a real app, this would toggle notifications panel
            alert('Notifications panel would open here');
        });

        document.getElementById('newRequestBtn').addEventListener('click', function() {
            // In a real app, this would open new request form
            alert('New food request form would open here');
        });

        closeWasteAlert.addEventListener('click', hideWasteAlert);
        dismissAlert.addEventListener('click', hideWasteAlert);
        viewSuggestions.addEventListener('click', function() {
            alert('Redirecting to waste reduction suggestions...');
            hideWasteAlert();
        });
    }

    // Helper functions
    function getNotificationIcon(type) {
        switch(type) {
            case 'donation': return 'fa-utensils';
            case 'schedule': return 'fa-calendar-alt';
            case 'delivery': return 'fa-truck';
            case 'waste': return 'fa-exclamation-triangle';
            default: return 'fa-bell';
        }
    }

    function formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function getActionText(status) {
        switch(status) {
            case 'pending': return 'Respond';
            case 'scheduled': return 'Details';
            case 'in-transit': return 'Track';
            case 'completed': return 'Review';
            default: return 'View';
        }
    }

    // Initialize everything
    function initDashboard() {
        renderNotifications();
        renderDonations();
        setupMenuNavigation();
        setupButtonEvents();
        checkForWasteAlerts();
    }

    initDashboard();
});