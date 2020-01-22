using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Response
{
    public class ValueDataResponse<T> : DataResponse
    {
        public T Result { get; set; }
    }
}
