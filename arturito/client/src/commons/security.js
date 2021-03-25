import {getToken, removeToken} from './jsonwebtoken';
import serverError from "./serverError";

const checkLogin = props => {
    if (!getToken()) {
        props.history.push('/');
    }
    return;
};

const logOut = props => {
    if (getToken()) {
        removeToken();
    }
    props.history.push('/');
    return;
};

const checkError = (err, props) => {
    if (err.hasOwnProperty('response') && err.response.status === 401) {
        removeToken();
        props.history.push('/')
    } else {
        serverError();
    }
};

export {logOut, checkLogin, checkError};
