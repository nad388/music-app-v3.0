import { configureStore } from '@reduxjs/toolkit';
import trackReducer, { TrackState } from './trackSlice';

const store = configureStore({
  reducer: {
    tracks: trackReducer,
  },
});

export type RootState = {
  tracks: TrackState;
};

export type AppDispatch = typeof store.dispatch;

export default store;