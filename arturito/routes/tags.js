const express = require('express');
const router = express.Router();
const withAuth = require('../middleware');

const Tag = require('../models/Tag');

router.get('/', (req, res) => {
	let filter;
	if (req.body.keys && req.body.keys.length !== 0) {
		const { keys } = req.body;
		filter = { key: { $in: keys } };
	} else {
		filter = {};
	}
	Tag.find(filter)
		.exec()
		.then(keyChips => {
			res.status(200).json({
				keys: keyChips
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.post('/', (req, res) => {
	const { key, value } = req.body;
	const tags = new Tag({
		key: key,
		value: value
	});

	tags
		.save()
		.then(() => {
			res.status(200).json({
				mensaje: 'Tag creado satisfactoriamente'
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: 'Error con el servidor, por favor vuelva a intentarlo más tarde'
			});
		});
});

module.exports = router;
