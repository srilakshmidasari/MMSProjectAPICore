import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory={
    
    docType: {
        Image: 1,
        Document: 2,        
    },

    ClassTypes :{
       FileType :1,
       LookUp:2,
       ItemType :3,
    },

    LookUp:{
     Store :3,
     Group :4,
     AstTrade :5,
     WorkStatus:6,
     Technician:7,
     WorkFaults:8,
     ItemCategory:9,
     UOM:10,
     
    }
}