const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Patient = require('./models/patient');
const cors = require('cors');
const port = process.env.PORT || 8080;
const mongoRoute =
	'mongodb://heroku_mjldhvzp:q0rrd1akklls3140jc12p88np3@ds339348.mlab.com:39348/heroku_mjldhvzp';
const path = require('path');
const socketIo = require('socket.io');
const authentication = require('./commons/authentication');
//const cookieParser = require('cookie-parser');

const app = express();
const doctorsRoutes = require('./routes/doctors');
const patientsRoutes = require('./routes/patients');
const filesRoutes = require('./routes/files');
const gadgetsRoutes = require('./routes/gadgets');
const tagsRoutes = require('./routes/tags');
const segmentsRoutes = require('./routes/segments');

// Serve static folder
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static(path.resolve(__dirname, 'client', 'build')));
	app.get('#/*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
} else {
	const allowedOrigins = ['remoteHost', 'http://localhost:3000'];

	let allowedOriginsCors = function(origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1)
			return callback(
				new Error('CORS origin not allowed ARTURITO API.'),
				false
			);
		return callback(null, true);
	};

	app.options('*', cors({ origin: allowedOriginsCors, credentials: true }));
	app.use(cors({ origin: allowedOriginsCors, credentials: true }));
}
// Cors fix

//Logger
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
//app.use(cookieParser());


app.use(authentication);

// Valid routes
app.use('/doctors', doctorsRoutes);
app.use('/patients', patientsRoutes);
app.use('/files', filesRoutes);
app.use('/gadgets', gadgetsRoutes);
app.use('/tags', tagsRoutes);
app.use('/segments', segmentsRoutes);

// Missing route
app.use((req, res, next) => {
	res.status(404).json({
		error: 'Ruta no encontrada',
	});
});

// Mongo connection
mongoose.connect(mongoRoute, { useNewUrlParser: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
// Once mongo is running -> App starts
db.once('open', () => {
	var server = app.listen(port, () => console.log(`Running on port ${port}`));

	var io = socketIo.listen(server);
	let interval;
	io.on('connection', socket => {
		if (interval) {
			clearInterval(interval);
		}
		let patientId = socket.handshake.query['patientId'];
		console.log('New client connected to socket'),
			setInterval(() => getApiAndEmit(socket, patientId), 5000);
		socket.on('disconnect', () => console.log('Client disconnected'));
	});
	const getApiAndEmit = async (socket, patientId) => {
		try {
			Patient.find({ _id: patientId })
				.exec()
				.then(patient => {
					socket.emit('getMessages', patient);
				});
		} catch (error) {
			console.error(`Error: ${error.code}`);
		}
	};
});
