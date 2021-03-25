import React, {Component} from 'react';
import {Typography, TextField, Button} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import axios from 'axios';
import sweet from 'sweetalert2';
import BrainImage from '../img/brain-eeg.png';
import {setToken, getToken} from '../commons/jsonwebtoken';
import {anyEmpty} from '../commons/utils';
import config from '../commons/config';

const style = theme => ({
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'row',
        fontFamily: "'Roboto Mono', monospace",
        backgroundColor: '#34a5e1',
    },
    items: {
        marginTop: 10,
    },
    buttons: {
        marginBottom: '10px',
        color: 'white',
    },
    inputs: {
        marginBottom: '20px',
        width: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    leftContent: {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        borderTopRightRadius: '50px',
        borderBottomRightRadius: '50px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
        margin: 0,
        padding: '100px',
    },
    rightContent: {
        borderRadius: 100,
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'center',
        width: '50%',
    },
    img: {
        width: 500,
    },
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleChange = event => {
            const {name, value} = event.target;
            this.setState({[name]: value});
    };

    componentDidMount = () => {
        if (getToken()) {
            this.props.history.push('/patients');
        }
    };

    // TODO: Add error message when field is empty
    handleSubmit = () => {
        if (!anyEmpty(this.state, [])) {
            axios
                .post(`${config.apiUrl}doctors/login`, this.state)
                .then(result => {
                    setToken(result.data.token);
                    this.props.history.push('/patients');
                })
                .catch(() => {
                    sweet.fire({
                        type: 'error',
                        title: 'Oops!',
                        text: 'Tu usuario o contraseña no son correctos',
                    });
                });
        }
    };

    handleKeyDown = (e) => {
    	if(e.key === 'Enter') {
    		this.handleSubmit()
		}
	};

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <div className={classes.content}>
                    <div className={classes.leftContent}>
                        <div className={classes.form}>
                            <div className={classes.inputs}>
                                <Typography
                                    component='h3'
                                    variant='h4'
                                    className={classes.items}
                                    style={{
                                        marginBottom: 10,
                                        fontFamily: "'Roboto Mono', monospace",
                                        color: '#363636',
                                    }}
                                >
                                    Bienvenido
                                </Typography>
                                <TextField
                                    label='Usuario'
                                    name='username'
                                    value={this.state.username}
                                    onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
                                    className={classes.items}
                                    margin='dense'
                                    autoFocus={true}
                                />
                                <TextField
                                    label='Contraseña'
                                    name='password'
                                    value={this.state.password}
                                    onChange={this.handleChange}
									onKeyDown={this.handleKeyDown}
                                    className={classes.items}
                                    margin='dense'
                                    type='password'
                                />
                            </div>
                            <Button
                                variant='contained'
                                color='primary'
                                className={classes.buttons}
                                onClick={this.handleSubmit}
                            >
                                Aceptar
                            </Button>
                        </div>
                    </div>
                    <div className={classes.rightContent}>
                        <img
                            src={BrainImage}
                            className={classes.img}
                            alt='Brain'
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(Home);
