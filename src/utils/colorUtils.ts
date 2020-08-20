import piecewise from '@freder/piecewise';
import { createColors, RGB, rgbHex } from 'color-map';
import { PriceIntrevalInfo, PricesToColors, RealEstateResponse } from '../interfaces';
import { MapFilters } from './../interfaces';
import MathUtils from './mathUtils';

export default class ColorUtils {
  static hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
  };

  static generateColors = (shadeCount: number) => {
    // const minColor = ColorUtils.hexToRgb('#4dd54d') as RGB;
    // const midColor = ColorUtils.hexToRgb('#e5c006') as RGB;
    // const maxColor = ColorUtils.hexToRgb('#cb0606') as RGB;
    const minColor = ColorUtils.hexToRgb('#fff2b8') as RGB;
    const midColor = ColorUtils.hexToRgb('#f61404') as RGB;
    const maxColor = ColorUtils.hexToRgb('#420039') as RGB;

    const isEven = shadeCount % 2 === 0;
    const halfShadeCount = Math.ceil(shadeCount / 2);
    const firstHalf = createColors(minColor, midColor, halfShadeCount);
    const secondHalf = createColors(midColor, maxColor, halfShadeCount + (isEven ? 1 : 0));
    secondHalf.shift(); // shift removes the first element which is the same as the last element of the first half
    return firstHalf.concat(secondHalf).map((x) => rgbHex(x));
  };

  static setColorProperties = (useAdaptiveColors: boolean, filters: MapFilters, data: RealEstateResponse[], colors: string[]) => {
    if (useAdaptiveColors) {
      return ColorUtils.getColorsAdaptive(colors, data);
    }
    return ColorUtils.getColorsWholeRange(filters, colors, data);
  };

  static getOpacityByPropertyCount = (propertyCount: number | undefined) => {
    return MathUtils.linearToLinear(propertyCount || 0, 0, 15, 0.7, 0.9);
  };

  private static getColorsWholeRange = (filters: MapFilters, colors: string[], data: RealEstateResponse[]) => {
    const shadeCount = colors.length;
    const isHouse = filters.propertyType === 'house';
    const isRent = filters.dealType === 'rent';
    const houseModifier = isHouse ? 2 : 1;
    const minMedianPrice = (isRent ? 100 : 200000) * houseModifier; // getMinMedianPrice(data);
    const maxMedianPrice = (isRent ? 900 : 1300000) * houseModifier; // getMaxMedianPrice(data);

    const totalPriceRangeSize = maxMedianPrice - minMedianPrice;
    let priceIntervalSize = Math.round(totalPriceRangeSize / shadeCount);
    if (!priceIntervalSize) {
      priceIntervalSize = 1;
    }

    const colorsByPriceInterval: PricesToColors = {};
    const suburbIdsByPriceInterval: { [price: number]: string[] } = {};
    for (let i = 0, currentPriceAnchor = minMedianPrice; i < shadeCount; currentPriceAnchor += priceIntervalSize, i++) {
      colorsByPriceInterval[currentPriceAnchor] = { intervalMinPrice: currentPriceAnchor, color: colors[i], suburbCount: 0 };
    }

    const priceAnchorPoints = Object.keys(colorsByPriceInterval).map(Number);

    for (const suburbInfo of data) {
      const priceAnchorPoint = MathUtils.closestMinimal(suburbInfo.medianPrice, priceAnchorPoints);
      if (!suburbIdsByPriceInterval[priceAnchorPoint]) {
        suburbIdsByPriceInterval[priceAnchorPoint] = [suburbInfo.suburbId];
      } else {
        suburbIdsByPriceInterval[priceAnchorPoint].push(suburbInfo.suburbId);
      }
      const priceSubIntrevalInfo = colorsByPriceInterval[priceAnchorPoint];
      priceSubIntrevalInfo.suburbCount++;
      ColorUtils.SetPriceIntervalInfo(suburbInfo, priceSubIntrevalInfo);
    }
    return { colorsByPriceInterval, suburbIdsByPriceInterval };
  };

  private static getColorsAdaptive = (colors: string[], data: RealEstateResponse[]) => {
    const shadeCount = colors.length;
    const getMinMedianPrice = (data: RealEstateResponse[]) => data.reduce((min, p) => (p.medianPrice < min ? p.medianPrice : min), data[0].medianPrice);
    const getMaxMedianPrice = (data: RealEstateResponse[]) => data.reduce((max, p) => (p.medianPrice > max ? p.medianPrice : max), data[0].medianPrice);

    const totalSuburbCount = data.length;

    let totalSubIntervalCount = 0;

    const buildConstantLengthSubIntervals = () => {
      const minMedianPrice = getMinMedianPrice(data);
      const maxMedianPrice = getMaxMedianPrice(data);
      const totalPriceRangeSize = maxMedianPrice - minMedianPrice;
      let priceIntervalSize = Math.round(totalPriceRangeSize / shadeCount);
      if (!priceIntervalSize) {
        priceIntervalSize = 1;
      }

      const suburbsByPriceChunks: { [needle: number]: number } = {};
      for (let currentPriceAnchor = minMedianPrice; currentPriceAnchor < maxMedianPrice; currentPriceAnchor += priceIntervalSize) {
        suburbsByPriceChunks[currentPriceAnchor] = 0;
      }

      const priceAnchorPoints = Object.keys(suburbsByPriceChunks).map(Number);

      for (const suburbInfo of data) {
        const priceAnchorPoint = MathUtils.closestMinimal(suburbInfo.medianPrice, priceAnchorPoints);
        suburbsByPriceChunks[priceAnchorPoint]++;
      }
      const subIntervals: { subIntervalCount: number; subIntervalCountDouble: number; suburbCount: number; intervalMinPrice: number }[] = [];

      const emptyConsecutiveSubIntervalsWithAtLeastOneSuburbMaxCount = 2;
      let isEmptySubIntervalCreated = false;
      let emptyConsecutiveSubIntervalsWithAtLeastOneSuburbIndex = 0;
      for (let shadeIndex = 0; shadeIndex < shadeCount; shadeIndex++) {
        const intervalMinPrice = priceAnchorPoints[shadeIndex];
        const currentSuburbCount = suburbsByPriceChunks[intervalMinPrice];

        const subIntervalCountDouble = (currentSuburbCount * shadeCount) / totalSuburbCount;
        let subIntervalCount = Math.round(subIntervalCountDouble);
        if (!subIntervalCount) {
          if (currentSuburbCount) {
            emptyConsecutiveSubIntervalsWithAtLeastOneSuburbIndex++;
            if (emptyConsecutiveSubIntervalsWithAtLeastOneSuburbIndex === emptyConsecutiveSubIntervalsWithAtLeastOneSuburbMaxCount) {
              // this code allows a big non entirely empty range do be split despite it has low count of suburbs
              isEmptySubIntervalCreated = false;
              emptyConsecutiveSubIntervalsWithAtLeastOneSuburbIndex = 0;
            }
          }
          if (!isEmptySubIntervalCreated) {
            // creating empty subInterval encompassing all consecutive empty fixed-length intervals
            subIntervalCount = 1;
            isEmptySubIntervalCreated = true;
          }
        } else {
          isEmptySubIntervalCreated = false;
        }
        totalSubIntervalCount += subIntervalCount;
        subIntervals.push({
          subIntervalCount: subIntervalCount,
          subIntervalCountDouble: subIntervalCountDouble,
          suburbCount: currentSuburbCount,
          intervalMinPrice: intervalMinPrice,
        });
      }

      return { subIntervals, priceIntervalSize, minMedianPrice, maxMedianPrice };
    };

    const { subIntervals, priceIntervalSize, minMedianPrice } = buildConstantLengthSubIntervals();

    const adjustShadeCount = () => {
      const adjustShadeCountIfExceeding = () => {
        // need to remove some additional intervals which were added due to rounding.
        const orderedBySuburbsCountDesending = subIntervals.concat().sort((a, b) => (a.subIntervalCount < b.subIntervalCount ? 1 : -1));
        let i = 0;
        let anyChangesMade = false;
        while (totalSubIntervalCount > shadeCount) {
          const current = orderedBySuburbsCountDesending[i];
          if (current.subIntervalCount > 1) {
            current.subIntervalCount--;
            totalSubIntervalCount--;
            anyChangesMade = true;
          }
          i++;
          // Loop ended. repeat from start (unlikely situation
          if (i === orderedBySuburbsCountDesending.length) {
            i = 0;
            // if there is not enough subIntervals to subtract from - break the loop
            if (!anyChangesMade) {
              break;
            }
            anyChangesMade = false;
          }
        }
      };

      const adjustShadeCountIfNotEnough = () => {
        // need to add some additional intervals which were not added due to rounding.
        const orderedBySuburbsCountDesending = subIntervals.concat().sort((a, b) => (a.subIntervalCount < b.subIntervalCount ? 1 : -1));
        let i = 0;
        while (totalSubIntervalCount < shadeCount) {
          const current = orderedBySuburbsCountDesending[i];
          current.subIntervalCount++;
          totalSubIntervalCount++;
          i++;
          // Loop ended. repeat from start (unlikely situation
          if (i === orderedBySuburbsCountDesending.length) {
            i = 0;
          }
        }
      };

      if (totalSubIntervalCount > shadeCount) {
        adjustShadeCountIfExceeding();
      } else if (totalSubIntervalCount < shadeCount) {
        adjustShadeCountIfNotEnough();
      }
    };

    adjustShadeCount();

    const buildVariableLengthSubIntervals = () => {
      const colorsByPriceInterval: PricesToColors = {};
      let globalSubIntervalIndex = 0;
      let firstPriceSet = false;
      for (const subIntervalInfo of subIntervals) {
        const subIntervalSize = Math.round(priceIntervalSize / subIntervalInfo.subIntervalCount);
        for (let i = 0; i < subIntervalInfo.subIntervalCount; i++) {
          const subIntervalMinPrice = firstPriceSet ? subIntervalInfo.intervalMinPrice + i * subIntervalSize : minMedianPrice; // the first interval with subIntervals should encompass all the previous intervals without subIntervals
          colorsByPriceInterval[subIntervalMinPrice] = { intervalMinPrice: subIntervalMinPrice, color: colors[globalSubIntervalIndex], suburbCount: 0 };
          globalSubIntervalIndex++;
          firstPriceSet = true;
        }
      }
      return colorsByPriceInterval;
    };

    const colorsByPriceInterval = buildVariableLengthSubIntervals();

    const assignColorsToSuburbs = () => {
      const buildPiecewiseEasingFunction = () => {
        const piecewiseEasingFnObjects = [];
        const keys = Object.keys(colorsByPriceInterval).map(Number);
        let index = 0;
        for (const subIntervalMinPrice of keys) {
          const priceSubIntervalInfo = colorsByPriceInterval[subIntervalMinPrice];
          const nextPriceSubIntervalInfo = colorsByPriceInterval[keys[index + 1]];
          piecewiseEasingFnObjects.push({ tInterval: [priceSubIntervalInfo.intervalMinPrice, nextPriceSubIntervalInfo?.intervalMinPrice || Number.MAX_VALUE], easingFn: () => subIntervalMinPrice });
          index++;
        }
        return piecewise.easing(piecewiseEasingFnObjects);
      };

      const piecewiseEasingFn = buildPiecewiseEasingFunction();

      const suburbIdsByPriceInterval: { [price: number]: string[] } = {};
      for (const suburbInfo of data) {
        const subIntervalMinPrice = piecewiseEasingFn(suburbInfo.medianPrice);
        const priceSubIntrevalInfo = colorsByPriceInterval[subIntervalMinPrice];
        priceSubIntrevalInfo.suburbCount++;
        ColorUtils.SetPriceIntervalInfo(suburbInfo, priceSubIntrevalInfo);
        if (!suburbIdsByPriceInterval[priceSubIntrevalInfo.intervalMinPrice]) {
          suburbIdsByPriceInterval[priceSubIntrevalInfo.intervalMinPrice] = [suburbInfo.suburbId];
        } else {
          suburbIdsByPriceInterval[priceSubIntrevalInfo.intervalMinPrice].push(suburbInfo.suburbId);
        }
      }
      return suburbIdsByPriceInterval;
    };

    const suburbIdsByPriceInterval = assignColorsToSuburbs();

    return { colorsByPriceInterval, suburbIdsByPriceInterval };
  };

  private static SetPriceIntervalInfo(suburbInfo: RealEstateResponse, priceIntrevalInfo: PriceIntrevalInfo) {
    suburbInfo.priceIntrevalInfo = priceIntrevalInfo;
  }
}
