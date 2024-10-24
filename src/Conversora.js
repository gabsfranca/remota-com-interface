class Conversora{
    hex2float(hex){
        const intValue = parseInt(hex, 16);
        const buffer = new Uint8Array(4);
        const dataView = new DataView(buffer.buffer);
        dataView.setUint32(0, intValue, false);
        return dataView.getFloat32(0, false);
    }
}

module.exports = Conversora