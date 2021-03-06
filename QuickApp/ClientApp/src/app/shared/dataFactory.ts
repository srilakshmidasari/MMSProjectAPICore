import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory = {

    docType: {
        Image: 1,
        Document: 2,
    },

    ClassTypes: {
        FileType: 1,
        LookUp: 2,
        ItemType: 3,
        TypeOfMaintenance: 5
    },

    LookUp: {
        Store: 3,
        Group: 4,
        AstTrade: 5,
        WorkStatus: 6,
        Technician: 7,
        WorkFaults: 8,
        WorkType: 18,
        ItemCategory: 9,
        UOM: 10,

    },

    StatusTypes: {
        Open: 14,
        Approved: 15,
        Rejected: 16,
        Closed: 17
    },

    JobStatusTypes: {
        Draft: 25,
        Active: 26,
        InActive: 27
    },

    OrderTypes: {
        NormalWorkOrder: 23,
        PMOrder: 24
    },

    PMOrderTypes :{
        WorkType : 81,
        WorkFault : 82,
        WorkStatus : 60
    },

    TypeofMaintenance :{
        Monthly : 19,
        Quarterly : 20,
        HalfYearly : 21,
        Yearly : 22
    }
}