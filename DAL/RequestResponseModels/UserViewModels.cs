﻿// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================


using DAL.Helpers;
using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using static DAL.RequestResponseModels.RequestResponseModels;

namespace DAL.RequestResponseModels
{
    public class UserViewModel : UserBaseViewModel
    {
        public bool IsLockedOut { get; set; }
        public bool EmailConfirmed { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[] Roles { get; set; }
    }



    public class UserEditViewModel : UserBaseViewModel
    {
        public string CurrentPassword { get; set; }

        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters")]
        public string NewPassword { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[] Roles { get; set; }
    }

    public class UserFileViewModel 
    {
        public string CurrentPassword { get; set; }

        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters")]
        public string NewPassword { get; set; }

        [MinimumCount(1, ErrorMessage = "Roles cannot be empty")]
        public string[] Roles { get; set; }

        public string Id { get; set; }

        [Required(ErrorMessage = "Username is required"), StringLength(200, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 200 characters")]
        public string UserName { get; set; }
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required"), StringLength(200, ErrorMessage = "Email must be at most 200 characters"), EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public string PhoneNumber { get; set; }
        public string Configuration { get; set; }
        public bool IsEnabled { get; set; }
        public string EmployeeId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }
        public int[] ProjectIds { get; set; }
        public List<UpsertRepository> FileRepositories { get; set; }

    }





    public class UserPublicRegisterViewModel : UserBaseViewModel
    {
        public UserPublicRegisterViewModel()
        {
            IsEnabled = true;
        }

        [MinLength(6, ErrorMessage = "New Password must be at least 6 characters")]
        public string NewPassword { get; set; }
    }



    public class UserPasswordRecovery
    {
        [Required(ErrorMessage = "Username or email address is required")]
        public string UsernameOrEmail { get; set; }
    }



    public class UserPasswordReset
    {
        [Required(ErrorMessage = "Username or email address is required")]
        public string UsernameOrEmail { get; set; }

        [Required(ErrorMessage = "Password is required"), MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Password reset code is required")]
        public string ResetCode { get; set; }
    }



    public class UserPatchViewModel
    {
        public string FullName { get; set; }

        public string JobTitle { get; set; }

        public string PhoneNumber { get; set; }

        public string Configuration { get; set; }
    }



    public abstract class UserBaseViewModel
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Username is required"), StringLength(200, MinimumLength = 2, ErrorMessage = "Username must be between 2 and 200 characters")]
        public string UserName { get; set; }

        public string FullName { get; set; }

        [Required(ErrorMessage = "Email is required"), StringLength(200, ErrorMessage = "Email must be at most 200 characters"), EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        public string JobTitle { get; set; }
        public string PhoneNumber { get; set; }
        public string Configuration { get; set; }
        public bool IsEnabled { get; set; }
        public string EmployeeId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }
    }

    public class UserResponseModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }  
        public bool IsEnabled { get; set; }
        public string EmployeeId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }
        public List<UpsertRepository> FileRepositories { get; set; }

    }

    public class UserResViewModel : AuditableEntity
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string JobTitle { get; set; }
        public string PhoneNumber { get; set; }
        public string Configuration { get; set; }
        public string[] Roles { get; set; }
        public bool IsEnabled { get; set; }
        public string EmployeeId { get; set; }
        public string Name1 { get; set; }
        public string Name2 { get; set; }
        public List<FileRepository> FileRepositories { get; set; }
      
    }

    public class UserProject
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }
    }

    //public class UserViewModelValidator : AbstractValidator<UserViewModel>
    //{
    //    public UserViewModelValidator()
    //    {
    //        //Validation logic here
    //        RuleFor(user => user.UserName).NotEmpty().WithMessage("Username cannot be empty");
    //        RuleFor(user => user.Email).EmailAddress().NotEmpty();
    //        RuleFor(user => user.Password).NotEmpty().WithMessage("Password cannot be empty").Length(4, 20);
    //    }
    //}
}
