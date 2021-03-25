import {withStyles} from '@material-ui/core';
import axios from 'axios';
import React, {useEffect, useState, useCallback} from 'react';
import sweet from 'sweetalert2';
import {errorPatient} from '../../commons/errors';
import {
    setEmptyPatientErrors,
    setFormatPatientErrors,
} from '../../commons/patientValidators';
import {anyEmpty, allEmpty} from '../../commons/utils';
import PatientForm from '../CreatePatient/PatientForm';
import styles from '../CreatePatient/styles';
import PatientDescription from '../LoadFile/PatientDescription';
import TopBar from '../TopBar';
import Spinner from '../Spinner';
import config from '../../commons/config';
import {getBearerAuth} from '../../commons/jsonwebtoken'
import {checkError} from '../../commons/security'


const ModifyPatient = props => {
    const [patient, setPatient] = useState({
        name: '',
        lastname: '',
        identification: '',
        medicalPlan: {
            medicalPlanCompany: '',
            medicalPlanNumber: '',
        },
        medicines: '',
        pathologies: '',
    });

    const [errors, setErrors] = useState(null);

    const [loading, setLoading] = useState(false);

    const [clean, setClean] = useState(0);

    // Future refactor
    const handleSubmit = useCallback(() => {
        if (!anyEmpty(patient, ['medicines', 'pathologies'])) {
            setLoading(true);
            const formatErrors = setFormatPatientErrors(patient);
            if (allEmpty(formatErrors)) {
                axios
                    .post(
                        `${config.apiUrl}patients/${props.match.params.patient}`,
                        patient,
                        getBearerAuth()
                    )
                    .then(() => {
                        setLoading(false);
                        sweet
                            .fire({
                                type: 'success',
                                title: 'Operación exitosa',
                                text: 'Paciente modificado correctamente',
                            })
                            .then(() => {
                                props.history.push(
                                    `/uploadfile/${patient._id}`
                                );
                            });
                    })
                    .catch(err => {
                        checkError(err, props);
                        setLoading(false);
                    });
                setLoading(false);
            } else {
                setErrors(formatErrors);
                setLoading(false);
            }
        } else {
            setErrors(setEmptyPatientErrors(patient));
            setLoading(false);
        }
    });

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${config.apiUrl}patients/${props.match.params.patient}`, getBearerAuth())
            .then(foundPatient => {
                setLoading(false);
                setPatient(foundPatient.data[0]);
            })
            .catch((err) => {
                checkError(err, props);
                setLoading(false);
            });
    }, [props.match.params.patient, clean]);

    useEffect(() => {
        if (errors) {
            if (allEmpty(errors)) {
                handleSubmit();
            }
        }
    }, [errors, handleSubmit]);

    const cleanErrors = () => {
        setErrors(errorPatient);
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
                            patient={patient}
                            errors={errors ? errors : errorPatient}
                            setPatient={setPatient}
                            handleSubmit={cleanErrors}
                            handleCancel={handleCancel}
                            submitDescription='Actualizar'
                            descriptionForm='Editar paciente'
                            disabledIdentification={true}
                        />
                    </div>
                    <PatientDescription patient={patient}/>
                </div>
            </div>
        </React.Fragment>
    );

};

export default withStyles(styles)(ModifyPatient);
