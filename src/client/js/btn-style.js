// =========================== ADD CLASS TO BTN ==========================
const btn = document.querySelectorAll('.btn')

btn.forEach(btn => {
  if (btn.innerHTML === 'Уже использовано') {
    btn.classList.add('variant__btn-done')
  } else {
    btn.classList.add('variant__btn-use')
  }
})