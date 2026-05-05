function handleForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = form.querySelectorAll('[required]');
    const valid = [...inputs].every(el => el.value.trim() !== '');
    if (!valid) {
      inputs.forEach(el => {
        el.style.borderColor = el.value.trim() === '' ? '#c0392b' : '';
      });
      return;
    }
    form.style.display = 'none';
    success.classList.add('show');
  });
}

handleForm('messageForm', 'msgSuccess');
handleForm('callForm', 'callSuccess');
