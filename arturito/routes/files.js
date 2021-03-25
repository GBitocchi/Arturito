const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const pythonExecution = require('../modules/file');
const File = require('../models/File');
const Patient = require('../models/patient');
const AWS = require('aws-sdk');

//insert diagnosis
router.post('/diagnosis', (req, res) => {
	File.find({ _id: req.body.fileId })
		.exec()
		.then(file => {
			if (file.length !== 0) {
				res.status(404).json({
					mensaje: 'No se ha encontrado el archivo.'
				});
				return;
			}
			file.diagnosis = req.body.diagnostico;
			file.tags = req.body.tags;
			file
				.save()
				.then(() => {
					res.status(201).json({
						mensaje: 'Diagnostico guardado correctamente'
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

router.get('/:fileId/:originalFile', (req, res) => {
	const { fileId, originalFile } = req.params;
	File.find({ _id: fileId })
		.exec()
		.then(files => {
			if (files.length === 0) {
				res.status(404).json({
					mensaje: 'No se encontro ningun archivo con el Id provisto'
				});
				return;
			}
			const [file] = files;

			let s3 = new AWS.S3();
			AWS.config.update({ accessKeyId: 'AKIAJH6F66SBCJO6WVPQ', secretAccessKey: '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' });
			const myBucket = 'arturitoproyectofinal';
			const signedUrlExpireSeconds = 60 * 5;
			let myKey = '';

			if (originalFile === 'true') {
				myKey = path.join(myKey, file.originalPath);
			} else {
				myKey = path.join(myKey, file.resultPath);
			}

			let url = s3.getSignedUrl('getObject', {
				Bucket: myBucket,
				Key: myKey,
				Expires: signedUrlExpireSeconds
			});

			if(url == 'https://s3.amazonaws.com/'){
				s3 = new AWS.S3();
				AWS.config.update({ accessKeyId: 'AKIAJH6F66SBCJO6WVPQ', secretAccessKey: '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' });
				url = s3.getSignedUrl('getObject', {
					Bucket: myBucket,
					Key: myKey,
					Expires: signedUrlExpireSeconds
				});
			}

			res.status(200).json({
				url
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

// Get artifacts and seconds
router.get('/info/artifacts/:idFile', (req, res) => {
	File.findById({ _id: req.params.idFile })
		.exec()
		.then(file => {
			if (file === null) {
				res.status(404).json({
					mensaje: 'No se encontro ningun file con el Id provisto'
				});
				return;
			}

			const netSeconds = file.seconds - file.artifacts;

			const info = [{ name: 'Artificios', value: file.artifacts }, { name: 'Segundos Netos', value: netSeconds }];

			res.status(200).json({
				info
			});
		})
		.catch(err => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

// Get specific file
router.get('/:idFile', (req, res) => {
	File.findById({ _id: req.params.idFile })
		.exec()
		.then(file => {
			if (file === null) {
				res.status(404).json({
					mensaje: 'No se encontro ningun file con el Id provisto'
				});
				return;
			}
			res.status(200).json(file);
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente'
			});
		});
});

module.exports = router;
