import React, {Component} from 'react';
import {
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    ExpansionPanelActions,
    Divider,
    Button
} from '@material-ui/core';
import axios from 'axios';
import sweet from 'sweetalert2';
import Swal from 'sweetalert2';
import config from '../../commons/config';
import TaggedFile from '../Tag/TaggedFile';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import {withStyles} from '@material-ui/styles';
import EditDiagnosis from '../PopupModifyDiagnosis/EditDiagnosis';
import Spinner from '../Spinner';
import LinearProgress from '@material-ui/core/LinearProgress';
import {handleSelectedTags} from '../Tag/TagFunctions/TagCommons';
import {getBearerAuth} from '../../commons/jsonwebtoken'

const styles = theme => ({
    summary: {
        display: 'flex',
        flexBasis: '50%',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    column: {
        flexBasis: '90%'
    },
    columnStatus: {
        flexBasis: '100%',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    respectEnter: {
        whiteSpace: 'pre-wrap'
    }
});

class ItemFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectedTags: [],
            diagnosis: '',
            allTags: [],
            loading: false,
            infoFile: ''
        }
    };

    componentDidMount() {
        const {file, tags} = this.props;
        this.setState(prevState => ({
            ...prevState,
            diagnosis: file.diagnosis,
            selectedTags: file.tags,
            allTags: tags
        }));
    }

    handleClose = () => {
        this.setState(prevState => ({
            ...prevState,
            open: false
        }));
    };

    handleOpen = () => {
        this.setState(prevState => ({
            ...prevState,
            open: true
        }));
    };


    setSelectedTags = (newTagsArray) => {
        this.setState(prevState => ({
            ...prevState,
            selectedTags: newTagsArray
        }));
    };

    currifiedHandleSelectedTags = handleSelectedTags(this.setSelectedTags);

    handleTagsSelected = (event, newTag) => {
        const {selectedTags} = this.state;
        this.currifiedHandleSelectedTags(selectedTags, newTag);
    };

    toggleButton = () => {
        const {file} = this.props;
        axios.get(`${config.apiUrl}files/info/artifacts/${file._id}`, getBearerAuth())
            .then(resp => {
                this.setState(prevState => ({...prevState, infoFile: resp.data.info}));
            })
            .catch(err => {
            });
    };

    metricsRedirect = () => {
        const {file, patientId} = this.props;
        this.props.history.push({pathname: `/files/${file._id}/metrics`, state: patientId});
    };

    handleDelete = () => {
        const {patientId, file} = this.props;
        Swal.fire({
            title: 'Está a punto de borrar un archivo',
            text: '¿Desea borrar el archivo?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f06292',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            focusCancel: true
        }).then(result => {
            if (result.value) {
                axios.delete(`${config.apiUrl}patients/${patientId}/${file._id}`, getBearerAuth())
                    .then(() => {
                        sweet
                            .fire({
                                type: 'success',
                                title: 'Operación exitosa',
                                text: 'Archivo borrado correctamente'
                            })
                            .then(() => {
                                window.location.reload(false);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        sweet.fire({
                            type: 'error',
                            title: 'Oops!',
                            text: 'Error al borrar el archivo, por favor vuelva a intentarlo más tarde'
                        });
                    });
            }
        });
    };

    fileRequest = original => {
        const {file} = this.props;
        const directorySplited = file.originalPath.split('/');
        const filename = directorySplited[directorySplited.length - 1];
        axios.get(`${config.apiUrl}files/${file._id}/${original}`, getBearerAuth())
            .then(resp => {
                const link = document.createElement('a');
                link.href = resp.data.url;
                link.setAttribute('download', filename);
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                this.handleClose();
            })
            .catch(err => {
                console.log(err);
                sweet.fire({
                    type: 'error',
                    title: 'Oops!',
                    text: 'Error al descargar el archivo, por favor vuelva a intentarlo más tarde'
                }).then(() => {
                    this.handleClose();
                })
            });
    };

    diagnosisUpdateSend = () => {
        const {patientId, file} = this.props;
        const {diagnosis, selectedTags} = this.state;
        if (diagnosis !== '') {
            this.setState(prevState => ({...prevState, loading: true}), () => {
                const data = {
                    diagnostico: diagnosis,
                    tags: selectedTags
                };
                axios.post(`${config.apiUrl}patients/${patientId}/${file._id}`, data, getBearerAuth())
                    .then(() => {
                        sweet.fire({
                            type: 'success',
                            title: 'Operación exitosa',
                            text: 'Diagnóstico actualizado correctamente'
                        });
                    })
                    .catch(() => {
                        sweet.fire({
                            type: 'error',
                            title: 'Oops!',
                            text: 'Error al guardar el diagnostico, por favor vuelva a intentarlo más tarde'
                        });
                    });
                this.setState(prevState => ({
                        ...prevState,
                        loading: false
                    }
                ), () => {
                    this.handleClose();
                })
            });
        }
    };

    render() {
        const {file, reloadTags, classes, id} = this.props;
        const {selectedTags, allTags, loading, open} = this.state;
        return (
            <React.Fragment>
                {loading && <Spinner/>}
                {open && <EditDiagnosis
                    descriptionButton="Actualizar"
                    open={open}
                    setOpen={this.handleOpen}
                    file={file}
                    setClose={this.handleClose}
                    diagnosisUpdateSend={this.diagnosisUpdateSend}
                    fileRequest={this.fileRequest}
                    setDiagnosis={(newDiagnosis) => {
                        this.setState(prevState => ({...prevState, diagnosis: newDiagnosis}))
                    }}
                    selectedTags={selectedTags}
                    handleSelectedTags={this.handleTagsSelected}
                    tags={allTags}
                    reloadTags={reloadTags}
                />}
                <ExpansionPanel onClick={this.toggleButton}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <div className={classes.summary}>
                            <Typography variant="h6" gutterBottom>
                                {file.name !== undefined ? file.name : `EEG ${id}`}
                            </Typography>
                            <Typography variant="caption" display="block" gutterBottom>
                                Creado
                            </Typography>
                            <Typography variant="body2" gutterBottom>{`${moment(file.date).format(
                                'DD/MM/YYYY'
                            )}`}</Typography>
                        </div>
                        <div className={classes.columnStatus}>
                            <Typography align="right" style={{fontSize: '17px', marginRight: 10}}>
                                <strong>{file.stage}</strong>
                            </Typography>
                            {file.status !== undefined &&
                            file.stage !== 'Finalizado' && (
                                <div>
                                    <LinearProgress
                                        style={{
                                            width: '16%',
                                            marginLeft: '83%',
                                            marginTop: 10
                                        }}
                                        variant="determinate"
                                        value={file.status.seconds * 100 / file.status.total}
                                    />
                                    <Typography align="right" style={{marginRight: 10}}>
                                        {file.status.seconds}/
                                        {file.status.total}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.column}/>
                        <div>
                            <Typography align="right" variant="body2">
                                Última modificación:{' '}
                                <strong>{`${moment(file.modificationDate).format('DD/MM/YYYY')}`}</strong>
                            </Typography>
                            {file.hasOwnProperty('doctor') &&
                            file.doctor.hasOwnProperty('name') && (
                                <Typography align="right" variant="body2">
                                    {file.doctor.name}
                                </Typography>
                            )}
                        </div>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails>
                        <div>
                            <Typography className={classes.respectEnter}>{file.diagnosis}</Typography>
                        </div>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails>
                        {file.hasOwnProperty('tags') && file.tags && file.tags.length > 0 &&
                        <TaggedFile tags={file.tags}/>}
                    </ExpansionPanelDetails>
                    {file.stage === 'Finalizado' && <Divider/>}
                    {file.stage === 'Finalizado' && (
                        <ExpansionPanelActions>
                            <Button onClick={this.handleDelete} style={{color: '#f06292'}}>
                                Borrar
                            </Button>
                            <Button onClick={this.handleOpen} color="primary">
                                Detalle
                            </Button>
                            <Button onClick={this.metricsRedirect} color="primary">
                                Métricas
                            </Button>
                        </ExpansionPanelActions>
                    )}
                </ExpansionPanel>
            </React.Fragment>

        )
    }
}

export default withStyles(styles)(ItemFile);

