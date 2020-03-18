// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DAL.Repositories;
using DAL.Repositories.Interfaces;
using Microsoft.Extensions.Options;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;
        readonly IOptions<AppSettings> _configuration;
        IMapper _mapper;
        ISiteRepository _sites;
        IMasterRepository _Masters;
        IProjectRepository _Projects;
        ILocationRepository _Locations;
        IAssetRepository _assets;
        ISupplierRepository _suppliers;
        ItemRepository _items;
        IPurchaseOrderRepository _purchages;

        IWorkOrderRepository _workorders;
        IPreventiveMaintenanceRepository _preventiveMaintenance;

        IJobPlanRepository _jobPlans;
        public UnitOfWork(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
        }



        public ISiteRepository Sites
        {
            get
            {
                if (_sites == null)
                    _sites = new SiteRepository(_context, _mapper, _configuration);

                return _sites;
            }
        }

        public IMasterRepository Masters
        {
            get
            {
                if (_Masters == null)
                    _Masters = new MasterRepository(_context, _mapper, _configuration);

                return _Masters;
            }
        }

        public IProjectRepository Projects
        {
            get
            {
                if (_Projects == null)
                    _Projects = new ProjectsRepository(_context, _mapper, _configuration);

                return _Projects;
            }
        }

        public ILocationRepository Locations
        {
            get
            {
                if (_Locations == null)
                    _Locations = new LocationRepository(_context, _mapper, _configuration);

                return _Locations;
            }
        }

        public IAssetRepository Assets
        {
            get
            {
                if (_assets == null)
                    _assets = new AssetRepository(_context, _mapper, _configuration);

                return _assets;
            }
        }

        public ISupplierRepository Suppliers
        {
            get
            {
                if (_suppliers == null)
                    _suppliers = new SupplierRepository(_context, _mapper, _configuration);

                return _suppliers;
            }
        }

        public IItemRepository Items
        {
            get
            {
                if (_items == null)
                    _items = new ItemRepository(_context, _mapper, _configuration);

                return _items;
            }
        }

        public IPurchaseOrderRepository Purchages
        {
            get
            {
                if (_purchages == null)
                    _purchages = new PurchaseOrderRepository(_context, _mapper, _configuration);

                return _purchages;
            }
        }

        public IWorkOrderRepository WorkOrders
        {
            get
            {
                if (_workorders == null)
                    _workorders = new WorkOrderRepository(_context, _mapper, _configuration);

                return _workorders;
            }
        }

        public IPreventiveMaintenanceRepository PreventiveMaintenances
        {
            get
            {
                if (_preventiveMaintenance == null)
                    _preventiveMaintenance = new PreventiveMaintenanceRepository(_context, _mapper, _configuration);

                return _preventiveMaintenance;
            }
        }

        public IJobPlanRepository JobPlans
        {
            get
            {
                if (_jobPlans == null)
                    _jobPlans = new JobPlanRepository(_context, _mapper, _configuration);

                return _jobPlans;
            }
        }



        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
