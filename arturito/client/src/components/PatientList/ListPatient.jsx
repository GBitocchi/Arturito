import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {withStyles} from '@material-ui/core';
import config from '../../commons/config';
import serverError from '../../commons/serverError';
import ItemPatient from './ItemPatient';
import TopBar from '../TopBar';
import style from './styles';
import SearchBar from './SearchBar';
import Spinner from '../Spinner';
import {checkLogin} from '../../commons/security';
import {getBearerAuth, removeToken} from '../../commons/jsonwebtoken';

const List = props => {
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState('');

    useEffect(() => {
        checkLogin(props);
        axios
            .get(`${config.apiUrl}patients`, getBearerAuth())
            .then(patients => {
                setPatients(patients.data);
                setLoading(false);
            })
            .catch(err => {
                if(err.hasOwnProperty('response') && err.response.status === 401) {
                	removeToken();
					props.history.push('/');
				}else{
                    serverError();
                }
                setLoading(false);
            });
    }, [props]);

    const newPatient = () => {
        props.history.push('/patient');
    };

    const {classes} = props;

    const patientsToRender = patients
        .filter(patient => {
            return (
                patient.identification.includes(filter) ||
                patient.name.includes(filter) ||
                patient.lastname.includes(filter)
            )
        })
        .map((patient, index) => {
            return <ItemPatient patient={patient} key={index} history={props.history}/>;
        });

    return (
        <React.Fragment>
            {loading && <Spinner/>}
            <div className={classes.window}>
                <TopBar history={props.history}/>
                <div className={classes.content}>
                    <SearchBar filter={filter} setFilter={setFilter} newPatient={newPatient}/>
                    {patients.length > 0 ? (
                        patientsToRender
                    ) : (
                        <p style={{color: '#808080'}}>No hay pacientes registrados.</p>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default withStyles(style)(List);
