import React from 'react';
import {TextField, Typography} from '@material-ui/core';


const AddFileName = props => {
    const {handleChange,name, error} = props;
    return (
        <div>
            <Typography>
                Ingrese el nombre del estudio que desea procesar
            </Typography>
            <TextField
                autoFocus
                margin='dense'
                id='name'
                label='Nombre del estudio'
                type='Nombre'
                value={name}
                fullWidth
                onChange={handleChange}
                error={error.length > 0}
                helperText={error}
            />
        </div>
    );
};

export default AddFileName;
