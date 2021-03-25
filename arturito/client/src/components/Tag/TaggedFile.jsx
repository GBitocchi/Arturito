import React from 'react';
import { Chip, withStyles } from '@material-ui/core';

const style = theme => ({
	chip: {
		margin: 5,
		color: 'white'
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	}
});

const TagRow = props => {
	const { classes, tags } = props;
	const renderedTags = tags.map((tag, index) => {
		return <Chip className={classes.chip} key={index} label={tag} color="primary" />;
	});

	return <div className={classes.row}>{renderedTags}</div>;
};

export default withStyles(style)(TagRow);
