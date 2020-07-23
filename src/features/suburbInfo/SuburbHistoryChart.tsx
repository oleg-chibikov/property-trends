import { ResponsiveLine, Serie } from '@nivo/line';
import PropTypes from 'prop-types';
import React from 'react';
import MoneyUtils from '../../utils/moneyUtils';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface SuburbHistoryChartProps {
  data: Serie[];
}

// https://github.com/plouc/nivo/issues/308
const theme = {
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

const SuburbHistoryChart: React.FunctionComponent<SuburbHistoryChartProps> = ({ data }) => (
  <ResponsiveLine
    data={data}
    theme={theme}
    enableArea={true}
    enableCrosshair={true}
    margin={{ top: 10, right: 50, bottom: 60, left: 50 }}
    curve={'monotoneX'}
    colors={{ scheme: 'yellow_orange_red' }}
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
    xScale={{
      type: 'point',
    }}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
    yFormat={(d) => MoneyUtils.format(d as number)}
    xFormat={(d) => new Date(d).toLocaleString('en-AU', { year: 'numeric', month: 'short' })}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      // legend: 'Month',
      legendOffset: 60,
      legendPosition: 'middle',
      // https://www.w3schools.com/jsref/jsref_tolocalestring.asp
      format: (d) => new Date(d).toLocaleString('en-AU', { year: 'numeric', month: 'short' }),
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      // legend: 'Median price',
      legendOffset: 10,
      legendPosition: 'middle',
      format: (d) => MoneyUtils.format(d as number),
    }}
    // legends={[
    //   {
    //     anchor: 'bottom-left',
    //     direction: 'column',
    //     justify: true,
    //     itemsSpacing: 0,
    //     itemDirection: 'left-to-right',
    //     itemWidth: 80,
    //     itemHeight: 20,
    //     itemOpacity: 1,
    //     symbolSize: 12,
    //     itemTextColor: 'white',
    //     symbolShape: 'circle',
    //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
    //     effects: [
    //       {
    //         on: 'hover',
    //         style: {
    //           itemBackground: 'rgba(0, 0, 0, .03)',
    //           itemOpacity: 1,
    //         },
    //       },
    //     ],
    //   },
    // ]}
  />
);

SuburbHistoryChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default React.memo(SuburbHistoryChart);
