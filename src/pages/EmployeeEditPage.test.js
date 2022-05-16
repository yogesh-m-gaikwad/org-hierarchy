import EmployeeEditPage from './EmployeeEditPage';
import { HashRouter } from 'react-router-dom';
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

it('renders form with id, name, email and phone fields', async () => {
  const props = {
    employee: {
      _id: '1016',
      name: 'Vishu',
      position: 'HR',
      email: 'vishu@hierarchy.org',
      phone: '+022878978463',
      type: 'member',
      parent_id: '1008',
    },
    onChangeEmployee: () => {},
    onResetEmployee: () => {},
    onSaveEmployee: () => {},
    onRemoveEmployee: () => {},
  };

  await act(async () => {
    ReactDOM.createRoot(container).render(
      <HashRouter>
        <EmployeeEditPage {...props} />
      </HashRouter>
    );
  });

  await waitFor(() => {
    expect(container.querySelector('#employee-id').innerHTML).toContain(props.employee._id);
    expect(container.querySelector("input[name='name']").value).toBe(props.employee.name);
    expect(container.querySelector("input[name='email']").value).toBe(props.employee.email);
    expect(container.querySelector("input[name='phone']").value).toBe(props.employee.phone);
  });
});
