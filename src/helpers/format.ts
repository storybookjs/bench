import mapValues from 'lodash/mapValues';
import prettyBytes from 'pretty-bytes';

const prettyTime = (duration: number) => (duration / 1000000000.0).toFixed(2);

const mapValuesDeep = (obj: any, formatFn: any): any =>
  typeof obj === 'object'
    ? mapValues(obj, val => mapValuesDeep(val, formatFn))
    : formatFn(obj);

export const prettyJSON = (value: any, formatFn: any) => {
  return mapValuesDeep(value, formatFn);
  // return JSON.stringify(formatted, null, 2);
};

export const format = (result: Record<string, any>) => ({
  time: prettyJSON(result.time, prettyTime),
  size: prettyJSON(result.size, prettyBytes),
});
