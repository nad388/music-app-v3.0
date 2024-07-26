import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Track {
	id: number
	src: string
	preview: string
	duration: number
	title: string
	artists: string
}
export interface TrackState {
	tracks: Track[]
	currentTrack: Track | null
	isPlaying: boolean
	searchQuery: string
	shuffle: boolean
}

const initialState: TrackState = {
	tracks: [],
	currentTrack: null,
	isPlaying: false,
	searchQuery: '',
	shuffle: false,
}

export const fetchTracks = createAsyncThunk<Track[], void, any>(
	'tracks/fetchTracks',
	async () => {
		const response = await axios.get(
			'https://516c9b9d82ee76a0.mokky.dev/tracks'
		)

		return response.data
	}
)

const trackSlice = createSlice({
	name: 'tracks',
	initialState,
	reducers: {
		playTrack(state, action: PayloadAction<Track>) {
			state.currentTrack = action.payload
			state.isPlaying = true
		},
		pauseTrack(state) {
			state.isPlaying = false
		},
		nextTrack(state) {
			if (state.tracks.length === 0) return
			const currentIndex = state.tracks.findIndex(
				track => track.id === state.currentTrack?.id
			)
			const nextIndex = state.shuffle
				? Math.floor(Math.random() * state.tracks.length)
				: (currentIndex + 1) % state.tracks.length
			state.currentTrack = state.tracks[nextIndex]
		},
		prevTrack(state) {
			if (state.tracks.length === 0) return
			const currentIndex = state.tracks.findIndex(
				track => track.id === state.currentTrack?.id
			)
			const prevIndex = state.shuffle
				? Math.floor(Math.random() * state.tracks.length)
				: (currentIndex - 1 + state.tracks.length) % state.tracks.length
			state.currentTrack = state.tracks[prevIndex]
		},
		setSearchQuery(state, action: PayloadAction<string>) {
			state.searchQuery = action.payload.toLowerCase()
		},
		toggleShuffle(state) {
			state.shuffle = !state.shuffle
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchTracks.fulfilled, (state, action) => {
			state.tracks = action.payload
			if (state.tracks.length > 0) {
				state.currentTrack == state.tracks[0]
			}
		})
	},
})

export const {
	playTrack,
	pauseTrack,
	nextTrack,
	prevTrack,
	setSearchQuery,
	toggleShuffle,
} = trackSlice.actions

export default trackSlice.reducer
