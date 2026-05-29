const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('main-nav');
const contactForm = document.getElementById('contactForm');
const orderForm = document.getElementById('orderForm');
const formNote = document.getElementById('formNote');
const orderNote = document.getElementById('orderNote');

menuBtn?.addEventListener('click', () => {
  nav.classList.toggle('open');
});

async function submitForm(form, url, noteElement, successMessage) {
  const formData = new FormData(form);
  const body = Object.fromEntries(formData.entries());

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (result.success) {
    noteElement.textContent = successMessage;
    form.reset();
  } else {
    noteElement.textContent = result.message || 'Unable to submit form. Please try again.';
  }
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitForm(contactForm, '/api/contact', formNote, 'Thank you! Your message has been submitted.');
});

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitForm(orderForm, '/api/order', orderNote, 'Your order request has been received. We will follow up soon.');
});

async function loadMaterials() {
  const select = document.getElementById('materialSelect');
  if (!select) return;

  try {
    const response = await fetch('/api/materials');
    if (!response.ok) return;
    const data = await response.json();
    select.innerHTML = '<option value="">Select stone type</option>';
    data.materials.forEach((material) => {
      const option = document.createElement('option');
      option.value = material.name;
      option.textContent = material.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Unable to load materials:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadMaterials);
