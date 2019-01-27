import {Metadata} from './universal';

type MedicalConditionsModel =
    'Alzheimer\'s'
    | 'Arthritis'
    | 'Asthma'
    | 'Blood Pressure'
    | 'Cancer'
    | 'Cholesterol'
    | 'Chronic Pain'
    | 'Cold & Flu'
    | 'Depression'
    | 'Diabetes'
    | 'Dictionary'
    | 'Digestion'
    | 'Eyesight'
    | 'Health & Living'
    | 'Healthy Kids'
    | 'Hearing & Ear'
    | 'Heart'
    | 'HIV/AIDS'
    | 'Infectious Disease'
    | 'Lung Conditions'
    | 'Medications'
    | 'Menopause'
    | 'Men\'s Health'
    | 'Mental'
    | 'Health'
    | 'Migraine'
    | 'Neurology'
    | 'Oral'
    | 'Health'
    | 'Pregnancy'
    | 'Senior'
    | 'Health'
    | 'Sexual'
    | 'Health'
    | 'Skin'
    | 'Sleep'
    | 'Thyroid'
    | 'Travel'
    | 'Health'
    | 'Women\'s Health' ;
export const medicalconditionsarray = [
    'Alzheimer\'s'
    , 'Arthritis'
    , 'Asthma'
    , 'Blood Pressure'
    , 'Cancer'
    , 'Cholesterol'
    , 'Chronic Pain'
    , 'Cold & Flu'
    , 'Depression'
    , 'Diabetes'
    , 'Dictionary'
    , 'Digestion'
    , 'Eyesight'
    , 'Health & Living'
    , 'Healthy Kids'
    , 'Hearing & Ear'
    , 'Heart'
    , 'HIV/AIDS'
    , 'Infectious Disease'
    , 'Lung Conditions'
    , 'Medications'
    , 'Menopause'
    , 'Men\'s Health'
    , 'Mental'
    , 'Health'
    , 'Migraine'
    , 'Neurology'
    , 'Oral'
    , 'Health'
    , 'Pregnancy'
    , 'Senior'
    , 'Health'
    , 'Sexual'
    , 'Health'
    , 'Skin'
    , 'Sleep'
    , 'Thyroid'
    , 'Travel'
    , 'Health'
    , 'Women\'s Health'];

export interface Condition {
    type: MedicalConditionsModel;
    detail: string;
    metadata: Metadata;
}

