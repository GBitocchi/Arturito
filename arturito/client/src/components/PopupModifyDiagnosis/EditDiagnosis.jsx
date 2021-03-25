import React, {Component} from 'react';
import TagDialog from '../Tag/TagDialog';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    withStyles,
    Chip,
} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {removeToken, getBearerAuth} from '../../commons/jsonwebtoken'
import TagFile from '../Tag/TagRow';
import Axios from "axios";
import config from "../../commons/config";
import serverError from "../../commons/serverError";

const style = theme => ({
    chipsAndBtns: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fab: {
        maxHeight: 32,
        maxWidth: 32,
    },
});

class EdigDiagnosis extends Component {
    handleChange = event => {
        this.props.setDiagnosis(event.target.value);
    };

    render() {
        const {seconds, artifacts, diagnosis} = this.props.file;
        const {
            open,
            setClose,
            fileRequest,
            diagnosisUpdateSend,
            descriptionButton,
            handleSelectedTags,
            tags,
            selectedTags,
            classes,
        } = this.props;

        return (
            <React.Fragment>
                <Dialog open={open} onClose={setClose}>
                    <DialogTitle>Electroencefalograma evaluado</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Se detectaron {artifacts} segundos de artificios,
                            quedando {seconds - artifacts} segundos netos para
                            ser analizados con mayor profundidad.
                        </DialogContentText>
                        <TextField
                            id='standard-multiline-flexible'
                            defaultValue={diagnosis}
                            label='Diagnóstico'
                            placeholder="Ingrese aquí sus observaciones sobre el estudio"
                            fullWidth
                            type='text'
                            className='textArea'
                            multiline
                            rowsMax='20'
                            variant='outlined'
                            onChange={this.handleChange}
                        />
                        <div className={classes.chipsAndBtns}>
                            <TagFile
                                tags={tags}
                                selectedTags={selectedTags ? selectedTags : []}
                                handleClick={handleSelectedTags}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                fileRequest(true);
                            }}
                            color='primary'
                        >
                            Descargar Original
                        </Button>
                        <Button
                            onClick={() => {
                                fileRequest(false);
                            }}
                            color='primary'
                        >
                            Descargar Resultados
                        </Button>
                        <Button
                            onClick={diagnosisUpdateSend}
                            style={{color: '#e91e63'}}
                        >
                            {descriptionButton}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(style)(EdigDiagnosis);
