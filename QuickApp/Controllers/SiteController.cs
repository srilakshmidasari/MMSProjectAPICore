using AutoMapper;
using DAL;
using DAL.Models;
using DAL.Response;
using Microsoft.AspNetCore.Mvc;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace MMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        public SiteController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public ListDataResponse<SiteInfo> Get()
        {
            return _unitOfWork.Sites.GetAllSite();
        }

        [HttpPost]
        public ValueDataResponse<SiteInfo> Insert(UpsertSite sites)
        {
            SiteInfo siteInfo = _mapper.Map<SiteInfo>(sites);
            return _unitOfWork.Sites.InsertSite(siteInfo);
        }

        [HttpPut]
        public ValueDataResponse<SiteInfo> Update(UpsertSite sites)
        {
            SiteInfo siteInfo = _mapper.Map<SiteInfo>(sites);
            return _unitOfWork.Sites.UpdateSite(siteInfo);
        }

        [HttpDelete]
        public ValueDataResponse<SiteInfo> Delete(int SiteId)
        {
            //Entity entityInfo = _mapper.Map<SiteInfo>(sites);
            return _unitOfWork.Sites.DeleteSiteInfo(SiteId);
        }

        [HttpGet("GetSitesByProjectId/{ProjectId}")]
        public ListDataResponse<SiteInfo> GetSitesByProjectId(int ProjectId)
        {
            return _unitOfWork.Sites.GetSitesByProjectId(ProjectId);
        }
    }
}