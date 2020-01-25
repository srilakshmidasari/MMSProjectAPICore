using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace DAL
{
    public class FileUploadService
    {
        public byte[] ConvertHtmlToPdf(string HtmlString)
        {

            //Create a byte array that will eventually hold our final PDF
            byte[] bytes;

            //Boilerplate iTextSharp setup here
            //Create a stream that we can write to, in this case a MemoryStream
            using (var ms = new MemoryStream())
            {

                //After all of the PDF "stuff" above is done and closed but **before** we
                //close the MemoryStream, grab all of the active bytes from the stream
                bytes = ms.ToArray();
            }

            return bytes;
        }

        public string UploadFile(byte[] Bytes, string Extension, string FolderLocation)
        {
            try
            {
                var now = DateTime.Now;
                //var yearName = now.Year.ToString(); now.ToString("yyyy");
                //var monthName = now.Month.ToString();
                //var dayName = now.Day.ToString();
                string FileName = DateTime.Now.ToString("yyyyMMddhhmmssfff");


                //  FolderLocation = FolderLocation.EndsWith(@"\") ? FolderLocation : FolderLocation + @"\";
                // var FilePath = Path.Combine(FolderLocation, ModuleName);

                //bool isaccess=Directory.g(FolderLocation);
                //FolderLocation += "FolderLocation/";
                if (!Directory.Exists(FolderLocation))
                {
                    Directory.CreateDirectory(FolderLocation);
                }

                //byte[] ByteArray = null;

                if (Bytes == null)
                    return null;
                else
                {
                    var testFile = Path.Combine(FolderLocation, FileName + Extension);
                    File.WriteAllBytes(testFile, Bytes);
                    return FileName;

                                  
                }
            }
            catch (Exception ex)
            {
                // throw;
                return ex.InnerException == null ? ex.Message : ex.InnerException.Message;
            }
        }
    }
}
