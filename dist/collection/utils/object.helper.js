export class ObjectHelper {
    static objectToKeyValue(obj) {
        if (!obj) {
            return [];
        }
        console.log(Object.keys(obj));
        return Object.keys(obj).map(x => ({
            key: x,
            value: obj[x]
        })).filter(x => Number(x.key) === NaN);
    }
}
