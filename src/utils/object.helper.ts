import { IKeyValue } from "../models";

export const ObjectHelper = {
  objectToKeyValue(obj: any): IKeyValue[] {
    if (!obj) {
      return [];
    }

    return Object.keys(obj)
      .map<IKeyValue>((x) => ({
        key: x,
        value: obj[x],
      }))
      .filter((x) => isNaN(Number(x.key)));
  },
};
