import {emptypatient, Patient} from './Patient';
import {emptypatientvisit, PatientVisit} from './PatientVisit';

export interface MergedPatient_QueueModel {
    patientdata: Patient;
    visitdata: PatientVisit;
}

export const emptymergedQueueModel: MergedPatient_QueueModel = {
    visitdata: {...emptypatientvisit},
    patientdata: {...emptypatient}
};