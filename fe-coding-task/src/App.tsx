import React, { useState } from "react";
import { Container } from "@mui/material";
// import { useNavigate } from "react-router-dom";

import SearchForm from "./SearchForm";
import Chart from "./Chart";

interface ChartData {
  name: string;
  value: number;
}

export interface Data {
  loading: boolean;
  error: string;
  chartData: ChartData[];
}

const DEFAULT_DATA_STATE = {
  loading: false,
  error: "",
  chartData: [],
};

const App: React.FC = () => {
  const [data, setData] = useState<Data>(DEFAULT_DATA_STATE);
  
  return (
    <Container>
      <SearchForm setData={setData} />
      <Chart data={data} />
    </Container>
  );
};

export default App;
