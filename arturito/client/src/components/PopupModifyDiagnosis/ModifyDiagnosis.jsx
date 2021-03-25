import React from 'react';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core';

const ModifyDiagnosis = props => {
	const { open, handleClose } = props;
	const { secondsArtifice, secondsNet } = props.file;

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Electroencefalograma evaluado</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Se detectó {secondsArtifice} segundos de artificios,
					quedando {secondsNet} segundos netos para ser analizados con
					mayor profundidad.
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default ModifyDiagnosis;
