import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';
import { updateScooterStatusWS,  updateScooterLocationWS } from '../websocket/websocket';



export const fetchScooters = createAsyncThunk('scooters/fetch', async () => {
    // Define the GraphQL client with the Authorization header
    const client = new GraphQLClient('http://localhost:8585/graphql/scooters', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    // Define the GraphQL query to fetch scooters
    const SCOOTERS_QUERY = gql`
        query {
            scooters (limit:0){
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
            .addCase(fetchScooters.rejected, (state) => { state.status = 'failed'; })
            .addCase(updateScooterStatusWS, (state, action) => {
                console.log("🟢 Redux Action Received:", action.payload);
                console.log("State:", state.data);
                console.log("Type of state:", typeof state);
                const { scooterId, status } = action.payload;
                const scooter = state.data.find((s) => s.customid === scooterId);
                if (scooter) {
                  scooter.status = status;
                  console.log("✅ Updated Scooter in Redux:", scooter);
                  console.log("Scooter:", scooter);
                }
                // console.log("No scooter found with scooterId:", scooterId);
            })
            .addCase(updateScooterLocationWS, (state, action) => {
                console.log("🟢 Redux Action Received:", action.payload);
                const { scooterId, current_location } = action.payload;
                const scooter = state.data.find((s) => s.customid === scooterId);
                if (scooter) {
                  scooter.current_location = current_location;
                  console.log("✅ Updated Scooter Location in Redux:", scooter);
                } else {
                  console.log("No scooter found with customid:", scooterId);
                }
            });
    },
});
  // Update scooter position in real-time
//   useEffect(() => {
//     socket.on("statusChange", (status) => {
//       if (rentedScooterMarker) {
//         rentedScooterMarker.setLngLat([status.lon, status.lat]);
//         map.current.flyTo({ center: [status.lon, status.lat], zoom: 25 });
//       }
//     });

//     return () => {
//       socket.off("statusChange");
//     };
//   }, [rentedScooterMarker]);

export default scootersSlice.reducer;