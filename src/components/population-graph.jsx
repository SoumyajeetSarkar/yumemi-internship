import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
function PopulationGraph({ data }) {
  const strokes = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'black',
    'grey',
    'pink'
  ]
  //console.log('here',data);
  return (
    <div className="population-graph"> {/*REFFERENCE from ReCharts Docs: https://recharts.org/en-US/api */}
      <h2>Graph</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={600} height={600} className="graph" margin={{left:20, top:25, right:20}}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis
            dataKey="year"
            type="category"
            allowDuplicatedCategory={false}
            padding={10}
            height={80}
            label={{ value: '年度', position: 'insideRight'}} 
          />
          <YAxis dataKey="value" padding={10} label={{ value: '人口数', position: 'top' ,offset:10}}/>
          <Tooltip />
          <Legend />
          {data.map((s) => (
            <Line dataKey="value" data={s.data} name={s.name} key={s.name} stroke={strokes[Math.floor(Math.random()*strokes.length)]}/>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PopulationGraph;
