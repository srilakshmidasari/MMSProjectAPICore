using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DAL;
using DAL.Models;
using DAL.Response;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace MMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public ProjectController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<GetProjectResponse> Get()
        {
            return _unitOfWork.Projects.GetAllProject();
        }

        [HttpGet("GetStoresByProjectId/{ProjectId}")]
        public ListDataResponse<GetLoopUpResponse> GetStoresByProjectId(int ProjectId)
        {
            return _unitOfWork.Projects.GetStoresByProjectId(ProjectId);
        }


        [HttpPost]
        public ValueDataResponse<Project> Insert(UpsertProject project)
        {
           // Project pro = _mapper.Map<Project>(project);
            return _unitOfWork.Projects.InsertProject(project);
        }

        [HttpGet("GetRepositoryByProject/{ProjectId}")]
        public ListDataResponse<ProjectRepositoryResposnse> GetRepositoryByProject(int ProjectId)
        {
            return _unitOfWork.Projects.GetRepositoryByProject(ProjectId);
        }

        [HttpDelete]
        [Route("DeleteProjectRepository/{ProjectRepositoryId}")]
        public ValueDataResponse<ProjectRepository> DeleteFileRepository(int ProjectRepositoryId)
        {
            return _unitOfWork.Projects.DeleteFileRepository(ProjectRepositoryId);
        }

        [HttpPut]
        public ValueDataResponse<Project> Update(UpsertProject project)
        {
            // Project pro = _mapper.Map<Project>(project);

            return _unitOfWork.Projects.UpdateProject(project);
        }

        [HttpDelete]
        public ValueDataResponse<Project> DeleteProject(int ProjectId)
        {
            return _unitOfWork.Projects.DeleteProject(ProjectId);
        }


        [HttpGet("GetProjectsBySiteId/{SiteId}")]
        public ListDataResponse<Project> GetProjectsBySiteId(int SiteId)
        {
            return _unitOfWork.Projects.GetProjectsBySiteId(SiteId);
        }
    }
}