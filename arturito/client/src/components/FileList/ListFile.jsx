import React, {Component} from 'react';
import axios from 'axios';
import ItemFile from './ItemFile';
import config from '../../commons/config';
import TopBar from '../TopBar';
import styles from './styles';
import sweet from 'sweetalert2';
import {withStyles} from '@material-ui/styles';
import Spinner from '../Spinner';
import {checkLogin} from '../../commons/security';
import {removeToken, getBearerAuth} from '../../commons/jsonwebtoken'
import SearchBar from '../PatientList/SearchBar';
import moment from 'moment';
import TagRow from '../Tag/TagRow';
import {handleSelectedTags} from '../Tag/TagFunctions/TagCommons';
import socketIOClient from 'socket.io-client';
import serverError from "../../commons/serverError";
import {Chip} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import TagDialog from "../Tag/TagDialog";

class ListFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patient: {
                name: '',
                lastname: '',
                medicalPlan: {number: 0, company: ''},
                identification: 0,
                files: [
                    {
                        date: '',
                        originalPath: '',
                        modificationDate: '',
                        resultPath: '',
                        doctor: '',
                        diagnosis: '',
                        tags: []
                    }
                ]
            },
            loading: false,
            tags: [],
            filter: '',
            selectedTags: [],
            createTagOpen: false,
        }
    }

    loadTags = () => {
        axios.get(`${config.apiUrl}tags`, getBearerAuth()).then(response => {
            const {keys} = response.data;
            this.setState(prevState => ({...prevState, tags: keys}), () => {
                this.setState(prevState => ({...prevState, loading: false}))
            });
        }).catch(err => {
            if (err.hasOwnProperty('response') && err.response.status === 401) {
                removeToken();
                this.setState(prevState => ({
                    ...prevState,
                    loading: false
                }), () => {
                    this.props.history.push('/');
                })
            } else {
                serverError().then(() => {
                    this.setState(prevState => ({
                        ...prevState,
                        loading: false
                    }))
                });
            }
        });
    };

    handleLabelOpen = () => {
        this.setState(prevState => ({
            ...prevState,
            createTagOpen: true,
        }));
    };

    handleCloseLabelDialog = () => {
        this.setState({
            createTagOpen: false,
        });
    };

    handleLabelCreate = (key, value) => {
        const {setClose, reloadTags} = this.props;
        this.setState({
            createTagOpen: false,
        });
        const body = {
            key: key,
            value: value
        };
        axios.post(`${config.apiUrl}tags`, body, getBearerAuth())
            .then(res => {
                if (res.status === 200) {
                    this.handleCloseLabelDialog();
                    this.loadTags();
                }
            }).catch(err => {
            console.log(err);
            if (err.hasOwnProperty('response') && err.response.status === 401) {
                removeToken();
                this.props.history.push('/');
            } else {
                serverError();
            }
        })
    };


    componentDidMount() {
        checkLogin(this.props);
        this.setState(prevState => ({...prevState, loading: true}), () => {
            const socket = socketIOClient(`${config.apiUrl}`, {query: `patientId=${this.props.match.params.patient}`});
            socket.on("getMessages", data => {
                this.setState(prevState => ({...prevState, patient: data[0]}));
            });
            axios
                .get(`${config.apiUrl}patients/${this.props.match.params.patient}`, getBearerAuth())
                .then(foundPatient => {
                    this.setState(prevState => ({...prevState, patient: foundPatient.data[0]}), () => {
                        if (!foundPatient.data[0].files.length) {
                            sweet.fire({
                                type: 'warning',
                                title: 'Aviso!',
                                text: 'El paciente no posee EEGs asignados'
                            }).then(() => {
                                this.props.history.push('/patients');
                            });
                        }
                    });
                    return new Promise(resolve => {
                        resolve();
                    })
                })
                .then(() => {
                    this.loadTags();
                })
                .catch(err => {
                    console.log(err)
                    if (err.hasOwnProperty('response') && err.response.status === 401) {
                        removeToken();
                        this.props.history.push('/');
                    } else {
                        sweet.fire({
                            type: 'error',
                            title: 'Oops!',
                            text: 'Error con el servidor. Por favor, vuelva a intentarlo más tarde'
                        });
                    }
                    this.setState(prevState => ({...prevState, loading: false}));
                });
        })
    }

    currifiedHandleSelectedTags = handleSelectedTags((newTagsArray) => {
        this.setState(prevState => ({...prevState, selectedTags: newTagsArray}))
    });

    handleTagSelected = (event, tagSelected) => {
        const {selectedTags} = this.state;
        this.currifiedHandleSelectedTags(selectedTags, tagSelected);
    };

    patientsToRender = () => {
        return this.state.patient.files.filter(file => {
            const {selectedTags} = this.state;
            return (
                (moment(file.date)
                        .format('DD/MM/YYYY')
                        .includes(this.state.filter) ||
                    (file.name !== undefined && file.name.includes(this.state.filter))) &&
                (selectedTags.length === 0 ||
                    (file.hasOwnProperty('tags') &&
                        file.tags.some(tag => {
                            return selectedTags.includes(tag);
                        })))
            );
        });
    }

    render() {
        const {patient, loading, tags, filter, createTagOpen} = this.state;
        const {classes} = this.props;
        const filesToRender = this.patientsToRender();
        return (
            <React.Fragment>
                {loading ? <Spinner/> :
                    <div className={classes.window}>
                        <TopBar history={this.props.history}/>
                        <TagDialog
                            open={createTagOpen}
                            handleCreate={this.handleLabelCreate}
                            handleClose={this.handleCloseLabelDialog}
                        />
                        <div className={classes.content}>
                            <SearchBar filter={filter} setFilter={(newValue) => {
                                this.setState(prevState => ({...prevState, filter: newValue}))
                            }}/>
                            {tags.length !== 0 &&
                            <TagRow tags={tags} handleClick={this.handleTagSelected} addChip={<Chip
                                icon={<Add/>}
                                label='Nueva etiqueta'
                                clickable
                                color='primary'
                                style={{color: 'white', marginLeft: 5}}
                                onClick={this.handleLabelOpen}/>}/>}
                            {filesToRender && filesToRender.map((file, index) => {
                                return (
                                    <div key={index} className={classes.item}>
                                        <ItemFile
                                            id={index}
                                            patientId={patient._id}
                                            file={file}
                                            history={this.props.history}
                                            tags={tags}
                                            reloadTags={this.loadTags}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ListFile);