const express = require('express');
const router = express.Router();
const Gadget = require('../models/Gadget');

router.post('/', (req, res) => {
	Gadget.find({ name: req.body.name })
		.exec()
		.then(gadgets => {
			if (gadgets.length !== 0) {
				res.status(409).json({ error: 'Nombre de electroencefalógrafo existente' });
				return;
			}
			const newGadget = new Gadget({
				name: req.body.name,
				year: req.body.year,
				brand: req.body.brand,
				artifacts: 0,
				seconds: 0,
				studies: 0,
			});
			newGadget
				.save()
				.then(() => {
					res.status(201).json({
						mensaje: 'Electroencefalógrafo creado correctamente',
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({
						error:
							'El servidor se encuentra fuera de servicio actualmente',
					});
				});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				err:
					'Error con el servidor, por favor vuelva a intentarlo más tarde',
			});
		});
});

router.get('/', (req, res) => {
	Gadget.find()
		.exec()
		.then(gadgets => {
			res.status(200).json(gadgets);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				err:
					'Error con el servidor, por favor vuelva a intentarlo más tarde',
			});
		});
});

router.get('/:idMachine', (req, res) => {
	Gadget.findById({ _id: req.params.idMachine })
		.exec()
		.then(gadget => {
			if (gadget === null) {
				res.status(404).json({
					mensaje:
						'No se encontro ninguna maquina con el Id provisto',
				});
				return;
			}
			res.status(200).json(gadget);
		})
		.catch(() => {
			res.status(500).json({
				error: 'El servidor se encuentra fuera de servicio actualmente',
			});
		});
});

module.exports = router;
