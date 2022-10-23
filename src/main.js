const express = require('express')
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'maliServ1',
  database: 'first-base'
});

const app = express()

app.use(express.static(__dirname + '/client'));

app.listen(3000, function() {
  console.log('===================== server started =====================')
})


app.get('/user_login/:login_query', function(req, res) {
  const login_query = req.params.login_query
  account(login_query, res, req)
})

function account(login_query, res, req) {
  connection.promise().query(
    `WITH d AS (SELECT user_id, description, price FROM orders_users o
                    LEFT JOIN products p ON p.id = o.product_id)
          SELECT login, SUM(c.price) - IFNULL(SUM(d.price), 0) AS 'balance',
          IF (description = "50% на звонки ST", "Уже использовано", "Использовать скидку") AS 'calling',
          IF (description = "30% за спецкурс", "Уже использовано", "Использовать скидку") AS 'speccourse',
          IF (description = "50% за курс", "Уже использовано", "Использовать скидку") AS 'fifcourse',
          IF (description = "65% за курс", "Уже использовано", "Использовать скидку") AS 'sfifcourse'
          FROM users u
          LEFT JOIN coins c ON c.user_id = u.id
          LEFT JOIN d ON d.user_id = u.id
          WHERE login LIKE ?
          GROUP BY login, description
        `, login_query)
    .then(function(data) {
      const accounts = data[0]
      res.send(`
        <!doctype html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <link rel="stylesheet" href="/css/style.css">
          <title>Тестовое English Tochka</title>
        </head>
        <body>
        
          <section class="account">
          
          <div class="lock-padding container account__container">
        
            <div class="account__options">
              <div class="account__balance">
                <h4 class="balance__title">Ваш баланс:</h4>
                <div class="balance__content">
                  <img class="balance__coin" src="../img/coin.png" alt="ET3 coin">
                  ${accounts.map(account => `<p class="balance__money">${account.balance}</p>`)} 
                  
                  <div class="balance__currency"></div>
                </div>
              </div>
            
              <div class="account__sale">
                <div class="sale__title">
                  <h5 class="sale__text">Варианты обмена на скидку</h5>
                  <a href="#instruction" class="sale__instruction">Инструкция</a>
                </div>
        
              <div class="sale__variants">
          
                <div class="sale__variant">
                  <div class="variant__price">
                    <img class="variant__coin" src="../img/small_coin.png" alt="ET3 coin">
                    <p class="variant__money">50</p>
                    <div class="variant__currency"></div>
                  </div>
                  <img src="../img/phone.svg" alt="" class="variant__icon">
                  <div class="variant__product">
                    <img src="../img/50
                    
                    %25.svg" alt="" class="variant__product-sale-icon">
                    <small class="variant__text">на звонки ST (x2)</small> 
                  </div>
                  ${accounts.map(account => `<button class="btn variant__btn-done">${account.calling}</button>`)}
                </div>
        
                <div class="sale__variant">
                  <div class="variant__price">
                    <img class="variant__coin" src="../img/small_coin.png" alt="ET3 coin">
                    <p class="variant__money">70</p>
                    <div class="variant__currency"></div>
                  </div>
                  <img src="../img/spec-course.svg" alt="" class="variant__icon">
                  <div class="variant__product">
                    <img src="../img/30%25.svg" alt="" class="variant__product-sale-icon">
                    <small class="variant__text">на спецкурс</small>
                  </div>
                  ${accounts.map(account => `<button class="btn variant__btn-use">${account.speccourse}</button>`)}
                </div>
          
                <div class="sale__variant">
                  <div class="variant__price">
                    <img class="variant__coin" src="../img/small_coin.png" alt="ET3 coin">
                    <p class="variant__money">100</p>
                    <div class="variant__currency"></div>
                  </div>
                  <img src="../img/course.svg" alt="" class="variant__icon">
                  <div class="variant__product">
                    <img src="../img/50%25.svg" alt="" class="variant__product-sale-icon">
                    <small class="variant__text">на курс</small>
                  </div>
                  ${accounts.map(account => `<button class="btn variant__btn-use">${account.fifcourse}</button>`)}
                </div>
          
                <div class="sale__variant">
                  <div class="variant__price">
                    <img class="variant__coin" src="../img/small_coin.png" alt="ET3 coin">
                    <p class="variant__money">139</p>
                    <div class="variant__currency"></div>
                  </div>
                  <img src="../img/course.svg" alt="" class="variant__icon">
                  <div class="variant__product">
                    <img src="../img/65%25.svg" alt="" class="variant__product-sale-icon">
                    <small class="variant__text">на курс</small>
                  </div>
                  ${accounts.map(account => `<button class="btn variant__btn-use">${account.sfifcourse}</button>`)}
                </div>
              </div>
              
              <div class="account__popup" id="instruction">
                <div class="popup__container">
                  <div class="popup__content">
                    <a class="popup__btn-close close-popup" href="#"></a>
                    <div class="popup__title">Инструкция</div>
                    <div class="popup__text">После публикации сделайте скрин, что вы его написали и отправьте своему куратору, чтобы мы добавили вам спецкурс в личный кабинет.</div>
                    <div class="popup__text">После публикации сделайте скрин, что вы его написали и отправьте своему куратору, чтобы мы добавили вам спецкурс в личный кабинет.</div>
                    <div class="popup__text">После публикации сделайте скрин, что вы его написали и отправьте своему куратору, чтобы мы добавили вам спецкурс в личный кабинет.</div>
                    <div class="popup__text">После публикации сделайте скрин, что вы его написали и отправьте своему куратору, чтобы мы добавили вам спецкурс в личный кабинет.</div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
          </section>
        
          <section class="user-form">
            <div class="container user-form__container">
            <form class="form" action="/data/1" method="get">
              <label>
                <input class="form__input" name="userLogin" placeholder="Введите логин" type="text">
              </label>
              <button class="btn form__btn" type="submit">Получить данные</button>
            </form>
          </section>
        
        <script src="../js/popup.js"></script>
        <script type="module" src="../js/check-user.js"></script>
        <script type="module" src="server/router.js"></script>
        </body>
        </html>
    `)
    })
}