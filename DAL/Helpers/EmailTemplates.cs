// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using static System.Net.Mime.MediaTypeNames;
using static DAL.RequestResponseModels.RequestResponseModels;
using System.Collections.Generic;

namespace DAL.Helpers
{
    public static class EmailTemplates
    {
        static IWebHostEnvironment _hostingEnvironment;
        static string testEmailTemplate;
        static string plainTextTestEmailTemplate;
        static string confirmAccountEmailTemplate;
        static string resetPasswordEmailTemplate;
        static string employeeConfirmationTemplate;
        static string purchaseOrderTemplate;
        public static string currentYear ;
        public static void Initialize(IWebHostEnvironment hostingEnvironment )
        {
            _hostingEnvironment = hostingEnvironment;
            currentYear =  DateTime.Now.Year.ToString();
        }


        public static string GetTestEmail(string recepientName, DateTime testDate)
        {
            if (testEmailTemplate == null)
                testEmailTemplate = ReadPhysicalFile("Helpers/Templates/TestEmail.template");


            string emailMessage = testEmailTemplate
                .Replace("{user}", recepientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }

        public static string GetResetPasswordEmail(string recepientName, string email, string callbackUrl)
        {
            if (resetPasswordEmailTemplate == null)
                resetPasswordEmailTemplate = ReadPhysicalFile("Helpers/Templates/ResetPasswordEmail.template");

            string emailMessage = resetPasswordEmailTemplate
                 .Replace("{user}", recepientName)
                  .Replace("{email}", email)
                 .Replace("{year}", currentYear)
                 .Replace("{url}", callbackUrl);

            return emailMessage;
        }
        public static string GetConfirmAccountEmail(string recepientName, string Email, string callbackUrl)
        {
             
            if (confirmAccountEmailTemplate == null)
                confirmAccountEmailTemplate = ReadPhysicalFile("Helpers/Templates/ConfirmAccountEmail.template");

            string emailMessage = confirmAccountEmailTemplate
                 .Replace("{user}", recepientName)
                 .Replace("{email}", Email)
                 .Replace("{year}", currentYear)
                 .Replace("{url}", callbackUrl);

            return emailMessage;
        }
        public static string GetEmployeeConfirmationEmail(string recepientName,string Email, string callbackUrl)
        {
            if (employeeConfirmationTemplate == null)
                employeeConfirmationTemplate = ReadPhysicalFile("Helpers/Templates/EmployeeConfirmation.template");

            string emailMessage = employeeConfirmationTemplate
                 .Replace("{user}", recepientName)
                 .Replace("{email}", Email)
                 .Replace("{year}", currentYear)
                 .Replace("{url}", callbackUrl);

            return emailMessage;
        }

        public static string GetPurchaseOrder(string purchaseReference, DateTime arrivingDate, string projectName, string storeName, string supplierName, string supplierAdtees, List<GetItemsResponse> itemData, string callbackUrl)
        {
            if (purchaseOrderTemplate == null)
                purchaseOrderTemplate = ReadPhysicalFile("Helpers/Templates/PurchaseOrder.template");

            string OrderMessage = purchaseOrderTemplate
                 .Replace("{PurchaseReference}", purchaseReference)
                 .Replace("{ProjectName}", projectName)
                 .Replace("{StoreName}", storeName)
                 .Replace("{SupplierName}", supplierName)
                 .Replace("{supplierAdtees}", supplierAdtees)
                 .Replace("{arrivingDate}", arrivingDate.ToString("dd/MM/yyyy"))
                 .Replace("{url}", callbackUrl);
            return OrderMessage;
        }

        public static string GetPlainTextTestEmail(DateTime date)
        {
            if (plainTextTestEmailTemplate == null)
                plainTextTestEmailTemplate = ReadPhysicalFile("Helpers/Templates/PlainTextTestEmail.template");


            string emailMessage = plainTextTestEmailTemplate
                .Replace("{date}", date.ToString());

            return emailMessage;
        }




        private static string ReadPhysicalFile(string path)
        {
            if (_hostingEnvironment == null)
                throw new InvalidOperationException($"{nameof(EmailTemplates)} is not initialized"); 
            IFileInfo fileInfo = _hostingEnvironment.ContentRootFileProvider.GetFileInfo(path); 
            if (!fileInfo.Exists)
                throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            using (var fs = fileInfo.CreateReadStream())
            {
                using (var sr = new StreamReader(fs))
                {
                    return sr.ReadToEnd();
                }
            }
        }
    }
}
