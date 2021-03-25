import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { checkLogin } from '../../commons/security';
import { errorDoctor } from '../../commons/errors';
import styles from './styles';
import DoctorForm from './DoctorForm';
import DoctorDescription from './DoctorDescription';
import TopBar from '../TopBar';
import Spinner from '../Spinner';
import axios from 'axios';
import config from '../../commons/config';
import serverError from '../../commons/serverError';
import { removeToken, getToken, getBearerAuth } from '../../commons/jsonwebtoken';
import Swal from 'sweetalert2';

const DoctorProfile = props => {
	const [doctor, setDoctor] = useState({});

	const [errors, setErrors] = useState(errorDoctor);

	const [loading, setLoading] = useState(false);

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		checkLogin(props);
	}, []);

	useEffect(() => {
		setLoading(true);
		axios
			.post(`${config.apiUrl}doctors`, { token: getToken() }, getBearerAuth())
			.then(foundDoctor => {
				setLoading(false);
				setDoctor(foundDoctor.data[0]);
			})
			.catch(err => {
				if (err.hasOwnProperty('response') && err.response.status === 401) {
					removeToken();
					props.history.push('/');
				} else {
					serverError();
					setLoading(false);
				}
			})
		}, [disabled]);

	const handleSubmit = () => {
		if (!disabled) {
			axios
				.patch(`${config.apiUrl}doctors`, {
					name: doctor.name,
					identification: doctor.identification,
					lastname: doctor.lastname,
					mail: doctor.mail,
					token: getToken(),
				}, getBearerAuth())
				.then(res => {
					if (res.status === 201) {
						Swal.fire({
							type: 'success',
							title: 'Actualizado!',
							text: 'Su perfil se actualizó satisfactoriamente',
						}).then(() => {
							props.history.push('/patients');
						});
					}
				})
				.catch(err => {
					if (err.hasOwnProperty('response') && err.response.status === 401) {
						removeToken();
						props.history.push('/');
					} else {
						serverError();
					}
				});
		}else{
			props.history.push('/patients');
		}
	};

	const handleCancel = () => {
		setDisabled(true);
	}
	
	const handleClickEditar = () => {
		setDisabled(false);
	};

	const { classes, showButton } = props;

	return (
		<React.Fragment>
			{loading && <Spinner />}
			<div className={classes.window}>
				<TopBar history={props.history} />
				<div className={classes.content}>
					<div className={classes.leftContent}>
						<DoctorForm
							setDoctor={setDoctor}
							doctor={doctor}
							errors={errors}
							handleSubmit={handleSubmit}
							handleCancel={handleCancel}
							disabled={disabled}
						/>
					</div>
					<DoctorDescription
						doctor={doctor}
						showButton={{ showButton }}
						handleClickEditar={handleClickEditar}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default withRouter(withStyles(styles)(DoctorProfile));
