import EmployeeEditPage from './EmployeeEditPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

let container = null;
let root = null;

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

it('renders form with id, name, email and phone fields', () => {
  const props = {
    employee: {
      _id: '1016',
      name: 'Vishu',
      role: 'HR',
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
  act(() => {
    ReactDOM.createRoot(container).render(<EmployeeEditPage {...props} />);
  });

  expect(container.querySelector('#employee-id').innerHTML).toBe(props.employee._id);
  expect(container.querySelector("input[name='name']").value).toBe(props.employee.name);
  expect(container.querySelector("input[name='email']").value).toBe(props.employee.email);
  expect(container.querySelector("input[name='phone']").value).toBe(props.employee.phone);
});
