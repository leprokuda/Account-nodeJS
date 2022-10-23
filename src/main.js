// ================================= ADD LIB ===========================
const express = require('express')
const mysql = require('mysql2')

// ======================================= CONNECT TO SERVER ============================================
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'maliServ1',
  database: 'first-base'
});

const app = express()
app.use(express.static(__dirname + '/client'));

// ========================== START SEVER ON 3000 PORT ==========================================
app.listen(3000, function() {
  console.log('===================== server started =====================')
})

// ============================== OPEN SITE ON /user_login/(LOGIN)
// +++++ В зависимости от введенного логина, рендерится сайт
app.get('/user_login/:login_query', function(req, res) {
  const login_query = req.params.login_query
  account(login_query, res, req)
})

// ================== RENDERING ===========================
function account(login_query, res, req) {
  connection.promise().query(
    `WITH d AS (SELECT o.user_id, p.description, p.price FROM orders_users o
                    LEFT JOIN products p ON p.id = o.product_id),
              t as (SELECT u.id, u.login, SUM(c.price) - IFNULL(SUM(d.price), 0) AS 'balance',
                    IF (d.description = "50% на звонки ST", "Уже использовано", "Использовать скидку") AS 'calling',
                    IF (d.description = "30% за спецкурс", "Уже использовано", "Использовать скидку") AS 'speccourse',
                    IF (d.description = "50% за курс", "Уже использовано", "Использовать скидку") AS 'fifcourse',
                    IF (d.description = "65% за курс", "Уже использовано", "Использовать скидку") AS 'sfifcourse'
                    FROM users u
                    LEFT JOIN coins c ON c.user_id = u.id
                    LEFT JOIN d ON d.user_id = u.id
                    GROUP BY u.id, d.description),
              p as (SELECT CASE WHEN @us=t.id THEN @i:=@i+1 ELSE @i:=1 END num,
                    @us:=t.id as 'id', login, balance, calling, speccourse, fifcourse, sfifcourse
                    FROM t, (SELECT @i:=0, @us:=0) X
                    ORDER BY t.id),
              p2 as (Select case when num=2 then p.login end login,
                    case when num=2 then p.balance else 0 end balance,
                    case when num=2 then p.calling else 0 end calling,
                    case when num=2 then p.speccourse else 0 end speccourse,
                    case when num=2 then p.fifcourse else 0 end fifcourse,
                    case when num=2 then p.sfifcourse else 0 end sfifcourse
                    FROM p),
              p3 as (Select case when num=3 then p.login end login,
                    case when num=3 then p.balance else 0 end balance,
                    case when num=3 then p.calling else 0 end calling,
                    case when num=3 then p.speccourse else 0 end speccourse,
                    case when num=3 then p.fifcourse else 0 end fifcourse,
                    case when num=3 then p.sfifcourse else 0 end sfifcourse
                    FROM p),
              p4 as (Select case when num=4 then p.login end login,
                    case when num=4 then p.balance else 0 end balance,
                    case when num=4 then p.calling else 0 end calling,
                    case when num=4 then p.speccourse else 0 end speccourse,
                    case when num=4 then p.fifcourse else 0 end fifcourse,
                    case when num=4 then p.sfifcourse else 0 end sfifcourse
                    FROM p),
              prom as (SELECT case when num=1 then p.login else 0 end login,
                      case when num=1 then p.balance else 0 end bal1,
                      case when num=1 then p.calling else 0 end call1,
                      case when num=1 then p.speccourse else 0 end spcourse1,
                      case when num=1 then p.fifcourse else 0 end fcourse1,
                      case when num=1 then p.sfifcourse else 0 end sfcourse1,
                      p2.balance as 'bal2', p2.calling as 'call2', p2.speccourse as 'spcourse2',
                      p2.fifcourse as 'fcourse2', p2.fifcourse as 'sfcourse2',
                      p3.balance as 'bal3', p3.calling as 'call3', p3.speccourse as 'spcourse3',
                      p3.fifcourse as 'fcourse3', p3.fifcourse as 'sfcourse3',
                      p4.balance as 'bal4', p4.calling as 'call4', p4.speccourse as 'spcourse4',
                      p4.fifcourse as 'fcourse4', p4.fifcourse as 'sfcourse4'
                      FROM p
                      LEFT JOIN p2 on p2.login = p.login
                      LEFT JOIN p3 on p3.login = p.login
                      LEFT JOIN p4 on p4.login = p.login),
              itog as (SELECT login, IFNULL(bal1,0) + IFNULL(bal2,0) + IFNULL(bal3,0) + IFNULL(bal4,0) as balance,
                      case when call1='Уже использовано' or call2='Уже использовано' or call3='Уже использовано'
                      or call4='Уже использовано' then 'Уже использовано' else 'Использовать скидку' end calling,
                      case when spcourse1='Уже использовано' or spcourse2='Уже использовано' or spcourse3='Уже использовано'
                      or spcourse4='Уже использовано' then 'Уже использовано' else 'Использовать скидку' end speccourse,
                      case when fcourse1='Уже использовано' or fcourse2='Уже использовано' or fcourse3='Уже использовано'
                      or fcourse4='Уже использовано' then 'Уже использовано' else 'Использовать скидку' end fifcourse,
                      case when sfcourse1='Уже использовано' or sfcourse2='Уже использовано' or sfcourse3='Уже использовано'
                      or sfcourse4='Уже использовано' then 'Уже использовано' else 'Использовать скидку' end sfifcourse
                      FROM prom)
                      SELECT login, balance, calling, speccourse, fifcourse, sfifcourse
                      FROM itog
                      where login NOT like '0' AND login = ?
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
                    <img src="../img/50%25.svg" alt="" class="variant__product-sale-icon">
                    <small class="variant__text">на звонки ST (x2)</small> 
                  </div>
                  ${accounts.map(account => `<button class="btn">${account.calling}</button>`)}
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
                  ${accounts.map(account => `<button class="btn">${account.speccourse}</button>`)}
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
                  ${accounts.map(account => `<button class="btn">${account.fifcourse}</button>`)}
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
                  ${accounts.map(account => `<button class="btn">${account.sfifcourse}</button>`)}
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
        
        <script src="/js/btn-style.js"></script>
        <script src="/js/popup.js"></script>
        </body>
        </html>
    `)
    })
}