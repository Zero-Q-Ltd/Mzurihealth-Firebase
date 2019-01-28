import {emptypatient, Patient} from './Patient';
import {emptypatientvisit, PatientVisit} from './PatientVisit';

export interface MergedPatient_QueueModel {
    patientdata: Patient;
    queuedata: PatientVisit;
}

export const emptymergedQueueModel: MergedPatient_QueueModel = {
    queuedata: {...emptypatientvisit},
    patientdata: {...emptypatient}
};