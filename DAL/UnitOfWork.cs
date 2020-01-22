// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Repositories;
using DAL.Repositories.Interfaces;
using Microsoft.Extensions.Options;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        readonly ApplicationDbContext _context;
        readonly IOptions<AppSettings> _configuration;
        //ICustomerRepository _customers;

        public UnitOfWork(ApplicationDbContext context, IOptions<AppSettings> configuration)
        {
            _context = context;
            _configuration = configuration;
        }



        //public ICustomerRepository Customers
        //{
        //    get
        //    {
        //        if (_customers == null)
        //            _customers = new CustomerRepository(_context);

        //        return _customers;
        //    }
        //}

        public int SaveChanges()
        {
            return _context.SaveChanges();
        }
    }
}
