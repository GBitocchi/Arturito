import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import config from '../../commons/config';
import TopBar from '../TopBar';
import styles from './styles';
import sweet from 'sweetalert2';
import { removeToken, getBearerAuth } from '../../commons/jsonwebtoken';
import { withStyles } from '@material-ui/styles';
import Spinner from '../Spinner';
import { checkLogin } from '../../commons/security';
import SearchBar from './SearchBar';
import moment from 'moment';
import Swal from "sweetalert2";
import ItemGadget from './ItemGadget';
import CreateGadget from './CreateGadget';

const ListGadget = props => {
	const { classes } = props;

    const [loading, setLoading] = useState(true);
    
    const [gadgets, setGadgets] = useState([]);

	const [filter, setFilter] = useState('');

	const [openCreateGadget, setOpenCreateGadget] = useState(false); 

	useEffect(() => {
		checkLogin(props);
        Axios.get(`${config.apiUrl}gadgets`, getBearerAuth())
        .then(gadgets => {
            if (gadgets.data.length !== 0) {
                setGadgets(gadgets.data);
            }
            setLoading(false);
        })
        .catch(err => {
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
            setLoading(false);
        })
	},[]);

	const click = () => {};

	const newGadget = () =>{
		setOpenCreateGadget(true);
	};

	const deleteGadget = () => {

	};

	const gadgetsToRender = gadgets
		.filter( gadget => {
			return (
				gadget.name.includes(filter) ||
				gadget.brand.includes(filter) ||
				gadget.year.toString().includes(filter)
			);
		})
		.map((gadget, index) => {
			return (
				<div key={index} className={classes.item}>
					<ItemGadget
						id={index}
						gadget={gadget}
						history={props.history}
						onClick={click}
						deleteGadget={deleteGadget}
					/>
				</div>
			);
		});

	return (
		<React.Fragment>
			{loading && <Spinner />}
			<CreateGadget
				open={openCreateGadget}
				setOpenCreateGadget={setOpenCreateGadget}
				history={props.history}
			/>
			<div className={classes.window}>
				<TopBar history={props.history} />
				<div className={classes.content}>
					<SearchBar
							filter={filter}
							setFilter={setFilter}
							newGadget={newGadget}
					/>
					<div className={classes.gadgetList}>
					{gadgetsToRender.length > 0 ?
						gadgetsToRender :
						<p style={{color: '#808080'}}>No hay electroencefalógrafos cargados.</p>}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default withStyles(styles)(ListGadget);