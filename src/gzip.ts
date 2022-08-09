// https://www.rfc-editor.org/rfc/rfc1952.html#page-5
import Struct from "typed-struct";
import fs from "fs";

const Member = new Struct('Member')
    .UInt8('ID1')
    .UInt8('ID2')
    .UInt8('CM')
    .UInt8('FLG')
    .UInt32LE('MTIME')
    .UInt8('XFL')
    .UInt8('OS')
    .compile();

const Extra = new Struct('Extra')
    .UInt8('SI1')
    .UInt8('SI2')
    .UInt16LE('LEN')
    .Buffer('data')
    .compile()

export async function ExtraField(file: string, SI1: number, SI2: number) {

    const fd = await fs.promises.open(file)

    try {
        let position = 0;
        const headerBuffer = await fd.read({position, length: Member.baseSize});
        position += headerBuffer.bytesRead;
        const member = new Member(headerBuffer.buffer)
        if (member.ID1 !== 31 || member.ID2 !== 139) {
            throw new Error("invalid file signature:" + member.ID1 + "," + member.ID2);
        }
        if (member.CM !== 8) {
            throw new Error("unknown compression method: " + member.CM);
        }

        const FlagsMask = {FTEXT: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16}

        if ((member.FLG & FlagsMask.FEXTRA) !== 0) {
            const lengthBuffer = await fd.read({position, length: 2})
            position += lengthBuffer.bytesRead;
            const length = lengthBuffer.buffer.readUInt16LE();
            const extraBuffer = await fd.read({position, length});
            position += extraBuffer.bytesRead;
            for (let offset = 0; offset < length;) {
                const extra = new Extra(extraBuffer.buffer.subarray(offset))
                if (extra.SI1 == SI1 && extra.SI2 == SI2) {
                    return extra.data.subarray(offset, offset + extra.LEN).toString()
                }
                offset += Extra.baseSize + extra.LEN;
            }
        }
    } finally {
        await fd.close();
    }
}
