import React from 'react';
import ReactDOM from 'react-dom';
import { render, getByText} from "@testing-library/react";
import OrderBookTable from '../components/OrderBookTable';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OrderBookTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
