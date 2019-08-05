import UndoBlock from 'eterna/UndoBlock';
import EPars from 'eterna/EPars';
import BitmapManager from 'eterna/resources/BitmapManager';
import ConstraintBox, {ConstraintBoxConfig} from '../ConstraintBox';
import Constraint, {BaseConstraintStatus} from '../Constraint';

interface MaxBaseConstraintStatus extends BaseConstraintStatus {
    currentCount: number;
}

abstract class MaximumBaseConstraint extends Constraint<MaxBaseConstraintStatus> {
    public readonly baseType: number;
    public readonly maxCount: number;

    constructor(baseType: number, maxCount: number) {
        super();
        this.baseType = baseType;
        this.maxCount = maxCount;
    }

    public evaluate(undoBlocks: UndoBlock[]): MaxBaseConstraintStatus {
        // TODO: Multistate?
        const count = undoBlocks[0].sequence.reduce(
            (acc, curr) => acc + (curr === this.baseType ? 1 : 0), 0
        );

        return {
            satisfied: count <= this.maxCount,
            currentCount: count
        };
    }

    public getConstraintBoxConfig(
        status: MaxBaseConstraintStatus,
        undoBlocks: UndoBlock[],
        targetConditions: any[],
        forMissionScreen: boolean
    ): ConstraintBoxConfig {
        let tooltip = ConstraintBox.createTextStyle();

        if (forMissionScreen) {
            tooltip.pushStyle('altTextMain');
        }

        tooltip.append('You must have ')
            .append('at most', 'altText')
            .append(` ${this.maxCount}`)
            .append(` ${EPars.getColoredLetter(EPars.nucleotideToString(this.baseType, false, false))}s.`);

        if (forMissionScreen) {
            tooltip.popStyle();
        }

        return {
            satisfied: status.satisfied,
            tooltip,
            clarificationText: `${this.maxCount} OR FEWER`,
            statText: status.currentCount.toString(),
            showOutline: true,
            fullTexture: forMissionScreen
                ? BitmapManager.getBitmapNamed(`Nova${EPars.nucleotideToString(this.baseType, false, false)}MissionReq`)
                : BitmapManager.getBitmapNamed(`Nova${EPars.nucleotideToString(this.baseType, false, false)}Req`)
        };
    }
}

export class MaximumAConstraint extends MaximumBaseConstraint {
    public static readonly NAME: 'AMAX';

    constructor(count: number) {
        super(EPars.RNABASE_ADENINE, count);
    }
}

export class MaximumUConstraint extends MaximumBaseConstraint {
    public static readonly NAME: 'UMAX';

    constructor(count: number) {
        super(EPars.RNABASE_URACIL, count);
    }
}

export class MaximumGConstraint extends MaximumBaseConstraint {
    public static readonly NAME: 'GMAX';

    constructor(count: number) {
        super(EPars.RNABASE_GUANINE, count);
    }
}

export class MaximumCConstraint extends MaximumBaseConstraint {
    public static readonly NAME: 'CMAX';

    constructor(count: number) {
        super(EPars.RNABASE_CYTOSINE, count);
    }
}
