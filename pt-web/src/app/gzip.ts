// https://www.rfc-editor.org/rfc/rfc1952.html#page-5
import Struct from 'typed-struct';

const Member = new Struct('Member').UInt8('ID1').UInt8('ID2').UInt8('CM').UInt8('FLG').UInt32LE('MTIME').UInt8('XFL').UInt8('OS').compile();

const Extra = new Struct('Extra').UInt8('SI1').UInt8('SI2').UInt16LE('LEN').Buffer('data').compile();

export async function ExtraField(file: File, SI1: number, SI2: number): Promise<string | undefined> {
  let position = 0;

  async function read(length: number) {
    const blob = file.slice(position, (position += length));
    return Buffer.from(await blob.arrayBuffer());
  }

  const headerBuffer = await read(Member.baseSize);
  const member = new Member(headerBuffer);
  if (member.ID1 !== 31 || member.ID2 !== 139) {
    throw new Error('invalid file signature:' + member.ID1 + ',' + member.ID2);
  }
  if (member.CM !== 8) {
    throw new Error('unknown compression method: ' + member.CM);
  }

  const FlagsMask = { FTEXT: 1, FHCRC: 2, FEXTRA: 4, FNAME: 8, FCOMMENT: 16 };

  if ((member.FLG & FlagsMask.FEXTRA) !== 0) {
    const lengthBuffer = await read(2);
    const length = lengthBuffer.readUInt16LE();
    const extraBuffer = await read(length);
    for (let offset = 0; offset < length; ) {
      const extra = new Extra(extraBuffer.subarray(offset));
      if (extra.SI1 == SI1 && extra.SI2 == SI2) {
        return extra.data.subarray(offset, offset + extra.LEN).toString();
      }
      offset += Extra.baseSize + extra.LEN;
    }
  }

  return;
}
