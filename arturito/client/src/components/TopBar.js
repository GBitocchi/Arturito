import React, {useRef, useEffect} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    makeStyles,
    useTheme,
} from '@material-ui/core';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Menu as MenuIcon,
    ArrowBack as Arrow
} from '@material-ui/icons';
import Swal from 'sweetalert2';
import {logOut} from '../commons/security';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        color: 'white',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 5,
    },
}));

const TopBar = props => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const {goBack} = props;
    const ref = useRef();

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClick = e => {
        if (!ref.current.contains(e.target)) {
            handleDrawerClose();
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Está a punto de salir del sistema',
            text: '¿Desea salir de ARTURITO?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f06392',
            cancelButtonColor: '#34a6e1',
            confirmButtonText: 'Salir',
            cancelButtonText: 'Cancelar',
            focusCancel: true,
        }).then(result => {
            if (result.value) logOut(props);
            else handleDrawerOpen();
        });
    };

    return (
        <div className={classes.root} ref={ref}>
            <AppBar
                position='fixed'
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    {goBack ? <IconButton
                        className={classes.menuButton}
                        to={`${goBack}`}
                        component={Link}
                    >
                        <Arrow style={{color: 'white'}}/>
                    </IconButton> : <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        onClick={handleDrawerOpen}
                        edge='start'
                        className={clsx(
                            classes.menuButton,
                            open && classes.hide
                        )}
                    >
                        <MenuIcon/>
                    </IconButton>}
                    <Typography variant='h6' color='inherit'>
                        ARTURITO
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='left'
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? (
                            <ChevronLeftIcon/>
                        ) : (
                            <ChevronRightIcon/>
                        )}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <ListItem
                        button
                        component={Link}
                        to='/patients'
                        onClick={() => setOpen(false)}
                    >
                        <ListItemText primary='Pacientes'/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/doctor'
                        onClick={() => setOpen(false)}
                    >
                        <ListItemText primary='Mi Perfil'/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/anomalies'
                        onClick={() => setOpen(false)}>
                        <ListItemText primary='Anomalías'/>
                    </ListItem>
                    <ListItem
                        button
                        component={Link}
                        to='/gadgets'
                        onClick={() => setOpen(false)}
                    >
                        <ListItemText primary='Electroencefalógrafos'/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => {
                            handleDrawerClose();
                            handleLogout();
                        }}
                    >
                        <ListItemText primary='Salir'/>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
};

export default TopBar;
