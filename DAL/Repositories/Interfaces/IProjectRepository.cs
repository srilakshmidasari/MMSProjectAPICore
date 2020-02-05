using DAL.Models;
using DAL.Response;
using System;
using System.Collections.Generic;
using System.Text;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        ListDataResponse<GetProjectResponse> GetAllProject();
        ListDataResponse<GetLoopUpResponse> GetStoresByProjectId(int ProjectId);
        ValueDataResponse<Project> InsertProject(UpsertProject project);

        //ListDataResponse<> GetStoresByProjectId(int ProjectId);
    }
}
