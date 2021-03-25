import React from 'react';
import { Route, Switch, HashRouter } from 'react-router-dom';
import Login from './Login.jsx';
import UploadFile from './LoadFile/UploadFile.jsx';
import CreatePatient from './CreatePatient/CreatePatient.jsx';
import ListPatient from './PatientList/ListPatient.jsx';
import ListFile from './FileList/ListFile.jsx';
import ModifyPatient from './ModifyPatient/ModifyPatient.jsx';
import ResultLoaded from './LoadFile/ResultLoaded/ResultLoaded.jsx';
import DoctorProfile from './Doctors/DoctorProfile.jsx';
import Metrics from './Metrics/Metrics.jsx';
import ListGadget from './Gadget/GadgetList.jsx';
import Anomalies from "./Anomalies/Anomalies";

export default () => (
	<HashRouter>
		<Switch>
			<Route exact path='/' component={Login} />{' '}
			<Route exact path='/patient' component={CreatePatient} />{' '}
			<Route exact path='/doctor' component={DoctorProfile} />{' '}
			<Route exact path='/uploadfile/:patient' component={UploadFile} />{' '}
			<Route exact path='/patients' component={ListPatient} />{' '}
			<Route exact path='/files/:patient' component={ListFile} />{' '}
			<Route
				exact
				path='/modifypatient/:patient'
				component={ModifyPatient}
			/>{' '}
			<Route exact path='/resultLoaded' component={ResultLoaded} />{' '}
			<Route exact path='/files/:file/metrics' component={Metrics} />
			<Route exact path='/gadgets' component={ListGadget} />
			<Route exact path='/anomalies' component={Anomalies}/>
		</Switch>{' '}
	</HashRouter>
);
