import React, { useMemo, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';


export default function Chart({ date, value, data, columns }) {  
  
  const dates = useMemo(() => {
    var indexOfDate = columns.indexOf(date);
    const arr = []
    data.map(elem => {
      if (indexOfDate != -1)
          arr.push(elem[indexOfDate])
    })
    return arr.map(dateString => new Date(dateString).getTime());
  }, [date])

  const values = useMemo(() => {
    var indexOfValue = columns.indexOf(value);
    const arr = []
    data.map(elem => {
      if (indexOfValue!= -1)
          arr.push(elem[indexOfValue])
    })
    return arr
  }, [value])

  return (
    <React.Fragment>
      <LineChart
        xAxis={[
          {
            data: dates
          },
        ]}
        series={[
          { curve: "natural", data: values },
        ]}
      />
    </React.Fragment>
  );
}