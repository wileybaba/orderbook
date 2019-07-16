import React, { useState, useEffect } from "react"
import LoaderIcon from "react-loader-icon"
import PairSelect from "./PairSelect"
import APIurl from "../deploy"

export default function OrderBookTable(props) {

  const [pairSelected, setPairSelected] = useState("BTC_ETH")
  const [totalAsks, setTotalAsks] = useState([])
  const [totalBids, setTotalBids] = useState([])
  const [loaded, setLoaded] = useState(false)

  const decimalAccuracy = 8

// Cumulative sum function that pushes the combined volumes at each price point into the arrays of asks/bids
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

  useEffect(() => {
    const fetchBooks = async pair => {
      setLoaded(false)
      const response = await fetch(`${APIurl}orderbook/${pair}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await response.json()

      console.log(response)
      console.log(`Orderbook data: ${data.totalAsks}`)

      setTotalAsks(data.totalAsks)
      setTotalBids(data.totalBids)
      setLoaded(true)
    }

    fetchBooks(pairSelected)

  }, [pairSelected, setTotalAsks, setTotalBids])

  return (
    <section style={{marginTop: "2rem", marginBottom: "2rem", marginLeft: "20%", marginRight: "20%"}}>
      <h1>Orderbook</h1>
      <PairSelect
        pairSelected={pairSelected}
        setPairSelected={setPairSelected}
        />
      <div style={{marginTop: "2%"}} className="tbl-header">
      <table>
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
        <table>
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
