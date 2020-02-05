import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory={
    
    docType: {
        Image: 1,
        Document: 2,        
    },

    LookUp:{
     Store :3,
     Group :4
    }
}