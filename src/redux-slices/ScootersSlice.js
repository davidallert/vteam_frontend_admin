import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

    // Define the GraphQL client with the Authorization header
    const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

export const fetchScooters = createAsyncThunk('scooters/fetch', async () => {
    // Define the GraphQL query to fetch scooters
    const SCOOTERS_QUERY = gql`
        query {
            scooters {
                _id
                status
                customid
                battery_level
                at_station
                designated_parking
                current_location {
                    type
                    coordinates
                }
            }
        }
    `;
    const { scooters } = await client.request(SCOOTERS_QUERY);
    return scooters;
});

const scootersSlice = createSlice({
  name: 'scooters',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScooters.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchScooters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchScooters.rejected, (state) => { state.status = 'failed'; });
  },
});

export default scootersSlice.reducer;