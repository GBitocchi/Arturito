import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Spinner(props) {
	return (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(255, 255, 255, 1)',
				position: 'fixed',
				zIndex: 1,
			}}
		>
			<CircularProgress size={80} />
			<p style={{ paddingTop: '10px' }}>{props.message}</p>
		</div>
	);
}
