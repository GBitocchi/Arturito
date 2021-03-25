export default theme => ({
	window: {
		height: '100vh'
	},
	content: {
		display: 'flex',
		flexAlign: 'row',
		zIndex: 1,
		fontFamily: 'Roboto mono',
		height: 'calc(100% - 48px)',
		marginTop: '48px'
	},
	leftContent: {
		width: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		flexDirection: 'column'
	},
	rightContent: {
		width: '50%',
		backgroundColor: '#34a5e1',
		color: 'white',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2
	},
	dropZone: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		alignItems: 'center'
	},
	dropRectangle: {
		border: 2,
		borderStyle: 'dashed',
		borderColor: '#8f8f8f'
	},
	icon: {
		color: '#34a5e1',
		fontSize: 100
	},
	choose: {
		color: '#34a5e1',
		cursor: 'pointer'
	},
	inputFile: {
		display: 'none'
	}
});
