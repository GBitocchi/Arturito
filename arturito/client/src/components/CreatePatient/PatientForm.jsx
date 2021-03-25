import React from 'react';
import { TextField, Typography, Button, withStyles } from '@material-ui/core';
import transitions from '../../commons/transitions';
import { animated } from 'react-spring';
import DatePicker from './DatePicker';
import { getAge, validateNum } from '../../commons/utils';
import { Link } from 'react-router-dom';

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

const PatientForm = props => {
	const { classes, patient, setPatient, handleSubmit, handleCancel, errors, submitDescription, descriptionForm, disabledIdentification } = props;
	return transitions(patient).map(({ item, key, props }) => (
		<animated.div style={props} className={classes.body}>
			<Typography component="h5" variant="h5">
				{descriptionForm}
			</Typography>
			<div className={classes.row}>
				<TextField
					name="name"
					label="Nombre"
					value={patient.name}
					error={errors.errorName !== ''}
					helperText={errors.errorName}
					onChange={e => {
						setPatient({ ...patient, name: e.target.value });
					}}
					className={classes.firstField}
				/>
				<TextField
					name="lastname"
					label="Apellido"
					value={patient.lastname}
					error={errors.errorLastname !== ''}
					helperText={errors.errorLastname}
					onChange={e => {
						setPatient({ ...patient, lastname: e.target.value });
					}}
					className={classes.field}
				/>
			</div>
			<div className={classes.singleField}>
				<TextField
					name="identification"
					label="Documento"
					value={patient.identification}
					error={errors.errorIdentification !== ''}
					helperText={errors.errorIdentification}
					inputProps={{ maxLength: 8 }}
					onChange={e => {
						setPatient({ ...patient, identification: e.target.value });
					}}
					className={classes.field}
					disabled={disabledIdentification}
				/>
			</div>
			<div className={classes.row}>
				<DatePicker
					text="Fecha de nacimiento"
					setDate={date => {
						setPatient({ ...patient, birthdate: new Date(date) });
					}}
					birthdate={patient.birthdate}
				/>
				<Typography style={{ marginBottom: 8 }}>{getAge(patient.birthdate)}</Typography>
			</div>
			<div className={classes.row}>
				<TextField
					name="medicalPlanCompany"
					label="Obra social"
					value={patient.medicalPlan.medicalPlanCompany}
					error={errors.errorMedicalPlan.errorMedicalPlanCompany !== ''}
					helperText={errors.errorMedicalPlan.errorMedicalPlanCompany}
					onChange={e => {
						setPatient({
							...patient,
							medicalPlan: { ...patient.medicalPlan, medicalPlanCompany: e.target.value }
						});
					}}
					className={classes.firstField}
				/>
				<TextField
					name="medicalPlanNumber"
					label="Número de socio"
					value={patient.medicalPlan.medicalPlanNumber}
					error={errors.errorMedicalPlan.errorMedicalPlanNumber !== ''}
					helperText={errors.errorMedicalPlan.errorMedicalPlanNumber}
					inputProps={{ maxLength: 11 }}
					onChange={e => {
						setPatient({
							...patient,
							medicalPlan: { ...patient.medicalPlan, medicalPlanNumber: e.target.value }
						});
					}}
					className={classes.field}
				/>
			</div>
			<TextField
				label="¿Qué medicación toma actualmente?"
				multiline
				rows="2"
				style={{ marginTop: 10, width: '100%' }}
				value={patient.medicines}
				onChange={e => {
					setPatient({
						...patient,
						medicines: e.target.value
					});
				}}
			/>
			<TextField
				label="¿Tiene alguna patología conocida?"
				multiline
				rows="2"
				style={{ marginTop: 10, width: '100%' }}
				value={patient.pathologies}
				onChange={e => {
					setPatient({
						...patient,
						pathologies: e.target.value
					});
				}}
			/>
			<div>
				<Button
					variant="contained"
					color="primary"
					className={classes.button}
					onClick={handleSubmit}
					style={{ color: 'white', marginTop: 20 }}
				>
					{submitDescription}
				</Button>
				{handleCancel &&
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					onClick={handleCancel}
					style={{ backgroundColor: '#f06392' ,color: 'white', marginTop: 20 }}
				>
					Cancelar
				</Button>}
			</div>
		</animated.div>

	));
};

export default withStyles(styles)(PatientForm);
