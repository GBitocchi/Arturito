export default theme => ({
	window: {
		height: '100vh'
	},
	content: {
		height: 'calc(100% - 64px)',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		flexDirection: 'column',
		marginTop: 64,
		[theme.breakpoints.down(600)]: {
			marginTop: 56
		}
	}
});
