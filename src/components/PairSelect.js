import React from 'react'
import { RadioGroup, RadioButton } from 'react-radio-buttons'

export default function PairSelect(props){

  return (
    <RadioGroup value={"BTC_ETH"} onChange={ val => props.setPairSelected(val) } horizontal>
      <RadioButton
        value="BTC_ETH"
        >
        BTC/ETH
      </RadioButton>
      <RadioButton
        value="BTC_XMR">
        BTC/XMR
      </RadioButton>
    </RadioGroup>
  )
}
