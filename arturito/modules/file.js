const pythonExecution = (path, callback) => {
	let { PythonShell } = require('python-shell');
	var options = {		
		args: [path],
		pythonPath: 'C:/Python27/python.exe' //Aca tiene que ir el path donde esta instalado tu python --VARIABLE DE ENTORNO
	};
	PythonShell.run('./scripts/fileProcessing.py', options, callback);
};

module.exports = pythonExecution;
