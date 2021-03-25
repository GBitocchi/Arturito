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
	gadgetList: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		flexWrap: 'wrap',
		justifyContent: 'center'
	},
	item: {
		marginTop: 10,
		paddingLeft: 10,
		paddingRight: 10
	},
});

export default styles;
