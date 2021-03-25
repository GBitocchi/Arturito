import React from 'react';
import { Avatar, withStyles, Typography, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { animated } from 'react-spring';
import moment from 'moment';
import transitions from '../../commons/transitions';
import { getAge } from '../../commons/utils';
import Tooltip from '@material-ui/core/Tooltip';

const style = theme => ({
	background: {
		backgroundColor: '#34a5e1',
		width: '50%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		color: 'white',
	},
	avatar: {
		height: 120,
		width: 120,
		marginBottom: 5,
		fontSize: 40,
	},
	patientInfo: {
		width: '40%',
	},
	item: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		color: 'white',
	},
	text: {
		textAlign: 'left',
		margin: '0px 0px 5px 0px',
		fontSize: '15px',
		display: 'flex',
		justifyContent: 'space-between',
		width: '60%',
	},
	value: {
		textAlign: 'right',
	},
	hidden: {
		display: 'none',
	},
	longText: {
		fontSize: '1.2em',
		textAlign: 'left',
		justifySelf: 'flex-start',
		width: '60%',
		margin: '0px 0px 5px 0px',
		wordWrap: 'break-word',
	},
	divider: {
		width: '60%',
		margin: 2,
		borderTop: 1,
		opacity: '0.5',
	},
});

const PatientDescription = props => {
	const { classes, patient, showButton } = props;
	moment.locale('es');

	const handleClickEditar = () => {
		props.history.push(`/modifypatient/${patient._id}`);
	};

	return transitions(patient).map(({ item, key, props }) => (
		<animated.div style={props} className={classes.background}>
			<Avatar className={classes.avatar}>
				{patient.name.length !== 0 &&
					`${patient.name.charAt(0)}${patient.lastname.charAt(0)}`}
			</Avatar>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography
					component='h4'
					variant='h4'
					style={{
						textAlign: 'right',
						marginBottom: 5,
						fontSize: 25,
					}}
				>
					{patient.name} {patient.lastname}
				</Typography>
				{showButton && (
					<Tooltip title='Editar paciente'>
						<IconButton
							style={{ marginLeft: 12 }}
							onClick={handleClickEditar}
						>
							<Edit style={{ color: 'white' }} />
						</IconButton>
					</Tooltip>
				)}
			</div>
			<div className={classes.text}>
				<strong>DNI </strong>
				{patient.identification}
			</div>
			<hr className={classes.divider} />
			<p className={classes.text}>
				<strong>Fecha de nacimiento </strong>
				<p style={{ textAlign: 'right', margin: 0 }}>
					{`${moment(patient.birthdate).format('DD/MM/YYYY')}`}{' '}
					{getAge(patient.birthdate) !== '' &&
						`(${getAge(patient.birthdate)})`}
				</p>
			</p>
			<hr className={classes.divider} />
			<p className={classes.text}>
				<strong>Obra social </strong>
				<p style={{ textAlign: 'right', margin: 0 }}>
					{patient.medicalPlan.medicalPlanNumber}{' '}
					{patient.medicalPlan.medicalPlanCompany !== '' &&
						`(${patient.medicalPlan.medicalPlanCompany})`}
				</p>
			</p>
			<hr className={classes.divider} />
			<p className={classes.text}>
				<strong>Medicamentos </strong>{' '}
				{patient.medicines === '' && 'Ninguno'}
			</p>
			<p
				className={
					patient.medicines === '' ? classes.hidden : classes.longText
				}
			>
				{patient.medicines}
			</p>
			<hr className={classes.divider} />
			<p className={classes.text}>
				<strong>Patologías </strong>{' '}
				{patient.pathologies === '' && 'Ninguna'}
			</p>
			<p
				className={
					patient.pathologies === ''
						? classes.hidden
						: classes.longText
				}
			>
				{patient.pathologies}
			</p>
			<Typography />
		</animated.div>
	));
};
export default withStyles(style)(PatientDescription);
