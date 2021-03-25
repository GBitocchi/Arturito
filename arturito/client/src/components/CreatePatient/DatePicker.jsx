import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function DatePicker(props) {
	// The first commit of Material-UI
	const { birthdate, setDate, text } = props;

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				disableToolbar
				margin="normal"
				id="date-picker-dialog"
				label={text}
				format="dd/MM/yyyy"
				value={birthdate}
				onChange={setDate}
				KeyboardButtonProps={{
					'aria-label': 'change date'
				}}
			/>
		</MuiPickersUtilsProvider>
	);
}
