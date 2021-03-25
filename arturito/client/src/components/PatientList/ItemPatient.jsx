import React from 'react';
import {Typography, Paper, IconButton} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import {CloudUpload, Folder, Delete} from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import sweet from 'sweetalert2';
import Swal from 'sweetalert2';
import config from '../../commons/config';
import axios from 'axios';
import {getBearerAuth, removeToken} from '../../commons/jsonwebtoken'

const style = theme => ({
    element: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        padding: 20,
        marginTop: 10
    },
    basicDiv: {
        margin: 0
    }
});

const ItemPatient = props => {
    const {patient} = props;

    const {classes} = props;

    const handleClickDelete = () => {
        Swal.fire({
            title: 'Está a punto de borrar un paciente',
            text: '¿Desea borrar el paciente?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f06292',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            focusCancel: true,
        }).then(result => {
            if (result.value) {
                axios.delete(`${config.apiUrl}patients/${patient._id}`, getBearerAuth())
                    .then(() => {
                        sweet
                            .fire({
                                type: 'success',
                                title: 'Operación exitosa',
                                text: 'Paciente borrado correctamente',
                            })
                            .then(() => {
                                window.location.reload(false);
                            });
                    })
                    .catch(err => {
                        if (err.hasOwnProperty('response') && err.response.status === 401) {
                            removeToken();
                            props.history.push('/');
                        } else {
                            sweet.fire({
                                type: 'error',
                                title: 'Oops!',
                                text:
                                    'Error al borrar el paciente, por favor vuelva a intentarlo más tarde',
                            });
                        }
                    })
            }
        })
    };

    const handleClickFiles = () => {
        props.history.push(`/files/${patient._id}`);
    };

    const handleClickLoadFile = () => {
        props.history.push(`/uploadfile/${patient._id}`);
    };

    return (
        <Paper className={classes.element}>
            <div className={classes.basicDiv}>
                <Typography component="h6" variant="h6">
                    <strong>
                        {patient.name} {patient.lastname}
                    </strong>
                </Typography>
                <Typography>DNI {patient.identification}</Typography>
            </div>
            <div>
                <Tooltip title="Borrar">
                    <IconButton onClick={handleClickDelete}>
                        <Delete fontSize="large"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Historial">
                    <IconButton onClick={handleClickFiles}
                                disabled={!(patient.hasOwnProperty('files') && patient.files.length > 0)}>
                        <Folder fontSize="large"/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Cargar archivos">
                    <IconButton onClick={handleClickLoadFile}>
                        <CloudUpload fontSize="large"/>
                    </IconButton>
                </Tooltip>
            </div>
        </Paper>
    );
};

export default withStyles(style)(ItemPatient);
