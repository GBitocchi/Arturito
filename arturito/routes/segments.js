const express = require('express');
const router = express.Router();
const withAuth = require('../middleware');

const Segment = require('../models/Segment');

router.get('/', (req, res) => {
	const { page } = req.query;
	const elementsPerPage = 10;
	const response = { anomalies: '', pages: '' };
	Segment.find()
		.skip(page * elementsPerPage)
		.limit(elementsPerPage)
		.exec()
		.then(anomalies => {
			response.anomalies = anomalies;
			return Segment.count().exec();
		})
		.then(amount => {
			response.pages = Math.ceil(amount / elementsPerPage);
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				mensaje: 'El servidor se encuentra fuera de servicio actualmente',
				err: err
			});
		});
});

router.post('/', (req, res) => {
	const segment = req.body;
	const newSegment = new Segment({
		image: segment.image
	});
	newSegment
		.save()
		.then(result => {
			res.status(200).json({
				mensaje: 'Segmento creado correctamente'
			});
		})
		.catch(e => {
			res.status(500).json({
				error: e
			});
		});
});

router.patch('/', (req, res) => {
	const segmentsToChange = req.body;
	try {
		for (let segment of segmentsToChange) {
			Segment.findOneAndUpdate({ _id: segment._id }, { value: segment.value })
				.exec()
				.then(res => {
					console.log(res);
				})
				.catch(e => {
					throw e;
				});
		}
		res.status(200).json({ mensaje: 'Segmentos actualizados correctamente' });
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});

module.exports = router;
