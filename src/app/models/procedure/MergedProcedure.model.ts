import {RawProcedure} from './RawProcedure';
import {CustomProcedure} from './CustomProcedure';

export interface MergedProcedureModel {
    rawprocedure: RawProcedure;
    customprocedure: CustomProcedure;
}