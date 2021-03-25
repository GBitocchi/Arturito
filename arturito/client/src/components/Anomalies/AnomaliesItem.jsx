import React from 'react';
import styles from './styles';
import { FormControl, InputLabel, Select, MenuItem, withStyles } from '@material-ui/core';

const AnomaliesItem = props => {
	const { anomaly, handleChange, classes } = props;
	return (
		<div className={classes.element}>
			<img src={`data:image/png;base64, ${anomaly.image}`} alt="second" width="900" height="500" />
			<FormControl className={classes.select}>
				<InputLabel id="demo-simple-select-label">Clasificación</InputLabel>
				<Select
					id="demo-simple-select"
					value={anomaly.value === undefined ? '' : anomaly.value}
					onChange={handleChange.bind(this, anomaly)}
					autoWidth
				>
					<MenuItem value={0}>Normal</MenuItem>
					<MenuItem value={1}>Artificio</MenuItem>
					<MenuItem value={2}>Anomalía</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
};

export default withStyles(styles)(AnomaliesItem);
