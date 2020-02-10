// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public interface IUnitOfWork
    {
         ISiteRepository Sites { get; }

        IMasterRepository Masters { get; }

        IProjectRepository Projects { get; }

        ILocationRepository Locations { get; }
        IAssetRepository Assets { get; }
        int SaveChanges();
    }
}
