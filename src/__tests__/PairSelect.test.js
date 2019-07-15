import React from 'react';
import ReactDOM from 'react-dom';
import PairSelect from '../components/PairSelect';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PairSelect />, div);
  ReactDOM.unmountComponentAtNode(div);
});
