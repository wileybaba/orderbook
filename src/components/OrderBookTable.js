import React, { useState, useEffect } from "react"
import LoaderIcon from "react-loader-icon";
import PairSelect from "./PairSelect"

export default function OrderBookTable(props) {

  const [poloAsks, setPoloAsks] = useState([])
  const [bittrexAsks, setBittrexAsks] = useState([])
  const [poloBids, setPoloBids] = useState([])
  const [bittrexBids, setBittrexBids] = useState([])
  const [depth, setDepth] = useState(6)
  const [decimalAccuracy, setDecimalAccuracy] = useState(9)
  const [loaded, setLoaded] = useState(false)

  const exchangeDepth = depth/2

  const fetchBooks = async pair => {

    let   proxyURL   = "https://cors-anywhere.herokuapp.com/",
          poloURL    = "https://poloniex.com/public?command=returnOrderBook&currencyPair=" + pair + "&depth=" + exchangeDepth,
          bittrexURL = "https://api.bittrex.com/api/v1.1/public/getorderbook?market=" + pair.replace(/_/g, '-') + "&type=both"

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
        console.log('test')
      })

    await fetch(proxyURL+bittrexURL)
      .then(res => {
        return res.json();
      })
      .then(resData => {
        setBittrexBids(normalizeBittrex(resData.result.buy.slice(0, exchangeDepth)))
        setBittrexAsks(normalizeBittrex(resData.result.sell.slice(0, exchangeDepth)))
        setLoaded(true)
      })
      .catch(err => {
        console.log(err)
      })
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

  let totalAsks = [...poloAsks, ...bittrexAsks].sort((a,b) => (a-b))
  let totalBids = [...poloBids, ...bittrexBids].sort((a,b) => (b-a))

  const addCumulativeVolume = arr => {
    const quantities = arr.map((val, i) => {
      return [val[1]]
    })
    let y = 0
    let cumulativeVolumes = quantities.map(d => y += parseFloat(d))
    const withVolume = arr.map((val, i) => {
      return [val[0], val[1], val[2], cumulativeVolumes[i].toFixed(decimalAccuracy)]
    })
    return withVolume
  }

  const lowestAsk = totalAsks.filter((item, _, arr) => item === arr[0]).flat()
  const highestBid = totalBids.filter((item, _, arr) => item === arr[0]).flat()

  const spread = (lowestAsk[0] - highestBid[0]).toFixed(decimalAccuracy)

  useEffect(() => {
    fetchBooks(props.pairSelected)
  }, fetchBooks)

  const asksTable = addCumulativeVolume(totalAsks).reverse().map(ask => {
      return (
        <tr key={Math.random()}>
          <td>{ask[0]}</td>
          <td>{ask[1]}</td>
          <td>{ask[2]}</td>
          <td>{ask[3]}</td>
        </tr>
      )
    })

  const bidsTable = addCumulativeVolume(totalBids).map(bid => {
    return (
      <tr key={Math.random()}>
        <td>{bid[0]}</td>
        <td>{bid[1]}</td>
        <td>{bid[2]}</td>
        <td>{bid[3]}</td>
      </tr>
    )
  })

  return (

    <section style={{marginTop: "5%", marginBottom: "5%", marginLeft: "25%", marginRight: "25%"}}>
      <h1>Orderbook</h1>
      <PairSelect
        pairSelected={props.pairSelected}
        setPairSelected={props.setPairSelected}
        fetchBooks={fetchBooks}
        loaded={loaded}
        setLoaded={setLoaded}/>
      <div style={{marginTop: "2%"}} className="tbl-header">
      <table cellPadding="0" cellSpacing="0" border="0">
        <thead>
          <tr>
            <th>Price (₿)</th>
            <th>Quantity</th>
            <th>Exchange</th>
            <th>Cumulative Volume</th>
          </tr>
        </thead>
      </table>
      </div>
      <div className="tbl-content">
        {!loaded && <LoaderIcon color={"white"} />}
        {loaded &&
        <table cellPadding="0" cellSpacing="0" border="0">
        <tbody>
          {asksTable}
          <tr style={{borderTop: "none"}}>
            <td style={{color: "orange"}}>Asks</td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td><strong>Spread: {spread}</strong></td>
            <td />
            <td />
            <td />
          </tr>
          <tr>
            <td style={{color: "#98f542"}}>Bids</td>
            <td />
            <td />
            <td />
          </tr>
          {bidsTable}
        </tbody>
      </table>}
    </div>
  </section>

  )
}
