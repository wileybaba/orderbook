const Koa = require("koa")
const Router = require("koa-router")
const cors = require("koa2-cors")
const bodyParser = require("koa-body-parser")
const static = require('koa-static');
const fetch = require("node-fetch")
require('dotenv').config()

const app = new Koa()
const router = new Router()

app.use(cors())

if (process.env.NODE_ENV === 'production') {
  app.use(static('frontend/build'));

  router.get('*', async (ctx, next) => {
    try {
      await send(ctx, '/frontend/build/index.html');
    } catch(err) {
      console.log(err)
      return next();
    }
  });
}

let exchangeDepth = 3

router.get('/orderbook/:pair', async (ctx, next) => {

  ctx.body = await fetchBooks(ctx.params.pair)
  console.log(ctx.body)
})

router.get('/test', (ctx, next) => {
  ctx.body = "TESTING"
})

const fetchBooks = async pair => {

  let poloBids = []
  let poloAsks = []
  let bittrexBids = []
  let bittrexAsks = []

  const poloURL    = "https://poloniex.com/public?command=returnOrderBook&currencyPair=" + pair + "&depth=" + exchangeDepth,
        bittrexURL = "https://api.bittrex.com/api/v1.1/public/getorderbook?market=" + pair.replace(/_/g, '-') + "&type=both"

  await fetch(poloURL)
    .then(res => {
      return res.json();
    })
    .then(resData => {
      poloAsks = normalizePolo(resData.asks)
      poloBids = normalizePolo(resData.bids)

      return poloAsks, poloBids
    })
    .catch(err => {
      console.log(err)
    })

  await fetch(bittrexURL)
    .then(res => {
      return res.json();
    })
    .then(resData => {
      bittrexAsks = normalizeBittrex(resData.result.buy.slice(0, exchangeDepth))
      bittrexBids = normalizeBittrex(resData.result.sell.slice(0, exchangeDepth))
    })
    .catch(err => {
      console.log(err)
    })

  const totalBids = [...poloBids, ...bittrexBids].sort((a,b) => (b-a))
  const totalAsks = [...poloAsks, ...bittrexAsks].sort((a,b) => (a-b))

  return {totalBids, totalAsks}
}

const normalizePolo = obj => {
  let newArr = obj.map((val, i) => {
    return [parseFloat(val[0]), val[1], "Poloniex"]
  })
  return newArr
}

const normalizeBittrex = obj => {
  const arr = obj.map(Object.values)
  const newArr = arr.map(val => val.reverse())
  return newArr.map((val, i) => {
    return [val[0], val[1], "Bittrex"]
  })
}

app
  .use(router.allowedMethods())
  .use(router.routes())
  .use(bodyParser)

const port = process.env.PORT || 8000;
app.listen(port);
console.log(`Listening on port ${port}`)
