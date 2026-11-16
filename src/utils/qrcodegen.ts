/**
 * Lightweight, zero-dependency QR Code Generator in pure TypeScript.
 * Generates standards-compliant QR Code Model 2 SVG path and module matrix.
 * Based on Project Nayuki's public domain QR Code specification.
 */

export namespace Qrcodegen {
  export type Ecc = 'L' | 'M' | 'Q' | 'H';

  export class QrCode {
    public readonly size: number;
    private readonly modules: boolean[][];

    public constructor(
      public readonly version: number,
      public readonly errorCorrectionLevel: Ecc,
      dataCodewords: number[],
      mask: number
    ) {
      if (version < 1 || version > 40) throw new RangeError('Version out of range');
      if (mask < 0 || mask > 7) throw new RangeError('Mask out of range');
      this.size = version * 4 + 17;

      const row: boolean[] = [];
      for (let i = 0; i < this.size; i++) row.push(false);
      this.modules = [];
      for (let i = 0; i < this.size; i++) this.modules.push(row.slice());

      this.drawFunctionPatterns();
      const allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords);

      if (mask === -1) {
        let minPenalty = 1e9;
        let bestMask = 0;
        for (let m = 0; m < 8; m++) {
          this.applyMask(m);
          this.drawFormatBits(m);
          const penalty = this.getPenaltyScore();
          if (penalty < minPenalty) {
            minPenalty = penalty;
            bestMask = m;
          }
          this.applyMask(m); // unmask
        }
        mask = bestMask;
      }
      this.applyMask(mask);
      this.drawFormatBits(mask);
    }

    public getModule(x: number, y: number): boolean {
      return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
    }

    public static encodeText(text: string, ecl: Ecc = 'M'): QrCode {
      const seg = QrSegment.makeBytes(new TextEncoder().encode(text));
      return QrCode.encodeSegments([seg], ecl);
    }

    public static encodeSegments(
      segs: QrSegment[],
      ecl: Ecc,
      minVersion: number = 1,
      maxVersion: number = 40,
      mask: number = -1
    ): QrCode {
      for (let version = minVersion; ; version++) {
        const dataCapacityBits = QrCode.getNumDataCodewords(version, ecl) * 8;
        const dataUsedBits = QrSegment.getTotalBits(segs, version);
        if (dataUsedBits !== -1 && dataUsedBits <= dataCapacityBits) {
          const bb: boolean[] = [];
          for (const seg of segs) {
            appendBits(seg.mode, 4, bb);
            appendBits(seg.numChars, seg.characterCountBits(version), bb);
            for (const b of seg.data) bb.push(b);
          }
          appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
          appendBits(0, (8 - (bb.length % 8)) % 8, bb);
          const padBytes = [0xec, 0x11];
          for (let padIdx = 0; bb.length < dataCapacityBits; padIdx ^= 1) {
            appendBits(padBytes[padIdx], 8, bb);
          }
          const dataCodewords: number[] = [];
          while (dataCodewords.length * 8 < bb.length) {
            let val = 0;
            for (let i = 0; i < 8; i++) val = (val << 1) | (bb[dataCodewords.length * 8 + i] ? 1 : 0);
            dataCodewords.push(val);
          }
          return new QrCode(version, ecl, dataCodewords, mask);
        }
        if (version >= maxVersion) throw new Error('Data too long for QR Code');
      }
    }

    private drawFunctionPatterns(): void {
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 === 0);
        this.setFunctionModule(i, 6, i % 2 === 0);
      }
      this.drawFinderPattern(3, 3);
      this.drawFinderPattern(this.size - 4, 3);
      this.drawFinderPattern(3, this.size - 4);

      const alignPos = this.getAlignmentPatternPositions();
      for (let i = 0; i < alignPos.length; i++) {
        for (let j = 0; j < alignPos.length; j++) {
          if (
            !(i === 0 && j === 0) &&
            !(i === 0 && j === alignPos.length - 1) &&
            !(i === alignPos.length - 1 && j === 0)
          ) {
            this.drawAlignmentPattern(alignPos[i], alignPos[j]);
          }
        }
      }
      this.drawFormatBits(0);
    }

    private drawFormatBits(mask: number): void {
      let data = (QrCode.getFormatBits(this.errorCorrectionLevel) << 3) | mask;
      let rem = data;
      for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      const bits = ((data << 10) | rem) ^ 0x5412;

      for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, ((bits >>> i) & 1) !== 0);
      this.setFunctionModule(8, 7, ((bits >>> 6) & 1) !== 0);
      this.setFunctionModule(8, 8, ((bits >>> 7) & 1) !== 0);
      this.setFunctionModule(7, 8, ((bits >>> 8) & 1) !== 0);
      for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, ((bits >>> i) & 1) !== 0);

      for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, ((bits >>> i) & 1) !== 0);
      for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, ((bits >>> i) & 1) !== 0);
      this.setFunctionModule(8, this.size - 8, true);
    }

    private drawFinderPattern(x: number, y: number): void {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const xx = x + dx;
          const yy = y + dy;
          if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) {
            this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
          }
        }
      }
    }

    private drawAlignmentPattern(x: number, y: number): void {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }

    private setFunctionModule(x: number, y: number, isDark: boolean): void {
      this.modules[y][x] = isDark;
    }

    private addEccAndInterleave(data: number[]): number[] {
      const numBlocks = QrCode.NUM_ERROR_CORRECTION_BLOCKS[QrCode.eccToIndex(this.errorCorrectionLevel)][this.version];
      const blockEccLen = QrCode.ECC_CODEWORDS_PER_BLOCK[QrCode.eccToIndex(this.errorCorrectionLevel)][this.version];
      const rawCodewords = Math.floor(QrCode.getNumRawDataModules(this.version) / 8);
      const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
      const shortBlockLen = Math.floor(rawCodewords / numBlocks);

      const blocks: number[][] = [];
      const rsDiv = QrCode.reedSolomonComputeDivisor(blockEccLen);
      for (let i = 0, k = 0; i < numBlocks; i++) {
        const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0));
        k += dat.length;
        const ecc = QrCode.reedSolomonComputeRemainder(dat, rsDiv);
        blocks.push(dat.concat(ecc));
      }

      const result: number[] = [];
      for (let i = 0; i < blocks[0].length; i++) {
        for (let j = 0; j < blocks.length; j++) {
          if (i < blocks[j].length) result.push(blocks[j][i]);
        }
      }
      return result;
    }

    private drawCodewords(data: number[]): void {
      let i = 0;
      for (let right = this.size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (let vert = 0; vert < this.size; vert++) {
          for (let j = 0; j < 2; j++) {
            const x = right - j;
            const upward = ((right + 1) & 2) === 0;
            const y = upward ? this.size - 1 - vert : vert;
            if (!this.isFunctionPattern(x, y)) {
              let dark = false;
              if (i < data.length * 8) {
                dark = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
                i++;
              }
              this.modules[y][x] = dark;
            }
          }
        }
      }
    }

    private applyMask(mask: number): void {
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (this.isFunctionPattern(x, y)) continue;
          let invert: boolean;
          switch (mask) {
            case 0: invert = (x + y) % 2 === 0; break;
            case 1: invert = y % 2 === 0; break;
            case 2: invert = x % 3 === 0; break;
            case 3: invert = (x + y) % 3 === 0; break;
            case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
            case 5: invert = ((x * y) % 2 + (x * y) % 3) === 0; break;
            case 6: invert = (((x * y) % 2 + (x * y) % 3) % 2) === 0; break;
            case 7: invert = (((x + y) % 2 + (x * y) % 3) % 2) === 0; break;
            default: throw new Error('Unreachable');
          }
          if (invert) this.modules[y][x] = !this.modules[y][x];
        }
      }
    }

    private isFunctionPattern(x: number, y: number): boolean {
      if (x < 9 && y < 9) return true;
      if (x >= this.size - 8 && y < 9) return true;
      if (x < 9 && y >= this.size - 8) return true;
      if (x === 6 || y === 6) return true;
      const alignPos = this.getAlignmentPatternPositions();
      for (const px of alignPos) {
        for (const py of alignPos) {
          if (Math.abs(x - px) <= 2 && Math.abs(y - py) <= 2) {
            if (
              !(px === 6 && py === 6) &&
              !(px === 6 && py === this.size - 7) &&
              !(px === this.size - 7 && py === 6)
            ) {
              return true;
            }
          }
        }
      }
      return false;
    }

    private getAlignmentPatternPositions(): number[] {
      if (this.version === 1) return [];
      const num = Math.floor(this.version / 7) + 2;
      const step =
        this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (num * 2 - 2)) * 2;
      const result = [6];
      for (let pos = this.size - 7; result.length < num; pos -= step) {
        result.splice(1, 0, pos);
      }
      return result;
    }

    private getPenaltyScore(): number {
      let result = 0;
      for (let y = 0; y < this.size; y++) {
        let runColor = false;
        let runVal = 0;
        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x] === runColor) {
            runVal++;
            if (runVal === 5) result += 3;
            else if (runVal > 5) result++;
          } else {
            runColor = this.modules[y][x];
            runVal = 1;
          }
        }
      }
      return result;
    }

    public toSvgPath(border: number = 4): { path: string; viewBoxSize: number } {
      const viewBoxSize = this.size + border * 2;
      let path = '';
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x]) {
            path += `M${x + border},${y + border}h1v1h-1z `;
          }
        }
      }
      return { path, viewBoxSize };
    }

    public static getNumDataCodewords(ver: number, ecl: Ecc): number {
      return (
        Math.floor(QrCode.getNumRawDataModules(ver) / 8) -
        QrCode.ECC_CODEWORDS_PER_BLOCK[QrCode.eccToIndex(ecl)][ver] *
          QrCode.NUM_ERROR_CORRECTION_BLOCKS[QrCode.eccToIndex(ecl)][ver]
      );
    }

    private static getNumRawDataModules(ver: number): number {
      let result = (16 * ver + 128) * ver + 64;
      if (ver >= 2) {
        const numAlign = Math.floor(ver / 7) + 2;
        result -= (25 * numAlign - 10) * numAlign - 55;
        if (ver >= 7) result -= 36;
      }
      return result;
    }

    private static eccToIndex(ecl: Ecc): number {
      return { L: 0, M: 1, Q: 2, H: 3 }[ecl];
    }

    private static getFormatBits(ecl: Ecc): number {
      return { L: 1, M: 0, Q: 3, H: 2 }[ecl];
    }

    private static reedSolomonComputeDivisor(degree: number): number[] {
      const result: number[] = [];
      for (let i = 0; i < degree - 1; i++) result.push(0);
      result.push(1);
      let root = 1;
      for (let i = 0; i < degree; i++) {
        for (let j = 0; j < result.length; j++) {
          result[j] = QrCode.reedSolomonMultiply(result[j], root);
          if (j + 1 < result.length) result[j] ^= result[j + 1];
        }
        root = QrCode.reedSolomonMultiply(root, 0x02);
      }
      return result;
    }

    private static reedSolomonComputeRemainder(data: number[], divisor: number[]): number[] {
      const result = divisor.map(() => 0);
      for (const b of data) {
        const factor = b ^ result.shift()!;
        result.push(0);
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= QrCode.reedSolomonMultiply(divisor[i], factor);
        }
      }
      return result;
    }

    private static reedSolomonMultiply(x: number, y: number): number {
      let z = 0;
      for (let i = 7; i >= 0; i--) {
        z = (z << 1) ^ ((z >>> 7) * 0x11d);
        z ^= ((y >>> i) & 1) * x;
      }
      return z;
    }

    private static readonly ECC_CODEWORDS_PER_BLOCK: number[][] = [
      [0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
      [0, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
      [0, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
    ];

    private static readonly NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
      [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
      [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
      [0, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
      [0, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 72, 74, 79]
    ];
  }

  export class QrSegment {
    public constructor(
      public readonly mode: number,
      public readonly numChars: number,
      public readonly data: boolean[]
    ) {}

    public static makeBytes(data: Uint8Array): QrSegment {
      const bb: boolean[] = [];
      for (const b of data) appendBits(b, 8, bb);
      return new QrSegment(0x4, data.length, bb);
    }

    public characterCountBits(version: number): number {
      return [8, 16, 16][Math.floor((version + 7) / 17)];
    }

    public static getTotalBits(segs: QrSegment[], version: number): number {
      let result = 0;
      for (const seg of segs) {
        const cc = seg.characterCountBits(version);
        if (seg.numChars >= 1 << cc) return -1;
        result += 4 + cc + seg.data.length;
      }
      return result;
    }
  }

  function appendBits(val: number, len: number, bb: boolean[]): void {
    for (let i = len - 1; i >= 0; i--) bb.push(((val >>> i) & 1) !== 0);
  }
}
