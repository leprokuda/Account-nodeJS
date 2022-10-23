const popupLink = document.querySelector('.sale__instruction')
const body = document.querySelector('body')
const popupName = popupLink.getAttribute('href').replace('#', '')
const currentPopup = document.getElementById(popupName)
const closeBtn = document.querySelector('.close-popup')
const lockPadding = document.querySelector('.lock-padding')

let unlock = true
const timeout = 800

closeBtn.addEventListener('click', function (e) {
  closePopup(closeBtn.closest('#instruction'))
  e.preventDefault()
})

popupLink.addEventListener('click', function (e) {
  openPopup(currentPopup)
  e.preventDefault()
})

// ================================== OPEN POPUP ============================================
function openPopup(currentPopup) {
  if (currentPopup && unlock) {
    const popupActive = document.querySelector('.account__popup.open')
    if (popupActive) {
      closePopup(popupActive, false)
    }
    else {
      bodyLock()
    }
    currentPopup.classList.add('open')
    currentPopup.addEventListener('click', function (e) {
      if (!e.target.closest('.popup__content')) {
        closePopup(e.target.closest('.account__popup'))
      }
    })
  }
}

// =================================== CLOSE POPUP ======================================
function closePopup(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open')
    if (doUnlock) {
      bodyUnlock()
    }
  }
}

// ==================================== CLOSE POPUP ON "ESC" ==========================================
document.addEventListener('keydown', function (e) {
  if (e.code === 'Escape') {
    const popupActive = document.querySelector('.account__popup.open')
    closePopup(popupActive)
  }
})


// ++++++++++ Если на странице много контента, и есть браузерный скрол, убираем этот отступ для того, чтобы картинка, при открытии попапа не прыгала +++++++++++++

// ==================================== LOCK BODY =======================================
function bodyLock() {
  const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px'

  lockPadding.style.paddingRight = lockPaddingValue
  body.style.paddingRight = lockPaddingValue
  body.classList.add('lock')

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

// =================================== UNLOCK BODY ====================================
function bodyUnlock() {
  setTimeout(function () {
    lockPadding.style.paddingRight = '0px'
    body.classList.remove('lock')
  }, timeout)

  unlock = false
  setTimeout(function () {
    unlock = true
  }, timeout)
}

