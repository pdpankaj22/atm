/**
 * Virtual ATM System - Application Logic
 * Full client-side ATM engine with localStorage persistence and zero external dependencies
 */

// --- Database Layer ---
const ATMDB = {
  STORAGE_KEY: 'virtual_atm_storage_v1',

  init() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.resetToSeed();
    }
  },

  resetToSeed() {
    // Clone seed data to avoid mutation
    const initial = JSON.parse(JSON.stringify(SEED_DATA));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.resetToSeed();
    } catch (e) {
      console.error('Failed to parse storage, resetting', e);
      return this.resetToSeed();
    }
  },

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  getUsers() {
    return this.getData().users;
  },

  getUser(accountNumber) {
    const users = this.getUsers();
    return users.find(u => String(u.account_number).trim() === String(accountNumber).trim()) || null;
  },

  saveUser(updatedUser) {
    const data = this.getData();
    const index = data.users.findIndex(u => String(u.account_number).trim() === String(updatedUser.account_number).trim());
    if (index >= 0) {
      data.users[index] = updatedUser;
    } else {
      data.users.push(updatedUser);
    }
    this.saveData(data);
  },

  getTransactions(accountNumber) {
    const data = this.getData();
    return data.transactions
      .filter(t => String(t.account_number).trim() === String(accountNumber).trim())
      .sort((a, b) => b.id - a.id);
  },

  addTransaction(accountNumber, type, amount, balanceAfter) {
    const data = this.getData();
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const nextId = data.transactions.length > 0 
      ? Math.max(...data.transactions.map(t => t.id || 0)) + 1 
      : 1;

    const newTxn = {
      id: nextId,
      account_number: String(accountNumber),
      type,
      amount: parseFloat(amount),
      balance_after: parseFloat(balanceAfter),
      date: dateStr
    };

    data.transactions.push(newTxn);
    this.saveData(data);
    return newTxn;
  }
};

// --- ATM Core Business Logic ---
const ATMService = {
  login(accountNumber, pin) {
    const user = ATMDB.getUser(accountNumber);
    if (user && String(user.pin).trim() === String(pin).trim()) {
      sessionStorage.setItem('current_user_account', user.account_number);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid Account Number or PIN' };
  },

  getCurrentUser() {
    const acc = sessionStorage.getItem('current_user_account');
    if (!acc) return null;
    return ATMDB.getUser(acc);
  },

  logout() {
    sessionStorage.removeItem('current_user_account');
  },

  signup(name, accountNumber, pin, initialBalance = 0) {
    const cleanAcc = String(accountNumber).trim();
    if (!cleanAcc || !name.trim() || !pin.trim()) {
      return { success: false, message: 'All fields are required!' };
    }

    if (ATMDB.getUser(cleanAcc)) {
      return { success: false, message: 'Account number already exists!' };
    }

    const newUser = {
      account_number: cleanAcc,
      name: name.trim(),
      pin: pin.trim(),
      balance: parseFloat(initialBalance) || 0.0,
      email: null,
      phone: null
    };

    ATMDB.saveUser(newUser);

    if (newUser.balance > 0) {
      ATMDB.addTransaction(cleanAcc, 'Deposit', newUser.balance, newUser.balance);
    }

    return { success: true, message: 'Account Created Successfully! Please log in.' };
  },

  deposit(accountNumber, amount) {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than ₹0.' };
    }

    const user = ATMDB.getUser(accountNumber);
    if (!user) return { success: false, message: 'User not found.' };

    user.balance += val;
    ATMDB.saveUser(user);
    ATMDB.addTransaction(accountNumber, 'Deposit', val, user.balance);

    return {
      success: true,
      message: `Deposited ₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. New Balance: ₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      newBalance: user.balance
    };
  },

  withdraw(accountNumber, amount) {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than ₹0.' };
    }

    const user = ATMDB.getUser(accountNumber);
    if (!user) return { success: false, message: 'User not found.' };

    if (val > user.balance) {
      return { success: false, message: 'Insufficient Balance!' };
    }

    user.balance -= val;
    ATMDB.saveUser(user);
    ATMDB.addTransaction(accountNumber, 'Withdraw', val, user.balance);

    return {
      success: true,
      message: `Withdrawn ₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. New Balance: ₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      newBalance: user.balance
    };
  },

  transfer(senderAccount, recipientAccount, amount) {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      return { success: false, message: 'Please enter a valid amount greater than ₹0.' };
    }

    const cleanSender = String(senderAccount).trim();
    const cleanRecipient = String(recipientAccount).trim();

    if (cleanSender === cleanRecipient) {
      return { success: false, message: 'Cannot transfer funds to your own account!' };
    }

    const sender = ATMDB.getUser(cleanSender);
    const recipient = ATMDB.getUser(cleanRecipient);

    if (!sender) return { success: false, message: 'Sender account not found.' };
    if (!recipient) return { success: false, message: 'Recipient account not found!' };

    if (val > sender.balance) {
      return { success: false, message: 'Insufficient Balance!' };
    }

    sender.balance -= val;
    recipient.balance += val;

    ATMDB.saveUser(sender);
    ATMDB.saveUser(recipient);

    ATMDB.addTransaction(cleanSender, 'Transfer Sent', val, sender.balance);
    ATMDB.addTransaction(cleanRecipient, 'Transfer Received', val, recipient.balance);

    return {
      success: true,
      message: `Transferred ₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to ${recipient.name} (${cleanRecipient}). New Balance: ₹${sender.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      newBalance: sender.balance,
      recipientName: recipient.name
    };
  },

  changePin(accountNumber, oldPin, newPin) {
    const user = ATMDB.getUser(accountNumber);
    if (!user) return { success: false, message: 'User not found.' };

    if (String(user.pin).trim() !== String(oldPin).trim()) {
      return { success: false, message: 'Current PIN is incorrect.' };
    }

    if (!newPin || newPin.trim().length < 3) {
      return { success: false, message: 'New PIN must be at least 3 digits.' };
    }

    user.pin = String(newPin).trim();
    ATMDB.saveUser(user);
    return { success: true, message: 'PIN changed successfully!' };
  }
};

// --- UI Controller ---
const AppUI = {
  currentTab: 'overview',

  init() {
    ATMDB.init();
    this.bindEvents();
    this.populateDemoAccounts();
    this.render();
  },

  bindEvents() {
    // Auth Tab Switch
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        document.getElementById('loginFormContainer').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('signupFormContainer').style.display = tab === 'signup' ? 'block' : 'none';
      });
    });

    // Demo account selector
    const demoSelect = document.getElementById('demoAccountSelect');
    if (demoSelect) {
      demoSelect.addEventListener('change', (e) => {
        if (!e.target.value) return;
        const [acc, pin] = e.target.value.split(':');
        document.getElementById('loginAccount').value = acc;
        document.getElementById('loginPin').value = pin;
      });
    }

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const acc = document.getElementById('loginAccount').value.trim();
        const pin = document.getElementById('loginPin').value.trim();
        const res = ATMService.login(acc, pin);
        if (res.success) {
          this.notify('Login successful! Welcome back.', 'success');
          this.render();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Signup Form Submit
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const acc = document.getElementById('signupAccount').value.trim();
        const pin = document.getElementById('signupPin').value.trim();
        const initial = document.getElementById('signupBalance').value;

        const res = ATMService.signup(name, acc, pin, initial);
        if (res.success) {
          this.notify(res.message, 'success');
          // Switch to login
          document.querySelector('[data-tab="login"]').click();
          document.getElementById('loginAccount').value = acc;
          document.getElementById('loginPin').value = pin;
          signupForm.reset();
          this.populateDemoAccounts();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        ATMService.logout();
        this.notify('You have been logged out securely.', 'info');
        this.render();
      });
    }

    // Dashboard Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Quick Amount buttons for Deposit
    document.querySelectorAll('.quick-deposit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.target.dataset.amount;
        const input = document.getElementById('depositAmount');
        input.value = (parseFloat(input.value) || 0) + parseFloat(val);
      });
    });

    // Quick Amount buttons for Withdraw
    document.querySelectorAll('.quick-withdraw-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = e.target.dataset.amount;
        document.getElementById('withdrawAmount').value = val;
      });
    });

    // Deposit Form
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
      depositForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = ATMService.getCurrentUser();
        const amount = document.getElementById('depositAmount').value;
        const res = ATMService.deposit(user.account_number, amount);
        if (res.success) {
          this.notify(res.message, 'success');
          depositForm.reset();
          this.updateDashboard();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Withdraw Form
    const withdrawForm = document.getElementById('withdrawForm');
    if (withdrawForm) {
      withdrawForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = ATMService.getCurrentUser();
        const amount = document.getElementById('withdrawAmount').value;
        const res = ATMService.withdraw(user.account_number, amount);
        if (res.success) {
          this.notify(res.message, 'success');
          withdrawForm.reset();
          this.updateDashboard();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Recipient Account Input live lookup preview
    const recipientInput = document.getElementById('transferRecipient');
    if (recipientInput) {
      recipientInput.addEventListener('input', (e) => {
        const target = e.target.value.trim();
        const previewEl = document.getElementById('recipientPreview');
        if (!target) {
          previewEl.textContent = '';
          return;
        }
        const user = ATMDB.getUser(target);
        const currentUser = ATMService.getCurrentUser();
        if (currentUser && target === currentUser.account_number) {
          previewEl.textContent = '⚠️ Cannot transfer to yourself';
          previewEl.className = 'field-hint warning';
        } else if (user) {
          previewEl.textContent = `✓ Recipient: ${user.name}`;
          previewEl.className = 'field-hint success';
        } else {
          previewEl.textContent = '❌ Account not found';
          previewEl.className = 'field-hint error';
        }
      });
    }

    // Transfer Form
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
      transferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = ATMService.getCurrentUser();
        const recipient = document.getElementById('transferRecipient').value;
        const amount = document.getElementById('transferAmount').value;
        const res = ATMService.transfer(user.account_number, recipient, amount);
        if (res.success) {
          this.notify(res.message, 'success');
          transferForm.reset();
          document.getElementById('recipientPreview').textContent = '';
          this.updateDashboard();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Change PIN Form
    const changePinForm = document.getElementById('changePinForm');
    if (changePinForm) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = ATMService.getCurrentUser();
        const oldPin = document.getElementById('oldPin').value;
        const newPin = document.getElementById('newPin').value;
        const confirmPin = document.getElementById('confirmPin').value;

        if (newPin !== confirmPin) {
          this.notify('New PIN and Confirm PIN do not match!', 'error');
          return;
        }

        const res = ATMService.changePin(user.account_number, oldPin, newPin);
        if (res.success) {
          this.notify(res.message, 'success');
          changePinForm.reset();
        } else {
          this.notify(res.message, 'error');
        }
      });
    }

    // Reset Demo Data
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Reset all demo accounts and transactions back to the original database state?')) {
          ATMDB.resetToSeed();
          this.populateDemoAccounts();
          this.notify('All data reset to initial database state.', 'info');
          this.render();
        }
      });
    }

    // Statement Filter
    const filterSelect = document.getElementById('statementFilter');
    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        this.renderStatementTable();
      });
    }
  },

  populateDemoAccounts() {
    const select = document.getElementById('demoAccountSelect');
    if (!select) return;

    select.innerHTML = '<option value="">⚡ Or Choose a Test Account...</option>';
    const users = ATMDB.getUsers();
    users.forEach(u => {
      const opt = document.createElement('option');
      opt.value = `${u.account_number}:${u.pin}`;
      opt.textContent = `${u.name} (Acc: ${u.account_number} | PIN: ${u.pin} | ₹${u.balance.toLocaleString()})`;
      select.appendChild(opt);
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });

    if (tabName === 'statement') {
      this.renderStatementTable();
    }
  },

  render() {
    const user = ATMService.getCurrentUser();
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const userBadge = document.getElementById('userHeaderBadge');

    if (!user) {
      authSection.style.display = 'block';
      dashboardSection.style.display = 'none';
      if (userBadge) userBadge.style.display = 'none';
      this.populateDemoAccounts();
    } else {
      authSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      if (userBadge) userBadge.style.display = 'flex';
      this.updateDashboard();
    }
  },

  updateDashboard() {
    const user = ATMService.getCurrentUser();
    if (!user) return;

    // Header info
    document.getElementById('headerUserName').textContent = user.name;
    document.getElementById('headerUserAcc').textContent = `Acc: ${user.account_number}`;

    // Debit Card details
    document.getElementById('cardHolderName').textContent = user.name.toUpperCase();
    document.getElementById('cardBalance').textContent = `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Format account number like a debit card: 989555 -> 5241 •••• •••• 9555
    const accStr = String(user.account_number);
    const masked = accStr.length > 4 
      ? `5241 •••• •••• ${accStr.slice(-4)}`
      : `5241 •••• •••• ${accStr.padStart(4, '0')}`;
    document.getElementById('cardNumberDisplay').textContent = masked;

    // Overview Stats
    document.getElementById('overviewBalance').textContent = `₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    const txns = ATMDB.getTransactions(user.account_number);
    document.getElementById('overviewTxnCount').textContent = txns.length;

    // Recent activity list on overview
    this.renderRecentActivity(txns.slice(0, 4));

    // Render statement table if on statement tab
    if (this.currentTab === 'statement') {
      this.renderStatementTable();
    }
  },

  renderRecentActivity(txns) {
    const container = document.getElementById('recentActivityList');
    if (!container) return;

    if (txns.length === 0) {
      container.innerHTML = '<p class="empty-state">No transactions yet.</p>';
      return;
    }

    container.innerHTML = txns.map(t => {
      const isPositive = t.type === 'Deposit' || t.type === 'Transfer Received';
      const sign = isPositive ? '+' : '-';
      const badgeClass = isPositive ? 'badge-success' : 'badge-danger';
      return `
        <div class="activity-item">
          <div class="activity-left">
            <span class="activity-icon ${isPositive ? 'icon-in' : 'icon-out'}">
              ${isPositive ? '↓' : '↑'}
            </span>
            <div class="activity-meta">
              <span class="activity-type">${t.type}</span>
              <span class="activity-date">${t.date}</span>
            </div>
          </div>
          <div class="activity-amount ${isPositive ? 'text-success' : 'text-danger'}">
            ${sign} ₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
      `;
    }).join('');
  },

  renderStatementTable() {
    const user = ATMService.getCurrentUser();
    if (!user) return;

    const tbody = document.getElementById('statementTableBody');
    if (!tbody) return;

    let txns = ATMDB.getTransactions(user.account_number);
    const filter = document.getElementById('statementFilter')?.value || 'all';

    if (filter !== 'all') {
      txns = txns.filter(t => {
        if (filter === 'deposit') return t.type === 'Deposit';
        if (filter === 'withdraw') return t.type === 'Withdraw';
        if (filter === 'transfer') return t.type.includes('Transfer');
        return true;
      });
    }

    if (txns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-table">No transactions found.</td></tr>`;
      return;
    }

    tbody.innerHTML = txns.map(t => {
      const isPositive = t.type === 'Deposit' || t.type === 'Transfer Received';
      const sign = isPositive ? '+' : '-';
      const badgeClass = isPositive ? 'badge-success' : 'badge-danger';

      return `
        <tr>
          <td><span class="txn-id">#${t.id}</span></td>
          <td>${t.date}</td>
          <td><span class="badge ${badgeClass}">${t.type}</span></td>
          <td class="${isPositive ? 'text-success font-semibold' : 'text-danger font-semibold'}">
            ${sign} ₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </td>
          <td class="font-semibold">₹${t.balance_after.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      `;
    }).join('');
  },

  notify(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast toast-${type} show`;

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  AppUI.init();
});
