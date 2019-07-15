
let APIurl
process.env.NODE_ENV === 'production'
  ? APIurl = `https://orderbook802.herokuapp.com/`
  : APIurl = `http://localhost:8001/`

export default APIurl
