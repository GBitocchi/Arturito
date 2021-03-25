const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
// const pythonExecution = require('../modules/file');
const spawnSync = require('child_process').spawnSync;
const File = require('../models/File');
const Patient = require('../models/patient');
const axios = require('axios');
//const delay = require('delay');

mongoose.set('useFindAndModify', false);

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		var fs = require('fs');
		var dir = './uploads';

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		cb(null, dir);
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.originalname.endsWith('.edf')) {
		cb(null, true);
	} else {
		cb(new Error('Formato de archivo no permitido.'), false);
	}
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Get all patients
router.get('/', (req, res) => {
	Patient.find({ logicaldel: { $ne: true } })
		.exec()
		.then(patients => {
			if (patients.length == 0) {
				res.status(200).json([]);
			}
			res.status(200).json(patients);
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

// Get specific patient
router.get('/:idPatient', (req, res) => {
	Patient.find({ _id: req.params.idPatient })
		.exec()
		.then(patient => {
			if (patient.length === 0) {
				res.status(200).json([]);
				return;
			}
			res.status(200).json(patient);
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

// Create a patient
router.post('/', (req, res) => {
	Patient.find({ identification: req.body.identification })
		.exec()
		.then(patient => {
			if (patient.length !== 0) {
				res.status(406).json({
					//NOT ACCEPTABLE
					mensaje: 'Ya existe el paciente'
				});
				return;
			}
			const { name, lastname, identification, birthdate, medicines, pathologies, medicalPlan } = req.body;
			const newPatient = new Patient({
				name,
				lastname,
				identification,
				birthdate,
				medicines,
				pathologies,
				medicalPlan
			});
			newPatient
				.save()
				.then(() => {
					res.status(201).json({
						mensaje: 'Paciente creado correctamente'
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error: 'El servidor se encuentra fuera de servicio actualmente'
					});
				});
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

// Update specific patient
router.post('/:idPatient', (req, res) => {
	Patient.find({ identification: req.body.identification })
		.exec()
		.then(patient => {
			if (patient.length == 0 || patient[0]._id == req.params.idPatient) {
				const {
					identification,
					name,
					lastname,
					birthdate,
					medicines,
					pathologies,
					medicalPlan,
					medicalPlan: { medicalPlanCompany, medicalPlanNumber }
				} = req.body;
				Patient.findOneAndUpdate(
					{
						_id: req.params.idPatient
					},
					{
						$set: {
							identification: identification,
							name: name,
							lastname: lastname,
							birthdate: birthdate,
							medicines: medicines,
							pathologies: pathologies,
							medicalPlan: medicalPlan,
							medicalPlan: {
								medicalPlanCompany: medicalPlanCompany,
								medicalPlanNumber: medicalPlanNumber
							}
						}
					},
					{
						new: true
					}
				)
					.exec()
					.then(patient => {
						if (patient === null) {
							res.status(404).json({
								mensaje: 'Paciente no encontrado'
							});
						}
						res.status(200).json({
							mensaje: 'Paciente actualizado correctamente'
						});
					})
					.catch(() => {
						res.status(500).json({
							error: 'Error en la base de datos'
						});
					});
			} else {
				res.status(409).json({
					mensaje: 'Conflicto, identificador existente en el sistema'
				});
				return;
			}
		})
		.catch(() => {
			res.status(500).json({
				error: 'Error en la base de datos'
			});
		});
});

// Upload patient's file
router.patch('/file/patient', upload.single('patientFileForm'), (req, res) => {
	const file = new File({
		originalPath: req.file.originalname,
		date: Date.now(),
		modificationDate: Date.now(),
		name: req.body.fileName,
		doctor: {
			id: req.body.idDoctor,
			name: req.body.nameDoctor
		},
		gadget: req.body.gadget
	});
	const { identification } = req.body;
	Patient.findOneAndUpdate(
		{
			identification
		},
		{
			$push: { files: file }
		},
		{
			new: true
		}
	)
		.exec()
		.then(patient => {
			if (patient === null) {
				res.status(404).json({
					mensaje: 'Paciente no encontrado'
				});
			} else {
				file
					.save()
					.then(file => {
						return axios.post(
							`${process.env.PYTHON_MICROSERVICE}notations`,
							//"http://arturitoproyfinal-env.39t8abem2q.sa-east-1.elasticbeanstalk.com/notations",
							{
								filename: file.originalPath,
								_id: file._id,
								patient: patient._id
							}
						);
					})
					.then(pythonResponse => {
						if (pythonResponse.status === 200) {
							res.status(200).json({
								message: 'File uploaded successfully'
							});
							return;
						}
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							error: 'Error al intentar guardar el archivo'
						});
					});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'Error en la base de datos'
			});
		});
});

//update patient's diagnosis
router.post('/:idPatient/:fileId', (req, res) => {
	File.findOneAndUpdate(
		{ _id: req.params.fileId },
		{
			$set: {
				diagnosis: req.body.diagnostico,
				tags: req.body.tags,
				modificationDate: Date.now()
			}
		},
		{ new: true }
	)
		.exec()
		.then(file => {
			if (file === null) {
				res.status(404).json({
					mensaje: 'Archivo no encontrado'
				});
			}
			Patient.findOneAndUpdate(
				{ _id: req.params.idPatient, 'files._id': req.params.fileId },
				{
					$set: {
						'files.$': file
					}
				},
				{ new: true }
			)
				.exec()
				.then(patient => {
					if (patient === null) {
						res.status(404).json({
							mensaje: 'Paciente no encontrado'
						});
						return;
					}
					res.status(200).json({
						mensaje: 'Diagnostico actualizado correctamente'
					});
				})
				.catch(err => {
					res.status(500).json({
						error: 'El servidor se encuentra fuera de servicio actualmente'
					});
				});
		})
		.catch(err => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

//delete patients's file
router.delete('/:idPatient/:fileId', (req, res) => {
	File.findOneAndUpdate(
		{ _id: req.params.fileId },
		{
			$set: {
				logicaldel: true,
				logicaldel_date: Date.now()
			}
		},
		{ new: true }
	)
		.exec()
		.then(file => {
			if (file === null) {
				res.status(404).json({
					mensaje: 'Archivo no encontrado'
				});
			}
			Patient.findOneAndUpdate(
				{ _id: req.params.idPatient },
				{
					$pull: {
						files: { _id: req.params.fileId }
					}
				},
				{ new: true }
			)
				.exec()
				.then(patient => {
					if (patient === null) {
						res.status(404).json({
							mensaje: 'Paciente no encontrado'
						});
						return;
					}
					res.status(200).json({
						mensaje: 'Archivo borrado correctamente'
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error: 'El servidor se encuentra fuera de servicio actualmente'
					});
				});
		})
		.catch(err => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

//delete patient
router.delete('/:idPatient', (req, res) => {
	Patient.findOneAndUpdate(
		{ _id: req.params.idPatient },
		{
			$set: {
				logicaldel: true,
				logicaldel_date: Date.now()
			}
		},
		{ new: true }
	)
		.exec()
		.then(patient => {
			if (patient === null) {
				res.status(404).json({
					mensaje: 'Paciente no encontrado'
				});
				return;
			}
			res.status(200).json({
				mensaje: 'Paciente borrado correctamente'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

module.exports = router;
