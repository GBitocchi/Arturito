import React from "react";
import {Card, CardContent, Typography, withStyles, IconButton, Icon, Tooltip} from "@material-ui/core";
import {DesktopWindows, Delete} from '@material-ui/icons'

const styles = theme => ({
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: '7px !important',
        [theme.hover]: {
            backgroundColor: '#efefef'
        }
    },
    info: {
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    card: {
        cursor: 'pointer',

    },
    element: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 200
    },
    description: {
        textAlign: 'center',
        marginTop: 15
    },
    fullItemGadget: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});

const ItemGadget = (props) => {
    const {classes, onClick, deleteGadget} = props;
    const {name, year, brand} = props.gadget;

    return (
        deleteGadget ?
            (<Card>
                <CardContent className={classes.fullItemGadget}>
                    <div className={classes.element}>
                        <Icon className={classes.icon} fontSize="large">
                            <DesktopWindows style={{fontSize: 35}}/>
                        </Icon>
                        <div className={classes.description}>
                            <Typography>
                                Nombre:
                            </Typography>
                            <Typography component="h6" variant="h6"><strong>{name}</strong></Typography>
                        </div>
                        <div className={classes.description}>
                            <Typography>
                                Marca:
                            </Typography>
                            <Typography component="h6" variant="h6"><strong>{brand}</strong></Typography>
                        </div>
                        <div className={classes.description}>
                            <Typography>
                                Año:
                            </Typography>
                            <Typography component="h6" variant="h6"><strong>{year}</strong></Typography>
                        </div>
                    </div>
                    <Tooltip title="Eliminar electroencefalógrafo">
                        <IconButton>
                            <Delete style={{fontSize: 35}}/>
                        </IconButton>
                    </Tooltip>
                </CardContent>
            </Card>)
            : (<Card className={classes.card} onClick={() => onClick(props.gadget)}>
                <CardContent className={classes.item}>
                    <div className={classes.info}>
                        <Typography variant="subtitle2">
                            {name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {brand}
                        </Typography>
                        <Typography variant="subtitle2">
                            {year}
                        </Typography>
                    </div>
                </CardContent>
            </Card>)
    )
};

export default withStyles(styles)(ItemGadget)