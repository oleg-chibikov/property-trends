import { useMediaQuery } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import React from 'react';
import { HistoryEntry } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface SuburbHistoryChartProps {
  history: HistoryEntry[];
}

interface Entry {
  x: string;
  y: number | null;
  z: number;
}

const convertHistoryToChartData = (history: HistoryEntry[]) => {
  let min: number = Number.MAX_VALUE;
  const groups: {
    [group: number]: { id: string; data: Entry[] };
  } = { 1: { id: 'Up to 5 props', data: [] }, 2: { id: '5-10 props', data: [] }, 3: { id: 'More than 10 props', data: [] } };

  let currentGroup: number | undefined;

  const lineData = history.map((el) => ({ x: el.date.split('T')[0], y: el.medianPrice, z: el.count }));

  for (const entry of lineData) {
    if (entry.y < min) {
      min = entry.y;
    }
    let groupToPut: number;
    if (entry.z < 5) {
      groupToPut = 1;
    } else if (entry.z >= 5 && entry.z < 10) {
      groupToPut = 2;
    } else {
      groupToPut = 3;
    }
    groups[groupToPut].data.push(entry);
    if (currentGroup && currentGroup !== groupToPut) {
      groups[currentGroup].data.push(entry);
      // this entry is added to create a gap if data added to the same group later
      const nextDay = new Date(entry.x);
      nextDay.setDate(nextDay.getDate() + 1);
      groups[currentGroup].data.push({ x: nextDay.toISOString().split('T')[0], y: null, z: entry.z });
    }
    currentGroup = groupToPut;
  }

  const data = Object.values(groups);
  return { data, min };
};

// https://github.com/plouc/nivo/issues/308
const chartTheme = {
  background: '#222222',
  // tooltip: {
  //   container: {
  //     background: '#303030',
  //     color: 'white',
  //     fontSize: 'inherit',
  //     borderRadius: '2px',
  //     boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
  //     padding: '5px 9px',
  //   },
  //   basic: {
  //     display: 'flex',
  //     alignItems: 'center',
  //   },
  //   table: {},
  //   tableCell: {
  //     padding: '3px 5px',
  //   },
  // },
  crosshair: {
    line: {
      stroke: 'white',
      strokeWidth: 1,
      strokeOpacity: 0.75,
      strokeDasharray: '6 6',
    },
  },
  axis: {
    fontSize: '14px',
    tickColor: 'white',
    ticks: {
      line: {
        stroke: 'white',
      },
      text: {
        fill: 'white',
      },
    },
    legend: {
      text: {
        fill: 'white',
      },
    },
  },
  legends: {
    text: {
      fill: 'white',
    },
  },
  grid: {
    line: {
      stroke: '#4d4d4d30',
    },
  },
};

const SuburbHistoryChart: React.FunctionComponent<SuburbHistoryChartProps> = ({ history }) => {
  const { data, min } = convertHistoryToChartData(history);

  const enoughHeight = useMediaQuery('(min-height: 35rem)');

  return (
    <ResponsiveLine
      colors={['#a8a8a82b', '#8fccac69', '#61ffad']}
      theme={chartTheme}
      enableArea={true}
      enableCrosshair={true}
      margin={{ top: 10, right: 50, bottom: 60, left: 50 }}
      curve={'monotoneX'}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={-12}
      tooltip={(input) => {
        const propertiesCount = (input.point.data as any).z;
        return (
          <div className="chartTooltip">
            <div>{input.point.data.xFormatted}</div>
            <div>{input.point.data.yFormatted}</div>
            <div>
              {propertiesCount} {propertiesCount === 1 ? 'property' : 'properties'}
            </div>
          </div>
        );
      }}
      useMesh={true}
      yFormat={(d) => MoneyUtils.format(d as number)}
      // xFormat={(d) => new Date(d).toLocaleString('en-AU', { year: 'numeric', month: 'short' })}
      // axisBottom={{
      //   // https://www.w3schools.com/jsref/jsref_tolocalestring.asp
      //   format: (d) => new Date(d).toLocaleString('en-AU', { year: 'numeric', month: 'short' }),
      // }}
      legends={[
        {
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          itemsSpacing: 3,
          itemDirection: 'left-to-right',
          itemWidth: 120,
          itemHeight: 20,
          itemOpacity: 0.5,
          symbolSize: 12,
          itemTextColor: 'white',
          symbolShape: 'circle',
          translateX: -10,
          translateY: 10,
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      data={data}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        min: min,
        max: 'auto',
        type: 'linear',
        stacked: false,
      }}
      axisLeft={{
        format: (d) => MoneyUtils.format(d as number),
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        tickValues: enoughHeight ? 8 : 3,
        legend: enoughHeight ? 'median price' : undefined,
        legendOffset: 12,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        format: '%b %Y',
        tickValues: 'every 1 months',
        legend: enoughHeight ? 'month' : undefined,
        legendOffset: -12,
      }}
    />
  );
};

SuburbHistoryChart.propTypes = {
  history: PropTypes.array.isRequired,
};

export default React.memo(SuburbHistoryChart);
