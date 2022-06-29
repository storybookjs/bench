import mapValues from 'lodash/mapValues';
import prettyBytes from 'pretty-bytes';

const prettyTime = (duration: number) => (duration / 1000000000.0).toFixed(2);

const mapValuesDeep = (obj: any, formatFn: any): any =>
  typeof obj === 'object' ? mapValues(obj, val => mapValuesDeep(val, formatFn)) : formatFn(obj);

export const formatString = (result: Record<string, any>) => ({
  time: mapValuesDeep(result.time, prettyTime),
  size: mapValuesDeep(result.size, prettyBytes),
});

const toMS = (val: number) => Math.round(val / 1000000);
const toKB = (val: number) => Math.round(val / 1024);

export const formatNumber = (result: Record<string, any>) =>
  mapValues(result, val => ({
    time: mapValuesDeep(val.time, toMS),
    size: mapValuesDeep(val.size, toKB),
  }));
