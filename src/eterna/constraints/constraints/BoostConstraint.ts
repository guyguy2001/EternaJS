import UndoBlock from 'eterna/UndoBlock';
import BitmapManager from 'eterna/resources/BitmapManager';
import Bitmaps from 'eterna/resources/Bitmaps';
import {Value, UnitSignal, ValueView} from 'signals';
import ConstraintBox, {ConstraintBoxConfig} from '../ConstraintBox';
import Constraint, {BaseConstraintStatus} from '../Constraint';

interface BoostConstraintStatus extends BaseConstraintStatus {
    boostCount: number;
}

class BoostConstraint extends Constraint<BoostConstraintStatus> {
    public static readonly NAME = 'BOOST';
    public readonly minBoosts: number;

    constructor(minBoosts: number) {
        super();

        throw new Error('BOOST constraint is unimplemented');
    }

    public evaluate(undoBlocks: UndoBlock[]): BoostConstraintStatus {
        throw new Error('BOOST constraint is unimplemented');
    }

    public getConstraintBoxConfig(
        status: BoostConstraintStatus,
        undoBlocks: UndoBlock[],
        targetConditions: any[],
        forMissionScreen: boolean
    ): ConstraintBoxConfig {
        let tooltip = ConstraintBox.createTextStyle();
        if (forMissionScreen) {
            tooltip.pushStyle('altTextMain');
        }
        tooltip.append(`You must have ${this.minBoosts.toString()} or `);

        if (forMissionScreen) {
            tooltip.append('more', 'altText');
        } else {
            tooltip.append('more');
        }

        tooltip.append('boosted loops.');

        if (forMissionScreen) {
            tooltip.popStyle();
        }

        return {
            tooltip,
            satisfied: status.satisfied,
            clarificationText: `${this.minBoosts} OR MORE`,
            statText: status.boostCount.toString(),
            fullTexture: forMissionScreen
                ? BitmapManager.getBitmap(Bitmaps.NovaBoostMissionReq)
                : BitmapManager.getBitmap(Bitmaps.NovaBoostReq),
            showOutline: true
        };
    }
}
