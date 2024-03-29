import * as d3 from 'd3';
import React, { Dispatch, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import useResizeObserver from '../../hooks/useResizeObserver';
import { ChartData } from '../../interfaces';
import MoneyUtils from '../../utils/moneyUtils';
import './graph.css';
import { selectSuburbInfoChartBrushSelection, selectSuburbInfoExpanded, setSuburbInfoChartBrushSelection } from './suburbInfoSlice';

interface BrushChartProps {
  data: ChartData[];
}

let dispatch: Dispatch<unknown>;
const timeFormat = d3.timeFormat('%b %Y');
let midDate: number;
let brushBehavior: d3.BrushBehavior<unknown> | undefined;
let zoomBehavior: d3.ZoomBehavior<Element, unknown> | undefined;
let showCrosshair: (e: d3.D3BrushEvent<Element>) => void;
let hideCrosshair: (e: d3.D3BrushEvent<Element>) => void;
let updateCrosshairPosition: (e: d3.D3BrushEvent<Element> | d3.D3ZoomEvent<Element, unknown>) => void;
let isCrosshairVisible: boolean;
let previousCoordinates: [number, number];

const BrushChart: React.FunctionComponent<BrushChartProps> = ({ data }) => {
  dispatch = useDispatch<AppDispatch>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = useResizeObserver(wrapperRef as { current: Element });
  const currentSelection = useSelector(selectSuburbInfoChartBrushSelection);
  const isDrawerExpanded = useSelector(selectSuburbInfoExpanded); // no need to refresh graph when the drawer is being hidden (this operation changes dimensions)

  // will be called initially and on every data change
  useEffect(() => {
    if (!data.length || !dimensions || !svgRef.current || !isDrawerExpanded) {
      return;
    }

    const svg = d3.select(svgRef.current);
    clearSvg(svg);
    const { mainGraphWidth, mainGraphHeight, brushHeight, margin, brushPosition } = setDimensions(dimensions, svg);
    const { xScale, xBrushScale, yScale, yBrushScale } = createScales(mainGraphWidth, mainGraphHeight, brushHeight);
    createClipPath(svg, mainGraphWidth, mainGraphHeight);
    const mainGraphGroup = createMainGraph(svg, margin);
    applyGridLines(mainGraphGroup, mainGraphHeight, mainGraphWidth, xScale, yScale);
    const brushGraph = createBrushGraph(svg, brushPosition);
    const prices = setScaleDomains(data, xScale, yScale, xBrushScale, yBrushScale);
    const { xAxis, yAxis, xBrushAxis } = createAxes(xScale, xBrushScale, yScale);

    appendAxesToMainGraph(mainGraphGroup, mainGraphHeight, xAxis, yAxis);
    appendAreaToBrushGraph(xBrushScale, brushHeight, yBrushScale, brushGraph, data);

    const area = appendAreaToMainGraph(xScale, mainGraphHeight, yScale, mainGraphGroup, data);
    const trendLine = appendTrendLineToMainGraph(xScale, yScale, mainGraphGroup, data);
    const overlay = createOverlay(svg, mainGraphWidth, mainGraphHeight, margin);
    const scatter = appendScatterToMainGraph(svg, data, xScale, yScale, margin);

    applyGradient(svg, yScale, 'gradient', prices);
    applyGradient(svg, yBrushScale, 'gradient-brush', prices);

    applyHighlightAndCrosshair(overlay, xScale, yScale, svg, data, margin);
    applyBrushBehaviorToBrushGraph(data, xBrushScale, xScale, yScale, xAxis, yAxis, mainGraphGroup, overlay, area, trendLine, scatter, mainGraphWidth, brushHeight, brushGraph);
    applyZoomBehaviorToMainGraph(data, xBrushScale, xScale, yScale, xAxis, yAxis, mainGraphGroup, overlay, area, trendLine, scatter, brushGraph, mainGraphWidth, mainGraphHeight);

    applyDefaultBrushSelection(data, currentSelection, xBrushScale, xScale, yScale, xAxis, yAxis, mainGraphGroup, overlay, area, trendLine, scatter, mainGraphWidth);
    appendAxesToBrushGraph(brushGraph, brushHeight, xBrushAxis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]); // only dimensions change should trigger the redraw

  return (
    <div ref={wrapperRef} className="chart">
      <svg ref={svgRef} width="100%" />
    </div>
  );
};

function createOverlay(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, mainGraphWidth: number, mainGraphHeight: number, margin: { top: number; right: number; bottom: number; left: number }) {
  const overlay = svg.append('rect').attr('class', 'overlay').style('fill', 'none').style('pointer-events', 'all').attr('width', mainGraphWidth).attr('height', mainGraphHeight);
  applyTranslate(overlay, margin);
  return overlay;
}

function applyTranslate(overlay: d3.Selection<SVGRectElement, unknown, null, undefined> | d3.Selection<SVGGElement, unknown, null, undefined>, margin: { top: number; right: number; bottom: number; left: number }) {
  overlay.attr('transform', `translate(${margin.left},${margin.top})`);
}

function applyHighlightAndCrosshair(
  overlay: d3.Selection<SVGRectElement, unknown, null, undefined>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: ChartData[],
  margin: { top: number; right: number; bottom: number; left: number }
) {
  // This allows to find the closest X index of the mouse:
  const bisect = d3.bisector(function (d: ChartData) {
    return d.date;
  }).left;

  const group = svg.append('g').attr('class', 'crosshairGroup');
  applyTranslate(group, margin);

  // Create the circle that travels along the curve of chart
  const focus = group.append('g').append('circle').attr('class', 'selectedDot');

  // Create the text that travels along the curve of chart
  const focusText = group.append('g').append('text').attr('class', 'selectedDotTooltip');

  // Create crosshairs
  const crosshair = group.append('g').attr('class', 'crosshairContainer');

  // Create horizontal line
  crosshair.append('line').attr('id', 'crosshairX').attr('class', 'crosshair');

  // Create vertical line
  crosshair.append('line').attr('id', 'crosshairY').attr('class', 'crosshair');

  // What happens when the mouse move -> show the annotations at the right positions.
  showCrosshair = () => {
    if (!isCrosshairVisible) {
      isCrosshairVisible = true;
      focus.style('display', null);
      focusText.style('display', null);
      crosshair.style('display', null);
    }
  };

  hideCrosshair = () => {
    if (isCrosshairVisible) {
      focus.style('display', 'none');
      focusText.style('display', 'none');
      crosshair.style('display', 'none');
      isCrosshairVisible = false;
    }
  };

  updateCrosshairPosition = (e: d3.D3BrushEvent<Element> | d3.D3ZoomEvent<Element, unknown>) => {
    // Recover coordinate we need
    const pointer = d3.pointer(e);
    const xDomain = xScale.domain();
    const yDomain = yScale.domain();
    const x = getCurrentXPosition(pointer);
    const i = bisect(data, xScale.invert(x), 1);
    const selectedData = data[i];
    if (!selectedData) {
      return;
    }
    focus
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('cx', xScale(selectedData.date) as number)
      .attr('cy', yScale(selectedData.median) as number);
    focusText.html(`${timeFormat(selectedData.date)}  :${MoneyUtils.format(selectedData.median)}`);

    const isSecondHalf = selectedData.date.getTime() >= midDate;
    const tooltipWidth = (focusText.node() as SVGTextElement).getBBox().width;
    const xShift = isSecondHalf ? -tooltipWidth - 15 : 15;
    const pointX = xScale(selectedData.date) as number;
    const pointY = yScale(selectedData.median) as number;
    focusText
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('x', pointX + xShift)
      .attr('y', pointY);

    crosshair
      .select('#crosshairX')
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('x1', pointX)
      .attr('y1', yScale(yDomain[0]) as number)
      .attr('x2', pointX)
      .attr('y2', yScale(yDomain[1]) as number);
    crosshair
      .select('#crosshairY')
      .transition()
      .duration(100)
      .ease(d3.easeLinear)
      .attr('x1', xScale(xDomain[0]) as number)
      .attr('y1', pointY)
      .attr('x2', xScale(xDomain[1]) as number)
      .attr('y2', pointY);
  };

  overlay.on('mouseenter', showCrosshair).on('mousemove', updateCrosshairPosition).on('mouseleave', hideCrosshair);

  function getCurrentXPosition(mouse: [number, number]) {
    let x = mouse[0];
    if (isNaN(x)) {
      if (previousCoordinates) {
        x = previousCoordinates[0];
      } else {
        const range = xScale.range();
        x = (range[0] + range[1]) / 2;
      }
    } else {
      previousCoordinates = mouse;
    }
    return x;
  }
}

// Gridlines in x axis function
function createXGridLines(xScale: d3.ScaleTime<number, number>) {
  return d3
    .axisBottom(xScale)
    .ticks(7)
    .tickFormat(() => '');
}

// Gridlines in y axis function
function createYGridLines(yScale: d3.ScaleLinear<number, number>) {
  return d3
    .axisLeft(yScale)
    .ticks(7)
    .tickFormat(() => '');
}

function applyGridLines(mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>, height: number, width: number, xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) {
  // Add the X gridlines
  mainGraphGroup
    .append('g')
    .attr('class', 'gridLine')
    .attr('transform', 'translate(0,' + height + ')')
    .call(createXGridLines(xScale).tickSize(-height));

  // Add the Y gridlines
  mainGraphGroup.append('g').attr('class', 'gridLine').call(createYGridLines(yScale).tickSize(-width));
}

function applyDefaultBrushSelection(
  data: ChartData[],
  currentSelection: number[],
  xBrushScale: d3.ScaleTime<number, number>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xAxis: d3.Axis<Date>,
  yAxis: d3.Axis<number>,
  mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  overlay: d3.Selection<SVGRectElement, unknown, null, undefined>,
  area: d3.Area<ChartData>,
  line: d3.Line<ChartData>,
  scatter: d3.Selection<SVGGElement, unknown, null, undefined>,
  mainGraphWidth: number
) {
  const selection = getCurrentOrDefaultSelection(currentSelection);
  const currentDomain = xScale.domain();
  const minValueForDomain = currentDomain[0].getTime();
  if (minValueForDomain > selection[0]) {
    selection[0] = minValueForDomain;
  }

  const maxValueForDomain = currentDomain[1].getTime();
  if (maxValueForDomain < selection[1]) {
    selection[1] = minValueForDomain;
  }

  const brushedSelection = selection.map(xBrushScale);
  applyBrushSelectionToMainGraph(data, brushedSelection as number[], xBrushScale, xScale, yScale, xAxis, yAxis, mainGraphGroup, overlay, area, line, scatter, mainGraphWidth);
}

const inverseSelectionIfNeeded = (selection: number[]): number[] => (selection[0] > selection[1] ? [selection[1], selection[0]] : selection);

function getCurrentOrDefaultSelection(currentSelection: number[]) {
  let selection = currentSelection;
  if (!selection || selection[0] === selection[1]) {
    selection = getDefaultSelection();
  } else {
    selection = inverseSelectionIfNeeded(selection);
  }
  return [selection[0], selection[1]];
}

function applyBrushBehaviorToBrushGraph(
  data: ChartData[],
  xBrushScale: d3.ScaleTime<number, number>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xAxis: d3.Axis<Date>,
  yAxis: d3.Axis<number>,
  mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  overlay: d3.Selection<SVGRectElement, unknown, null, undefined>,
  area: d3.Area<ChartData>,
  line: d3.Line<ChartData>,
  scatter: d3.Selection<SVGGElement, unknown, null, undefined>,
  mainGraphWidth: number,
  brushHeight: number,
  brushGraph: d3.Selection<SVGGElement, unknown, null, undefined>
) {
  const onBrush = (e: d3.D3BrushEvent<Element>) => {
    if (!e.sourceEvent || e.sourceEvent.type === 'zoom') {
      return; // ignore brush-by-zoom
    }
    const selection = (e.selection as number[]) || xBrushScale.range();
    applyBrushSelectionToMainGraph(data, selection, xBrushScale, xScale, yScale, xAxis, yAxis, mainGraphGroup, overlay, area, line, scatter, mainGraphWidth);
    updateCrosshairPosition(e);
  };

  brushBehavior = d3
    .brushX()
    .extent([
      [0, 0],
      [mainGraphWidth, brushHeight],
    ])
    // .on('start', () => {
    //   const event = d3.event.sourceEvent;
    //   if (event?.type === 'zoom') {
    //     return; // ignore brush-by-zoom
    //   }
    //   hideCrosshair();
    // })
    .on('brush', onBrush);
  // .on('end', () => {
  //   const event = d3.event.sourceEvent;
  //   if (event?.type === 'zoom') {
  //     return; // ignore brush-by-zoom
  //   }
  //   showCrosshair();
  //   updateCrosshairPosition();
  // });
  brushGraph
    .append('g')
    .attr('class', 'brush')
    .call(brushBehavior)
    .call(brushBehavior.move, xScale.range() as d3.BrushSelection);
}

function applyZoomBehaviorToMainGraph(
  data: ChartData[],
  xBrushScale: d3.ScaleTime<number, number>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xAxis: d3.Axis<Date>,
  yAxis: d3.Axis<number>,
  mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  overlay: d3.Selection<SVGRectElement, unknown, null, undefined>,
  area: d3.Area<ChartData>,
  line: d3.Line<ChartData>,
  scatter: d3.Selection<SVGGElement, unknown, null, undefined>,
  brushGraph: d3.Selection<SVGGElement, unknown, null, undefined>,
  mainGraphWidth: number,
  mainGraphHeight: number
) {
  const onZoom = (e: d3.D3ZoomEvent<Element, unknown>) => {
    if (!e.sourceEvent || e.sourceEvent.type === 'brush') {
      return; // ignore zoom-by-brush
    }
    const transform = e.transform as d3.ZoomTransform;
    const newDomain = transform.rescaleX(xBrushScale).domain();

    const { range, domainValues } = applyNewDomain(data, newDomain, xScale, yScale, xAxis, yAxis, mainGraphGroup, area, line, scatter);
    if (brushBehavior) {
      // @ts-expect-error call has 2 args
      brushGraph.select('.brush').call(brushBehavior.move as (x: unknown) => void, range.map(transform.invertX, transform));
    }
    dispatch(setSuburbInfoChartBrushSelection(domainValues.map((x) => x.getTime())));
    updateCrosshairPosition(e);
  };
  zoomBehavior = d3
    .zoom()
    //.scaleExtent([1, Infinity])
    .scaleExtent([1, 100])
    .translateExtent([
      [0, 0],
      [mainGraphWidth, mainGraphHeight],
    ])
    .extent([
      [0, 0],
      [mainGraphWidth, mainGraphHeight],
    ])
    // .on('start', () => {
    //   const event = d3.event.sourceEvent;
    //   if (event?.type === 'brush') {
    //     return; // ignore zoom-by-brush
    //   }
    //   hideCrosshair();
    // })
    .on('zoom', onZoom);
  // .on('end', () => {
  //   const event = d3.event.sourceEvent;
  //   if (event?.type === 'brush') {
  //     return; // ignore zoom-by-brush
  //   }
  //   showCrosshair();
  //   updateCrosshairPosition();
  // });

  overlay.call(zoomBehavior as (x: unknown) => void);
}

function applyBrushSelectionToMainGraph(
  data: ChartData[],
  selection: number[],
  xBrushScale: d3.ScaleTime<number, number>,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xAxis: d3.Axis<Date>,
  yAxis: d3.Axis<number>,
  mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  overlay: d3.Selection<SVGRectElement, unknown, null, undefined>,
  area: d3.Area<ChartData>,
  line: d3.Line<ChartData>,
  scatter: d3.Selection<SVGGElement, unknown, null, undefined>,
  mainGraphWidth: number
) {
  const newDomain = selection.map(xBrushScale.invert, xBrushScale) as Date[];
  applyNewDomain(data, newDomain, xScale, yScale, xAxis, yAxis, mainGraphGroup, area, line, scatter);
  // This line retains the brush selection on the brush graph
  if (zoomBehavior) {
    // @ts-expect-error call has 2 args
    overlay.call(zoomBehavior.transform as (x: unknown) => void, d3.zoomIdentity.scale(mainGraphWidth / (selection[1] - selection[0])).translate(-selection[0], 0));
  }

  dispatch(setSuburbInfoChartBrushSelection(newDomain.map((x) => x.getTime())));
}

function applyNewDomain(
  data: ChartData[],
  newDomain: Date[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xAxis: d3.Axis<Date>,
  yAxis: d3.Axis<number>,
  mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  area: d3.Area<ChartData>,
  line: d3.Line<ChartData>,
  scatter: d3.Selection<SVGGElement, unknown, null, undefined>
) {
  midDate = getMidDate(newDomain);
  xScale.domain(newDomain);
  mainGraphGroup
    .select('.area')
    //  .transition(transition as any)
    .attr('d', area as d3.ValueFn<d3.BaseType, unknown, string | number | boolean | null>);
  mainGraphGroup
    .select('.line')
    //  .transition(transition as any)
    .attr('d', line as d3.ValueFn<d3.BaseType, unknown, string | number | boolean | null>);
  const xAxisSelection = mainGraphGroup
    .select('.axis--x')
    //  .transition(transition as any)
    .call(xAxis as (x: unknown) => void);

  rotateAxisTicks(xAxisSelection);

  scatter
    .selectAll('circle')
    //   .transition(transition as any)
    .attr('cx', ((d: ChartData) => xScale(d.date) as number) as d3.ValueFn<d3.BaseType, unknown, string | number | boolean | null>)
    .attr('cy', ((d: ChartData) => yScale(d.median) as number) as d3.ValueFn<d3.BaseType, unknown, string | number | boolean | null>);

  const range = xScale.range();
  const domainValues = range.map(xScale.invert);
  const dataSelection = data.filter((x) => x.date >= domainValues[0] && x.date <= domainValues[1]);
  setYDomain(dataSelection, yScale);

  const yAxisSelection = mainGraphGroup
    .select('.axis--y')
    //  .transition(transition as any)
    .call(yAxis as (x: unknown) => void);

  rotateAxisTicks(yAxisSelection);

  return { range, domainValues };
}

function rotateAxisTicks<T extends d3.BaseType>(axisSelection: d3.Selection<T, unknown, null, undefined>) {
  axisSelection.selectAll('text').attr('y', 0).attr('x', 9).attr('dy', '.35em');
}

function appendTrendLineToMainGraph(xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>, mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>, data: ChartData[]) {
  const line = createMainLine(xScale, yScale);
  const siftedData = data.filter((value) => value.count >= 5).filter((value, index, array) => index === 0 || index === array.length - 1 || index % 5 === 0);
  mainGraphGroup.append('path').datum(siftedData).attr('class', 'line').attr('d', line);
  return line;
}

function appendAreaToMainGraph(xScale: d3.ScaleTime<number, number>, mainGraphHeight: number, yScale: d3.ScaleLinear<number, number>, mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>, data: ChartData[]) {
  const area = createMainArea(xScale, mainGraphHeight, yScale);
  mainGraphGroup.append('path').datum(data).attr('class', 'area').attr('d', area);
  return area;
}

function appendAreaToBrushGraph(xBrushScale: d3.ScaleTime<number, number>, brushHeight: number, yBrushScale: d3.ScaleLinear<number, number>, brushGraph: d3.Selection<SVGGElement, unknown, null, undefined>, data: ChartData[]) {
  const areaBrush = createBrushArea(xBrushScale, brushHeight, yBrushScale);
  brushGraph.append('path').datum(data).attr('class', 'areaBrush').attr('d', areaBrush);
}

function appendScatterToMainGraph(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: ChartData[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  margin: { top: number; right: number; bottom: number; left: number }
) {
  const tooltip = d3.select('.tooltip');
  const scatter = svg.append('g').attr('class', 'scatter');
  applyTranslate(scatter, margin);

  scatter
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(d.date) as number)
    .attr('cy', (d) => yScale(d.median) as number)
    .style('opacity', (x) => (x.count < 3 ? 0.2 : x.count < 5 ? 0.5 : x.count < 10 ? 0.7 : 1));

  scatter
    .selectAll('.dotSurrounding')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dotSurrounding')
    .attr('cx', (d) => xScale(d.date) as number)
    .attr('cy', (d) => yScale(d.median) as number)
    .style('fill', (x) => (x.count < 3 ? '#f3f0e7' : x.count < 5 ? '#eedfb4' : x.count < 10 ? '#eed590' : '#ffc21a'))
    .style('opacity', (x) => (x.count < 3 ? 0.1 : x.count < 5 ? 0.3 : x.count < 10 ? 0.5 : 0.7))
    .on('mouseover', (e, d) => showTooltip(e, d, tooltip))
    .on('click', (e, d) => showTooltip(e, d, tooltip))
    .on('mousemove', (e, d) => repositionTooltip(e, d, tooltip))
    .on('mouseleave', () => hideTooltip(tooltip));
  return scatter;
}

function repositionTooltip(e: { pageX: number; pageY: number }, d: ChartData, tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>) {
  const isSecondHalf = d.date.getTime() >= midDate;
  const tooltipWidth = parseInt(tooltip.style('width'));
  const xShift = isSecondHalf ? -tooltipWidth : 0;
  tooltip.style('left', e.pageX + xShift + 'px').style('top', e.pageY + 'px');
}

function showTooltip(e: { pageX: number; pageY: number }, d: ChartData, tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>) {
  tooltip.style('opacity', 1);
  const tooltipHtml = `${timeFormat(d.date)}
  <br />
  ${MoneyUtils.format(d.median)}${d.count === 1 ? '' : ` (${MoneyUtils.format(d.min)} - ${MoneyUtils.format(d.max)})`}
  <br />
  ${d.count} ${d.count === 1 ? 'property' : 'properties'}`;
  tooltip.html(tooltipHtml);
  repositionTooltip(e, d, tooltip);
}

function hideTooltip(tooltip: d3.Selection<d3.BaseType, unknown, HTMLElement, unknown>) {
  tooltip.style('opacity', 0);
}

function setScaleDomains(data: ChartData[], xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>, xBrushScale: d3.ScaleTime<number, number>, yBrushScale: d3.ScaleLinear<number, number>) {
  const dateRange = d3.extent<ChartData, Date>(data, (d) => d.date);
  if (!dateRange[0] || !dateRange[1]) {
    throw new Error('Date range is undefined');
  }

  const prices = setYDomain(data, yScale);
  xScale.domain(dateRange);
  xBrushScale.domain(xScale.domain());
  yBrushScale.domain(yScale.domain());
  midDate = getMidDate(dateRange);
  return prices;
}

function setYDomain(data: ChartData[], yScale: d3.ScaleLinear<number, number>) {
  if (!data.length) {
    return { minPrice: 0, maxPrice: 0 };
  }
  const maxPrice = d3.max(data, (d) => d.median) ?? 0;
  const minPrice = d3.min(data, (d) => d.median) ?? 0;
  const topDataMargin = (maxPrice - minPrice) / 10;
  yScale.domain([minPrice - topDataMargin, maxPrice + topDataMargin]);
  return { minPrice, maxPrice };
}

function clearSvg(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  svg.selectAll('*').remove();
}

function appendAxesToMainGraph(mainGraphGroup: d3.Selection<SVGGElement, unknown, null, undefined>, mainGraphHeight: number, xAxis: d3.Axis<Date>, yAxis: d3.Axis<number>) {
  const xAxisSelection = mainGraphGroup
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + mainGraphHeight + ')')
    .call(xAxis);

  rotateAxisTicks(xAxisSelection);

  const yAxisSelection = mainGraphGroup.append('g').attr('class', 'axis axis--y').call(yAxis);

  rotateAxisTicks(yAxisSelection);
}

function appendAxesToBrushGraph(brushGraph: d3.Selection<SVGGElement, unknown, null, undefined>, brushHeight: number, xBrushAxis: d3.Axis<Date>) {
  const xBrushAxisSelection = brushGraph
    .append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + brushHeight + ')')
    .call(xBrushAxis);

  rotateAxisTicks(xBrushAxisSelection);
}

function setDimensions(dimensions: { width: number; height: number }, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  const containerWidth = dimensions.width;
  const containerHeight = dimensions.height;
  svg.attr('height', containerHeight);
  svg.attr('viewBox', '0 0 ' + containerWidth + ' ' + containerHeight).attr('perserveAspectRatio', 'none');

  const brushHeight = 30;
  const brushBottomMargin = 20;
  const marginBetweenGraphs = 70;
  const height = containerHeight - marginBetweenGraphs - brushHeight - brushBottomMargin;
  const brushTop = height + marginBetweenGraphs;

  const margin = { top: 5, right: 0, bottom: brushHeight + marginBetweenGraphs, left: 0 },
    brushPosition = { top: brushTop, left: margin.left },
    mainGraphWidth = +containerWidth - margin.left - margin.right,
    mainGraphHeight = +containerHeight - margin.top - margin.bottom;
  return { mainGraphWidth, mainGraphHeight, brushHeight, margin, brushPosition };
}

function createScales(mainGraphWidth: number, mainGraphHeight: number, brushHeight: number) {
  const xScale = d3.scaleTime().range([0, mainGraphWidth]),
    xBrushScale = d3.scaleTime().range([0, mainGraphWidth]),
    yScale = d3.scaleLinear().range([mainGraphHeight, 0]),
    yBrushScale = d3.scaleLinear().range([brushHeight, 0]);
  return { xScale, xBrushScale, yScale, yBrushScale };
}

function createAxes(xScale: d3.ScaleTime<number, number>, xBrushScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) {
  const xAxis = d3.axisBottom<Date>(xScale).ticks(7),
    xBrushAxis = d3.axisBottom<Date>(xBrushScale).ticks(7),
    yAxis = d3.axisLeft<number>(yScale).ticks(4).tickFormat(MoneyUtils.format);
  return { xAxis, yAxis, xBrushAxis };
}

function createMainLine(xScale: d3.ScaleTime<number, number>, yScale: d3.ScaleLinear<number, number>) {
  return d3
    .line<ChartData>()
    .curve(d3.curveBasis)
    .x((d) => xScale(d.date) as number)
    .y((d) => yScale(d.median) as number);
}

function createMainArea(xScale: d3.ScaleTime<number, number>, mainGraphHeight: number, yScale: d3.ScaleLinear<number, number>) {
  return d3
    .area<ChartData>()
    .curve(d3.curveMonotoneX)
    .x((d) => xScale(d.date) as number)
    .y0(mainGraphHeight)
    .y1((d) => yScale(d.median) as number);
}

function createBrushArea(xBrushScale: d3.ScaleTime<number, number>, brushHeight: number, yBrushScale: d3.ScaleLinear<number, number>) {
  return d3
    .area<ChartData>()
    .curve(d3.curveMonotoneX)
    .x((d) => xBrushScale(d.date) as number)
    .y0(brushHeight)
    .y1((d) => yBrushScale(d.median) as number);
}

function createBrushGraph(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, brushPosition: { top: number; left: number }) {
  return svg
    .append('g')
    .attr('class', 'brushGraph')
    .attr('transform', 'translate(' + brushPosition.left + ',' + brushPosition.top + ')');
}

function createClipPath(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, mainGraphWidth: number, mainGraphHeight: number) {
  svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', mainGraphWidth).attr('height', mainGraphHeight);
}

function createMainGraph(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, margin: { top: number; right: number; bottom: number; left: number }) {
  const mainGraphGroup = svg.append('g').attr('class', 'mainGraphGroup');
  applyTranslate(mainGraphGroup, margin);
  return mainGraphGroup;
}

function getMidDate(dateRange: Date[]) {
  const range = dateRange;
  const startTime = range[0].getTime();
  const endTime = range[1].getTime();
  return endTime - (endTime - startTime) / 2;
}

function applyGradient(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, yScale: d3.ScaleLinear<number, number>, id: string, prices: { minPrice: number; maxPrice: number }) {
  svg
    .append('linearGradient')
    .attr('id', id)
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', yScale(prices.minPrice) as number)
    .attr('x2', 0)
    .attr('y2', yScale(prices.maxPrice) as number)
    .selectAll('stop')
    .data([
      { offset: '0%', color: '#e0f0ea' },
      { offset: '50%', color: '#20cb95' },
      { offset: '100%', color: '#0f291f' },
    ])
    .enter()
    .append('stop')
    .attr('offset', function (d) {
      return d.offset;
    })
    .attr('stop-color', function (d) {
      return d.color;
    });
}

function getDefaultSelection() {
  const currentDate = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);
  return [oneYearFromNow.getTime(), currentDate.getTime()];
}

export default BrushChart;
