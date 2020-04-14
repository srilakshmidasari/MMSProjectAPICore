using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class EnumType
    {

       public enum PMOrderTypes
        {
            WorkType = 23,
            OrderType = 24,
          
        }

        public enum WorkStatus
        {
            Planned = 60,
            Completed = 71,
            InProgrss = 77,
        }

        public enum StatusTypes
        {
            Open= 14,
            Approved= 15,
            Rejected= 16,
            Closed= 17 
        }
    }
}
