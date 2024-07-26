// src/components/TrackPlayer.tsx
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import {
	fetchTracks,
	nextTrack,
	pauseTrack,
	playTrack,
	prevTrack,
	setSearchQuery,
	toggleShuffle,
} from '../store/trackSlice'

const TrackPlayer: React.FC = () => {
	const dispatch: AppDispatch = useDispatch()
	const { tracks, currentTrack, isPlaying, searchQuery, shuffle } = useSelector(
		(state: RootState) => state.tracks
	)
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		dispatch(fetchTracks())
	}, [dispatch])

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.addEventListener('ended', handleTrackEnd)
		}
		return () => {
			if (audioRef.current) {
				audioRef.current.removeEventListener('ended', handleTrackEnd)
			}
		}
	}, [currentTrack])

	const handleTrackEnd = () => {
		dispatch(nextTrack())
	}

	const handlePlayPause = () => {
		if (isPlaying) {
			dispatch(pauseTrack())
			audioRef.current?.pause()
		} else {
			dispatch(playTrack(currentTrack!))
			audioRef.current?.play()
		}
	}

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(setSearchQuery(e.target.value))
	}

	const filteredTracks = tracks.filter(
		track =>
			track.title.toLowerCase().includes(searchQuery) ||
			track.artists.toLowerCase().includes(searchQuery)
	)

	return (
		<div>
			<input
				type='text'
				placeholder='Search...'
				value={searchQuery}
				onChange={handleSearch}
			/>
			<button onClick={() => dispatch(toggleShuffle())}>
				{shuffle ? 'Disable' : 'Enable'} Shuffle
			</button>
			{currentTrack && (
				<div>
					<h3>
						Now Playing: {currentTrack.title} - {currentTrack.artists}
					</h3>
					<audio ref={audioRef} src={currentTrack.src} autoPlay={isPlaying} />
					<button onClick={handlePlayPause}>
						{isPlaying ? 'Pause' : 'Play'}
					</button>
					<button onClick={() => dispatch(prevTrack())}>Previous</button>
					<button onClick={() => dispatch(nextTrack())}>Next</button>
				</div>
			)}
			<ul>
				{filteredTracks.map(track => (
					<li key={track.id} onClick={() => dispatch(playTrack(track))}>
						<img
							src={track.preview}
							alt={track.title}
							style={{ width: '50px', height: '50px' }}
						/>
						{track.title} - {track.artists}
					</li>
				))}
			</ul>
		</div>
	)
}

export default TrackPlayer
