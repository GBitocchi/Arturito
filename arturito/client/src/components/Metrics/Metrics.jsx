import React, {Component} from 'react';
import {withStyles} from '@material-ui/styles';
import {getToken} from '../../commons/jsonwebtoken';
import Axios from 'axios';
import config from '../../commons/config';
import Swal from 'sweetalert2';
import {Typography, Card, CardContent} from '@material-ui/core';
import SecArtPie from './Graphs/SecArtPie';
import TopBar from '../TopBar';
import Spinner from '../Spinner';
import PrecisionBar from './Graphs/PrecisionBar';
import {checkError} from '../../commons/security'
import {getBearerAuth} from '../../commons/jsonwebtoken'
import KPI from './Graphs/KPI';

const styles = theme => ({
    window: {
        height: '100vh',
    },
    view: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 20,
        overflow: 'hidden',
        [theme.breakpoints.down(600)]: {
            marginTop: 56,
            overflow: 'auto',
        },
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '80%',
        height: '100%',
    },
    title: {
        marginTop: 55,
        marginLeft: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
	classTitle: {
    	textAlign: 'center'
	}
});

const mapSecondsArtifacts = (arr) => {
    return [
        {
            name: 'Artificios',
            value: arr[0],
        },
        {name: 'Segundos netos', value: arr[1]},
    ];
};

const mapPrecision = (file) => {
    return file.hasOwnProperty('acc') &&
        [{name: 'Predicciones entre 0.4 y 0.6', value: (100 - file.acc) / 100},
            {name: 'Predicciones por fuera de 0.4 y 0.6', value: (file.acc / 100)}]
};


class Metrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            loading: false,
            gadget: ''
        };
    }

    componentDidMount() {
        this.setState({loading: true}, () => {
            if (!getToken()) {
                this.props.history.push('/');
            } else {
                Axios.get(
                    `${config.apiUrl}files/${this.props.match.params.file}`,
                    getBearerAuth()
                )
                    .then(complete_file => {
                        this.setState({file: complete_file['data']});
                        Axios.get(
                            `${config.apiUrl}gadgets/${this.state.file.gadget}`,
                            getBearerAuth()
                        )
                            .then(retrieved_gadget => {
                                this.setState({gadget: retrieved_gadget['data']});
                                this.setState({loading: false});
                            })
                            .catch(err => {
                                console.log(err);
                                Swal.fire({
                                    type: 'error',
                                    title: 'Ups',
                                    text: `${err}`,
                                });
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            type: 'error',
                            title: 'Ups',
                            text: `${err}`,
                        });
                    });
            }

        });
    }

    render() {
        const {classes} = this.props;
        const {file, gadget} = this.state;
        return (
            <div className={classes.window}>
                <TopBar history={this.props.history} goBack={`/files/${this.props.location.state}`}/>
                {this.state.loading ? (
                    <Spinner/>
                ) : (
                    <div className={classes.view}>
                        <Typography
                            component='h5'
                            variant='h5'
                            className={classes.title}
                        >
                            <strong>{file.name}</strong>
                        </Typography>
                        <div className={classes.row}>
                            {/*<div className={classes.column}>*/}
                            <div className={classes.column}>
                                <Typography component='h6' variant='h6' className={classes.classTitle}>
                                    <strong>
                                        Clasificación de ondas
                                    </strong>
                                </Typography>
                                <SecArtPie data={mapSecondsArtifacts([file.artifacts, file.seconds - file.artifacts])}/>
                            </div>
							<div className={classes.column}>

								<Typography component='h6' variant='h6' className={classes.classTitle}>
									<strong>{`Precisión acumulada del electroencefalógrafo ${gadget.name}`}</strong>
								</Typography>
								<KPI gadget={gadget}/>
							</div>
                            <div className={classes.column}>

                                <Typography component='h6' variant='h6' className={classes.classTitle}>
                                    <strong>Cantidad de segundos por Porcentaje de Precisión</strong>
                                </Typography>
                                <PrecisionBar file={file}/>
                            </div>

                            {/*</div>
							<div className={classes.column}>*/}


                            <div className={classes.column}>

                                <Typography component='h6' variant='h6' className={classes.classTitle}>
                                    <strong>
                                        Precisión de evaluación del estudio
                                    </strong>
                                </Typography>
                                <SecArtPie data={mapPrecision(file)}/>
                                {/*</div>*/}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Metrics);
