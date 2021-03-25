import React from "react";
import axios from 'axios';
import sweet from 'sweetalert2';
import Popup from "reactjs-popup";
import { Typography, TextField } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import TopBar from '../../TopBar';
import './styles.css';

const colortheme = createMuiTheme({
  palette: {
    primary: { main: "#e91e63", contrastText: "#fff" },
    secondary: { main: "#03a9f4", contrastText: "#fff" }
  }
});

export default class ControlledPopup extends React.Component {
    constructor(props) {
      super(props);
      this.state = { open: false, diagnostico: '' };
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
    }
    openModal() {
      this.setState({ open: true });
    };

    closeModal() {
      this.setState({ open: false });
    };

    fileRequest(original){
      axios.get('http://localhost:3000/files/' + this.props.fileId + '/' + original)
        .then(resp => {
            resp.download(resp.data);
        })
        .catch(err => {
          sweet.fire({
            type: 'error',
            title: 'Oops!',
            text: 'Error al descargar el archivo. Por favor, vuelva a intentarlo más tarde'
          });
        });
    };

    diagnosisSend(){
            axios({method: 'post', headers: {}, url: 'http://localhost:3000/files/diagnosis',data: {
                diagnostico: this.state.diagnostico,
                fileId: this.props.fileId
              }})
              .catch(() => {
                sweet.fire({
                  type: 'error',
                  title: 'Oops!',
                  text: 'Error al guardar el diagnóstico. Por favor, vuelva a intentarlo más tarde'
                });
              });
    };

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };
  
    render() {
      return (
       <div>
          <TopBar history={this.props.history}/>
          <Popup open={true} modal>
          {close => (
            <div className="modal">
              <a className="close" onClick={close}>
                &times;
              </a>
              <div className="header"> Electroencefalograma evaluado </div>
              <div className="content">
              <Typography
                    component="body1"
                    variant="body2"
                    className="items"
                    style={{
                      marginBottom: 10,
                      fontFamily: "'Roboto Mono', monospace",
                      color: '#363636'
                    }}
              >                 
								  Se detectó {this.props.segundosArtificios} segundos de artificios, quedando {this.props.netoSegundos} segundos netos para ser
                     <br/>
                    analizados con mayor profundidad.						
              </Typography>     
              <div className="textAreaDiv">         
                <TextField
                id="outlined-multiline-static"
                placeholder={!this.props.diagnostico ? "Ingrese aquí sus observaciones sobre el estudio." : this.props.diagnostico}
                onChange={this.handleChange('diagnostico')}
                margin="normal"
                className = "textArea"
                multiline
                rows = "4"
                variant="outlined"
                />
                </div>           
              <div className="actions">
                <Button
                  variant="contained"
                  color="primary"               
                  className="button"
                  onClick={() => {
                    this.fileRequest(true);
                    close();
                  }}
                >
                  Descargar original 
                  <CloudDownloadIcon className="rightIcon" />
                </Button>
                <div className="divider"></div>
                <Button
                  variant="contained"
                  color="primary"               
                  className="button"
                  onClick={() => {
                    this.fileRequest(false);
                    close();
                  }}
                >
                  Descargar resultados
                  <CloudDownloadIcon className="rightIcon" />
                </Button>
                <div className="divider"></div>
                <MuiThemeProvider theme={colortheme}>
                <Button
                  variant="contained"
                  color="primary"               
                  className="button"
                  onClick={() => {
                    if(this.state.diagnostico !== ''){
                      this.diagnosisSend();
                    }
                    close();
                  }}
                >
                  Aceptar
                </Button>
                </MuiThemeProvider>
              </div>
            </div>
          </div>
          )}
        </Popup>
      </div>
      );
    }
  }