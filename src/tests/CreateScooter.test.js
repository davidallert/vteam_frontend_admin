import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import CreateScooter from '../components/scooter-sub-components/CreateScooter';
import { gql } from '@apollo/client';

const CREATE_SCOOTER_MUTATION = gql`
    mutation CreateScooter($record: CreateOneScooterInput!) {
        scooterCreateOne(record: $record) {
            _id
            customid
            status
            speed
            battery_level
            current_location {
                type
                coordinates
            }
        }
    }
`;

const mocks = [
  {
    request: {
      query: CREATE_SCOOTER_MUTATION,
      variables: {
        record: {
          customid: 'test-id',
          status: 'active',
          speed: 20,
          battery_level: 100,
          current_location: {
            type: 'Point',
            coordinates: [-63.856079, 20.848448],
          },
          at_station: 'Stockholm C',
          designated_parking: true,
        },
      },
    },
    result: {
      data: {
        scooterCreateOne: {
          _id: '1',
          customid: 'test-id',
          status: 'active',
          speed: 20,
          battery_level: 100,
          current_location: {
            type: 'Point',
            coordinates: [-63.856079, 20.848448],
          },
        },
      },
    },
  },
];

test('renders CreateScooter form and submits data', async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <CreateScooter />
      </MemoryRouter>
    </MockedProvider>
  );

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Custom ID:/i), { target: { value: 'test-id' } });
  fireEvent.change(screen.getByLabelText(/Status:/i), { target: { value: 'active' } });
  fireEvent.change(screen.getByLabelText(/Speed:/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/Battery Level:/i), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText(/Coordinates \(longitude, latitude\):/i), { target: { value: '-63.856079, 20.848448' } });

  // Submit the form
  fireEvent.click(screen.getByText(/Create Scooter/i));

  // Wait for the mutation to be called and the navigation to occur
  await screen.findByText(/Create New Scooter/i);

  // Check if the form submission was successful
  expect(screen.queryByText(/Failed to create scooter. Please try again./i)).not.toBeInTheDocument();
});