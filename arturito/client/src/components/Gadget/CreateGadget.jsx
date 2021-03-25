import React, {Component} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Typography,
    withStyles
} from '@material-ui/core';
import {errorGadget} from '../../commons/errors';
import {getBearerAuth} from '../../commons/jsonwebtoken';
import {checkError} from '../../commons/security'
import {setEmptyGadgetErrors, setFormatGadgetErrors} from '../../commons/gadgetValidators';
import axios from 'axios';
import sweet from 'sweetalert2';
import {anyEmpty, allEmpty} from '../../commons/utils';
import config from '../../commons/config';

const styles = theme => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%'
    },
    singleField: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%'
    },
    field: {
        marginTop: 10
    },
});

class CreateGadget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: '',
            errors: {...errorGadget},
            gadget: {
                name: '',
                year: '',
                brand: ''
            },
            loading: false
        }
    }

    /*
        cleanError = () => {
            this.setState(prevState => ({
                ...prevState,
                errors: {...errorTemplate}
            }));
        };
    */


    handleSubmit = () => {
        const {gadget, errors} = this.state;
        const {setOpenCreateGadget} = this.props;
        this.setState(prevState => ({
            ...prevState,
            errors: {...errorGadget}
        }), () => {
            this.checkEmptyErrors(gadget, errors, setOpenCreateGadget);
        })
    };

    checkEmptyErrors(gadget, errors, setOpenCreateGadget) {
        if (!anyEmpty(gadget, [])) {
            this.setState(prevState => ({
                ...prevState,
                loading: true,
                errors: setFormatGadgetErrors(gadget)
            }), () => {
                if (allEmpty(errors)) {
                	console.log(errors);
                    axios
                        .post(`${config.apiUrl}gadgets`, gadget, getBearerAuth())
                        .then(() => {
                            setOpenCreateGadget(false);
                            sweet
                                .fire({
                                    type: 'success',
                                    title: 'Operación exitosa',
                                    text: 'Electroencefalógrafo creado correctamente',
                                })
                                .then(() => {
                                    window.location.reload(false);
                                    this.setState(prevState => ({
                                        ...prevState,
                                        loading: false
                                    }));
                                });
                        })
                        .catch((err) => {
                            setOpenCreateGadget(false);
                            let message = 'Error con el servidor. Por favor, vuelva a intentarlo más tarde';
                            if (err.response !== undefined && err.response.status === 409)
                                message = err.response.data.error;
                            sweet.fire({
                                type: 'error',
                                title: 'Oops!',
                                text:
                                message,
                            }).then(() => {
                                this.setState(prevState => ({
                                    ...prevState,
                                    loading: false
                                }))
                            });
                        });
                } else {
                    this.setState((prevState) => ({
                        ...prevState,
                        errors: {...errorGadget}
                    }));
                }
            })
        }
    }

    handleClose = () => {
        const {setOpenCreateGadget} = this.props;
        setOpenCreateGadget(false);
        window.location.reload(false);
    };

    handleChange = (e) => {
    	e.persist();
    	const {target} = e;
    	this.setState(prevState => ({
			...prevState,
			gadget: {
				...prevState.gadget,
				[target.name]: target.value
			}
		}));
	};

    render() {
        const {errors, gadget} = this.state;
        const {open} = this.props;
        return (
            <Dialog open={open}>
                <DialogTitle>Crear electroencefalógrafo</DialogTitle>
                <DialogContent>
                    <TextField
                        name="name"
                        label="Nombre"
                        style={{marginTop: 10, width: '100%'}}
                        value={gadget.name}
                        error={errors.errorName !== ''}
                        helperText={errors.errorName}
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="year"
                        label="Año"
                        style={{marginTop: 10, width: '100%'}}
                        value={gadget.year}
                        error={errors.errorYear !== ''}
                        helperText={errors.errorYear}
                        onChange={this.handleChange}
                    />
                    <TextField
                        name="brand"
                        label="Marca"
                        style={{marginTop: 10, width: '100%'}}
                        value={gadget.brand}
                        error={errors.errorBrand !== ''}
                        helperText={errors.errorBrand}
                        onChange={this.handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} style={{color: '#f06292'}}>
                        Cancelar
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


export default withStyles(styles)

(
    CreateGadget
)
;