import { FC } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Data } from './App';

const Chart: FC<{data: Data}> = ({data}) =>{
  return (
    <div>
      <h2>Price per Square Meter</h2>
      <LineChart width={600} height={300} data={data.chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}

export default Chart;
