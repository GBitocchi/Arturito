import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { CloudUpload } from '@material-ui/icons';
import axios from 'axios';
import styles from './styles';
import TopBar from '../TopBar';
import PatientDescription from './PatientDescription';
import config from '../../commons/config';
import serverError from '../../commons/serverError';
import { checkLogin } from '../../commons/security';
import { removeToken } from '../../commons/jsonwebtoken';
import Spinner from '../Spinner';
import sweet from 'sweetalert2';
import EditDiagnosis from '../PopupModifyDiagnosis/EditDiagnosis';
import Dropzone from 'react-dropzone';
import AddNameFile from './AddNameFile';
import { getToken, getBearerAuth } from '../../commons/jsonwebtoken';
import StepperMain from './StepperFileInfo/StepperMain';

const UploadFile = props => {
	const [file, setFile] = useState('');
	const [processedFile, setProcessedFile] = useState('');
	const [open, setOpen] = useState(false);
	const [diagnosis, setDiagnosis] = useState('');
	const [openName, setOpenName] = useState(false);
	const [fileName, setFileName] = useState('');
	const [doctor, setDoctor] = useState('');
	const [gadget, setGadget] = useState('');
	const [tags, setTags] = useState('');
	const [selectedTags, setSelectedTags] = useState([]);

	const [patient, setPatient] = useState({
		_id: '',
		name: '',
		lastname: '',
		medicalPlan: { number: 0, company: '' },
		identification: 0,
		files: [
			{
				date: '',
				originalPath: '',
				modificationDate: '',
				resultPath: '',
				doctor: '',
				diagnosis: ''
			}
		]
	});

	const [loading, setLoading] = useState(false);

	const [ref] = useState({
		fileInputRef: React.createRef()
	});

	useEffect(() => {
		if(gadget !== '' && gadget){handleCommit();}
	}, [gadget])

	useEffect(() => {
		if (file !== '') {
			setOpenName(true);
		}
	}, [file]);

	const handleCommit = () => {
		checkLogin(props);
		if (file !== '' && fileName !== '' && gadget._id !== '') {
			setOpenName(false);
			setLoading(true);
			const data = new FormData();
			data.append('name', patient.name);
			data.append('lastName', patient.lastname);
			data.append('identification', patient.identification);
			data.append('idDoctor', doctor._id);
			data.append('nameDoctor', doctor.name);
			data.append('patientFileForm', file);
			data.append('fileName', fileName);
			data.append('gadget', gadget._id);
			axios
				.patch(`${config.apiUrl}patients/file/patient`, data, getBearerAuth())
				.then(result => {
					setLoading(false);
					sweet
						.fire({
							type: 'success',
							title: 'Archivo cargado correctamente',
							text: 'A la brevedad podrá visualizar los resultados'
						})
						.then(() => {
							props.history.push(`/files/${patient._id}`);
						});
				})
				.catch(err => {
					setLoading(false);
					sweet.fire({
						type: 'error',
						title: 'Oops!',
						text: 'Error con el servidor. Por favor, vuelva a intentarlo más tarde'
					});
				});
		}
	};

	useEffect(
		() => {
			checkLogin(props);
			axios
				.get(`${config.apiUrl}patients/${props.match.params.patient}`, getBearerAuth())
				.then(({ status, data }) => {
					if (status === 200) {
						setPatient(data[0]);
						return axios.get(`${config.apiUrl}tags`, getBearerAuth());
					} else {
						serverError();
					}
				})
				.then(({ status, tags }) => {
					if (status === 200) {
						setTags(tags);
					} else {
						serverError();
					}
				})
				.catch(err => {
					if (err.hasOwnProperty('response') && err.response.status === 401) {
						removeToken();
						props.history.push('/');
					} else {
						serverError();
					}
				});
		},
		[props]
	);

	useEffect(
		() => {
			axios
				.post(`${config.apiUrl}doctors`, { token: getToken() }, getBearerAuth())
				.then(foundDoctor => {
					setDoctor(foundDoctor.data[0]);
				})
				.catch(err => {
					if (err.hasOwnProperty('response') && err.response.status === 401) {
						removeToken();
						props.history.push('/');
					} else {
						serverError();
					}
				});
		},
		[props.history]
	);

	const openFileDialog = () => {
		ref.current.click();
	};

	const onFilesAdded = e => {
		const file = e.target.files[0];
		if (file.name.endsWith('.edf')) {
			setFile(file);
		} else {
			sweet.fire({
				type: 'error',
				title: 'Oops!',
				text: 'Archivo con extensión inválida'
			});
		}
	};

	const onDrop = acceptedFiles => {
		const file = acceptedFiles[0];
		if (file.name.endsWith('.edf')) {
			setFile(file);
		} else {
			sweet.fire({
				type: 'error',
				title: 'Oops!',
				text: 'Archivo con extensión inválida'
			});
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleCloseName = () => {
		setOpenName(false);
	};

	const handleOpenName = () => {
		setOpenName(true);
	};

	const handleTagSelected = tagSelected => {
		if (
			selectedTags.find(tag => {
				return tagSelected.key !== tag;
			})
		) {
			setSelectedTags([...selectedTags, tagSelected.key]);
		} else {
			const tags = [...selectedTags];
			const index = tags.indexOf(tagSelected.key);
			tags.splice(index, 1);
			setSelectedTags(tags);
		}
	};

	const fileRequest = original => {
		let directorySplited;
		if (original) directorySplited = processedFile.originalPath.split('/');
		else directorySplited = processedFile.resultPath.split('/');

		const filename = directorySplited[directorySplited.length - 1];
		axios({
			url: `${config.apiUrl}files/` + processedFile._id + '/' + original,
			responseType: 'blob',
			method: 'GET'
		})
			.then(resp => {
				const url = window.URL.createObjectURL(new Blob([resp.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', filename);
				document.body.appendChild(link);
				link.click();
			})
			.catch(err => {
				console.log(err);
				sweet.fire({
					type: 'error',
					title: 'Oops!',
					text: 'Error al descargar el archivo. Por favor, vuelva a intentarlo más tarde'
				});
			});
	};

	const diagnosisUpdateSend = () => {
		setLoading(true);
		axios({
			method: 'post',
			headers: {},
			url: `${config.apiUrl}patients/${patient._id}/${processedFile._id}`,
			data: {
				diagnostico: diagnosis
			}
		})
			.then(() => {
				setLoading(false);
				sweet
					.fire({
						type: 'success',
						title: 'Operación exitosa',
						text: 'Archivo procesado y guardado correctamente'
					})
					.then(() => {
						props.history.push(`/files/${patient._id}`);
					});
			})
			.catch(() => {
				sweet.fire({
					type: 'error',
					title: 'Oops!',
					text: 'Error al guardar el diagnóstico. Por favor, vuelva a intentarlo más tarde'
				});
				setLoading(false);
			});
		handleClose();
	};

	const { classes, showButton } = props;

	return (
		<div className={classes.window}>
			<TopBar history={props.history} />
			{loading && <Spinner message="Subiendo archivo" />}
			<StepperMain
				open={openName}
				handleCloseName={handleCloseName}
				handleCommit={handleCommit}
				setGadget={setGadget}
				setFileName={setFileName}
			/>
			{false && (
				<AddNameFile
					open={openName}
					setOpen={handleOpenName}
					handleCloseName={handleCloseName}
					setFileName={setFileName}
					handleCommit={handleCommit}
				/>
			)}
			<EditDiagnosis
				descriptionButton="Aceptar"
				open={open}
				setOpen={handleOpen}
				file={processedFile}
				setClose={handleClose}
				diagnosisUpdateSend={diagnosisUpdateSend}
				fileRequest={fileRequest}
				setDiagnosis={setDiagnosis}
			/>
			<div className={classes.content}>
				<Dropzone onDrop={onDrop}>
					{({ getRootProps }) => (
						<div className={classes.leftContent} {...getRootProps()}>
							<div className={classes.dropZone}>
								<CloudUpload className={classes.icon} />
								<p>
									<strong className={classes.choose} onClick={openFileDialog}>
										Elija
									</strong>{' '}
									o arrastre el archivo aquí
								</p>
							</div>
						</div>
					)}
				</Dropzone>
				<PatientDescription patient={patient} showButton={{ showButton }} history={props.history} />
			</div>
			<input accept=".edf" ref={ref} type="file" className={classes.inputFile} onChange={onFilesAdded} />
		</div>
	);
};

export default withStyles(styles)(UploadFile);
