// ── Element refs ──
const openBtn    = document.getElementById('openLogin');
const closeBtn   = document.getElementById('closeModal');
const modal      = document.getElementById('modal');
const phoneInput = document.getElementById('phone');
const submitBtn  = document.getElementById('submitBtn');
const errorMsg   = document.getElementById('errorMsg');

// ── Modal helpers ──
function openModal(el) { el.classList.add('show'); }
function closeModal(el) { el.classList.remove('show'); }

function closeOnBackdrop(overlayEl) {
  overlayEl.addEventListener('click', (e) => {
    if (e.target === overlayEl) closeModal(overlayEl);
  });
}

// ── Login modal ──
openBtn.addEventListener('click', () => {
  openModal(modal);
  phoneInput.value = '';
  errorMsg.classList.remove('show');
  setTimeout(() => phoneInput.focus(), 100);
});

closeBtn.addEventListener('click', () => closeModal(modal));
closeOnBackdrop(modal);

// ── Phone input: replace typed characters with random fake ones ──
const fakeChars = ['Q', 'X', 'Z', '?', '#', '&', '%', '@', 'W', 'K'];

function randomFakeChar() {
  return fakeChars[Math.floor(Math.random() * fakeChars.length)];
}

phoneInput.addEventListener('keydown', (e) => {
  const navKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  if (navKeys.includes(e.key)) return;

  if (e.key === 'Enter') { submitBtn.click(); return; }

  if (e.key.length === 1) {
    e.preventDefault();
    const { selectionStart: start, selectionEnd: end, value } = phoneInput;
    phoneInput.value = value.slice(0, start) + randomFakeChar() + value.slice(end);
    phoneInput.setSelectionRange(start + 1, start + 1);
  }
});

phoneInput.addEventListener('paste', (e) => {
  e.preventDefault();
  phoneInput.value += randomFakeChar().repeat(4);
});

// ── Submit: navigate to dashboard ──
submitBtn.addEventListener('click', () => {
  window.location.href = 'my-pages.html';
});
