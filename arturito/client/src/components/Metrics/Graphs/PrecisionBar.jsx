import React from 'react';
import { withStyles } from '@material-ui/styles';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const style = theme => ({});

const parseData = (metrics) => {
	const parsedMetrics = [];
	Object.keys(metrics).forEach(value => {
		const percent = parseFloat(value) / 10;
		const amount = metrics[value].length;
		parsedMetrics.push({name: percent, Cantidad: amount})
	})
	return parsedMetrics;
}

const PrecisionBar = props => {
	const data = props.file.hasOwnProperty('metrics') && parseData(props.file.metrics)
	return (
		<BarChart
			width={450}
			height={250}
			data={data}
			margin={{
				top: 5,
				right: 30,
				left: 20,
				bottom: 5,
			}}
		>
			<XAxis dataKey='name' />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey='Cantidad' fill='#3ba4e5' />
		</BarChart>
	);
};

export default withStyles(style)(PrecisionBar);
