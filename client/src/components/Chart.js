import React, { useMemo, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';


export default function Chart({ date, value, data, columns, trends }) {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  
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
    setMin(Math.min(...arr))
    setMax(Math.max(...arr))
    return arr
  }, [value])

  const showedTrends = useMemo(() => {
    const TrendCharts = [];
    if (trends && trends.length > 0) {
      trends.forEach(trendArray => {
        const row = Array(values.length).fill(null);

        trendArray.map(point => {
          dates.map((date, index) => {
            if (date == point.x) {
              row[index] = point.y
              setMin(Math.min(...values, point.y))
              setMax(Math.max(...values, point.y))
            }
          })
        })
        
        TrendCharts.push({ curve: "linear", 
                            showMark: false,
                           data: row,
                            color: "red", 
                            connectNulls: true });
      });
    }
    /*
      trends.forEach((value, index) => {
        const row = Array(values.length).fill(undefined);
        const insertIndex = index;
  
        if (insertIndex < values.length-1) {
          row[insertIndex] = parseFloat(value[0]);
          row[insertIndex + 1] = null
          row[insertIndex + 2] = parseFloat(value[1]);
          setMin(Math.min(...values, row[insertIndex], row[insertIndex + 2]))
          setMax(Math.max(...values, row[insertIndex], row[insertIndex + 2]))
        }
        TrendCharts.push({ curve: "linear", data: row, color: "red" });
      });
      */
    console.log('TrendsCh', TrendCharts)
    return TrendCharts
  }, [trends])
  return (
    <React.Fragment>
      <LineChart
        xAxis={[
          {
            data: dates
          },
        ]}
        yAxis={[{ min: min, max: max}]}
        series={[
          { curve: "natural", data: values },
          ...showedTrends
        ]}
      />
    </React.Fragment>
  );
}