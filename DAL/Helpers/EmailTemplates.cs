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
using System.Linq;

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

        public static string GetPurchaseOrder(string purchaseReference, DateTime arrivingDate, string projectName, string storeName, string supplierName, string supplierAdtees, string billingAddress, string shippingAddress, List<GetItemsResponse> itemData, string callbackUrl)
        {
            if (purchaseOrderTemplate == null)
                purchaseOrderTemplate = ReadPhysicalFile("Helpers/Templates/PurchaseOrder.template");

            //string ItemMessage = purchaseOrderTemplate
            //     .Replace("{PurchaseReference}", purchaseReference)
            //     .Replace("{ProjectName}", projectName)
            //     .Replace("{StoreName}", storeName)
            //     .Replace("{SupplierName}", supplierName)
            //     .Replace("{supplierAdtees}", supplierAdtees)
            //     .Replace("{arrivingDate}", arrivingDate.ToString("dd/MM/yyyy"))
            //     .Replace("{billingAddress}", billingAddress)
            //     .Replace("{shippingAddress}", shippingAddress)
            //     .Replace("{ItemName}", ItemName)
            //     .Replace("{Quantity}", Quantity.ToString())
            //     .Replace("{ExpectedCost}", ExpectedCost.ToString())
            //     .Replace("{Comments}", Comments)
            //     .Replace("{url}", callbackUrl);
            string ItemMessage ="";
            foreach (var file in itemData)
            {
                ItemMessage = purchaseOrderTemplate
                  //.Replace("{PurchaseReference}", purchaseReference)
                  //.Replace("{ProjectName}", projectName)
                  //.Replace("{StoreName}", storeName)
                  //.Replace("{SupplierName}", supplierName)
                  //.Replace("{supplierAdtees}", supplierAdtees)
                  //.Replace("{arrivingDate}", arrivingDate.ToString("dd/MM/yyyy"))
                  //.Replace("{billingAddress}", billingAddress)
                  //.Replace("{shippingAddress}", shippingAddress)
                  .Replace("{ItemName}", file.ItemName)
                  .Replace("{Quantity}", file.Quantity.ToString())
                  .Replace("{ExpectedCost}", file.ExpectedCost.ToString())
                  .Replace("{Comments}", file.Comments);

            }
            return ItemMessage;
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
