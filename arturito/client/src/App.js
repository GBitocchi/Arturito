import React from 'react';
import './App.css';
import { createMuiTheme } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Routes from './components/Routes';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#3ba4e5'
		},
		secondary: {
			main: '#2876a6'
		}
	}
});

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<Routes />
		</MuiThemeProvider>
	);
}

export default App;
