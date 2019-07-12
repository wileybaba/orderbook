import React, { useState } from 'react'
import OrderBookTable from './OrderBookTable'

export default function StateContainer(props){

  const [pairSelected, setPairSelected] = useState("BTC_ETH")
  return (
    <OrderBookTable pairSelected={pairSelected} setPairSelected={setPairSelected} />
  )
}
