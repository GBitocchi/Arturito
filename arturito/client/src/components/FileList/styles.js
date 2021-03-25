const styles = theme => ({
	window: {
		height: '100vh',
	},
	content: {
		height: 'calc(100% - 64)',
		marginTop: 64,
		width: '100%',
		[theme.breakpoints.down(600)]: {
			marginTop: 56,
		},
		display: 'flex',
		flexDirection: 'column',
	},
	item: {
		marginTop: 10,
		padding: '0 20px',
	},
});

export default styles;
