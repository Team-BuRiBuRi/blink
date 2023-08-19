import { Box, Center } from '@chakra-ui/react';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneY } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { ScaleSVG } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useEffect, useState } from 'react';

type Currencies = 'USD' | 'ARS' | 'BTC';

interface Price {
  mid: number;
  timestamp: string;
}

interface XEResponseBody {
  term: string;
  privacy: string;
  from: Currencies;
  amount: number;
  to: {
    [key in Currencies]: Price[];
  };
}

interface LineChartProps {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: {
    from: Currencies;
    to: Currencies;
    start: string;
    end: string;
  };
  ratio: number;
}

const getTime = (d: Price) => new Date(d.timestamp);

export const LineChart = (props: LineChartProps) => {
  const { width, height, margin, header, ratio } = props;
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<Price[]>([]);
  const [userPrice, setUserPrice] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const url = `https://xecdapi.xe.com/v1/historic_rate/period?from=${header.from}&to=${header.to}&start_timestamp=${header.start}&end_timestamp=${header.end}}`;
      const response = fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.XE_ID}:${process.env.XE_KEY}`
          )}`,
        },
      });
      const json = await (await response).json();
      setData(json.to[header.to]);
      setUserPrice(
        json.to[header.to][json.to[header.to].length - 1].mid * ratio
      );
    };
    setIsFetching(true);
    getData();
    setIsFetching(false);
  }, [header, ratio]);

  const formatTime = timeFormat('%b %d');
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const dateScale = scaleBand({
    range: [0, xMax],
    domain: data.map(getTime),
    padding: 0.2,
  });

  const priceScale = scaleLinear({
    range: [yMax, 0],
    domain: [Math.min(...data.map((d) => d.mid)) * 0.7, userPrice],
    nice: true,
  });

  return (
    <Box width={width} height={height} alignContent={'flex-end'}>
      {!isFetching && data.length !== 0 && (
        <ScaleSVG width={width} height={height}>
          <Group
            top={margin.top}
            left={margin.left + dateScale.bandwidth() / 2}
          >
            <LinearGradient
              id='linear'
              from='#E2674E'
              to='#E2674E'
              toOpacity={0.1}
            />
            <AreaClosed<Price>
              data={data}
              x={(d) => dateScale(new Date(d.timestamp)) ?? 0}
              y={(d) => priceScale(d.mid) ?? 0}
              yScale={priceScale}
              strokeWidth={0}
              // stroke='#E2674E'
              fill='url(#linear)'
              curve={curveMonotoneY}
            />
            <LinePath
              data={data}
              x={(d) => dateScale(new Date(d.timestamp)) ?? 0}
              y={(d) => priceScale(d.mid) ?? 0}
              stroke='#E2674E'
              strokeWidth={2}
              curve={curveMonotoneY}
            />
            <circle
              cx={dateScale(getTime(data[data.length - 1]))}
              cy={priceScale(data[data.length - 1].mid)}
              fill='#E2674E'
              r={5}
            />
            <circle
              cx={dateScale(getTime(data[data.length - 1]))}
              cy={priceScale(data[data.length - 1].mid)}
              fill='#E2674E'
              r={10}
              opacity={0.5}
            />
            <circle
              cx={dateScale(getTime(data[data.length - 1]))}
              cy={priceScale(userPrice)}
              fill='#2b7cff'
              r={5}
            />
            <circle
              cx={dateScale(getTime(data[data.length - 1]))}
              cy={priceScale(userPrice)}
              fill='#2b7cff'
              r={10}
              opacity={0.5}
            />
            <line
              x1={dateScale(getTime(data[data.length - 1]))}
              x2={dateScale(getTime(data[data.length - 1]))}
              y1={yMax}
              y2={priceScale(userPrice)}
              stroke='gray'
              opacity={0.5}
            />
          </Group>
          <AxisBottom
            top={height - margin.bottom}
            left={margin.left}
            scale={dateScale}
            tickFormat={(d) => formatTime(d)}
            stroke='gray'
            tickStroke='gray'
            tickLabelProps={() => ({
              fill: 'gray',
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
          <AxisLeft
            top={margin.top}
            left={margin.left}
            scale={priceScale}
            tickFormat={(d) => format('$,.2d')(d)}
            stroke='gray'
            hideAxisLine
            tickStroke='gray'
            tickLabelProps={() => ({
              fill: 'gray',
              fontSize: 11,
              textAnchor: 'end',
              verticalAnchor: 'middle',
            })}
          />
          {/* Point to Current Price (latest) */}
        </ScaleSVG>
      )}
      <Center width={'full'} justifyContent={'end'}>
        <Box
          bgColor={'#E2674E'}
          w={3}
          h={3}
          borderRadius={10}
          display={'inline-block'}
        />
        <Box as='span' fontSize='sm' ml={2} color={'#E2674E'}>
          {'Presented Price'}
        </Box>
        <Box
          bgColor={'#2b7cff'}
          w={3}
          h={3}
          borderRadius={10}
          display={'inline-block'}
          ml={4}
        />
        <Box as='span' fontSize='sm' ml={2} color={'#2b7cff'}>
          {'User Price'}
        </Box>
      </Center>
    </Box>
  );
};
