using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class EnumType
    {

        public enum WorkType
        {
            CM = 80,
            PM = 81,
        }



        public enum LookUP
        {
            Store= 3,
            Group= 4,
            AstTrade= 5,
            WorkStatus= 6,
            Technician= 7,
            WorkFaults= 8,
            WorkType= 18,
            ItemCategory=9,
            UOM= 10,
        }
        public enum WorkStatus
        {
            Planned = 60,
            Completed = 77,
            InProgrss = 71,
        }

        public enum StatusTypes
        {
            Open = 14,
            Approved = 15,
            Rejected = 16,
            Closed = 17
        }
    }
}
