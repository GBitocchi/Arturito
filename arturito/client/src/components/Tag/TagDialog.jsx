import React, {Component} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    withStyles,
    Button,
} from '@material-ui/core';

const style = theme => ({
    dialog: {
        padding: '20px !important'
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textFields: {
        marginBottom: 10
    }
});

class TagDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: {
                value: '',
                error: '',
            },
            value: {
                value: '',
                error: '',
            },
        };
    }

    handleChange = e => {
        const {name, value} = e.target;
        this.setState((prevState) =>
            ({
                [name]: {
                    ...prevState[name],
                    ['value']: value
                }
            })
        );
    };

    onCreate = () => {
        const {handleCreate, handleClose} = this.props;
        const {key, value} = this.state;
        if (key.value !== '' && value.value !== '') {
            handleCreate(key.value, value.value);
            this.setState({
                key: {
                    value: '',
                    error: ''
                },
                value: {
                    value: '',
                    error: ''
                }
            });
            handleClose();
        } else {
            key.value === '' &&
            this.setState({
                key: {
                    value: key.value,
                    error:
                        key.value === ''
                            ? 'El campo no puede estar vacio'
                            : '',
                },
            });
            value.value === '' &&
            this.setState({
                value: {
                    value: value.value,
                    error:
                        value.value === ''
                            ? 'El campo no puede estar vacio'
                            : '',
                },
            });
        }
    };

    render() {
        const {key, value} = this.state;
        const {classes, open, handleClose} = this.props;
        return (
            <Dialog open={open} className={classes.dialog}>
                <DialogTitle>Creación de etiquetas</DialogTitle>
                <DialogContent className={classes.body}>
                    <TextField
                        name='key'
                        label='Etiqueta'
                        onChange={this.handleChange}
                        value={key.value}
                        error={key.error !== ''}
                        helperText={key.error}
                        className={classes.textFields}
                    />
                    <TextField
                        name='value'
                        label='Descripción'
                        onChange={this.handleChange}
                        value={value.value}
                        multiline
                        rows="4"
                        error={value.error !== ''}
                        helperText={value.error}
                        className={classes.textFields}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={this.onCreate}>
                        Crear
                    </Button>
                    <Button style={{color: "#f06292"}} onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(style)(TagDialog);
