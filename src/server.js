const Koa = require('koa')
const fetch = require('node-fetch')

const app = new Koa()

const poloURL = "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=10"

const fetchPoloniex = async () => {

  fetch(poloURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    })
    .catch(err => {
      console.log(err)
    })
}

fetchPoloniex()
