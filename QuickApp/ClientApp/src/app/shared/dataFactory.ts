import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory={
    TypeOfFile: {
        Image: 1,
        Document: 2,        
    }
}