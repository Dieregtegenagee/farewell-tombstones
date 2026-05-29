const adminLoginForm = document.getElementById('adminLoginForm');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginNote = document.getElementById('adminLoginNote');
const adminLoginSection = document.getElementById('adminLoginSection');
const adminDashboardSection = document.getElementById('adminDashboardSection');
const logoutButton = document.getElementById('logoutButton');
const ordersCount = document.getElementById('ordersCount');
const contactsCount = document.getElementById('contactsCount');
const materialsCount = document.getElementById('materialsCount');
const ordersTableBody = document.getElementById('ordersTableBody');
const contactsTableBody = document.getElementById('contactsTableBody');
const materialsTableBody = document.getElementById('materialsTableBody');
const addMaterialForm = document.getElementById('addMaterialForm');
const newMaterialName = document.getElementById('newMaterialName');
const newMaterialDescription = document.getElementById('newMaterialDescription');

const ADMIN_TOKEN_KEY = 'farwellAdminToken';
let refreshInterval = null;

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function showLogin() {
  adminLoginSection.classList.remove('hidden');
  adminDashboardSection.classList.add('hidden');
  adminLoginNote.textContent = 'Enter your admin password to view orders, customers, and materials.';
  clearRefresh();
}

function showDashboard() {
  adminLoginSection.classList.add('hidden');
  adminDashboardSection.classList.remove('hidden');
  fetchDashboard();
  startRefresh();
}

function clearRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

function handleUnauthorized() {
  clearAdminToken();
  showLogin();
  adminLoginNote.textContent = 'Session expired. Please sign in again.';
}

async function fetchDashboard() {
  try {
    const [ordersRes, contactsRes, materialsRes] = await Promise.all([
      fetch('/api/orders', { headers: authHeaders() }),
      fetch('/api/contacts', { headers: authHeaders() }),
      fetch('/api/materials'),
    ]);

    if (ordersRes.status === 401 || contactsRes.status === 401) {
      return handleUnauthorized();
    }

    if (!ordersRes.ok || !contactsRes.ok || !materialsRes.ok) {
      adminLoginNote.textContent = 'Unable to refresh dashboard. Check API access.';
      return;
    }

    const ordersData = await ordersRes.json();
    const contactsData = await contactsRes.json();
    const materialsData = await materialsRes.json();

    ordersCount.textContent = ordersData.orders.length;
    contactsCount.textContent = contactsData.contacts.length;
    materialsCount.textContent = materialsData.materials.length;

    renderOrders(ordersData.orders);
    renderContacts(contactsData.contacts);
    renderMaterials(materialsData.materials);
  } catch (error) {
    adminLoginNote.textContent = 'Unable to reach the server. Please try again later.';
    console.error('Dashboard fetch error:', error);
  }
}

function renderOrders(orders) {
  ordersTableBody.innerHTML = orders.map((order) => `
    <tr>
      <td>${order.id}</td>
      <td>${order.name}<br/><small>${order.email}</small></td>
      <td>${order.productType}</td>
      <td>${order.material}</td>
      <td>${order.quantity}</td>
      <td>${new Date(order.orderedAt).toLocaleString()}</td>
    </tr>
  `).join('');
}

function renderContacts(contacts) {
  contactsTableBody.innerHTML = contacts.map((contact) => `
    <tr>
      <td>${contact.id}</td>
      <td>${contact.name}</td>
      <td>${contact.email}</td>
      <td>${contact.message}</td>
      <td>${new Date(contact.submittedAt).toLocaleString()}</td>
    </tr>
  `).join('');
}

function renderMaterials(materials) {
  materialsTableBody.innerHTML = materials.map((material) => `
    <tr data-id="${material.id}">
      <td><input class="material-name" value="${material.name}" /></td>
      <td><input class="material-description" value="${material.description || ''}" /></td>
      <td><label><input type="checkbox" class="material-available" ${material.available ? 'checked' : ''} /> Active</label></td>
      <td><button type="button" class="btn btn--secondary save-material">Save</button></td>
    </tr>
  `).join('');

  document.querySelectorAll('.save-material').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const row = event.target.closest('tr');
      const id = row.dataset.id;
      const name = row.querySelector('.material-name').value.trim();
      const description = row.querySelector('.material-description').value.trim();
      const available = row.querySelector('.material-available').checked;

      try {
        const response = await fetch(`/api/materials/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(),
          },
          body: JSON.stringify({ name, description, available }),
        });

        const result = await response.json();
        if (!response.ok) {
          adminLoginNote.textContent = result.message || 'Unable to save the material.';
          return;
        }

        adminLoginNote.textContent = 'Material saved successfully.';
        fetchDashboard();
      } catch (error) {
        adminLoginNote.textContent = 'Unable to save the material at this time.';
        console.error('Material update error:', error);
      }
    });
  });
}

adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = adminPasswordInput.value.trim();
  if (!password) {
    adminLoginNote.textContent = 'Please enter the admin password.';
    return;
  }

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const result = await response.json();

    if (!response.ok) {
      adminLoginNote.textContent = result.message || 'Invalid password.';
      return;
    }

    setAdminToken(result.token);
    adminPasswordInput.value = '';
    showDashboard();
  } catch (error) {
    adminLoginNote.textContent = 'Unable to sign in. Please try again later.';
    console.error('Admin login error:', error);
  }
});

logoutButton?.addEventListener('click', () => {
  clearAdminToken();
  showLogin();
});

addMaterialForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = newMaterialName.value.trim();
  const description = newMaterialDescription.value.trim();

  if (!name) {
    adminLoginNote.textContent = 'Material name is required.';
    return;
  }

  try {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({ name, description }),
    });
    const result = await response.json();

    if (!response.ok) {
      adminLoginNote.textContent = result.message || 'Unable to create material.';
      return;
    }

    newMaterialName.value = '';
    newMaterialDescription.value = '';
    adminLoginNote.textContent = 'Material added successfully.';
    fetchDashboard();
  } catch (error) {
    adminLoginNote.textContent = 'Unable to add material at this time.';
    console.error('Add material error:', error);
  }
});

function startRefresh() {
  clearRefresh();
  refreshInterval = setInterval(fetchDashboard, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  if (getAdminToken()) {
    showDashboard();
  } else {
    showLogin();
  }
});
