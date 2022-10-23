function checkUser() {
  document.addEventListener('DOMContentLoaded', () => {

    const inputLogin = document.querySelector('.form__input')
    const btnData = document.querySelector('.form__btn')

    inputLogin.addEventListener('input', function (e) {
      const userLogin = inputLogin.value
      console.log(userLogin)
    })

    btnData.addEventListener('click', function (e) {
      e.preventDefault()
    })
  })
}

checkUser()
