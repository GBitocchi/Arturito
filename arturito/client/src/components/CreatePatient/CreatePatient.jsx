import React, {useState, useEffect} from 'react';
import axios from 'axios';
import sweet from 'sweetalert2';
import {withStyles} from '@material-ui/styles';
import {withRouter} from 'react-router-dom';
import {anyEmpty, allEmpty} from '../../commons/utils';
import {
    setEmptyPatientErrors,
    setFormatPatientErrors,
} from '../../commons/patientValidators';
import {checkLogin, checkError} from '../../commons/security';
import {errorPatient} from '../../commons/errors';
import styles from './styles';
import PatientForm from './PatientForm';
import PatientDescription from '../LoadFile/PatientDescription';
import TopBar from '../TopBar';
import Spinner from '../Spinner';
import config from '../../commons/config';
import {getBearerAuth, removeToken} from '../../commons/jsonwebtoken';
import {check} from "express-validator";

const CreatePatient = props => {
    const [patient, setPatient] = useState({
        name: '',
        lastname: '',
        identification: '',
        birthdate: new Date(),
        medicalPlan: {
            medicalPlanCompany: '',
            medicalPlanNumber: '',
        },
        medicines: '',
        pathologies: '',
    });

    const [errors, setErrors] = useState(errorPatient);

    const [loading, setLoading] = useState(false);

    const [clean, setClean] = useState(0);

    useEffect(() => {
        checkLogin(props);
    }, []);

    useEffect(() => {
        setPatient({
            name: '',
            lastname: '',
            identification: '',
            birthdate: new Date(),
            medicalPlan: {
                medicalPlanCompany: '',
                medicalPlanNumber: '',
            },
            medicines: '',
            pathologies: ''
        });
    }, [clean]);

    const handleSubmit = () => {
        setErrors(errorPatient);
        if (!anyEmpty(patient, ['medicines', 'pathologies'])) {
           
            setErrors(setFormatPatientErrors(patient));
            if (allEmpty(errors)) {
                setLoading(true);
                axios
                    .post(`${config.apiUrl}patients`, patient, getBearerAuth())
                    .then(() => {
                        sweet
                            .fire({
                                type: 'success',
                                title: 'Operación exitosa',
                                text: 'Paciente creado correctamente',
                            })
                            .then(() => {
                                props.history.push('/patients');
                            });
                    })
                    .catch(err => {
                        setLoading(false);
                        //checkError(err, props);
                        if (err.hasOwnProperty('response') && err.response.status === 401) {
                            removeToken();
                            props.history.push('/')
                        } else {
                            let message = 'Error con el servidor. Por favor, vuelva a intentarlo más tarde';
                            if (err.response !== undefined && err.response.status === 406)
                                message = err.response.data.mensaje;
                            sweet.fire({
                                type: 'error',
                                title: 'Oops!',
                                text: message
                            })
                        }
                    });
            }
        } else {
            setLoading(false);
            setErrors(setEmptyPatientErrors(patient));
        }
    };

    const handleCancel = () => {
        setClean(clean + 1);
    }

    const {classes} = props;

    return (
        <React.Fragment>
            {loading && <Spinner/>}
            <div className={classes.window}>
                <TopBar history={props.history}/>
                <div className={classes.content}>
                    <div className={classes.leftContent}>
                        <PatientForm
                            setPatient={setPatient}
                            handleSubmit={handleSubmit}
                            patient={patient}
                            errors={errors}
                            submitDescription='Crear'
                            descriptionForm='Crear paciente'
                            handleCancel={handleCancel}
                        />
                    </div>
                    <PatientDescription patient={patient}/>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withRouter(withStyles(styles)(CreatePatient));
