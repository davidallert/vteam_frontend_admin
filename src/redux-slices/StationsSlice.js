import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export const fetchStationsData = async () => {
    const STATIONS_QUERY = gql`
        query {
            stations {
                _id
                name
                city
                charging_station
                location {
                    coordinates
                }
            }
        }
    `;
    const data = await client.request(STATIONS_QUERY);
    return data.stations;
};

export const fetchStations = createAsyncThunk('stations/fetch', async () => {
    // Define the GraphQL query to fetch stations
    const STATIONS_QUERY = gql`
        query {
            stations {
                _id
                name
                city
                charging_station
                no_of_scooters_max
                location {
                    coordinates
                }
            }
        }
    `;
    const { stations } = await client.request(STATIONS_QUERY);
    return stations;
});

const stationsSlice = createSlice({
  name: 'stations',
  initialState: { data: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStations.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchStations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchStations.rejected, (state) => { state.status = 'failed'; });
  },
});

export default stationsSlice.reducer;