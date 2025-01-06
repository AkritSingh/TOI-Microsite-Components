export default function compObjModifier(compObj) {
    compObj.config = { ...compObj.config, ...{ rendering: { serverSide: true } } }
    return compObj
}
