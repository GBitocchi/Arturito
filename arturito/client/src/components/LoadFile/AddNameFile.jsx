import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AddNameFile = props => {
	const {
		open,
		setClose,
		handleCloseName,
		setFileName,
		handleCommit,
	} = props;

	const handleChange = () => event => {
		setFileName(event.target.value);
	};

	return (
		<Dialog
			disableBackdropClick
			open={open}
			onClose={setClose}
			aria-labelledby='form-dialog-title'
		>
			<DialogTitle id='form-dialog-title'>Procesar archivo</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Ingrese el nombre del estudio que desea procesar
				</DialogContentText>
				<TextField
					autoFocus
					margin='dense'
					id='name'
					label='Nombre del estudio'
					type='Nombre'
					fullWidth
					onChange={handleChange()}
				/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						handleCloseName();
					}}
					style={{ color: '#f06292' }}
				>
					Cancelar
				</Button>
				<Button onClick={handleCommit} color='primary'>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddNameFile;
