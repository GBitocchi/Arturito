const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('../commons/responses');
const jsonwebtoken = process.env.JWT;
const withAuth = require('../middleware');

const Doctor = require('../models/doctor');

const buildJWT = doctor => {
	return jwt.sign(
		{
			username: doctor.username,
			id: doctor._id,
		},
		jsonwebtoken,
		{
			expiresIn: '5h',
		}
	);
};

router.post('/signup', (req, res) => {
	Doctor.find({ username: req.body.username })
		.exec()
		.then(doctor => {
			if (doctor.length !== 0) {
				response(res, 409, { message: 'Nombre de usuario existente' });
				return;
			}
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					response(
						res,
						500,
						'Hubo un error con el servidor, por favor vuelva a intentarlo más tarde'
					);
					return;
				}
				const doctor = new Doctor({
					username: req.body.username,
					password: hash,
					name: req.body.name,
					lastname: req.body.lastname,
					identification: req.body.identification,
					rol: req.body.rol,
					mail: req.body.mail,
				});
				doctor
					.save()
					.then(() => {
						response(res, 201, {
							mensaje: 'Usuario creado correctamente',
							usuario: doctor.username,
						});
					})
					.catch(err => {
						console.log(err);
						response(res, 400, err.message);
					});
			});
		})
		.catch(err => {
			console.log(err);
			response(
				res,
				500,
				'Hubo un error con el servidor, por favor vuelva a intentarlo más tarde'
			);
		});
});

router.post('/login', (req, res) => {
	Doctor.findOne({ username: req.body.username })
		.exec()
		.then(doctor => {
			if (!doctor || doctor.length === null) {
				response(res, 401, {
					message: 'Autenticacion faillida',
				});
				return;
			}
			bcrypt.compare(
				req.body.password,
				doctor.password,
				(err, result) => {
					if (err) {
						response(res, 401, {
							message: 'Autenticacion faillida',
						});
						return;
					}
					if (result) {
						const token = buildJWT(doctor);
						res.status(200).json({
							token: token,
						});
						/*res.cookie('token', token, { httpOnly: true })
					.sendStatus(200);*/
						return;
					}
					response(res, 401, {
						message: 'Autenticacion faillida',
					});
				}
			);
		})
		.catch(err => {
			console.log(err);
			response(
				res,
				500,
				'Hubo un error con el servidor, por favor vuelva a intentarlo más tarde'
			);
		});
});

// Get specific doctor
router.post('/', withAuth, (req, res) => {
	Doctor.find({ _id: req.idDoctor })
		.exec()
		.then(doctor => {
			if (doctor.length === 0) {
				res.status(404).json({
					mensaje: 'No se encontro ningun doctor con el Id provisto',
				});
				return;
			}

			res.status(200).json(doctor);
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente',
			});
		});
});

router.patch('/', withAuth, (req, res) => {
	const { name, lastname, identification, mail } = req.body;

	Doctor.findOneAndUpdate(
		{ _id: req.idDoctor },
		{
			$set: {
				identification: identification,
				name: name,
				lastname: lastname,
				mail: mail
			},
		}
	)
		.exec()
		.then(result => {
			res.status(201).json({
				mensaje: 'Paciente actualizado correctamente',
			});
		})
		.catch(err => {
			res.status(500).json({
				error: 'No se pudo actualizar el paciente',
				razon: err,
			});
		});
});

// update specific doctor
router.post('/update', (req, res) => {
	bcrypt.hash(req.body.password, 10, (err, hash) => {
		if (err) {
			response(
				res,
				500,
				'Hubo un error con el servidor, por favor vuelva a intentarlo más tarde'
			);
			return;
		}
		Doctor.findOneAndUpdate(
			{ _id: req.body._id },
			{
				$set: {
					password: hash,
					name: req.body.name,
					lastname: req.body.lastname,
					identification: req.body.identification,
					rol: req.body.rol,
				},
			},
			{ new: true }
		)
			.exec()
			.then(doctor => {
				if (doctor === null) {
					res.status(404).json({
						mensaje: 'Doctor no encontrado',
					});
				}
				res.status(200).json({
					mensaje: 'Doctor actualizado correctamente',
				});
			})
			.catch(err => {
				res.status(500).json({
					error:
						'El servidor se encuentra fuera de servicio actualmente',
				});
			});
	});
});

router.get('/checkToken', withAuth, function(req, res) {
	res.sendStatus(200);
});

module.exports = router;
