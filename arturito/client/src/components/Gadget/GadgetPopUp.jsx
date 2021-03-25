import React, {Component} from 'react';
import {withStyles} from '@material-ui/styles';
import Axios from "axios";
import Swal from "sweetalert2";
import {Typography, IconButton} from "@material-ui/core";
import {removeToken, getBearerAuth} from '../../commons/jsonwebtoken';
import config from "../../commons/config";
import ItemGadget from "./ItemGadget";

const styles = theme => ({
    content: {
        padding: 20
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainContent: {
        overflow: 'auto',
        padding: '20px',
        maxHeight: '100px',
    },
    item: {
        marginTop: 5,
    },
    addBtn: {
        marginLeft: 30,
        marginTop: 20
    }
});

class GadgetPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gadgets: [{name: 'Maquinita', brand: 'Epson', year: '1950', artifacts: '', seconds: '', studies: ''}]
        }
    }

    componentDidMount() {
        this.getGadgets();
    }

    getGadgets = () => {
        Axios.get(`${config.apiUrl}gadgets`, getBearerAuth()).then(gadgets => {
            if (gadgets.data.length !== 0) {
                this.setState({
                    gadgets: gadgets.data
                });
            }
        }).catch(err => {
            if (err.hasOwnProperty('response') && err.response.status === 401) {
                removeToken();
                this.props.history.push('/');
            } else {
                Swal.fire({
                    text: 'Error al intentar obtener el listado de máquinas',
                    title: 'Ups!'
                }).then(() => {
                    this.props.history.push('/patients')
                })
            }
        })
    };

    onGadgetSelected = (gadget) => {
        this.props.selectGadget(gadget);
    };

    render() {
        const {classes} = this.props;
        const {gadgets} = this.state;
        return (
            <div className={classes.content}>
                <div className={classes.header}>
                    <Typography variant="h6" component="h6">Seleccione el electroencefalógrafo donde se llevó a cabo el
                        estudio</Typography>
                </div>
                <div className={classes.mainContent}>
                    {gadgets.length > 0 ? gadgets.map((gadget, index) => {
                        return (
                            <div key={index} className={classes.item}>
                                <ItemGadget gadget={gadget} onClick={this.onGadgetSelected}/>
                            </div>
                        )
                    }) : <Typography>No hay máquinas cargadas</Typography>}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(GadgetPopUp);