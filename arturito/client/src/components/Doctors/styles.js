export default theme => ({
	window: {
		minHeight: '100vh'
	},
	content: {
		display: 'flex',
		flexDirection: 'row',
		height: 'calc(100vh - 48px)',
		marginTop: 48,
		justifyContent: 'space-between',
		alignItems: 'space-between'
	},
	leftContent: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '50%'
	}
});
