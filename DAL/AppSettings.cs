// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class AppSettings
    {
        public string DefaultUserRole { get; set; }
        public string FileRepositoryUrl { get; set; }
        public string FileRepositoryFolder { get; set; }
        public string ServerRootPath { get; set; }
        public string EmailEndUrl { get; set; }
        public string GoogleAPIKey { get; set; }
        public SmtpConfig SmtpConfig { get; set; }

    }



    public class SmtpConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }

        public string Name { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}
