import React from 'react';
import { withStyles } from '@material-ui/styles';
import { TextField, Fab, InputAdornment } from '@material-ui/core';
import { Add, Search } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
	background: {
		backgroundColor: '#efefef',
		width: '100%',
		justifyContent: 'center',
		display: 'flex'
	},
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		padding: '20px 30px'
	}
});

const SearchBar = props => {
	const { filter, setFilter, classes } = props;

	return (
		<div className={classes.background}>
			<div className={classes.container}>
				<TextField
					label="Buscar"
					value={filter}
					variant="outlined"
					onChange={e => {
						setFilter(e.target.value);
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						)
					}}
				/>
				<Tooltip title="Crear electroencefalógrafo">
					<Fab color="primary" onClick={props.newGadget}>
						<Add style={{ color: 'white' }} />
					</Fab>
				</Tooltip>
			</div>
		</div>
	);
};

export default withStyles(styles)(SearchBar);
