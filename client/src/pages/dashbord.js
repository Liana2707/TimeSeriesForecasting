import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Deposits from '../components/Deposits/Deposits';
import MainFeaturedPost from "../components/MainFeaturedPost";
import Orders from '../components/Orders';
import Chart from '../components/Chart'

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import getByName from "../requests/GetByName";


const Dashbord = () => {
    const mainFeaturedPost = {
        title: 'Панель',
        description:
            "На этой странице вы сможете просмотреть и сохранить результаты алгоритмов. Справа выберите столбцы и создайте форму для интересующего алгоритма. Форму можно заполнить ниже.",
        imageText: 'main image description',
    };

    const buttons = []

    const params = useParams()

    const [mainData, setMainData] = useState({
        values: [],
        columns: [],
        dateColumns: [],
        valueColumns: [],
    })
    useEffect(() => { getByName(params.name, setMainData) }, []);

    const [selectedDateColumn, setSelectedDateColumn] = useState('')
    const [selectedValueColumn, setSelectedValueColumn] = useState('')

    const draw1 = (select) => {
        setTrends([])
        setForms([])
        setIntervals([])
        setSelectedDateColumn(select)
    }

    const draw2 = (select) => {
        setTrends([])
        setForms([])
        setIntervals([])
        setSelectedValueColumn(select)
    }

    const [forms, setForms] = useState([]);

    const [trends, setTrends] = useState([])
    const [intervals, setIntervals] = useState([])
    const [trendChanges, setTrendChanges] = useState([])

    const addTrends = (newTrends, intervals, changes) => {
        setTrends([...newTrends])
        setIntervals([...intervals])
        setTrendChanges([...changes])
    }

    const [containerWidth, setContainerWidth] = useState(0);

    const handleResize = width => {
        setContainerWidth(width);
    };

    return (
        <div>
            <MainFeaturedPost post={mainFeaturedPost} buttons={buttons} />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={8} lg={9} className="chart-container">
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 750,
                            }}
                        >
                            <Chart date={selectedDateColumn}
                                value={selectedValueColumn}
                                data={mainData.values}
                                columns={mainData.columns}
                                trends={trends}
                                intervals={intervals}
                                trendChanges={trendChanges}
                                containerWidth={containerWidth}
                                onResize={handleResize}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 750,
                            }}
                        >
                            <Deposits mainData={mainData}
                                value={selectedValueColumn}
                                date={selectedDateColumn}
                                onDateChange={draw1}
                                onValueChange={draw2}
                                setForms={setForms}
                                forms={forms}
                                fileName={params.name}
                                addTrends={addTrends}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            {forms}
                            <Orders mainData={mainData.values} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default Dashbord;