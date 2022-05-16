import { HashRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { waitFor } from '@testing-library/react';

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  document.body.removeChild(container);
  container = null;
});

it('renders welcome page', async () => {
  await act(async () => {
    ReactDOM.createRoot(container).render(
      <HashRouter>
        <App />
      </HashRouter>
    );
  });

  await waitFor(() => {
    expect(container.querySelector('h2').textContent).toBe('Welcome to Hierarchy UI');
  });
});
