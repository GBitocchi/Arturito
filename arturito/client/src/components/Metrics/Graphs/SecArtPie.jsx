import React, {PureComponent} from 'react';
import {PieChart, Pie, Tooltip, Cell} from 'recharts';

const colors = ['#f06292', '#3ba4e5'];

const data02 = [{}, {}];

/*const mapData = arr => {
	return [
		{
			name: 'Artificios',
			value: arr[0],
		},
		{ name: 'Segundos netos', value: arr[1] },
	];
};*/

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
                                   cx, cy, midAngle, innerRadius, outerRadius, percent, index,
                               }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default class GraphFile extends PureComponent {
    static jsfiddleUrl = 'https://jsfiddle.net/alidingling/3Leoa7f4/';

    render() {
        const {data} = this.props;
        return (
            <React.Fragment>
                {data && <PieChart width={300} height={250} onMouseEnter={this.onPieEnter}>
                    <Pie
                        dataKey='value'
                        data={data}
                        cx={150}
                        cy={120}
                        outerRadius={80}
                        innerRadius={40}
                        fill='#8884d8'
                        paddingAngle={3}
                        label
                    >
                        {data02.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip/>
                </PieChart>}
            </React.Fragment>
        );
    }
}