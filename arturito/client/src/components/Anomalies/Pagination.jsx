import React from 'react';
import { withStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const style = theme => ({
	paginationRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20
	},
	text: {
		color: '#4a4a4a'
	}
});

const Pagination = props => {
	const { actualPage, pages, handleChangePage, classes } = props;

	return (
		<div className={classes.paginationRow}>
			<IconButton onClick={handleChangePage.bind(this, actualPage - 1)}>
				<KeyboardArrowLeft />
			</IconButton>
			<Typography className={classes.text}>{`Página ${actualPage + 1} de ${pages}`}</Typography>
			<IconButton onClick={handleChangePage.bind(this, actualPage + 1)}>
				<KeyboardArrowRight />
			</IconButton>
		</div>
	);
};

export default withStyles(style)(Pagination);
