import React from 'react'
import { RadioGroup, RadioButton } from 'react-radio-buttons'

export default function PairSelect(props){

  const handleChange = val => {
    props.setLoaded(false)
    props.setPairSelected(val)
    props.fetchBooks(val)
  }

  return (
    <RadioGroup
      value={props.pairSelected}
      onChange={ handleChange } horizontal>
      <RadioButton
        value="BTC_ETH">
        BTC/ETH
      </RadioButton>
      <RadioButton
        value="BTC_XMR">
        BTC/XMR
      </RadioButton>
      <RadioButton
        value="BTC_ZEC">
        BTC/ZEC
      </RadioButton>
    </RadioGroup>
  )
}
