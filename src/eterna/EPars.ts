import IntLoopPars from 'eterna/IntLoopPars';
import Utility from 'eterna/util/Utility';
import {StyledTextBuilder} from 'flashbang';
import Arrays from 'flashbang/util/Arrays';

export enum RNABASE {
    UNDEFINED = 1,
    GUANINE = 3,
    ADENINE = 1,
    URACIL = 4,
    CYTOSINE = 2,
    PAIR = 5,
    SELECT = 6,
    MAGIC = 7,
    RANDOM = 8,
    AU_PAIR = 9,
    GU_PAIR = 10,
    GC_PAIR = 11,

    ADD_BASE = 12,
    ADD_PAIR = 13,
    DELETE = 14,
    LOCK = 15,
    BINDING_SITE = 16,

    SHIFT = 17,
    // public static readonly const RNABASE_ADD_ANNOTATION:int = 18; //Variable for adding an annotation by lullujune
    CUT = 19,
    MAGIC_GLUE = 20,
    BASE_MARK = 21
}

export default class EPars {
    public static readonly INF: number = 1000000;
    public static readonly NST: number = 0;
    public static readonly MAXLOOP: number = 30;
    public static readonly MAX_NINIO: number = 300;
    public static readonly LXC: number = 107.856;
    public static readonly TERM_AU: number = 50;
    public static readonly NBPAIRS: number = 7;
    public static readonly ML_INTERN37: number = 40;
    public static readonly TURN: number = 3;
    public static readonly DANGLES: number = 1;

    public static readonly ML_BASE37: number = 0;
    public static readonly ML_CLOSING37: number = 340;

    public static readonly DUPLEX_INIT: number = 4.1;

    // (almost) follows the Vienna convention for the BP array
    public static readonly FORCE_PAIRED: number = -1;
    public static readonly FORCE_PAIRED3P: number = -2;
    public static readonly FORCE_PAIRED5P: number = -3;
    public static readonly FORCE_UNPAIRED: number = -4;
    public static readonly FORCE_IGNORE: number = -5;

    public static readonly RNABASE_DYNAMIC_FIRST: number = 100;

    public static readonly DEFAULT_TEMPERATURE: number = 37;

    public static readonly F_ninio37: number[] = [0, 40, 50, 20, 10];
    /* only F[2] used */

    public static readonly RNABASE_LAST20: number[] = [
        RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.GUANINE,
        RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.CYTOSINE,
        RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.CYTOSINE, RNABASE.ADENINE,
        RNABASE.ADENINE, RNABASE.CYTOSINE, RNABASE.ADENINE, RNABASE.ADENINE,
        RNABASE.CYTOSINE, RNABASE.ADENINE, RNABASE.ADENINE, RNABASE.CYTOSINE
    ];

    public static readonly HAIRPIN_37: number[] = [
        EPars.INF, EPars.INF, EPars.INF, 570, 560, 560, 540, 590, 560, 640, 650,
        660, 670, 678, 686, 694, 701, 707, 713, 719, 725,
        730, 735, 740, 744, 749, 753, 757, 761, 765, 769];

    public static readonly BULGE_37: number[] = [
        EPars.INF, 380, 280, 320, 360, 400, 440, 459, 470, 480, 490,
        500, 510, 519, 527, 534, 541, 548, 554, 560, 565,
        571, 576, 580, 585, 589, 594, 598, 602, 605, 609];

    public static readonly INTERNAL_37: number[] = [
        EPars.INF, EPars.INF, 410, 510, 170, 180, 200, 220, 230, 240, 250,
        260, 270, 278, 286, 294, 301, 307, 313, 319, 325,
        330, 335, 340, 345, 349, 353, 357, 361, 365, 369];

    public static mlIntern(i: number): number {
        if (i > 2) {
            return EPars.ML_INTERN37 + EPars.TERM_AU;
        } else {
            return EPars.ML_INTERN37;
        }
    }

    public static getBarcodeHairpin(seq: string): string | null {
        const hairpinMatch: RegExpExecArray | null = (/[AGUC]{7}UUCG([AGUC]{7})AAAAGAAACAACAACAACAAC$/i).exec(seq);
        if (hairpinMatch == null) {
            return null;
        }
        return hairpinMatch[1];
    }

    public static getLongestStackLength(pairs: number[]): number {
        let longlen = 0;

        let stackStart = -1;
        let lastStackOther = -1;

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                if (stackStart < 0) {
                    stackStart = ii;
                }

                const isContinued = lastStackOther < 0 || pairs[ii] === lastStackOther - 1;

                if (isContinued) {
                    lastStackOther = pairs[ii];
                } else {
                    if (stackStart >= 0 && ii - stackStart > longlen) {
                        longlen = ii - stackStart;
                    }

                    lastStackOther = -1;
                    stackStart = -1;
                }
            } else {
                if (stackStart >= 0 && ii - stackStart > longlen) {
                    longlen = ii - stackStart;
                }

                stackStart = -1;
                lastStackOther = -1;
            }
        }

        return longlen;
    }

    public static getLetterColor(letter: string): number {
        if (letter === 'G') {
            return 0xFF3333;
        } else if (letter === 'A') {
            return 0xFFFF33;
        } else if (letter === 'U') {
            return 0x7777FF;
        } else if (letter === 'C') {
            return 0x33FF33;
        }

        return 0;
    }

    public static addLetterStyles(builder: StyledTextBuilder): void {
        builder.addStyle('G', {fill: this.getLetterColor('G')});
        builder.addStyle('A', {fill: this.getLetterColor('A')});
        builder.addStyle('U', {fill: this.getLetterColor('U')});
        builder.addStyle('C', {fill: this.getLetterColor('C')});
    }

    public static getColoredLetter(letter: string): string {
        if (letter === 'G') {
            return '<G>G</G>';
        } else if (letter === 'A') {
            return '<A>A</A>';
        } else if (letter === 'U') {
            return '<U>U</U>';
        } else if (letter === 'C') {
            return '<C>C</C>';
        }

        return '';
    }

    public static nucleotideToString(value: number, allowCut: boolean, allowUnknown: boolean): string {
        if (value === RNABASE.ADENINE) {
            return 'A';
        } else if (value === RNABASE.URACIL) {
            return 'U';
        } else if (value === RNABASE.GUANINE) {
            return 'G';
        } else if (value === RNABASE.CYTOSINE) {
            return 'C';
        } else if (value === RNABASE.CUT) {
            if (allowCut) {
                return '&';
            } else {
                throw new Error(`Bad nucleotide '${value}`);
            }
        } else if (allowUnknown) {
            return '?';
        } else {
            throw new Error(`Bad nucleotide '${value}`);
        }
    }

    public static stringToNucleotide(value: string, allowCut: boolean, allowUnknown: boolean): number {
        if (value === 'A' || value === 'a') {
            return RNABASE.ADENINE;
        } else if (value === 'G' || value === 'g') {
            return RNABASE.GUANINE;
        } else if (value === 'U' || value === 'u') {
            return RNABASE.URACIL;
        } else if (value === 'C' || value === 'c') {
            return RNABASE.CYTOSINE;
        } else if (value === '&' || value === '-' || value === '+') {
            if (allowCut) {
                return RNABASE.CUT;
            } else {
                throw new Error(`Bad nucleotide '${value}`);
            }
        } else if (allowUnknown) {
            return RNABASE.UNDEFINED;
        } else {
            throw new Error(`Bad nucleotide '${value}`);
        }
    }

    public static nucleotidePairToString(value: number): 'AU'|'GU'|'GC' {
        if (value === RNABASE.AU_PAIR) {
            return 'AU';
        } else if (value === RNABASE.GU_PAIR) {
            return 'GU';
        } else if (value === RNABASE.GC_PAIR) {
            return 'GC';
        } else {
            throw new Error(`Bad nucleotide "${value}"`);
        }
    }

    public static stringToSequence(seq: string, allowCut: boolean = true, allowUnknown: boolean = true): number[] {
        const seqArray: number[] = [];
        for (const char of seq) {
            seqArray.push(this.stringToNucleotide(char, allowCut, allowUnknown));
        }
        return seqArray;
    }

    /**
     *  a version of stringtoSequence expanded to allow specification of indices at end of sequence, e.g.,
     *
     *    ACUGU 11-14 16
     *
     *  will return Array of length 16, padded with UNDEFINED in first 10 positions and
     *  then ADENINE, CYTOSINE, URACIL, GUANOSINE, UNDEFINED, URACIL
     *
     * -- If customNumbering is available, then the indices will be remapped if possible. For example,
     *    if the puzzle is a sub-puzzle of a bigger one and has only four nucleotides with
     *    customNumbering of 13-16, we'd instead get an Array of length 4 with just the
     *    inputted sequences that match up with something in the sub-puzzle:
     *     URACIL, GUANOSINE, UNDEFINED, URACIL
     *
     * -- null's in input string are not mapped (e.g., as 'null,null' or ',,,,' ). So e.g.,
     *
     *  ACUGU 11-12,,,16    or
     *  ACUGU 11-12,null,null,16
     *
     *  will skip placement of UG
     *
     * -- null's in puzzle's customNumbering will not receive any mapping either.
     *
     * -- the only exception is if the input null string *exactly* matches the customNumbering,
     *    in which case its assumed that the players wants to copy/paste within the same puzzle.
     *
     *  TODO: properly handle oligos, e.g.
     *       ACUGU&ACAGU 2-11
     *
     * @param strInput string inputted like 'ACUGU 11-12,,,16'
     * @returns array of Nucleotide enums like [RNABASE_ADENINE, ...]
     */
    public static indexedStringToSequence(strInput: string, customNumbering?: (number | null)[]):
    number[] | undefined {
        // make robust to blanks:
        const strChunks: string[] = strInput.trim().split(/\s+/); // spaces
        if (strChunks.length === 0) return []; // blank sequence, no op.
        const seqStr = strChunks[0]; // sequence like ACUGU

        // process rest of string like '11-14 16' to get indices for pasting
        let indices: (number | null)[] | undefined = [];
        if (strChunks.length > 1) {
            indices = Utility.getIndices(strChunks.slice(1).join());
            if (indices === undefined) return undefined; // signal error
        } else if (customNumbering != null && seqStr.length === customNumbering.length) {
            // no indices specified after sequence; can happen when copying from
            //  legacy puzzles or if player has noted down solutions from other software.
            // assume player is copy/pasting sequence for same puzzle.
            indices = customNumbering;
        } else {
            // player may be pasting a legacy solution without any indices.
            // assume the indices are 1,2,...
            indices = Array(seqStr.length).fill(0).map((_, idx) => idx + 1);
        }

        // remap indices to match puzzle's "custom numbering"
        if (customNumbering !== undefined) {
            if (Arrays.shallowEqual(customNumbering, indices)) {
                // assume player is copy/pasting into the same puzzle.
                return this.stringToSequence(seqStr, true /* allowCut */, true /* allowUnknown */);
            }
            indices = indices.filter((n) => n !== null).map((n) => customNumbering.indexOf(n) + 1);
        }

        const seqArray: number[] = Array(
            Math.max(...(indices.filter((n) => n !== null)) as number[])
        ).fill(RNABASE.UNDEFINED);

        for (let n = 0; n < indices.length; n++) {
            const ii = indices[n];
            if (ii !== null && ii >= 0) {
                const char = seqStr.charAt(n);
                seqArray[ii - 1] = this.stringToNucleotide(char, true /* allowCut */, true /* allowUnknown */);
            }
        }
        return seqArray;
    }

    public static sequenceToString(sequence: number[], allowCut: boolean = true, allowUnknown: boolean = true): string {
        const str = sequence.map(
            (value) => EPars.nucleotideToString(value, allowCut, allowUnknown)
        ).join('');
        return str;
    }

    public static isInternal(index: number, pairs: number[]): number[] | null {
        let pairStartHere = -1;
        let pairEndHere = -1;
        let pairStartThere = -1;
        let pairEndThere = -1;

        if (pairs[index] >= 0) {
            return null;
        }

        let walker: number = index;
        while (walker >= 0) {
            if (pairs[walker] >= 0) {
                pairStartHere = walker;
                pairStartThere = pairs[walker];
                break;
            }
            walker--;
        }

        walker = index;
        while (walker < pairs.length) {
            if (pairs[walker] >= 0) {
                pairEndHere = walker;
                pairEndThere = pairs[walker];
                break;
            }
            walker++;
        }

        if (pairStartHere < 0 || pairEndHere < 0) {
            return null;
        }

        const thereStart: number = Math.min(pairStartThere, pairEndThere);
        const thereEnd: number = Math.max(pairStartThere, pairEndThere);

        if (pairStartHere === thereStart) {
            return null;
        }

        for (let ii: number = thereStart + 1; ii < thereEnd; ii++) {
            if (pairs[ii] >= 0) {
                return null;
            }
        }

        const bases: number[] = [];

        for (let ii = pairStartHere; ii <= pairEndHere; ii++) {
            bases.push(ii);
        }

        for (let ii = thereStart; ii <= thereEnd; ii++) {
            bases.push(ii);
        }

        return bases;
    }

    public static validateParenthesis(
        parenthesis: string, letteronly: boolean = true, lengthLimit: number = -1
    ): string | null {
        const pairStack: number[] = [];

        if (lengthLimit >= 0 && parenthesis.length > lengthLimit) {
            return `Structure length limit is ${lengthLimit}`;
        }

        for (let jj = 0; jj < parenthesis.length; jj++) {
            if (parenthesis.charAt(jj) === '(') {
                pairStack.push(jj);
            } else if (parenthesis.charAt(jj) === ')') {
                if (pairStack.length === 0) {
                    return 'Unbalanced parenthesis notation';
                }

                pairStack.pop();
            } else if (parenthesis.charAt(jj) !== '.') {
                return `Unrecognized character ${parenthesis.charAt(jj)}`;
            }
        }

        if (pairStack.length !== 0) {
            return 'Unbalanced parenthesis notation';
        }

        if (letteronly) {
            return null;
        }

        let index: number = parenthesis.indexOf('(.)');
        if (index >= 0) {
            return `There is a length 1 hairpin loop which is impossible at base ${index + 2}`;
        }

        index = parenthesis.indexOf('(..)');

        if (index >= 0) {
            return `There is a length 2 hairpin loop which is impossible at base ${index + 2}`;
        }

        return null;
    }

    public static parenthesisToPairs(parenthesis: string, pseudoknots: boolean = false): number[] {
        const pairs: number[] = new Array(parenthesis.length).fill(-1);
        const pairStack: number[] = [];

        for (let jj = 0; jj < parenthesis.length; jj++) {
            if (parenthesis.charAt(jj) === '(') {
                pairStack.push(jj);
            } else if (parenthesis.charAt(jj) === ')') {
                if (pairStack.length === 0) {
                    throw new Error('Invalid parenthesis notation');
                }

                pairs[pairStack[pairStack.length - 1]] = jj;
                pairStack.pop();
            }
        }

        // If pseudoknots should be counted, manually repeat for
        // the char pairs [], {}
        if (pseudoknots) {
            for (let jj = 0; jj < parenthesis.length; jj++) {
                if (parenthesis.charAt(jj) === '[') {
                    pairStack.push(jj);
                } else if (parenthesis.charAt(jj) === ']') {
                    if (pairStack.length === 0) {
                        throw new Error('Invalid parenthesis notation');
                    }

                    pairs[pairStack[pairStack.length - 1]] = jj;
                    pairStack.pop();
                }
            }

            for (let jj = 0; jj < parenthesis.length; jj++) {
                if (parenthesis.charAt(jj) === '{') {
                    pairStack.push(jj);
                } else if (parenthesis.charAt(jj) === '}') {
                    if (pairStack.length === 0) {
                        throw new Error('Invalid parenthesis notation');
                    }

                    pairs[pairStack[pairStack.length - 1]] = jj;
                    pairStack.pop();
                }
            }
            for (let jj = 0; jj < parenthesis.length; jj++) {
                if (parenthesis.charAt(jj) === '<') {
                    pairStack.push(jj);
                } else if (parenthesis.charAt(jj) === '>') {
                    if (pairStack.length === 0) {
                        throw new Error('Invalid parenthesis notation');
                    }

                    pairs[pairStack[pairStack.length - 1]] = jj;
                    pairStack.pop();
                }
            }
        }

        for (let jj = 0; jj < pairs.length; jj++) {
            if (pairs[jj] >= 0) pairs[pairs[jj]] = jj;
        }

        return pairs;
    }

    public static getSatisfiedPairs(pairs: number[], seq: number[]): number[] {
        const retPairs: number[] = new Array(pairs.length);

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] < 0) {
                retPairs[ii] = -1;
            } else if (pairs[ii] > ii) {
                if (EPars.pairType(seq[ii], seq[pairs[ii]]) !== 0) {
                    retPairs[ii] = pairs[ii];
                    retPairs[pairs[ii]] = ii;
                } else {
                    retPairs[ii] = -1;
                    retPairs[pairs[ii]] = -1;
                }
            }
        }

        return retPairs;
    }

    public static pairsToParenthesis(pairs: number[], seq: number[] | null = null,
        pseudoknots: boolean = false): string {
        if (pseudoknots) {
            // given partner-style array, writes dot-parens notation string. handles pseudoknots!
            // example of partner-style array: '((.))' -> [4,3,-1,1,0]
            const bpList: number[] = new Array(pairs.length).fill(-1);

            for (let ii = 0; ii < pairs.length; ii++) {
                if (pairs[ii] > ii) {
                    bpList[ii] = pairs[ii];
                    bpList[pairs[ii]] = ii;
                }
            }

            const bps: number[][] = [];
            for (let ii = 0; ii < bpList.length; ++ii) {
                if (bpList[ii] !== -1 && bpList[ii] > ii) {
                    bps.push([ii, bpList[ii]]);
                }
            }

            const stems: number[][][] = [];
            // #bps: list of bp lists
            // # i.e. '((.))' is [[0,4],[1,3]]
            // # Returns list of (list of bp lists), now sorted into stems
            // # i.e. [ list of all bps in stem 1, list of all bps in stem 2]
            // if debug: print(bps)
            for (let ii = 0; ii < bps.length; ++ii) {
                let added = false;
                for (let jj = 0; jj < stems.length; ++jj) {
                    // is this bp adjacent to any element of an existing stem?
                    for (let kk = 0; kk < stems[jj].length; ++kk) {
                        if ((bps[ii][0] - 1 === stems[jj][kk][0] && bps[ii][1] + 1 === stems[jj][kk][1])
                                || (bps[ii][0] + 1 === stems[jj][kk][0] && bps[ii][1] - 1 === stems[jj][kk][1])
                                || (bps[ii][0] - 1 === stems[jj][kk][1] && bps[ii][1] + 1 === stems[jj][kk][0])
                                || (bps[ii][0] + 1 === stems[jj][kk][1] && bps[ii][1] - 1 === stems[jj][kk][0])) {
                            // add to this stem
                            stems[jj].push(bps[ii]);
                            added = true;
                            break;
                        }
                    }
                    if (added) break;
                }
                if (!added) {
                    stems.push([bps[ii]]);
                }
            }
            // if debug: print('stems', stems)

            const dbn: string[] = new Array(pairs.length).fill('.');
            const delimsL = [/\(/i, /\{/i, /\[/i, /</i];// ,'a','b','c']
            const delimsR = [/\)/i, /\}/i, /\]/i, />/i];// ,'a','b','c']
            const charsL = ['(', '{', '[', '<'];
            const charsR = [')', '}', ']', '>'];
            if (stems.length === 0) {
                return dbn.join('');
            } else {
                for (let ii = 0; ii < stems.length; ++ii) {
                    const stem = stems[ii];

                    let pkCtr = 0;
                    const substring = dbn.join('').substring(stem[0][0] + 1, stem[0][1]);
                    // check to see how many delimiter types exist in between where stem is going to go
                    // ah -- it's actually how many delimiters are only half-present, I think.
                    while ((substring.search(delimsL[pkCtr]) !== -1 && substring.search(delimsR[pkCtr]) === -1)
                            || (substring.search(delimsL[pkCtr]) === -1 && substring.search(delimsR[pkCtr]) !== -1)) {
                        pkCtr += 1;
                    }
                    for (let jj = 0; jj < stem.length; ++jj) {
                        const i = stem[jj][0];
                        const j = stem[jj][1];

                        dbn[i] = charsL[pkCtr];
                        dbn[j] = charsR[pkCtr];
                    }
                }
                return dbn.join('');
            }
        }

        const biPairs: number[] = new Array(pairs.length).fill(-1);
        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                biPairs[ii] = pairs[ii];
                biPairs[pairs[ii]] = ii;
            }
        }

        let str = '';
        for (let ii = 0; ii < biPairs.length; ii++) {
            if (biPairs[ii] > ii) {
                str += '(';
            } else if (biPairs[ii] >= 0) {
                str += ')';
            } else if (seq != null && seq[ii] === RNABASE.CUT) {
                str += '&';
            } else {
                str += '.';
            }
        }

        return str;
    }

    public static filterForPseudoknots(pairs: number[]): number[] {
        // Round-trip to remove all pseudoknots.
        const filtered: string = EPars.pairsToParenthesis(pairs, null, true)
            .replace(/\{/g, '.')
            .replace(/\}/g, '.')
            .replace(/\[/g, '.')
            .replace(/\]/g, '.')
            .replace(/</g, '.')
            .replace(/>/g, '.');
        return EPars.parenthesisToPairs(filtered, true);
    }

    public static onlyPseudoknots(pairs: number[]): number[] {
        // Round-trip to remove all non-pseudoknots.
        const filtered: string = EPars.pairsToParenthesis(pairs, null, true)
            .replace(/\(/g, '.')
            .replace(/\)/g, '.');

        return EPars.parenthesisToPairs(filtered, true);
    }

    public static parenthesisToForcedArray(parenthesis: string): number[] {
        const forced: number[] = new Array(parenthesis.length).fill(EPars.FORCE_IGNORE);
        const pairStack: number[] = [];

        for (let jj = 0; jj < parenthesis.length; jj++) {
            if (parenthesis.charAt(jj) === '.') {
                continue;
            } else if (parenthesis.charAt(jj) === '|') {
                forced[jj] = EPars.FORCE_PAIRED;
            } else if (parenthesis.charAt(jj) === '<') {
                forced[jj] = EPars.FORCE_PAIRED3P;
            } else if (parenthesis.charAt(jj) === '>') {
                forced[jj] = EPars.FORCE_PAIRED5P;
            } else if (parenthesis.charAt(jj) === 'x') {
                forced[jj] = EPars.FORCE_UNPAIRED;
            } else if (parenthesis.charAt(jj) === '(') {
                pairStack.push(jj);
            } else if (parenthesis.charAt(jj) === ')') {
                if (pairStack.length === 0) {
                    throw new Error('Invalid parenthesis notation');
                }

                forced[pairStack[pairStack.length - 1]] = jj;
                pairStack.pop();
            }
        }

        for (let jj = 0; jj < forced.length; jj++) {
            if (forced[jj] >= 0) forced[forced[jj]] = jj;
        }

        return forced;
    }

    public static forcedArrayToParenthesis(forced: number[]): string {
        let str = '';

        for (let ii = 0; ii < forced.length; ii++) {
            if (forced[ii] > ii) {
                str = str.concat('(');
            } else if (forced[ii] >= 0) {
                str = str.concat(')');
            } else if (forced[ii] === EPars.FORCE_PAIRED) {
                str = str.concat('|');
            } else if (forced[ii] === EPars.FORCE_PAIRED3P) {
                str = str.concat('<');
            } else if (forced[ii] === EPars.FORCE_PAIRED5P) {
                str = str.concat('>');
            } else if (forced[ii] === EPars.FORCE_UNPAIRED) {
                str = str.concat('x');
            } else {
                str = str.concat('.');
            }
        }

        return str;
    }

    public static numPairs(pairs: number[]): number {
        let ret = 0;

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                ret++;
            }
        }
        return ret;
    }

    public static sequenceDiff(seq1: Sequence, seq2: Sequence): number {
        let diff = 0;
        for (let ii = 0; ii < seq1.sequence.length; ii++) {
            if (seq1.sequence[ii] !== seq2.sequence[ii]) {
                diff++;
            }
        }
        return diff;
    }

    public static arePairsSame(aPairs: number[], bPairs: number[], constraints: boolean[] | null = null): boolean {
        if (aPairs.length !== bPairs.length) {
            return false;
        }

        for (let ii = 0; ii < aPairs.length; ii++) {
            if (bPairs[ii] >= 0) {
                if (bPairs[ii] !== aPairs[ii]) {
                    if (constraints == null || constraints[ii]) {
                        return false;
                    }
                }
            }

            if (aPairs[ii] >= 0) {
                if (bPairs[ii] !== aPairs[ii]) {
                    if (constraints == null || constraints[ii]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public static hasCut(seq: number[], from: number, to: number): boolean {
        return seq.slice(from, to + 1).some(
            (c) => c === RNABASE.CUT
        );
    }

    public static pairType(a: number, b: number): number {
        return EPars.PAIR_TYPE_MAT[a * (EPars.NBPAIRS + 1) + b];
    }

    public static getBulge(i: number): number {
        return EPars.BULGE_37[30] + (Number)(EPars.LXC * Math.log((Number)(i) / 30.0));
    }

    public static getInternal(i: number): number {
        return EPars.INTERNAL_37[30] + (Number)(EPars.LXC * Math.log((Number)(i) / 30.0));
    }

    public static hairpinMismatch(type: number, s1: number, s2: number): number {
        return EPars.MISMATCH_H37[type * 25 + s1 * 5 + s2];
    }

    public static internalMismatch(type: number, s1: number, s2: number): number {
        return EPars.MISMATCH_I37[type * 25 + s1 * 5 + s2];
    }

    public static getStackScore(t1: number, t2: number, b1: boolean, b2: boolean): number {
        if (b1 && b2) {
            return EPars.STACK_37[t1 * (EPars.NBPAIRS + 1) + t2];
        } else if ((!b1) && (!b2)) {
            return EPars.STACK_37[t1 * (EPars.NBPAIRS + 1) + t2] + 200;
        } else {
            return EPars.STACK_37[t1 * (EPars.NBPAIRS + 1) + t2] + 100;
        }
    }

    public static getTetraLoopBonus(loop: string): number {
        for (let ii = 0; ii < EPars.TETRA_LOOPS.length; ii++) {
            if (EPars.TETRA_LOOPS[ii] === loop) {
                return EPars.TETRA_ENERGY_37[ii];
            }
        }

        return 0;
    }

    public static getDangle5Score(t1: number, s: number): number {
        const ret: number = EPars.DANGLE5_37[t1 * 5 + s];
        if (ret > 0) {
            return 0;
        } else {
            return ret;
        }
    }

    public static getDangle3Score(t1: number, s: number): number {
        const ret: number = EPars.DANGLE3_37[t1 * 5 + s];
        if (ret > 0) {
            return 0;
        } else {
            return ret;
        }
    }

    public static getInt11(t1: number, t2: number, s1: number, s2: number): number {
        return IntLoopPars.int11_37[s2 + s1 * 5 + t2 * 25 + t1 * (EPars.NBPAIRS + 1) * 25];
    }

    public static getInt21(t1: number, t2: number, s1: number, s2: number, s3: number): number {
        return IntLoopPars.int21_37[s3 + s2 * 5 + s1 * 25 + t2 * 125 + t1 * (EPars.NBPAIRS + 1) * 125];
    }

    public static getInt22(t1: number, t2: number, s1: number, s2: number, s3: number, s4: number): number {
        if (t1 === 0) {
            return 0;
        } else if (t1 === 1) {
            return IntLoopPars.int22_37_1[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else if (t1 === 2) {
            return IntLoopPars.int22_37_2[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else if (t1 === 3) {
            return IntLoopPars.int22_37_3[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else if (t1 === 4) {
            return IntLoopPars.int22_37_4[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else if (t1 === 5) {
            return IntLoopPars.int22_37_5[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else if (t1 === 6) {
            return IntLoopPars.int22_37_6[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        } else {
            return IntLoopPars.int22_37_7[s4 + s3 * 5 + s2 * 25 + s1 * 125 + t2 * 625];
        }
    }

    private static readonly PAIR_TYPE_MAT: number[] = [
        /* _  A  C  G  U  X  K  I */
        1, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 5, 0, 0, 5,
        0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 2, 0, 3, 0, 0, 0,
        0, 6, 0, 4, 0, 0, 0, 6,
        0, 0, 0, 0, 0, 0, 2, 0,
        0, 0, 0, 0, 0, 1, 0, 0,
        0, 6, 0, 0, 5, 0, 0, 0];

    private static readonly MISMATCH_I37: number[] = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,

        /* CG */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 0, 0, -110, 0, /* A@  AA  AC  AG  AU */
        0, 0, 0, 0, 0, /* C@  CA  CC  CG  CU */
        0, -110, 0, 0, 0, /* G@  GA  GC  GG  GU */
        0, 0, 0, 0, -70, /* U@  UA  UC  UG  UU */

        /* GC */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 0, 0, -110, 0, /* A@  AA  AC  AG  AU */
        0, 0, 0, 0, 0, /* C@  CA  CC  CG  CU */
        0, -110, 0, 0, 0, /* G@  GA  GC  GG  GU */
        0, 0, 0, 0, -70, /* U@  UA  UC  UG  UU */

        /* GU */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 70, 70, -40, 70, /* A@  AA  AC  AG  AU */
        0, 70, 70, 70, 70, /* C@  CA  CC  CG  CU */
        0, -40, 70, 70, 70, /* G@  GA  GC  GG  GU */
        0, 70, 70, 70, 0, /* U@  UA  UC  UG  UU */

        /* UG */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 70, 70, -40, 70, /* A@  AA  AC  AG  AU */
        0, 70, 70, 70, 70, /* C@  CA  CC  CG  CU */
        0, -40, 70, 70, 70, /* G@  GA  GC  GG  GU */
        0, 70, 70, 70, 0, /* U@  UA  UC  UG  UU */

        /* AU */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 70, 70, -40, 70, /* A@  AA  AC  AG  AU */
        0, 70, 70, 70, 70, /* C@  CA  CC  CG  CU */
        0, -40, 70, 70, 70, /* G@  GA  GC  GG  GU */
        0, 70, 70, 70, 0, /* U@  UA  UC  UG  UU */

        /* UA */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 70, 70, -40, 70, /* A@  AA  AC  AG  AU */
        0, 70, 70, 70, 70, /* C@  CA  CC  CG  CU */
        0, -40, 70, 70, 70, /* G@  GA  GC  GG  GU */
        0, 70, 70, 70, 0, /* U@  UA  UC  UG  UU */

        /* @@ */
        90, 90, 90, 90, 90,
        90, 90, 90, 90, -20,
        90, 90, 90, 90, 90,
        90, -20, 90, 90, 90,
        90, 90, 90, 90, 20
    ];

    private static readonly MISMATCH_H37: number[] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

        /* CG */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        -90, -150, -150, -140, -180, /* A@  AA  AC  AG  AU */
        -90, -100, -90, -290, -80, /* C@  CA  CC  CG  CU */
        -90, -220, -200, -160, -110, /* G@  GA  GC  GG  GU */
        -90, -170, -140, -180, -200, /* U@  UA  UC  UG  UU */
        /* GC */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        -70, -110, -150, -130, -210, /* A@  AA  AC  AG  AU */
        -70, -110, -70, -240, -50, /* C@  CA  CC  CG  CU */
        -70, -240, -290, -140, -120, /* G@  GA  GC  GG  GU */
        -70, -190, -100, -220, -150, /* U@  UA  UC  UG  UU */
        /* GU */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, 20, -50, -30, -30, /* A@  AA  AC  AG  AU */
        0, -10, -20, -150, -20, /* C@  CA  CC  CG  CU */
        0, -90, -110, -30, 0, /* G@  GA  GC  GG  GU */
        0, -30, -30, -40, -110, /* U@  UA  UC  UG  UU */
        /* UG */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, -50, -30, -60, -50, /* A@  AA  AC  AG  AU */
        0, -20, -10, -170, 0, /* C@  CA  CC  CG  CU */
        0, -80, -120, -30, -70, /* G@  GA  GC  GG  GU */
        0, -60, -10, -60, -80, /* U@  UA  UC  UG  UU */
        /* AU */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, -30, -50, -30, -30, /* A@  AA  AC  AG  AU */
        0, -10, -20, -150, -20, /* C@  CA  CC  CG  CU */
        0, -110, -120, -20, 20, /* G@  GA  GC  GG  GU */
        0, -30, -30, -60, -110, /* U@  UA  UC  UG  UU */
        /* UA */
        0, 0, 0, 0, 0, /* @@  @A  @C  @G  @U */
        0, -50, -30, -60, -50, /* A@  AA  AC  AG  AU */
        0, -20, -10, -120, -0, /* C@  CA  CC  CG  CU */
        0, -140, -120, -70, -20, /* G@  GA  GC  GG  GU */
        0, -30, -10, -50, -80, /* U@  UA  UC  UG  UU */
        /* @@ */
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    private static readonly STACK_37: number[] = [
        /*          CG     GC     GU     UG     AU     UA  */
        EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF,
        EPars.INF, -240, -330, -210, -140, -210, -210, EPars.NST,
        EPars.INF, -330, -340, -250, -150, -220, -240, EPars.NST,
        EPars.INF, -210, -250, 130, -50, -140, -130, EPars.NST,
        EPars.INF, -140, -150, -50, 30, -60, -100, EPars.NST,
        EPars.INF, -210, -220, -140, -60, -110, -90, EPars.NST,
        EPars.INF, -210, -240, -130, -100, -90, -130, EPars.NST,
        EPars.INF, EPars.NST, EPars.NST, EPars.NST, EPars.NST, EPars.NST, EPars.NST, EPars.NST
    ];

    private static readonly DANGLE5_37: number[] = [
        EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF, /* no pair */
        EPars.INF, -50, -30, -20, -10, /* CG  (stacks on C) */
        EPars.INF, -20, -30, -0, -0, /* GC  (stacks on G) */
        EPars.INF, -30, -30, -40, -20, /* GU */
        EPars.INF, -30, -10, -20, -20, /* UG */
        EPars.INF, -30, -30, -40, -20, /* AU */
        EPars.INF, -30, -10, -20, -20, /* UA */
        0, 0, 0, 0, 0 /*  @ */
    ];

    private static readonly DANGLE3_37: number[] = [
        /*   @     A     C     G     U   */
        EPars.INF, EPars.INF, EPars.INF, EPars.INF, EPars.INF, /* no pair */
        EPars.INF, -110, -40, -130, -60, /* CG  (stacks on G) */
        EPars.INF, -170, -80, -170, -120, /* GC */
        EPars.INF, -70, -10, -70, -10, /* GU */
        EPars.INF, -80, -50, -80, -60, /* UG */
        EPars.INF, -70, -10, -70, -10, /* AU */
        EPars.INF, -80, -50, -80, -60, /* UA */
        0, 0, 0, 0, 0 /*  @ */
    ];

    private static readonly TETRA_ENERGY_37: number[] = [
        300, -300, -300, -300, -300, -300, -300, -300, -300, -250, -250, -250,
        -250, -250, -200, -200, -200, -200, -200, -150, -150, -150, -150, -150,
        -150, -150, -150, -150, -150, -150];

    private static readonly TETRA_LOOPS: string[] = [
        'GGGGAC', 'GGUGAC', 'CGAAAG', 'GGAGAC', 'CGCAAG', 'GGAAAC', 'CGGAAG', 'CUUCGG', 'CGUGAG', 'CGAAGG',
        'CUACGG', 'GGCAAC', 'CGCGAG', 'UGAGAG', 'CGAGAG', 'AGAAAU', 'CGUAAG', 'CUAACG', 'UGAAAG', 'GGAAGC',
        'GGGAAC', 'UGAAAA', 'AGCAAU', 'AGUAAU', 'CGGGAG', 'AGUGAU', 'GGCGAC', 'GGGAGC', 'GUGAAC', 'UGGAAA'];
}

export class Sequence {
    constructor(seq: string) {
        this._sequence = seq;
    }

    public getColoredSequence(): string {
        let res = '';
        for (const c of this._sequence) {
            res += EPars.getColoredLetter(c);
        }
        return res;
    }

    public getExpColoredSequence(expData: number[]): string {
        // AMW TODO: how could this be?
        if (expData == null) {
            return this._sequence;
        }

        const offset: number = expData[0];
        const maxmax: number = Math.max(...expData.slice(1));
        const minmin: number = Math.min(...expData.slice(1));

        const avg: number = (maxmax + minmin) / 2.0;

        let res = '';
        for (let ii = 0; ii < this._sequence.length; ii++) {
            if (ii < offset - 1 || ii >= expData.length) {
                res += this._sequence[ii];
            } else if (expData[ii] < avg) {
                res += `<FONT COLOR='#7777FF'>${this._sequence[ii]}</FONT>`;
            } else {
                res += `<FONT COLOR='#FF7777'>${this._sequence[ii]}</FONT>`;
            }
        }

        return res;
    }

    public countConsecutive(letter: number, locks: boolean[] | null = null): number {
        const sequence = EPars.stringToSequence(this._sequence);

        let maxConsecutive = 0;

        let ii = 0;
        let startIndex = -1;
        for (ii = 0; ii < sequence.length; ii++) {
            if (sequence[ii] === letter) {
                if (startIndex < 0) {
                    startIndex = ii;
                }
            } else if (startIndex >= 0) {
                if (maxConsecutive < ii - startIndex) {
                    if (locks == null) {
                        maxConsecutive = ii - startIndex;
                    } else {
                        let allLocked = true;
                        let jj: number;
                        for (jj = startIndex; jj < ii; jj++) {
                            allLocked = allLocked && locks[jj];
                        }
                        if (allLocked === false) {
                            maxConsecutive = ii - startIndex;
                        }
                    }
                }
                startIndex = -1;
            }
        }

        if (startIndex >= 0) {
            if (maxConsecutive < ii - startIndex) {
                maxConsecutive = ii - startIndex;
            }
        }

        return maxConsecutive;
    }

    public getRestrictedConsecutive(
        letter: number, maxAllowed: number, locks: boolean[] | null = null
    ): number[] {
        const sequence = EPars.stringToSequence(this._sequence);

        const restricted: number[] = [];

        let ii = 0;
        let startIndex = -1;

        if (maxAllowed <= 0) {
            return restricted;
        }

        for (ii = 0; ii < sequence.length; ii++) {
            if (sequence[ii] === letter) {
                if (startIndex < 0) {
                    startIndex = ii;
                }
            } else if (startIndex >= 0) {
                if (maxAllowed < ii - startIndex) {
                    if (locks == null) {
                        restricted.push(startIndex);
                        restricted.push(ii - 1);
                    } else {
                        let allLocked = true;
                        let jj: number;
                        for (jj = startIndex; jj < ii; jj++) {
                            allLocked = allLocked && locks[jj];
                        }
                        if (allLocked === false) {
                            restricted.push(startIndex);
                            restricted.push(ii - 1);
                        }
                    }
                }
                startIndex = -1;
            }
        }

        // gotta check if we found a startIndex without an end...
        if (startIndex >= 0) {
            if (maxAllowed < ii - startIndex) {
                restricted.push(startIndex);
                restricted.push(ii - 1);
            }
        }

        return restricted;
    }

    public getSequenceRepetition(n: number): number {
        const dict: Set<string> = new Set<string>();
        let numRepeats = 0;

        for (let ii = 0; ii < this._sequence.length - n; ii++) {
            const substr: string = this._sequence.substr(ii, n);
            if (dict.has(substr)) {
                numRepeats++;
            } else {
                dict.add(substr);
            }
        }

        return numRepeats++;
    }

    public numGUPairs(pairs: number[]): number {
        const sequence = EPars.stringToSequence(this._sequence);
        let ret = 0;

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                if (sequence[ii] === RNABASE.GUANINE && sequence[pairs[ii]] === RNABASE.URACIL) {
                    ret++;
                }
                if (sequence[ii] === RNABASE.URACIL && sequence[pairs[ii]] === RNABASE.GUANINE) {
                    ret++;
                }
            }
        }

        return ret;
    }

    public numGCPairs(pairs: number[]): number {
        const sequence = EPars.stringToSequence(this._sequence);
        let ret = 0;

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                if (sequence[ii] === RNABASE.GUANINE && sequence[pairs[ii]] === RNABASE.CYTOSINE) {
                    ret++;
                }
                if (sequence[ii] === RNABASE.CYTOSINE && sequence[pairs[ii]] === RNABASE.GUANINE) {
                    ret++;
                }
            }
        }

        return ret;
    }

    public numUAPairs(pairs: number[]): number {
        const sequence = EPars.stringToSequence(this._sequence);
        let ret = 0;

        for (let ii = 0; ii < pairs.length; ii++) {
            if (pairs[ii] > ii) {
                if (sequence[ii] === RNABASE.ADENINE && sequence[pairs[ii]] === RNABASE.URACIL) {
                    ret++;
                }
                if (sequence[ii] === RNABASE.URACIL && sequence[pairs[ii]] === RNABASE.ADENINE) {
                    ret++;
                }
            }
        }

        return ret;
    }

    public get sequence(): number[] {
        return EPars.stringToSequence(this._sequence);
    }

    public set sequence(sequence: number[]) {
        this._sequence = EPars.sequenceToString(sequence);
    }

    public get sequenceString(): string {
        return this._sequence;
    }

    private _sequence: string;
}
