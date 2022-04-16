import React, { useEffect, useState, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text, Progress } from '@robustswap-libs/uikit'
import Grid from '@material-ui/core/Grid'
import Box from "@material-ui/core/Box";
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios'
import { useTotalSupply } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n';
import useStyles from "../../../assets/styles";
import { usePriceRbsBusd, usePriceRbtBusd } from '../../../state/hooks'

// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

/* Chart code */
// Themes begin

const Chart = styled.div`
    margin: -14.5px -15px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
`

am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);

interface ChartProps {
    volume: [],
    price: []
}

const ChartComp = () => {
    const totalSupply = useTotalSupply()
    const rbtPrice = usePriceRbtBusd()
    const classes = useStyles.chart();
    const TranslateString = useI18n()
    const [priceChangePercent, setPriceChangePercent] = useState(0);
    const [low24, setLow24] = useState(0)
    const [high24, setHigh24] = useState(0)
    const [marketCap, setMarketCap] = useState(0)
    const [activeStatus, setActiveStatus] = useState<number>(1);
    const [chartdata, setChartData] = useState<ChartProps>({
        volume: [],
        price: []
    });
    const isMobile = useMediaQuery('(max-width: 970px)')
    const isPad = useMediaQuery('(max-width: 720px)')
    const [selection, setSelectValue] = React.useState<number>(1);
    const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectValue(event.target.value as number)
        changeStatus(event.target.value as number)
    };
    const { countUp, update } = useCountUp({
        start: 0,
        end: marketCap,
        duration: 1,
        separator: ','
    })

    const updateValue = useRef(update)

    useEffect(() => {
        updateValue.current(marketCap)
    }, [marketCap, updateValue])

    useEffect(() => {
        try {
            axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=robust-token&order=market_cap_desc&per_page=100&page=1&sparkline=false')
                .then(response => {
                    setPriceChangePercent(response.data[0].price_change_percentage_24h)
                    setLow24(response.data[0].low_24h)
                    setHigh24(response.data[0].high_24h)
                    setMarketCap(response.data[0].market_cap)
                })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
        getChartData(activeStatus, (data: any) => {
            setChartData(prevState => ({
                ...prevState,
                'volume': data.total_volumes,
                'price': data.prices
            }));
        });
    }, [activeStatus])

    const changeStatus = async (newStatus: number) => {
        setActiveStatus(newStatus);

        getChartData(newStatus, (data: any) => {
            setChartData(prevState => ({
                ...prevState,
                'price': data.prices,
                'volume': data.total_volumes
            }));
        });
    }

    function getChartData(status: any, cb: any) {
        let duration = '1';

        if (status === 1) {
            duration = '7'
        } else if (status === 2) {
            duration = '30'
        } else {
            duration = 'max'
        }
        const url = `https://api.coingecko.com/api/v3/coins/robust-token/market_chart?vs_currency=usd&days=${duration}`

        try {
            axios.get(url)
                .then(response => {
                    cb(response.data)
                })
        } catch (e) {
            console.log(`Axios request failed: ${e}`)
        }
    }

    function generateChartData(data: any) {
        let count = data['price'].length;
        let chartData = [];
        // current date
        var item = {

        }
        for (var i = 0; i < count; i++) {
            if (data['price'][i]) {
                let newDate = new Date(data['price'][i][0]);
                let volume = 0;
                let price = 0;

                volume = data['volume'][i][1]
                price = data['price'][i][1]

                item = {
                    date: newDate,
                    price: Number(price.toFixed(2)),
                    volume: Number(volume.toFixed(2))
                }
                chartData.push({
                    date: newDate,
                    price: Number(price.toFixed(2)),
                    volume: Number(volume.toFixed(2))
                });
            } else {
                chartData.push(item);
            }
        }
        return chartData;

    }

    useEffect(() => {
        if (chartdata && chartdata['price'].length) {
            let chart = am4core.create("chartdiv", am4charts.XYChart);
            let chart1 = am4core.create("chartdiv1", am4charts.XYChart);

            chart.data = generateChartData(chartdata);
            chart1.data = chart.data;
            let gradient = new am4core.LinearGradient();
            gradient.addColor(am4core.color("rgba(179,71,238,1)"));
            gradient.addColor(am4core.color("rgba(179,71,238,0)"));
            gradient.rotation = 90;

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.baseInterval = {
                "timeUnit": "minute",
                "count": 1
            };
            dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
            dateAxis.renderer.grid.template.disabled = true;
            dateAxis.renderer.labels.template.disabled = true;
            dateAxis.tooltip.disabled = true;

            let dateAxis1 = chart1.xAxes.push(new am4charts.DateAxis());
            dateAxis1.baseInterval = {
                "timeUnit": "minute",
                "count": 1
            };
            dateAxis1.tooltipDateFormat = "HH:mm, d MMMM";
            dateAxis1.renderer.grid.template.disabled = true;
            dateAxis1.renderer.labels.template.disabled = true;
            dateAxis1.tooltip.disabled = true;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.baseGrid.disabled = true;
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.labels.template.disabled = true;
            // valueAxis.title.text = "Unique visitors";

            let valueAxis1 = chart1.yAxes.push(new am4charts.ValueAxis());
            valueAxis1.tooltip.disabled = true;
            valueAxis1.renderer.baseGrid.disabled = true;
            valueAxis1.renderer.grid.template.disabled = true;
            valueAxis1.renderer.labels.template.disabled = true;

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "price";
            series.tooltip.getFillFromObject = false;
            series.tooltip.background.strokeWidth = 0;
            series.tooltip.label.fontSize = 14;
            series.tooltip.background.fill = am4core.color("#0C1630");
            series.tooltip.label.fill = am4core.color("#FFFFFF");
            series.tooltipText = "{date}\nPrice: $ {price}\nVolume: $ {volume}";
            series.fillOpacity = 0.3;
            series.fill = gradient;
            series.stroke = am4core.color("#B347EE")
            series.strokeWidth = 3;

            let series1 = chart1.series.push(new am4charts.ColumnSeries());
            series1.dataFields.dateX = "date";
            series1.dataFields.valueY = "volume";
            series1.stroke = am4core.color("#3924B5")
            series1.strokeWidth = 3;
            series1.marginBottom = 0;

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineY.opacity = 0;
            chart1.cursor = new am4charts.XYCursor();
            chart1.cursor.lineY.opacity = 0;
            // chart.scrollbarX = new am4charts.XYChartScrollbar();
            // chart.scrollbarX.series.push(series);

            dateAxis.start = 0.8;
            dateAxis.keepSelection = false;

            dateAxis1.start = 0.8;
            dateAxis1.keepSelection = false;

        }
    }, [chartdata]);
    return (
        <div>
            <Box className={classes.chartHeader}>
                <Box>
                    <Box style={{ display: 'flex' }}>
                        <Box style={{ display: 'flex', paddingLeft: 24, alignItems: 'center', flexDirection: 'column' }}>
                            <img src="/images/farms/RBT.svg" alt="rbs logo" width={51} height={51} />
                        </Box>
                        <Box style={{ display: 'flex', paddingLeft: 8, flexDirection: 'column', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: '#FCFCFC' }}>RBT</Text>
                            <Box style={{ display: 'flex', flexDirection: 'initial' }}>
                                <Text style={{
                                    fontSize: 34, color: '#FCFCFC', fontWeight: 600
                                }}>{rbtPrice ? '$' : ''}{rbtPrice ? rbtPrice.toFixed(2) : '-'}</Text>
                                <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: priceChangePercent < 0 ? 'red' : '#38D047', marginTop: 15, marginLeft: 4 }}>{priceChangePercent > 0 ? '+' : ''}{priceChangePercent ? priceChangePercent.toFixed(2) : 2.1}%</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {!isMobile && <Box style={{ paddingRight: 20, paddingBottom: 22 }}>
                    <Button
                        onClick={() => changeStatus(1)}
                        className={activeStatus === 1 ? classes.activeStatus : classes.deactiveStatus}
                    >
                        1W
                    </Button>
                    <Button
                        onClick={() => changeStatus(2)}
                        className={activeStatus === 2 ? classes.activeStatus : classes.deactiveStatus}
                    >
                        1M
                    </Button>
                    <Button
                        onClick={() => changeStatus(3)}
                        className={activeStatus === 3 ? classes.activeStatus : classes.deactiveStatus}
                    >
                        All
                    </Button>
                </Box>}
            </Box>
            {isMobile &&
                <Box style={{ paddingTop: 16, margin: '0px 24px' }}>
                    <Select
                        value={selection}
                        onChange={handleChangeSelect}
                        style={{
                            borderRadius: 8,
                            background: "rgba(107, 161, 255, 0.2)",
                            padding: "0px 16px",
                            width: '100%',
                            border: '1px solid rgba(107, 161, 255, 0.2)',
                            height: 40
                        }}
                        IconComponent={
                            () => (<ArrowDropDownIcon style={{ color: "#FFFFFF" }} />)
                        }
                        disableUnderline
                    >
                        <MenuItem className={classes.mobileMenuItem} value={1} style={{ background: '#1E215C' }}>1W</MenuItem>
                        <MenuItem className={classes.mobileMenuItem} value={2}>1M</MenuItem>
                        <MenuItem className={classes.mobileMenuItem} value={3}>ALL</MenuItem>
                    </Select>
                </Box>
            }
            <Chart style={{ height: 458 }}>
                <div id="chartdiv" style={{
                    width: "calc(100%+30px)",
                    height: 300,
                    display: "block",
                }}></div>
                <div id="chartdiv1" style={{
                    width: "100%",
                    height: 158,
                    display: "block"
                }}></div>
            </Chart>
            <Box style={{ borderTop: '1px solid #0C0720' }}>
                <Grid container spacing={0}>
                    <Grid item sm={6} xs={12} style={{ borderRight: isPad ? '' : '1px solid #0C0720', borderBottom: isPad ? '1px solid #0C0720' : '', padding: 16 }}>
                        <Text style={{ color: '#A0B9FB', fontSize: 14, marginBottom: 8 }}>
                            {TranslateString(10040, "24h Low")}/{TranslateString(10041, "24h High")}
                        </Text>
                        <Row>
                            ${low24}
                            <div style={{ width: '55%', height: 8 }}><Progress primaryStep={Math.ceil(100 * low24 / high24)} /></div>
                            ${high24}
                        </Row>
                    </Grid>
                    <Grid item sm={6} xs={12} style={{ padding: 16 }}>
                        <Text style={{ color: '#A0B9FB', fontSize: 14, marginBottom: 8 }}>{TranslateString(10005, "Market Cap")}</Text>
                        <Row>${countUp}</Row>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}
export default ChartComp;
