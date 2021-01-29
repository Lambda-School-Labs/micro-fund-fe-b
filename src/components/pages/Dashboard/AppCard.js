import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useOktaAuth } from '@okta/okta-react';
import { useQueryClient } from 'react-query';
import axiosWithAuth from '../../../utils/axiosWithAuth';

// A custom POST for apps
// We can't use a react query, because that's for handling
// Server state, and this doesn't exist in server state yet
function postAppData(auth, appData) {
  return (
    auth.authService
      .getAccessToken()
      .then(token => {
        return axiosWithAuth(token).post(
          `/apps/app/new`,
          JSON.stringify(appData),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      })
      // the user's applications are in the 'user' query
      // so we, confusingly, need to invalidate that
      .catch(error => console.error(error))
  );
}

// This is just completely wrong.
function AppCard({ orgId }) {
  const auth = useOktaAuth();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    address: '',
    reason: '',
  });

  const handleChanges = e => {
    let name = e.target.name;
    let value = e.target.value;
    setFormState({ ...formState, [name]: value });
  };

  const onSubmit = e => {
    // React query to submit an application
    e.preventDefault();
    postAppData(auth, {
      ...formState,
      organization: { orgid: 4 },
    });
    queryClient.invalidateQueries('user');
  };

  return (
    <>
      <div>
        <h1> Org Name </h1>
        <p>
          {' '}
          userInput_id Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat
          urna. Morbi a bibendum metus. Donec scelerisque sollicitudin enim eu
          venenatis. Duis tincidunt laoreet ex, in pretium orci vestibulum eget.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Duis pharetra luctus lacus ut vestibulum.
          Maecenas ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor.
          Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer
          feugiat faucibus libero, at maximus nisl suscipit posuere. Morbi nec
          enim nunc. Phasellus bibendum turpis ut ipsum egestas, sed
          sollicitudin elit convallis. Cras pharetra mi tristique sapien
          vestibulum lobortis. Nam eget bibendum metus, non dictum mauris. Nulla
          at tellus sagittis, viverra est a, bibendum metus.
        </p>
      </div>

      <div>
        <form id="org-applcation-form">
          <input
            name="name"
            value={formState.name}
            onChange={handleChanges}
            placeholder="Name"
          />

          <input
            name="phone"
            value={formState.phone}
            onChange={handleChanges}
            placeholder="Phone Number"
          />

          <input
            name="address"
            value={formState.address}
            onChange={handleChanges}
            placeholder="Address"
          />

          <input
            name="reason"
            value={formState.reason}
            onChange={handleChanges}
            placeholder="Reason"
          />

          <button onClick={onSubmit}> Apply </button>
        </form>
      </div>
    </>
  );
}

export default AppCard;
