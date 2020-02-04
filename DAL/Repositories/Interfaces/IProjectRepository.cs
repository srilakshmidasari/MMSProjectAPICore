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
        ValueDataResponse<Project> InsertProject(UpsertProject project);
    }
}
