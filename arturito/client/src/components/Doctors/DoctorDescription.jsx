import React, {useState} from 'react';
import { Avatar, withStyles, Typography, IconButton } from '@material-ui/core';
import { animated } from 'react-spring';
import moment from 'moment';
import transitions from '../../commons/transitions';
import Tooltip from '@material-ui/core/Tooltip';
import { Edit } from '@material-ui/icons';

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

const DoctorDescription = props => {
	const { classes, doctor, showButton, handleClickEditar} = props;
	moment.locale('es');

	const [edit, setEdit] = useState(false);

	return transitions(doctor).map(({ item, key, props }) => (
		<animated.div style={props} className={classes.background}>
			<Avatar className={classes.avatar}>
				{doctor.name !== undefined &&
					`${doctor.name.charAt(0)}${doctor.lastname.charAt(0)}`}
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
				{doctor.name} {doctor.lastname}
			</Typography>
			{showButton && (
					<Tooltip title='Editar perfil'>
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
				<strong>Usuario </strong>
				{doctor.username}
			</div>
			<hr className={classes.divider} />
			<div className={classes.text}>
				<strong>Contraseña </strong>
				{edit ? doctor.password : '********'}
			</div>
			<hr className={classes.divider} />
			<div className={classes.text}>
				<strong>DNI </strong>
				{doctor.identification}
			</div>
			<hr className={classes.divider} />
			<div className={classes.text}>
				<strong>Rol </strong>
				{doctor.rol}
			</div>
			<hr className={classes.divider} />
			<div className={classes.text}>
				<strong>Email </strong>
				{doctor.mail}
			</div>
			<Typography />
		</animated.div>
	));
};
export default withStyles(style)(DoctorDescription);
