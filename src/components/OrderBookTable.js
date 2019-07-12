import React, { useState, useEffect } from 'react'

export default function OrderBookTable(props) {

  const [poloAsks, setPoloAsks] = useState([])
  const [bittrexAsks, setBittrexAsks] = useState([])
  const [poloBids, setPoloBids] = useState([])
  const [bittrexBids, setBittrexBids] = useState([])
  const [depth, setDepth] = useState(6)

  const exchangeDepth = depth/2

  const proxyURL   = "https://cors-anywhere.herokuapp.com/",
        poloURL    = "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=" + exchangeDepth,
        bittrexURL = "https://api.bittrex.com/api/v1.1/public/getorderbook?market=BTC-ETH&type=both"

  const fetchPoloniex = async () => {

    await fetch(proxyURL+poloURL)
      .then(res => {
        return res.json();
      })
      .then(resData => {
        setPoloAsks(normalizePolo(resData.asks))
        setPoloBids(normalizePolo(resData.bids))
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fetchBittrex = async () => {
    await fetch(proxyURL+bittrexURL)
      .then(res => {
        return res.json();
      })
      .then(resData => {
        setBittrexBids(normalizeBittrex(resData.result.buy.slice(0, exchangeDepth)))
        setBittrexAsks(normalizeBittrex(resData.result.sell.slice(0, exchangeDepth)))
      })
      .catch(err => {
        console.log(err)
      })
  }

  const normalizePolo = obj => {
    let newArr = obj.map(val => {
      return [parseFloat(val[0]), val[1], "Poloniex"]
    })
    return newArr
  }

  const normalizeBittrex = obj => {
    const arr = obj.map(Object.values)
    const newArr = arr.map(val => val.reverse())
    return newArr.map(val => {
      return [val[0], val[1], "Bittrex"]
    })
  }

  const totalAsks = [...poloAsks, ...bittrexAsks].sort((a,b) => (a-b))
  const totalBids = [...poloBids, ...bittrexBids].sort((a,b) => (b-a))

  const lowestAsk = totalAsks.filter((item, _, arr) => item === arr[0]).flat()
  const highestBid = totalBids.filter((item, _, arr) => item === arr[0]).flat()

  const spread = (lowestAsk[0] - highestBid[0]).toFixed(9)

  useEffect(() => {
    const interval = setInterval(() => {
        fetchPoloniex()
        fetchBittrex()
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  // const combineBooks = arr => {
  //   let a = arr.concat();
  //   for (let i=0; i<a.length; i++) {
  //       for(let j=i+1; j<a.length; j++) {
  //           if(a[i][0] === a[j][0]) {
  //             a.splice(j--, 1)
  //             console.log(a)
  //           }
  //       }
  //   }
  //
  //   return a;
  // }



  const asksTable = totalAsks.reverse().map(ask => {
      return (
        <tr key={Math.random()}>
          <td>{ask[0]}</td>
          <td>{ask[1]}</td>
          <td>{ask[2]}</td>
        </tr>
      )
    })

  const bidsTable = totalBids.map(bid => {
    return (
      <tr key={Math.random()}>
        <td>{bid[0]}</td>
        <td>{bid[1]}</td>
        <td>{bid[2]}</td>
      </tr>
    )
  })

  return (

    <section style={{marginTop: "5%", marginBottom: "5%", marginLeft: "25%", marginRight: "25%"}}>
      <h1>Orderbook</h1>
    <div className="tbl-header">
    <table cellPadding="0" cellSpacing="0" border="0">
      <thead>
        <tr>
          <th>Price (₿)</th>
          <th>Quantity</th>
          <th>Exchange</th>
        </tr>
      </thead>
    </table>
    </div>

    <div className="tbl-content">
     <table cellPadding="0" cellSpacing="0" border="0">
     <tbody>
        {asksTable}
        <tr style={{borderTop: "none"}}>
          <td style={{color: "orange"}}>Asks</td>
          <td />
          <td />
        </tr>
        <tr>
          <td><strong>Spread: {spread}</strong></td>
          <td />
          <td />
        </tr>
        <tr>
          <td style={{color: "#98f542"}}>Bids</td>
          <td />
          <td />
        </tr>
        {bidsTable}
      </tbody>
    </table>
  </div>
  </section>

  )
}
