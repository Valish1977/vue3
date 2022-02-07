const convertComposition = () => {
    const typeСast = (v: any) => {
        if (typeof v === "string") {
          if (!!(parseFloat(v) % 1) && v.toString() === parseFloat(v).toString()) {
            return parseFloat(v);
          }
          if (!(parseFloat(v) % 1) && v.toString() === parseInt(v, 10).toString()) {
            return parseInt(v, 10);
          }
        }
        return v;
      }
    return {
        typeСast
    }
}
export default convertComposition;