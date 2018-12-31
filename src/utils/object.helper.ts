import { IKeyValue } from "../models";

export class ObjectHelper {
  public static objectToKeyValue(obj: any): Array<IKeyValue> {
    if(!obj) {
      return [];
    }
    console.log(Object.keys(obj))
    return Object.keys(obj).map<IKeyValue>(x=> ({
      key: x,
      value: obj[x]
    })).filter(x=>Number(x.key) === NaN);
  }
}