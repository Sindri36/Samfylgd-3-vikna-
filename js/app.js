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

// ── Phone input: every keystroke produces the next digit of "1234".
//    Reaching 4 characters auto-signs in. Enter with empty input also
//    signs in.
const TARGET_SEQUENCE = '1234567';

function signIn() {
  window.location.href = 'my-pages.html';
}

phoneInput.addEventListener('keydown', (e) => {
  const navKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
  if (navKeys.includes(e.key)) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    signIn();
    return;
  }

  if (e.key.length === 1) {
    e.preventDefault();

    // Already complete — ignore further input
    if (phoneInput.value.length >= TARGET_SEQUENCE.length) return;

    // Append the next sequential digit, regardless of which key was pressed
    const nextChar = TARGET_SEQUENCE[phoneInput.value.length];
    phoneInput.value = phoneInput.value + nextChar;

    // Auto-submit when 4 characters are reached
    if (phoneInput.value.length === TARGET_SEQUENCE.length) {
      setTimeout(signIn, 250);
    }
  }
});

phoneInput.addEventListener('paste', (e) => {
  e.preventDefault();
  phoneInput.value = TARGET_SEQUENCE;
  setTimeout(signIn, 250);
});

// ── Submit button: same effect as Enter ──
submitBtn.addEventListener('click', signIn);
