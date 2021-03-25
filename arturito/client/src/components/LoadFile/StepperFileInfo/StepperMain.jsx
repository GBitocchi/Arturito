import React, {useEffect} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from "@material-ui/core/Dialog";
import withStyles from "@material-ui/core/styles/withStyles";
import AddFileName from '../../Filename/AddFilename'
import GadgetPopUp from '../../Gadget/GadgetPopUp';
import CreateGadget from '../../Gadget/CreateGadget';

const styles = theme => ({
    root: {
        width: '540px',
        display: 'flex',
        justifyContent: 'center'
    },
    backButton: {
        marginRight: 20,
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px'
    }
});

function getSteps() {
    return ['Nombre de archivo', 'Electroencefalógrafo donde se llevó a cabo el estudio'];
}

const StepperMain = (props) => {
    const {classes, handleCommit, open, handleCloseName, setGadget, setFileName} = props;
    const [activeStep, setActiveStep] = React.useState(0);
    const [temporaryFileName, setTemporarysFileName] = React.useState('');
    const [filenameError, setFilenameError] = React.useState('');
    const [OpenCreateGadget, setOpenCreateGadget] = React.useState(false);
    const [cancelled, setCancelled] = React.useState(false);
    const steps = getSteps();

    useEffect(() => {
        setTemporarysFileName('');
        setGadget('');
    }, [cancelled]);

    const handleNext = () => {
        if (activeStep === 0 && temporaryFileName !== ''){
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        } else if (temporaryFileName === '') {
            setFilenameError('Por favor complete el nombre del archivo');
        }
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const selectGadget = (gadget) => {
        setGadget(gadget)
    };

    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
        setTemporarysFileName(e.target.value);
    };

    const handleCancel = () => {
        setCancelled(true);
        handleCloseName();
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <CreateGadget
                open={OpenCreateGadget}
                setOpenCreateGadget={setOpenCreateGadget}
            />
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div className={classes.root}>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>Debe ingresar un nombre de archivo</Typography>
                    </div>
                ) : (
                    <div>
                        <div>{activeStep === 0 ?
                            <AddFileName handleChange={handleFileNameChange} error={filenameError} name={temporaryFileName}/> :
                            <GadgetPopUp selectGadget={selectGadget} setOpenCreateGadget={setOpenCreateGadget}/>}
                        </div>
                        <div className={classes.actions}>
                            <Button
                                onClick={() => {
                                    handleCloseName();
                                }}
                                style={{ color: '#f06292' }}
                            >
					            Cancelar
				            </Button>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Atras
                            </Button>
                            {activeStep !== steps.length - 1 &&
                            <Button variant="contained" color="primary" style={{color: 'white'}} onClick={handleNext}>
                                Siguiente
                            </Button>}
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default withStyles(styles)(StepperMain)
