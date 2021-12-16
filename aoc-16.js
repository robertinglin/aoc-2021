// const data = 'D2FE28';
// const data = 'A0016C880162017C3686B18A3D4780';
const data = require('./data-16');
// const data = '04005AC33890'

const parseBin = (str) => {
    return parseInt(str, 2);
}
const parseBigBin = (str) => {
    return BigInt('0b' + str);
}

const parse = (data) => {
    const bitConvert = {
        0:'0000',
        1:'0001',
        2:'0010',
        3:'0011',
        4:'0100',
        5:'0101',
        6:'0110',
        7:'0111',
        8:'1000',
        9:'1001',
        A:'1010',
        B:'1011',
        C:'1100',
        D:'1101',
        E:'1110',
        F:'1111',
    }
    const parsed = data.split('').map(x => bitConvert[x]).join('');
    return parsed;
}

const getVersion = (str) => {
    let version = parseBin(str.substr(0,3));
    return [version, str.substr(3)];
}

const getType = (str) => {
    let type = parseBin(str.substr(0,3));
    return [type, str.substr(3)];
}

const getValue = (str) => {
    let pointer = 0;
    let valueBits = '';
    while (true){
        let isLastChunk = str[pointer] === '0';
        const chunk = str.substring(pointer + 1, pointer + 5);
        pointer += 5;

        valueBits += chunk;
        if (isLastChunk) {
            break;
        }
    }
    let value = parseBigBin(valueBits);
    return [value, str.substr(pointer)];
}

const getMode = (str) => {
    let mode = parseBin(str.substr(0,1));
    return [mode, str.substr(1)];
}

const getSubPacketLength = (str) => {
    let subPacketLength = parseBin(str.substr(0,15));
    return [subPacketLength, str.substr(15)];
}
const getSubPacketCount = (str) => {
    let getSubPacketCount = parseBin(str.substr(0,11));
    return [getSubPacketCount, str.substr(11)];
}

let packets = [];
const parseBitString = (bitString) => {
    
    let version;
    let type;
    let packet = {};
    packets.push(packet);

    [version, bitString] = getVersion(bitString);
    [type, bitString] = getType(bitString);

    packet.version = version;
    packet.type = type;

    if (type === 4) {
        let value;
        [value, bitString] = getValue(bitString);
        packet.value = value;
    } else {
        [mode, bitString] = getMode(bitString);
        packet.mode = mode;
        if (mode === 0) {
            let subPacketLength;
            [subPacketLength, bitString] = getSubPacketLength(bitString);
            packet.subPacketLength = subPacketLength;

            let subBitString = bitString.substr(0, subPacketLength);
            let i = 0;
            while (true) {
                let subPacket;
                [subPacket, subBitString] = parseBitString(subBitString);
                packet.subPackets = packet.subPackets || [];
                packet.subPackets.push(subPacket);
                if (!subBitString.length || parseBin(subBitString) === 0){
                    break;
                }
            }
            bitString = bitString.substr(subPacketLength);
        } else {
            let subPacketCount;
            [subPacketCount, bitString] = getSubPacketCount(bitString);
            packet.subPacketCount = subPacketCount;

            for (let i = 0; i < subPacketCount; i++) {
                let subPacket;
                [subPacket, bitString] = parseBitString(bitString);
                packet.subPackets = packet.subPackets || [];
                packet.subPackets.push(subPacket);
            }
        }
    }
    return [packet, bitString];
}

const print = (packet) => {
    let subPackets = packet.subPackets || [];
    let p = {...packet};
    delete p.subPackets;
    console.log(p);
    subPackets.forEach(print);
}

const traverse = (node) => {
    switch (node.type) {
        case 0:
            return node.subPackets.map(traverse).reduce((acc, val) => acc + val, BigInt(0));
        case 1:
            return node.subPackets.map(traverse).reduce((acc, val) => acc * val, BigInt(1));
        case 2:
            return node.subPackets.map(traverse).reduce((acc, val) => val < acc ? val : acc, BigInt(Number.MAX_SAFE_INTEGER*2))
        case 3:
            return node.subPackets.map(traverse).reduce((acc, val) => val > acc  ? val : acc, BigInt(0))
        case 4: 
            return node.value;
        case 5:
            return traverse(node.subPackets[0]) > traverse(node.subPackets[1]) ? BigInt(1) : BigInt(0);
        case 6:
            return traverse(node.subPackets[0]) < traverse(node.subPackets[1]) ? BigInt(1) : BigInt(0);
        case 7:
            return traverse(node.subPackets[0]) == traverse(node.subPackets[1]) ? BigInt(1) : BigInt(0);
    }
}

const solve = (data) => {

    let bitString = parse(data);
    let packet;
    [packet, bitString] = parseBitString(bitString);

    // print(packet);
    return traverse(packet);

    // part 1
    return packets.reduce((acc, packet) => {
        return acc + packet.version;
    }, 0);

}

console.log(solve(data));