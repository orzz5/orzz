// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.password1 = '644oR02_-';
        this.password2 = '679937489oR_-';
        this.isLoggedIn = false;
        this.currentStep = 1;
        this.data = {
            suggestions: [],
            orders: [],
            lastSync: null,
            version: '1.0'
        };
        // Don't initialize here, wait for explicit init
    }

    init() {
        this.loadLocalData();
        this.setupEventListeners();
        this.checkLoginStatus();
        this.startAutoSync();
    }

    // Data Management
    loadLocalData() {
        const stored = localStorage.getItem('adminDashboardData');
        if (stored) {
            try {
                this.data = { ...this.data, ...JSON.parse(stored) };
            } catch (e) {
                // Error loading data
            }
        }
    }

    saveLocalData() {
        localStorage.setItem('adminDashboardData', JSON.stringify(this.data));
        this.updateStats();
    }

    // Load portfolio submissions
    loadPortfolioData() {
        // Load suggestions
        const suggestionKeys = Object.keys(localStorage).filter(key => key.startsWith('suggestion_'));
        const suggestions = suggestionKeys.map(key => {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        }).filter(item => item !== null);

        // Load orders
        const orderKeys = Object.keys(localStorage).filter(key => key.startsWith('order_'));
        const orders = orderKeys.map(key => {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return null;
            }
        }).filter(item => item !== null);

        // Merge with existing data
        this.data.suggestions = this.mergeData(this.data.suggestions, suggestions, 'timestamp');
        this.data.orders = this.mergeData(this.data.orders, orders, 'timestamp');
        
        this.saveLocalData();
        this.renderSubmissions();
    }

    mergeData(existing, newItems, uniqueField) {
        const merged = [...existing];
        const existingIds = new Set(existing.map(item => item[uniqueField]));
        
        newItems.forEach(item => {
            if (!existingIds.has(item[uniqueField])) {
                // Ensure all new items start as uncompleted
                item.completed = false;
                merged.push(item);
                existingIds.add(item[uniqueField]);
            }
        });
        
        return merged.sort((a, b) => b[uniqueField] - a[uniqueField]);
    }

    // Authentication
    checkLoginStatus() {
        const loginTime = localStorage.getItem('adminLoginTime');
        if (loginTime && Date.now() - parseInt(loginTime) < 24 * 60 * 60 * 1000) {
            this.showDashboard();
        }
    }

    setupEventListeners() {
        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            if (this.currentStep === 1) {
                if (password === this.password1) {
                    this.currentStep = 2;
                    this.showError('Incorrect password (but it will not be incorrect)');
                    document.getElementById('password').value = '';
                } else {
                    this.showError('Invalid password');
                }
            } else if (this.currentStep === 2) {
                if (password === this.password2) {
                    localStorage.setItem('adminLoginTime', Date.now().toString());
                    this.currentStep = 1;
                    this.showDashboard();
                } else {
                    this.showError('Invalid password');
                    this.currentStep = 1;
                }
            }
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('adminLoginTime');
            this.currentStep = 1;
            this.showLogin();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Data operations
        document.getElementById('syncBtn').addEventListener('click', () => this.syncData());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllData());
        document.getElementById('importBtn').addEventListener('click', () => this.showImportModal());

        // Search and filter
        document.getElementById('suggestionsSearch').addEventListener('input', (e) => {
            this.filterSubmissions('suggestions', e.target.value);
        });

        document.getElementById('ordersSearch').addEventListener('input', (e) => {
            this.filterSubmissions('orders', e.target.value);
        });

        document.getElementById('suggestionsFilter').addEventListener('change', (e) => {
            this.filterSubmissionsByType('suggestions', e.target.value);
        });

        document.getElementById('ordersFilter').addEventListener('change', (e) => {
            this.filterSubmissionsByType('orders', e.target.value);
        });

        // Import modal
        document.getElementById('closeImportModal').addEventListener('click', () => {
            document.getElementById('importModal').style.display = 'none';
        });

        document.getElementById('cancelImport').addEventListener('click', () => {
            document.getElementById('importModal').style.display = 'none';
        });

        document.getElementById('confirmImport').addEventListener('click', () => {
            this.importData();
        });
    }

    // UI Methods
    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboardScreen').style.display = 'none';
        this.isLoggedIn = false;
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'block';
        this.isLoggedIn = true;
        this.loadPortfolioData();
        this.updateStats();
        this.renderSubmissions();
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    updateStats() {
        document.getElementById('suggestionsCount').textContent = this.data.suggestions.length;
        document.getElementById('ordersCount').textContent = this.data.orders.length;
        
        if (this.data.lastSync) {
            const syncDate = new Date(this.data.lastSync);
            document.getElementById('lastSync').textContent = syncDate.toLocaleString();
        } else {
            document.getElementById('lastSync').textContent = 'Never';
        }
    }

    renderSubmissions() {
        this.renderSuggestions();
        this.renderOrders();
    }

    renderSuggestions() {
        const container = document.getElementById('suggestionsList');
        const suggestions = this.data.suggestions;
        
        if (suggestions.length === 0) {
            container.innerHTML = '<p class="no-data">No suggestions found</p>';
            return;
        }

        container.innerHTML = suggestions.map(suggestion => `
            <div class="submission-card ${suggestion.completed ? 'completed' : ''}" data-id="${suggestion.timestamp}">
                <div class="submission-header">
                    <div class="submission-info">
                        <h3>${suggestion.anonymous ? 'Anonymous' : suggestion.name}</h3>
                        <span class="submission-type">${suggestion.type}</span>
                        ${suggestion.completed ? '<span class="status-badge completed">Completed</span>' : '<span class="status-badge uncompleted">Uncompleted</span>'}
                    </div>
                    <div class="submission-date">
                        ${new Date(suggestion.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="submission-content">
                    <p>${suggestion.message}</p>
                </div>
                <div class="submission-actions">
                    ${!suggestion.completed ? `
                        <button class="btn btn-sm btn-success" onclick="dashboard.markAsCompleted('suggestions', ${suggestion.timestamp})">
                            <i class="fas fa-check"></i> Completed
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.declineSubmission('suggestions', ${suggestion.timestamp})">
                            <i class="fas fa-times"></i> Decline
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.markAsUncompleted('suggestions', ${suggestion.timestamp})">
                            <i class="fas fa-undo"></i> Mark Uncompleted
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }

    renderOrders() {
        const container = document.getElementById('ordersList');
        const orders = this.data.orders;
        
        if (orders.length === 0) {
            container.innerHTML = '<p class="no-data">No custom orders found</p>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="submission-card ${order.completed ? 'completed' : ''}" data-id="${order.timestamp}">
                <div class="submission-header">
                    <div class="submission-info">
                        <h3>${order.name}</h3>
                        <span class="submission-type">${order.type}</span>
                        ${order.completed ? '<span class="status-badge completed">Completed</span>' : '<span class="status-badge uncompleted">Uncompleted</span>'}
                    </div>
                    <div class="submission-date">
                        ${new Date(order.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="submission-content">
                    <p><strong>Details:</strong> ${order.details}</p>
                    <p><strong>Budget:</strong> ${order.budget}</p>
                    <p><strong>Timeline:</strong> ${order.timeline}</p>
                </div>
                <div class="submission-actions">
                    ${!order.completed ? `
                        <button class="btn btn-sm btn-success" onclick="dashboard.markAsCompleted('orders', ${order.timestamp})">
                            <i class="fas fa-check"></i> Completed
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.declineSubmission('orders', ${order.timestamp})">
                            <i class="fas fa-times"></i> Decline
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.markAsUncompleted('orders', ${order.timestamp})">
                            <i class="fas fa-undo"></i> Mark Uncompleted
                        </button>
                    `}
                </div>
            </div>
        `).join('');
    }

    // Data Operations
    syncData() {
        this.loadPortfolioData();
        this.data.lastSync = Date.now();
        this.saveLocalData();
        this.showSuccess('Data synced successfully!');
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('Data exported successfully!');
    }

    showImportModal() {
        document.getElementById('importModal').style.display = 'flex';
    }

    importData() {
        const fileInput = document.getElementById('importFile');
        const mergeData = document.getElementById('mergeData').checked;
        
        if (!fileInput.files.length) {
            this.showError('Please select a file to import');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (mergeData) {
                    // Merge with existing data
                    this.data.suggestions = this.mergeData(this.data.suggestions, importedData.suggestions || [], 'timestamp');
                    this.data.orders = this.mergeData(this.data.orders, importedData.orders || [], 'timestamp');
                } else {
                    // Replace all data
                    this.data = { ...this.data, ...importedData };
                }
                
                this.saveLocalData();
                this.renderSubmissions();
                document.getElementById('importModal').style.display = 'none';
                fileInput.value = '';
                this.showSuccess('Data imported successfully!');
                
            } catch (error) {
                this.showError('Error importing data. Please check the file format.');
            }
        };

        reader.readAsText(file);
    }

    // New completion status methods
    markAsCompleted(type, timestamp) {
        // Marking submission as completed
        const submission = this.data[type].find(item => item.timestamp === timestamp);
        if (submission) {
            submission.completed = true;
            submission.completedDate = Date.now();
            // Submission updated
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess(`Marked as completed!`);
        } else {
            // Submission not found
            this.showError('Submission not found!');
        }
    }

    markAsUncompleted(type, timestamp) {
        // Marking submission as uncompleted
        const submission = this.data[type].find(item => item.timestamp === timestamp);
        if (submission) {
            submission.completed = false;
            delete submission.completedDate;
            // Submission updated
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess(`Marked as uncompleted!`);
        } else {
            // Submission not found
            this.showError('Submission not found!');
        }
    }

    declineSubmission(type, timestamp) {
        // Declining submission
        if (confirm('Are you sure you want to decline/remove this submission?')) {
            const originalLength = this.data[type].length;
            this.data[type] = this.data[type].filter(item => item.timestamp !== timestamp);
            // Removed items from data
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess('Submission declined and removed!');
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This action cannot be undone and will delete all suggestions and orders.')) {
            // Clear dashboard data
            this.data.suggestions = [];
            this.data.orders = [];
            this.data.lastSync = null;
            this.saveLocalData();
            
            // Clear all localStorage data
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('suggestion_') || key.startsWith('order_') || key === 'adminDashboardData') {
                    localStorage.removeItem(key);
                }
            });
            
            // Update UI
            this.renderSubmissions();
            this.updateStats();
            this.showSuccess('All data has been cleared successfully!');
        }
    }

    // Old methods (keeping for compatibility)
    deleteSubmission(type, timestamp) {
        if (confirm('Are you sure you want to delete this submission?')) {
            this.data[type] = this.data[type].filter(item => item.timestamp !== timestamp);
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess('Submission deleted successfully!');
        }
    }

    markAsReviewed(type, timestamp) {
        const submission = this.data[type].find(item => item.timestamp === timestamp);
        if (submission) {
            submission.reviewed = true;
            submission.reviewedDate = Date.now();
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess('Marked as reviewed!');
        }
    }

    updateOrderStatus(timestamp, status) {
        const order = this.data.orders.find(item => item.timestamp === timestamp);
        if (order) {
            order.status = status;
            order.statusUpdated = Date.now();
            this.saveLocalData();
            this.renderSubmissions();
            this.showSuccess(`Order status updated to ${status}!`);
        }
    }

    filterSubmissions(type, searchTerm) {
        const container = document.getElementById(`${type}List`);
        const cards = container.querySelectorAll('.submission-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(searchTerm.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterSubmissionsByType(type, filterValue) {
        const container = document.getElementById(`${type}List`);
        const cards = container.querySelectorAll('.submission-card');
        
        cards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
            } else {
                const typeElement = card.querySelector('.submission-type');
                if (typeElement && typeElement.textContent.toLowerCase() === filterValue.toLowerCase()) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // Auto-sync
    startAutoSync() {
        // Sync every 5 minutes
        setInterval(() => {
            if (this.isLoggedIn) {
                this.syncData();
            }
        }, 5 * 60 * 1000);
    }

    // Notifications
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard and make it globally accessible
const dashboard = new AdminDashboard();
window.dashboard = dashboard;

// Only initialize if we're on the admin dashboard page
if (window.location.pathname.includes('adm-orrzz') || window.location.href.includes('adm-orrzz')) {
    document.addEventListener('DOMContentLoaded', function() {
        dashboard.init();
    });
}
