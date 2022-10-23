function checkUser() {
  document.addEventListener('DOMContentLoaded', () => {

    const inputLogin = document.querySelector('.form__input')
    const btnData = document.querySelector('.form__btn')

    inputLogin.addEventListener('input', function (e) {
      const login_query = inputLogin.value
    })

    btnData.addEventListener('click', function (e) {
      e.preventDefault()
    })
  })
}

checkUser()
