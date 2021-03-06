// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using AutoMapper;
using DAL.Models;
using DAL.Core.Interfaces;
using Microsoft.AspNetCore.JsonPatch;
using DAL.Core;
using IdentityServer4.AccessTokenValidation;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using DAL.Helpers;
using DAL.RequestResponseModels;
using MMS.Authorization;
using DAL;

using System.IO;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace MMS.Controllers
{
    [Authorize(AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAccountManager _accountManager;
        private readonly IAuthorizationService _authorizationService;
        private readonly IEmailSender _emailSender;
        private readonly string _publicRoleName;
        private readonly ILogger<AccountController> _logger;
        private const string GetUserByIdActionName = "GetUserById";
        private const string GetRoleByIdActionName = "GetRoleById";
        private readonly IOptions<AppSettings> _config;
        private readonly ApplicationDbContext _appcontext;
        
        public AccountController(IMapper mapper, IAccountManager accountManager, IAuthorizationService authorizationService, IEmailSender emailSender, IOptions<AppSettings> config,
            ILogger<AccountController> logger, ApplicationDbContext context )
        {
            _mapper = mapper;
            _accountManager = accountManager;
            _authorizationService = authorizationService;
            _emailSender = emailSender;
            _publicRoleName = config.Value.DefaultUserRole;
            _logger = logger;
            _config = config;
            _appcontext = context;
        }


        [HttpGet("users/me")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        public async Task<IActionResult> GetCurrentUser()
        {
            return await GetUserById(Utilities.GetUserId(this.User));
        }


        [HttpGet("users/{id}", Name = GetUserByIdActionName)]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserById(string id)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Read)).Succeeded)
                return new ChallengeResult();

            UserViewModel userVM = await GetUserViewModelHelper(id);

            if (userVM != null)
                return Ok(userVM);
            else
                return NotFound(id);
        }


        [HttpGet("users/username/{userName}")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserByUserName(string userName)
        {
            ApplicationUser appUser = await _accountManager.GetUserByUserNameAsync(userName);

            if (!(await _authorizationService.AuthorizeAsync(this.User, appUser?.Id ?? "", AccountManagementOperations.Read)).Succeeded)
                return new ChallengeResult();

            if (appUser == null)
                return NotFound(userName);

            return await GetUserById(appUser.Id);
        }


        [HttpGet("users")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
        public async Task<IActionResult> GetUsers()
        {
            return await GetUsers(-1, -1);
        }


        [HttpGet("users/{pageNumber:int}/{pageSize:int}")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        [ProducesResponseType(200, Type = typeof(List<UserViewModel>))]
        public async Task<IActionResult> GetUsers(int pageNumber, int pageSize)
        {
            var usersAndRoles = await _accountManager.GetUsersAndRolesAsync(pageNumber, pageSize);

            List<UserViewModel> usersVM = new List<UserViewModel>();

            foreach (var item in usersAndRoles)
            {
                var userVM = _mapper.Map<UserViewModel>(item.User);
                userVM.Roles = item.Roles;

                usersVM.Add(userVM);
            }

            return Ok(usersVM);
        }

        [HttpPut("users/me")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UserEditViewModel user)
        {
            return await UpdateUser(Utilities.GetUserId(this.User), user);
        }


        [HttpPut("users/{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserEditViewModel user)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);
            string[] currentRoles = appUser != null ? (await _accountManager.GetUserRolesAsync(appUser)).ToArray() : null;

            var manageUsersPolicy = _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update);
            var assignRolePolicy = _authorizationService.AuthorizeAsync(this.User, (user.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy);


            if ((await Task.WhenAll(manageUsersPolicy, assignRolePolicy)).Any(r => !r.Succeeded))
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");

                if (!string.IsNullOrWhiteSpace(user.Id) && id != user.Id)
                    return BadRequest("Conflicting user id in parameter and model data");

                if (appUser == null)
                    return NotFound(id);

                bool isPasswordChanged = !string.IsNullOrWhiteSpace(user.NewPassword);
                bool isUserNameChanged = !appUser.UserName.Equals(user.UserName, StringComparison.OrdinalIgnoreCase);
                bool isConfirmedEmailChanged = !appUser.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase) && appUser.EmailConfirmed;

                if (Utilities.GetUserId(this.User) == id)
                {
                    if (string.IsNullOrWhiteSpace(user.CurrentPassword))
                    {
                        if (isPasswordChanged)
                            AddError("Current password is required when changing your own password", "Password");

                        if (isUserNameChanged)
                            AddError("Current password is required when changing your own username", "Username");

                        if (isConfirmedEmailChanged)
                            AddError("Current password is required when changing your own email address", "Email");
                    }
                    else if (isPasswordChanged || isUserNameChanged || isConfirmedEmailChanged)
                    {
                        if (!await _accountManager.CheckPasswordAsync(appUser, user.CurrentPassword))
                            AddError("The username/password couple is invalid.");
                    }
                }

                if (ModelState.IsValid)
                {
                    _mapper.Map<UserEditViewModel, ApplicationUser>(user, appUser);
                    appUser.EmailConfirmed = isConfirmedEmailChanged ? false : appUser.EmailConfirmed;

                    var result = await _accountManager.UpdateUserAsync(appUser, user.Roles);
                    if (result.Succeeded)
                    {
                        if (isConfirmedEmailChanged)
                            await SendVerificationEmail(appUser);

                        if (isPasswordChanged)
                        {
                            if (!string.IsNullOrWhiteSpace(user.CurrentPassword))
                                result = await _accountManager.UpdatePasswordAsync(appUser, user.CurrentPassword, user.NewPassword);
                            else
                                result = await _accountManager.ResetPasswordAsync(appUser, user.NewPassword);
                        }

                        if (result.Succeeded)
                            return NoContent();
                    }

                    AddError(result.Errors);
                }
            }

            return BadRequest(ModelState);
        }

        [HttpPut("updateuser/{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUsers(string id, [FromBody] UserFileViewModel user)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);
            string[] currentRoles = appUser != null ? (await _accountManager.GetUserRolesAsync(appUser)).ToArray() : null;

            var manageUsersPolicy = _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update);
            var assignRolePolicy = _authorizationService.AuthorizeAsync(this.User, (user.Roles, currentRoles), Authorization.Policies.AssignAllowedRolesPolicy);


            if ((await Task.WhenAll(manageUsersPolicy, assignRolePolicy)).Any(r => !r.Succeeded))
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");

                if (!string.IsNullOrWhiteSpace(user.Id) && id != user.Id)
                    return BadRequest("Conflicting user id in parameter and model data");

                if (appUser == null)
                    return NotFound(id);

                bool isPasswordChanged = !string.IsNullOrWhiteSpace(user.NewPassword);
                bool isUserNameChanged = !appUser.UserName.Equals(user.UserName, StringComparison.OrdinalIgnoreCase);
                bool isConfirmedEmailChanged = !appUser.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase) && appUser.EmailConfirmed;

                if (Utilities.GetUserId(this.User) == id)
                {
                    if (string.IsNullOrWhiteSpace(user.CurrentPassword))
                    {
                        if (isPasswordChanged)
                            AddError("Current password is required when changing your own password", "Password");

                        if (isUserNameChanged)
                            AddError("Current password is required when changing your own username", "Username");

                        if (isConfirmedEmailChanged)
                            AddError("Current password is required when changing your own email address", "Email");
                    }
                    else if (isPasswordChanged || isUserNameChanged || isConfirmedEmailChanged)
                    {
                        if (!await _accountManager.CheckPasswordAsync(appUser, user.CurrentPassword))
                            AddError("The username/password couple is invalid.");
                    }
                }

                if (ModelState.IsValid)
                {
                    _mapper.Map<UserFileViewModel, ApplicationUser>(user, appUser);
                    appUser.EmailConfirmed = isConfirmedEmailChanged ? false : appUser.EmailConfirmed;

                    var result = await _accountManager.UpdateUserAsync(appUser, user.Roles);
                    var projectList = _appcontext.UserProjectXrefs.Where(x => x.UserId == appUser.Id).ToList();
                    _appcontext.UserProjectXrefs.RemoveRange(projectList);
                    _appcontext.SaveChanges();
                    foreach (var up in user.ProjectIds)
                    {
                        _appcontext.UserProjectXrefs.Add(new UserProjectXref
                        {
                            UserId = appUser.Id,
                            ProjectId = up,
                        });
                    }
                    if (result.Succeeded)
                    {
                        foreach (var req in user.FileRepositories)
                        {
                            if (req.FileName != null)
                            {
                                string ModuleName = "Users";
                                var now = DateTime.Now;
                                var yearName = now.ToString("yyyy");
                                var monthName = now.Month.ToString("d2");
                                var dayName = now.ToString("dd");

                                FileUploadService repo = new FileUploadService();

                                // string FolderLocation = _config.Value.FileRepositoryFolder;
                                string FolderLocation = "FileRepository";
                                string ServerRootPath = _config.Value.ServerRootPath;

                                string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                                byte[] FileBytes = Convert.FromBase64String(req.FileName);

                                req.FileName = repo.UploadFile(FileBytes, req.FileExtention, Location);

                                req.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                                FileRepository file = new FileRepository();
                                {
                                    file.UserId = appUser.Id;
                                    file.FileName = req.FileName;
                                    file.FileLocation = req.FileLocation;
                                    file.FileExtention = req.FileExtention;
                                    file.DocumentType = req.DocumentTypeId;
                                    file.CreatedBy = req.CreatedBy;
                                    file.CreatedDate = DateTime.Now;
                                    file.UpdatedBy = req.UpdatedBy;
                                    file.UpdatedDate = DateTime.Now;
                                }
                                _appcontext.FileRepositories.Add(file);
                            }
                        }
                        _appcontext.SaveChanges();
                        if (isConfirmedEmailChanged)
                            await SendVerificationEmail(appUser);

                        if (isPasswordChanged)
                        {
                            if (!string.IsNullOrWhiteSpace(user.CurrentPassword))
                                result = await _accountManager.UpdatePasswordAsync(appUser, user.CurrentPassword, user.NewPassword);
                            else
                                result = await _accountManager.ResetPasswordAsync(appUser, user.NewPassword);
                        }

                        if (result.Succeeded)
                            return NoContent();
                    }

                    AddError(result.Errors);

                }
            }

            return BadRequest(ModelState);
        }



        [HttpPatch("users/me")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] JsonPatchDocument<UserPatchViewModel> patch)
        {
            return await UpdateUser(Utilities.GetUserId(this.User), patch);
        }


        [HttpPatch("users/{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] JsonPatchDocument<UserPatchViewModel> patch)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Update)).Succeeded)
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (patch == null)
                    return BadRequest($"{nameof(patch)} cannot be null");


                ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

                if (appUser == null)
                    return NotFound(id);


                UserPatchViewModel userPVM = _mapper.Map<UserPatchViewModel>(appUser);
                patch.ApplyTo(userPVM, (e) => AddError(e.ErrorMessage));

                if (ModelState.IsValid)
                {
                    _mapper.Map<UserPatchViewModel, ApplicationUser>(userPVM, appUser);

                    var result = await _accountManager.UpdateUserAsync(appUser);
                    if (result.Succeeded)
                        return NoContent();


                    AddError(result.Errors);
                }
            }

            return BadRequest(ModelState);
        }


        [HttpPost("users")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> Register([FromBody] UserFileViewModel user)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, (user.Roles, new string[] { }), Authorization.Policies.AssignAllowedRolesPolicy)).Succeeded)
                return new ChallengeResult();


            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");


                ApplicationUser appUser = _mapper.Map<ApplicationUser>(user);

                var result = await _accountManager.CreateUserAsync(appUser, user.Roles, user.NewPassword);
                 
                foreach (var up in user.ProjectIds)
                {
                    _appcontext.UserProjectXrefs.Add(new UserProjectXref
                    {
                        UserId = appUser.Id,
                        ProjectId = up,
                    });
                }
                if (result.Succeeded)
                {
                    foreach (var req in user.FileRepositories)
                    {
                        if (req.FileName != null)
                        {
                            string ModuleName = "Users";
                            var now = DateTime.Now;
                            var yearName = now.ToString("yyyy");
                            var monthName = now.Month.ToString("d2");
                            var dayName = now.ToString("dd");

                            FileUploadService repo = new FileUploadService();

                            string FolderLocation = _config.Value.FileRepositoryFolder;
                            

                            string ServerRootPath = _config.Value.ServerRootPath;

                            string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                            byte[] FileBytes = Convert.FromBase64String(req.FileName);

                            req.FileName = repo.UploadFile(FileBytes, req.FileExtention, Location);

                            req.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                            FileRepository file = new FileRepository();
                            {
                                file.UserId = appUser.Id;
                                file.FileName = req.FileName;
                                file.FileLocation = req.FileLocation;
                                file.FileExtention = req.FileExtention;
                                file.DocumentType = req.DocumentTypeId;
                                file.CreatedBy = req.CreatedBy;
                                file.CreatedDate = DateTime.Now;
                                file.UpdatedBy = req.UpdatedBy;
                                file.UpdatedDate = DateTime.Now;
                            }
                            _appcontext.FileRepositories.Add(file);
                        }
                    }
                     _appcontext.SaveChanges();
                    await SendVerificationEmail(appUser);
                    UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);
                    return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
                }

                AddError(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpPost("public/users")]
        [AllowAnonymous]
        [ProducesResponseType(201, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> PublicRegister([FromBody] UserPublicRegisterViewModel user)
        {
            if (ModelState.IsValid)
            {
                if (user == null)
                    return BadRequest($"{nameof(user)} cannot be null");

                ApplicationUser appUser = _mapper.Map<ApplicationUser>(user);

                var result = await _accountManager.CreateUserAsync(appUser, new string[] { _publicRoleName }, user.NewPassword);
                if (result.Succeeded)
                {
                    await SendVerificationEmail(appUser);

                    UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);
                    return CreatedAtAction(GetUserByIdActionName, new { id = userVM.Id }, userVM);
                }

                AddError(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpPost("users/me/sendconfirmemail")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SendConfirmEmail()
        {
            var userId = Utilities.GetUserId(this.User);
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            if (false && appUser.EmailConfirmed)
                return BadRequest("User email has already been confirmed");

            await SendVerificationEmail(appUser);

            return Ok();
        }


        [HttpPut("public/confirmemail")]
        [AllowAnonymous]
        [ProducesResponseType(202)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            if (appUser == null)
                return NotFound(userId);

            var result = await _accountManager.ConfirmEmailAsync(appUser, code);
            if (!result.Succeeded)
                return BadRequest($"Confirming email failed for user \"{appUser.UserName}\". Errors: {string.Join(", ", result.Errors)}");

            return Accepted();
        }


        [HttpPost("public/recoverpassword")]
        [AllowAnonymous]
        [ProducesResponseType(202)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> RecoverPassword([FromBody] UserPasswordRecovery recoveryInfo)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser appUser = null;

                if (recoveryInfo.UsernameOrEmail.Contains("@"))
                    appUser = await _accountManager.GetUserByEmailAsync(recoveryInfo.UsernameOrEmail);

                if (appUser == null)
                    appUser = await _accountManager.GetUserByUserNameAsync(recoveryInfo.UsernameOrEmail);

                //if (appUser == null || !(await _accountManager.IsEmailConfirmedAsync(appUser)))
                //{
                //    // Don't reveal that the user does not exist or is not confirmed
                //    return Accepted();
                //}
                if (appUser == null)
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    return Accepted();
                }

                string code = await _accountManager.GeneratePasswordResetTokenAsync(appUser);
                string callbackUrl = $"{_config.Value.EmailEndUrl}/ResetPassword?code={code}";
                string message = EmailTemplates.GetResetPasswordEmail(appUser.UserName, appUser.Email, HtmlEncoder.Default.Encode(callbackUrl));

                //string code = await _accountManager.GeneratePasswordResetTokenAsync(appUser);
                //string callbackUrl = $"{Request.Scheme}://{Request.Host}/ResetPassword?code={code}";
                //string message = EmailTemplates.GetResetPasswordEmail(appUser.UserName, appUser.Email, HtmlEncoder.Default.Encode(callbackUrl));

                await _emailSender.SendEmailAsync(appUser.UserName, appUser.Email, "Reset Password", message);

                return Accepted();
            }

            return BadRequest(ModelState);
        }


        [HttpPost("public/resetpassword")]
        [AllowAnonymous]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> ResetPassword([FromBody] UserPasswordReset resetInfo)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser appUser = null;

                if (resetInfo.UsernameOrEmail.Contains("@"))
                    appUser = await _accountManager.GetUserByEmailAsync(resetInfo.UsernameOrEmail);

                if (appUser == null)
                    appUser = await _accountManager.GetUserByUserNameAsync(resetInfo.UsernameOrEmail);

                if (appUser == null)
                {
                    // Don't reveal that the user does not exist
                    return NoContent();
                }

                var result = await _accountManager.ResetPasswordAsync(appUser, resetInfo.ResetCode, resetInfo.Password);
                if (!result.Succeeded)
                    return BadRequest($"Resetting password failed for user \"{appUser.UserName}\". Errors: {string.Join(", ", result.Errors)}");

                return NoContent();

            }

            return BadRequest(ModelState);
        }

        [HttpDelete("users/{id}")]
        [ProducesResponseType(200, Type = typeof(UserViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, id, AccountManagementOperations.Delete)).Succeeded)
                return new ChallengeResult();


            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

            if (appUser == null)
                return NotFound(id);

            if (!await _accountManager.TestCanDeleteUserAsync(id))
                return BadRequest("User cannot be deleted. Delete all orders associated with this user and try again");


            UserViewModel userVM = await GetUserViewModelHelper(appUser.Id);

            var result = await _accountManager.DeleteUser(appUser);

            return Ok(userVM);
        }
       
        //[HttpGet("users/GetAllUserById")]
        //[ProducesResponseType(200, Type = typeof(UserViewModel))]
        //[ProducesResponseType(400)]
        //[ProducesResponseType(403)]
        //[ProducesResponseType(404)]
        //public async Task<IActionResult> GetAllUserById(string UserId)
        //{

        //    // UserViewModel userVM = await GetAllUsersById(UserId);

        //    ApplicationUser appUser = await _accountManager.GetAllUsersById(UserId);

        //    if (appUser != null)
        //        return Ok(appUser);
        //    else
        //        return NotFound(UserId);
        //}



        [HttpPut("users/unblock/{id}")]
        [Authorize(Authorization.Policies.ManageAllUsersPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UnblockUser(string id)
        {
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(id);

            if (appUser == null)
                return NotFound(id);

            appUser.LockoutEnd = null;
            var result = await _accountManager.UpdateUserAsync(appUser);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst unblocking user: " + string.Join(", ", result.Errors));


            return NoContent();
        }


        [HttpGet("users/me/preferences")]
        [ProducesResponseType(200, Type = typeof(string))]
        public async Task<IActionResult> UserPreferences()
        {
            var userId = Utilities.GetUserId(this.User);
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            return Ok(appUser.Configuration);
        }


        [HttpPut("users/me/preferences")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> UserPreferences([FromBody] string data)
        {
            var userId = Utilities.GetUserId(this.User);
            ApplicationUser appUser = await _accountManager.GetUserByIdAsync(userId);

            appUser.Configuration = data;

            var result = await _accountManager.UpdateUserAsync(appUser);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst updating User Configurations: " + string.Join(", ", result.Errors));

            return NoContent();
        }

        [HttpGet("roles/{id}", Name = GetRoleByIdActionName)]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleById(string id)
        {
            var appRole = await _accountManager.GetRoleByIdAsync(id);

            if (!(await _authorizationService.AuthorizeAsync(this.User, appRole?.Name ?? "", Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
                return new ChallengeResult();

            if (appRole == null)
                return NotFound(id);

            return await GetRoleByName(appRole.Name);
        }


        [HttpGet("roles/name/{name}")]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(403)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetRoleByName(string name)
        {
            if (!(await _authorizationService.AuthorizeAsync(this.User, name, Authorization.Policies.ViewRoleByRoleNamePolicy)).Succeeded)
                return new ChallengeResult();


            RoleViewModel roleVM = await GetRoleViewModelHelper(name);

            if (roleVM == null)
                return NotFound(name);

            return Ok(roleVM);
        }


        [HttpGet("roles")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles()
        {
            return await GetRoles(-1, -1);
        }


        [HttpGet("roles/{pageNumber:int}/{pageSize:int}")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<RoleViewModel>))]
        public async Task<IActionResult> GetRoles(int pageNumber, int pageSize)
        {
            List<RoleViewModel> roleViewModels = new List<RoleViewModel>();
            var roles = await _accountManager.GetRolesLoadRelatedAsync(pageNumber, pageSize);
            var result = _mapper.Map<List<RoleViewModel>>(roles);

            foreach (var res in result)
            {
                var parentRoleDetails = _appcontext.Roles.Where(x => x.Id == res.ParentRoleId).FirstOrDefault();
                var responce = new RoleViewModel
                {
                    Id = res.Id,
                    Name = res.Name,
                    ParentRoleId = res.ParentRoleId == null ? null : res.ParentRoleId,
                    ParentRoleName =  string.IsNullOrEmpty(res.ParentRoleId) ? null : parentRoleDetails.Name,
                    Description = res.Description,
                    UsersCount = res.UsersCount,
                    Permissions = res.Permissions
                };

                roleViewModels.Add(responce);
            }

            return Ok(roleViewModels);
        }


        [HttpPut("roles/{id}")]
        //[Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateRole(string id, [FromBody] RoleViewModel role)
        {
            if (ModelState.IsValid)
            {
                if (role == null)
                    return BadRequest($"{nameof(role)} cannot be null");

                if (!string.IsNullOrWhiteSpace(role.Id) && id != role.Id)
                    return BadRequest("Conflicting role id in parameter and model data");



                ApplicationRole appRole = await _accountManager.GetRoleByIdAsync(id);

                if (appRole == null)
                    return NotFound(id);


                _mapper.Map<RoleViewModel, ApplicationRole>(role, appRole);

                var result = await _accountManager.UpdateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
                if (result.Succeeded)
                    return NoContent();

                AddError(result.Errors);

            }

            return BadRequest(ModelState);
        }


        [HttpPost("roles")]
      // [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(201, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateRole([FromBody] RoleViewModel role)
        {
            if (ModelState.IsValid)
            {
                if (role == null)
                    return BadRequest($"{nameof(role)} cannot be null");


                ApplicationRole appRole = _mapper.Map<ApplicationRole>(role);

                var result = await _accountManager.CreateRoleAsync(appRole, role.Permissions?.Select(p => p.Value).ToArray());
                if (result.Succeeded)
                {
                    RoleViewModel roleVM = await GetRoleViewModelHelper(appRole.Name);
                    return CreatedAtAction(GetRoleByIdActionName, new { id = roleVM.Id }, roleVM);
                }

                AddError(result.Errors);
            }

            return BadRequest(ModelState);
        }


        [HttpDelete("roles/{id}")]
       // [Authorize(Authorization.Policies.ManageAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(RoleViewModel))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteRole(string id)
        {
            ApplicationRole appRole = await _accountManager.GetRoleByIdAsync(id);

            if (appRole == null)
                return NotFound(id);

            if (!await _accountManager.TestCanDeleteRoleAsync(id))
                return BadRequest("Role cannot be deleted. Remove all users from this role and try again");

            if (appRole.Name.Equals(_publicRoleName, StringComparison.OrdinalIgnoreCase))
                return BadRequest("Default public role cannot be deleted");


            RoleViewModel roleVM = await GetRoleViewModelHelper(appRole.Name);

            var result = await _accountManager.DeleteRoleAsync(appRole);
            if (!result.Succeeded)
                throw new Exception("The following errors occurred whilst deleting role: " + string.Join(", ", result.Errors));


            return Ok(roleVM);
        }


        [HttpGet("permissions")]
        [Authorize(Authorization.Policies.ViewAllRolesPolicy)]
        [ProducesResponseType(200, Type = typeof(List<PermissionViewModel>))]
        public IActionResult GetAllPermissions()
        {
            return Ok(_mapper.Map<List<PermissionViewModel>>(ApplicationPermissions.AllPermissions));
        }

        [HttpGet("GetFilesByUserId/{UserId}")]
        [Authorize(Authorization.Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetFilesByUserId(string UserId)
        {
            // var result = _appcontext.FileRepositories.Where(x => x.UserId == UserId).ToList();
            var result = (from e in _appcontext.FileRepositories
                          join t in _appcontext.TypeCdDmts
                           on e.DocumentType equals t.TypeCdDmtId
                          
                          select new FileRepositoryResposnse
                          {
                              RepositoryId = e.RepositoryId,
                              UserId =e.UserId,
                              FileName=e.FileName,
                              FileLocation = e.FileLocation,
                              FileExtention =e.FileExtention,
                              DocumentType = e.DocumentType,
                              FileTypeName =t.Description
                          }).Where(x => x.UserId == UserId).ToList();

            var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

            result.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

            return Ok(result);
        }

        [HttpGet]
        [Route("users/GetUserById")]
        [ProducesResponseType(200, Type = typeof(UserResViewModel))]
        public async Task<UserResViewModel> GetUsersById(string userId)
        {
            var userInfo = await _accountManager.GetUserById(userId);
            userInfo.FileRepositories = _appcontext.FileRepositories.Where(x => x.UserId == userId).ToList();
            var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

            userInfo.FileRepositories.ForEach(f => f.FileLocation = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));




            //userInfo.FileRepositories = await GetFilesByUserId(userId);

            return userInfo;
        }

        private async Task<UserViewModel> GetUserViewModelHelper(string userId)
        {
            var userAndRoles = await _accountManager.GetUserAndRolesAsync(userId);
            if (userAndRoles == null)
                return null;

            var userVM = _mapper.Map<UserViewModel>(userAndRoles.Value.User);
            userVM.Roles = userAndRoles.Value.Roles;

            return userVM;
        }


        private async Task<RoleViewModel> GetRoleViewModelHelper(string roleName)
        {
            var role = await _accountManager.GetRoleLoadRelatedAsync(roleName);
            if (role != null)
                return _mapper.Map<RoleViewModel>(role);


            return null;
        }

        private async Task SendVerificationEmail(ApplicationUser appUser)
        {
            string code = await _accountManager.GenerateEmailConfirmationTokenAsync(appUser);
            string callbackUrl = $"{_config.Value.EmailEndUrl}/ConfirmEmail?userId={appUser.Id}&code={code}";
            string message = EmailTemplates.GetConfirmAccountEmail(appUser.UserName, appUser.Email, HtmlEncoder.Default.Encode(callbackUrl));

            //For background tasks such as sending emails, its good practice to use job runners such as hangfire https://www.hangfire.io
            await _emailSender.SendEmailAsync(appUser.UserName, appUser.Email, "Confirm your email", message);
        }


        private void AddError(IEnumerable<string> errors, string key = "")
        {
            foreach (var error in errors)
            {
                AddError(error, key);
            }
        }

        private void AddError(string error, string key = "")
        {
            ModelState.AddModelError(key, error);
        }

    }
}
