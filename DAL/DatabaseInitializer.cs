// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Core;
using DAL.Core.Interfaces;

namespace DAL
{
    public interface IDatabaseInitializer
    {
        Task SeedAsync();
    }




    public class DatabaseInitializer : IDatabaseInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly IAccountManager _accountManager;
        private readonly ILogger _logger;
        private readonly string _defaultRoleName;

        public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger)
        {
            _accountManager = accountManager;
            _context = context;
            _logger = logger;
        }

        public DatabaseInitializer(ApplicationDbContext context, IAccountManager accountManager, ILogger<DatabaseInitializer> logger, string defaultRoleName)
            : this(context, accountManager, logger)
        {
            _defaultRoleName = defaultRoleName;
        }


        virtual public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync().ConfigureAwait(false);

            if (!await _context.Users.AnyAsync())
            {
                _logger.LogInformation("Generating inbuilt accounts");

                const string adminRoleName = "SuperAdmin";
               const string userRoleName = "user";

                await EnsureRoleAsync(adminRoleName, "Super administrator", ApplicationPermissions.GetAllPermissionValues());
               await EnsureRoleAsync(userRoleName, "Default user", new string[] { });

                if (!string.IsNullOrWhiteSpace(_defaultRoleName))
                    await EnsureRoleAsync(_defaultRoleName, "Default public role", new string[] { });

                await CreateUserAsync("superadmin", "Abcd@123", "Super Administrator", "superadmin@gmail.com", "7846745764", new string[] { adminRoleName });
               await CreateUserAsync("user", "Abcd@123", "Inbuilt Standard User", "user@gmail.com", "9574574687", new string[] { userRoleName });

              //  await _context.SaveChangesAsync();

                _logger.LogInformation("Inbuilt account generation completed");
            }
        }



        private async Task EnsureRoleAsync(string roleName, string description, string[] claims)
        {
            if ((await _accountManager.GetRoleByNameAsync(roleName)) == null)
            {
                ApplicationRole applicationRole = new ApplicationRole(roleName, description);

                var result = await this._accountManager.CreateRoleAsync(applicationRole, claims);

                if (!result.Succeeded)
                    throw new Exception($"Seeding \"{description}\" role failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");
            }
        }

        private async Task<ApplicationUser> CreateUserAsync(string userName, string password, string fullName, string email, string phoneNumber, string[] roles)
        {
            ApplicationUser applicationUser = new ApplicationUser
            {
                UserName = userName,
                FullName = fullName,
                Email = email,
                PhoneNumber = phoneNumber,
                EmailConfirmed = true,
                IsEnabled = true
 
            };

            var result = await _accountManager.CreateUserAsync(applicationUser, roles, password);

            if (!result.Succeeded)
                throw new Exception($"Seeding \"{userName}\" user failed. Errors: {string.Join(Environment.NewLine, result.Errors)}");


            return applicationUser;
        }
    }
}
