﻿using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Response
{
    public class ListDataResponse<T> : DataResponse
    {
        public IEnumerable<T> ListResult { get; set; }

    }
}
