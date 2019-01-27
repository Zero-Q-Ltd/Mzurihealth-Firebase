import {emptypatient, Patient} from './Patient';
import {emptypatienthistory, PatientVisit} from './PatientVisit';

export interface MergedPatient_QueueModel {
    patientdata: Patient;
    queuedata: PatientVisit;
}

export const mergedQueueModel: MergedPatient_QueueModel = {
    queuedata: {...emptypatienthistory},
    patientdata: {...emptypatient}
};