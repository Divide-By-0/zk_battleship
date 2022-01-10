import ph from '../node_modules/circomlib/src/pedersenHash.js'
import bj from '../node_modules/circomlib/src/babyjub.js'
import snarkjs from 'snarkjs'

const pedersenHash = (x) => {
	const buff = snarkjs.bigInt.leInt2Buff(x, 32);
	const hashed = ph.hash(buff);
	const hashInt = snarkjs.bigInt.leBuff2int(hashed);
	const point = bj.unpackPoint(hashed);
	return point2hash(point);
}

const point2hash = (point) => {
	const xbuff = snarkjs.bigInt.leInt2Buff(point[0], 32);
	const ybuff = snarkjs.bigInt.leInt2Buff(point[1], 32);
	const result = Buffer.alloc(32);
	for (let i = 0; i < 31; i++) {
		result[i] = ybuff[i];
	}
	result[31] = xbuff[31];
	return snarkjs.bigInt.leBuff2int(result);
}

export {pedersenHash}

console.log(pedersenHash(BigInt(10)));