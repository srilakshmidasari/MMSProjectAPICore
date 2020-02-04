﻿using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IMasterRepository
    {
        ListDataResponse<TypeCdDmt> GetAllTypeCddmtdetails(int ClassTypeId);

        ValueDataResponse<FileRepository> DeleteFileRepository(int FileRepositoryId);

        ListDataResponse<LookUp> GetAllLookUpDetails();

        ValueDataResponse<LookUp> AddLookUpData (LookUp lookup);
    }
}
