import { configureStore } from '@reduxjs/toolkit';
import scootersReducer from '../redux-slices/ScootersSlice';
import stationsReducer from '../redux-slices/StationsSlice';


export const store = configureStore({
  reducer: {
    scooters: scootersReducer,
    stations: stationsReducer,
  },
});
