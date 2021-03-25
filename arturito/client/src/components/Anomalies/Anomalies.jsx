import React, {Component} from 'react';
import styles from './styles';
import Axios from 'axios';
import Swal from 'sweetalert2';
import {removeToken, getBearerAuth} from '../../commons/jsonwebtoken';
import config from '../../commons/config';
import {checkError} from '../../commons/security'
import serverError from '../../commons/serverError';
import AnomaliesItem from './AnomaliesItem';
import withStyles from '@material-ui/core/styles/withStyles';
import {Typography, Fab} from '@material-ui/core';
import TopBar from '../TopBar';
import Spinner from '../Spinner';
import {Save} from '@material-ui/icons';
import Pagination from './Pagination';

class Anomalies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segments: [
                {
                    _id: '',
                    image: '',
                    // 0 normal, 1 artifact, 2 anomaly
                    value: ''
                }
            ],
            loading: false,
            pages: 0,
            actualPage: 0
        };
    }

    componentDidMount() {
        const {actualPage} = this.state;
        this.setState({loading: true}, () => {
            Axios.get(`${config.apiUrl}segments?page=${actualPage}`, getBearerAuth())
                .then(res => {
                    return this.setState({segments: res.data.anomalies, pages: res.data.pages, loading: false});
                })
                .catch(err => {
                    checkError(err, this.props);
                    this.setState({loading: false});
                });
        });
    }

    handleChange = (segment, e) => {
        const classification = e.target.value;
        const segmentsCopy = this.state.segments;
        const segmentIndex = this.state.segments.findIndex(elem => elem._id === segment._id);
        segmentsCopy[segmentIndex].value = classification;
        this.setState({segments: segmentsCopy});
    };

    handleSave = () => {
        this.setState({loading: true}, () => {
            Axios.patch(`${config.apiUrl}segments`, this.state.segments, getBearerAuth())
                .then(res => {
                    this.setState({loading: false});
                    Swal.fire({
                        title: 'Operación exitosa',
                        text: 'Se guardaron los segmentos clasificados correctamente',
                        type: 'success'
                    });
                })
                .catch(err => {
                    checkError(err, this.props);
                    this.setState({loading: false});
                });
        });
    };

    handleChangePage = newPage => {
        const {pages} = this.state;
        if (newPage < pages && newPage !== -1) {
            this.setState({loading: true}, () => {
                Axios.get(`${config.apiUrl}segments?page=${newPage}`, getBearerAuth())
                    .then(res => {
                        this.setState({segments: res.data.anomalies, actualPage: newPage, loading: false}, () => {
                            window.scrollTo(0, 0);
                        });
                    })
                    .catch(e => {
                        this.setState({loading: false});
                        if (e.hasOwnProperty('response') && e.response.status === 401) {
                            removeToken();
                            this.props.history.push('/');
                        } else {
                            serverError();
                        }
                    });
            });
        }
    };

    render() {
        const {classes} = this.props;
        const {segments, actualPage, pages} = this.state;
        const segmentsRendered = segments.map((segment, index) => {
            return <AnomaliesItem key={index} anomaly={segment} handleChange={this.handleChange}/>;
        });
        return (
            <div>
                {this.state.loading && <Spinner/>}
                <TopBar history={this.props.history}/>
                <div className={classes.content}>
                    <Typography component="h4" variant="h4" className={classes.title}>
                        Clasificación de segmentos
                    </Typography>
                    <div className={classes.classificationColumn}>{segmentsRendered.length > 0 ?
                        segmentsRendered :
                        <p style={{color: '#808080'}}>No hay segmentos cargados.</p>}</div>
                    <Fab className={classes.fab} color="primary" onClick={this.handleSave}>
                        <Save/>
                    </Fab>
                </div>
                {segmentsRendered.length > 0 &&
                <Pagination actualPage={actualPage} pages={pages} handleChangePage={this.handleChangePage}/>}
            </div>
        );
    }
}

export default withStyles(styles)(Anomalies);
