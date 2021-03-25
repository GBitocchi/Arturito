import React from 'react';
import { TextField, Typography, Button, withStyles } from '@material-ui/core';
import transitions from '../../commons/transitions';
import { animated } from 'react-spring';

const styles = theme => ({
	body: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	field: {
		marginTop: 10
	},
	firstField: {
		margin: '10px 30px auto auto'
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		width: '100%'
	},
	singleField: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%'
	},
	button: {
		margin: theme.spacing(1)
	}
});




const DoctorForm = props => {
	const { classes, doctor, setDoctor, errors, handleSubmit, handleCancel, disabled } = props;

	return transitions(doctor).map(({ item, key, props }) => (
		<animated.div style={props} className={classes.body}>
			<Typography component="h5" variant="h5">
				Médico
			</Typography>
			<div className={classes.row}>
				<TextField
					disabled
					name="username"
					label="Usuario"
					value={doctor.username}
					error={errors.errorUsername !== ''}
					helperText={errors.errorUsername}
					onChange={e => {
						setDoctor({ ...doctor, username: e.target.value });
					}}
					className={classes.firstField}
				/>
				<TextField
					disabled={disabled}
					name="password"
					error={errors.errorPassword !== ''}
					helperText={errors.errorPassword}
					onChange={e => {
						setDoctor({ ...doctor, password: e.target.value });
					}}
					className={classes.Field}
					placeholder="********"
					type='password'
				/>
			</div>
			<div className={classes.row}>
				<TextField
					disabled={disabled}
					name="name"
					label="Nombre"
					value={doctor.name}
					error={errors.errorName !== ''}
					helperText={errors.errorName}
					onChange={e => {
						setDoctor({ ...doctor, name: e.target.value });
					}}
					className={classes.firstField}
				/>
				<TextField
					disabled={disabled}
					name="lastname"
					label="Apellido"
					value={doctor.lastname}
					error={errors.errorLastname !== ''}
					helperText={errors.errorLastname}
					onChange={e => {
						setDoctor({ ...doctor, lastname: e.target.value });
					}}
					className={classes.field}
				/>
			</div>
			<div className={classes.row}>
				<TextField
					disabled={disabled}
					name="identification"
					label="Documento"
					value={doctor.identification}
					error={errors.errorIdentification !== ''}
					helperText={errors.errorIdentification}
					inputProps={{ maxLength: 8 }}
					onChange={e => {
						setDoctor({ ...doctor, identification: e.target.value });
					}}
					className={classes.field}
				/>
				<TextField
					disabled={disabled}
					name="email"
					label="Correo electrónico"
					value={doctor.mail}
					error={errors.errorMail !== ''}
					helperText={errors.errorMail}
					onChange={e => {
						setDoctor({ ...doctor, mail: e.target.value });
					}}
					className={classes.field}
				/>
			</div>
			<div className={classes.singleField}>
				<TextField
					disabled
					name="rol"
					label="Rol"
					value={doctor.rol}
					error={errors.errorRol !== ''}
					helperText={errors.errorRol}
					onChange={e => {
						setDoctor({ ...doctor, rol: e.target.value });
					}}
					className={classes.field}
				/>
			</div>
			<div>
				<Button
					variant="contained"
					color="primary"
					className={classes.button}
					onClick={handleSubmit}
					style={{ color: 'white', marginTop: 20 }}
				>
					{ disabled ? 'Aceptar' : 'Actualizar'}
				</Button>
				{ !disabled &&
				<Button
					variant="contained"
					color="primary"
					className={classes.button}
					onClick={handleCancel}
					style={{backgroundColor: '#f06392', color: 'white', marginTop: 20 }}
				>
					Cancelar
				</Button>}
			</div>
		</animated.div>

	));
};

export default withStyles(styles)(DoctorForm);
