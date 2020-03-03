using AutoMapper;
using DAL.Repositories.Interfaces;
using DAL.Response;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static DAL.RequestResponseModels.RequestResponseModels;
using DAL.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.Extensions.Hosting.Internal;
using System.IO;
using iTextSharp.text.pdf.draw;
using DAL.Helpers;
using CoreHtmlToImage;

namespace DAL.Repositories
{
    public class PurchaseOrderRepository : Repository<dynamic>, IPurchaseOrderRepository
    {

        public readonly IOptions<AppSettings> _config;
        public PurchaseOrderRepository(ApplicationDbContext context, IMapper mapper, IOptions<AppSettings> configuration) : base(context, mapper, configuration)
        {
            _config = configuration;
        }

        private ApplicationDbContext _appContext => (ApplicationDbContext)_context;

        public ListDataResponse<GetPurchageResponse> GetAllPurchases()
        {
            ListDataResponse<GetPurchageResponse> response = new ListDataResponse<GetPurchageResponse>();
            try
            {
                var result = (from po in _appContext.PurchageOrders
                              join s in _appContext.Suppliers on po.SupplierId equals s.Id
                              join p in _appContext.Projects on po.ProjectId equals p.Id
                              join t in _appContext.TypeCdDmts on po.StatusTypeId equals t.TypeCdDmtId
                              join lo in _appContext.LookUps on po.StoreId equals lo.Id
                              select new GetPurchageResponse
                              {
                                  Id = po.Id,
                                  SupplierId = po.SupplierId,
                                  PurchaseReference = po.PurchaseReference,
                                  SupplierName = s.Name1,
                                  SupplierAddress = s.Address,
                                  StatusTypeId = po.StatusTypeId,
                                  StatusName = t.Description,
                                  ProjectId = po.ProjectId,
                                  ProjectName = p.Name1,
                                  StoreId = po.StoreId,
                                  StoreName = lo.Name1,
                                  ArrivingDate = po.ArrivingDate,
                                  FileExtention = po.FileExtention,
                                  FileName = po.FileName,
                                  FileLocation = po.FileLocation,
                                  Remarks = po.Remarks,
                                  BillindAddress = po.BillingAddress,
                                  ShippingAddress = po.ShippingAddress,
                                  IsActive = po.IsActive,
                                  CreatedBy = po.CreatedBy,
                                  CreatedDate = po.CreatedDate,
                                  UpdatedBy = po.UpdatedBy,
                                  UpdatedDate = po.UpdatedDate,

                              }).ToList();
                var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;

                result.ForEach(f => f.PdfUrl = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, f.FileLocation, f.FileName, f.FileExtention));

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Purchase Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Details Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ValueDataResponse<string> InsertPurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<string> response = new ValueDataResponse<string>();
            byte[] byteArray = null;
            var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;
            try
            {
                PurchageOrder pro = _mapper.Map<PurchageOrder>(purchages);
                var result = _appContext.PurchageOrders.Add(pro);
                _appContext.SaveChanges();
                foreach (var it in purchages.PurchaseItems)
                {
                    _appContext.PurchageItemXrefs.Add(new PurchageItemXref
                    {
                        ItemId = it.ItemId,
                        PurchageId = pro.Id,
                        Quantity = it.Quantity,
                        ExpectdCost = it.ExpectdCost,
                        Comments = it.Comments
                    });
                }
                _appContext.SaveChanges();
                var supplier = _appContext.Suppliers.Where(x => x.Id == pro.SupplierId).FirstOrDefault();
                var project = _appContext.Projects.Where(x => x.Id == pro.ProjectId).FirstOrDefault();
                var store = _appContext.LookUps.Where(x => x.Id == pro.StoreId).FirstOrDefault();


                var items = (from pi in _appContext.PurchageItemXrefs
                             join i in _appContext.Items on pi.ItemId equals i.Id
                             join p in _appContext.PurchageOrders on pi.PurchageId equals p.Id
                             select new GetItemsResponse
                             {
                                 Id = pi.Id,
                                 PurchaseId = pi.PurchageId,
                                 PurchaseReference = p.PurchaseReference,
                                 ItemReference = i.ItemReference,
                                 ItemId = pi.ItemId,
                                 ItemName = i.Name1,
                                 Quantity = pi.Quantity,
                                 Comments = pi.Comments,
                                 ExpectedCost = pi.ExpectdCost,

                             }).Where(x => x.PurchaseId == pro.Id).ToList();
                DateTime Date = pro.ArrivingDate;
               
                string message = EmailTemplates.GetPurchaseOrder(pro.PurchaseReference, pro.ArrivingDate, project.Name1, supplier.Name1, supplier.Address, store.Name1, items, null);
                if (message != null)
                {
                    string ModuleName = "PurchaseOrder";
                    var now = DateTime.Now;
                    var yearName = now.ToString("yyyy");
                    var monthName = now.Month.ToString("d2");
                    var dayName = now.ToString("dd");

                    FileUploadService repo = new FileUploadService();

                    string FolderLocation = "FileRepository";
                    string ServerRootPath = _config.Value.ServerRootPath;

                    string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;

                    var converter = new HtmlConverter();
                    var html = message;

                    Byte[] bytes = converter.FromHtmlString(html);

                    string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);

                    string ImageUrl = "data:image/png;base64," + base64String;

                    byte[] FileBytes = Convert.FromBase64String(base64String);

                   
                    pro.FileName = repo.UploadFile(bytes, pro.FileExtention, Location);

                    pro.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                    _appContext.SaveChanges();
                }
               

                if (pro != null)
                {
                    response.Result = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, pro.FileLocation, pro.FileName, pro.FileExtention);
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "PurchageOrder Added Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "PurchageOrder Added Failed";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }
            return response;
        }

        public ValueDataResponse<string> UpdatePurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<string> response = new ValueDataResponse<string>();
            byte[] byteArray = null;
            var FileRepoBaseUrl = _config.Value.FileRepositoryUrl;
            try
            {
                PurchageOrder pro = _mapper.Map<PurchageOrder>(purchages);
                var result = _appContext.PurchageOrders.Where(x => x.Id == purchages.Id).FirstOrDefault();
                var purchaseItemList = _appContext.PurchageItemXrefs.Where(x => x.PurchageId == purchages.Id).ToList();
                _appContext.PurchageItemXrefs.RemoveRange(purchaseItemList);
                _appContext.SaveChanges();

                foreach (var it in purchages.PurchaseItems)
                {
                    _appContext.PurchageItemXrefs.Add(new PurchageItemXref
                    {
                        ItemId = it.ItemId,
                        PurchageId = pro.Id,
                        Quantity = it.Quantity,
                        ExpectdCost = it.ExpectdCost,
                        Comments = it.Comments
                    });
                }

                if (result != null)
                {
                    result.SupplierId = purchages.SupplierId;
                    result.ProjectId = purchages.ProjectId;
                    result.StoreId = purchages.StoreId;
                    result.Remarks = purchages.Remarks;
                    result.IsActive = purchages.IsActive;
                    result.FileLocation = purchages.FileLocation;
                    result.FileName = purchages.FileName;
                    result.FileExtention = purchages.FileExtention;
                    result.CreatedBy = purchages.CreatedBy;
                    result.CreatedDate = purchages.CreatedDate;
                    result.UpdatedBy = purchages.UpdatedBy;
                    result.UpdatedDate = purchages.UpdatedDate;
                    result.ArrivingDate = purchages.ArrivingDate;
                    result.PurchaseReference = purchages.PurchaseReference;
                    result.BillingAddress = purchages.BillindAddress;
                    result.ShippingAddress = purchages.ShippingAddress;
                    _appContext.SaveChanges();

                    string ModuleName = "Purchase Order";
                    var now = DateTime.Now;
                    var yearName = now.ToString("yyyy");
                    var monthName = now.Month.ToString("d2");
                    var dayName = now.ToString("dd");

                    FileUploadService repo = new FileUploadService();

                    string FolderLocation = "FileRepository";
                    string ServerRootPath = _config.Value.ServerRootPath;

                    string Location = ServerRootPath + @"\" + FolderLocation + @"\" + yearName + @"\" + monthName + @"\" + dayName + @"\" + ModuleName;


                    var supplier = _appContext.Suppliers.Where(x => x.Id == pro.SupplierId).FirstOrDefault();
                    var project = _appContext.Projects.Where(x => x.Id == pro.ProjectId).FirstOrDefault();
                    var store = _appContext.LookUps.Where(x => x.Id == pro.StoreId).FirstOrDefault();

                    var items = (from pi in _appContext.PurchageItemXrefs
                                 join i in _appContext.Items on pi.ItemId equals i.Id
                                 join p in _appContext.PurchageOrders on pi.PurchageId equals p.Id
                                 select new GetItemsResponse
                                 {
                                     Id = pi.Id,
                                     PurchaseId = pi.PurchageId,
                                     PurchaseReference = p.PurchaseReference,
                                     ItemReference = i.ItemReference,
                                     ItemId = pi.ItemId,
                                     ItemName = i.Name1,
                                     Quantity = pi.Quantity,
                                     Comments = pi.Comments,
                                     ExpectedCost = pi.ExpectdCost,

                                 }).Where(x => x.PurchaseId == pro.Id).ToList();

                    byteArray = GeneratePurchaseOrderPdf(pro, supplier, items, project, store);

                    result.FileName = repo.UploadFile(byteArray, pro.FileExtention, Location);

                    result.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                    _appContext.SaveChanges();

                    if (pro != null)
                    {
                        response.Result = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, result.FileLocation, result.FileName, result.FileExtention); ;
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Purchage Order Updated Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Purchage Order Updation Failed";
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }
            return response;
        }

        public ValueDataResponse<PurchageOrder> DeletePurchaseOrder(int PurchaseId)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();
            try
            {
                var purchaseData = _appContext.PurchageOrders.Where(x => x.Id == PurchaseId).FirstOrDefault();

                var ast = _appContext.PurchageItemXrefs.Where(x => x.PurchageId == PurchaseId).ToList();
                if (ast.Count > 0)
                {
                    _appContext.PurchageItemXrefs.RemoveRange(ast);

                    _appContext.PurchageOrders.Remove(purchaseData);
                    _appContext.SaveChanges();
                }

                if (purchaseData != null)
                {
                    response.Result = purchaseData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Purchase Order Deleted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }

        public ListDataResponse<GetItemsResponse> GetItemsByPurchaseId(int purchaseId)
        {
            ListDataResponse<GetItemsResponse> response = new ListDataResponse<GetItemsResponse>();
            try
            {
                var result = (from pi in _appContext.PurchageItemXrefs
                              join i in _appContext.Items on pi.ItemId equals i.Id
                              join p in _appContext.PurchageOrders on pi.PurchageId equals p.Id
                              select new GetItemsResponse
                              {
                                  Id = pi.Id,
                                  PurchaseId = pi.PurchageId,
                                  PurchaseReference = p.PurchaseReference,
                                  ItemReference = i.ItemReference,
                                  ItemId = pi.ItemId,
                                  ItemName = i.Name1,
                                  Quantity = pi.Quantity,
                                  ExpectedCost = pi.ExpectdCost,
                                  Comments = pi.Comments

                              }).Where(x => x.PurchaseId == purchaseId).ToList();

                if (result != null)
                {
                    response.ListResult = result;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Get All Item Details Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Item Details Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }


        public ValueDataResponse<PurchageOrder> AcceptOrder(int PurchaseId)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();
            try
            {
                var purchaseData = _appContext.PurchageOrders.Where(x => x.Id == PurchaseId).FirstOrDefault();


                if (purchaseData != null)
                {
                    purchaseData.StatusTypeId = 15;
                    _appContext.SaveChanges();
                }

                if (purchaseData != null)
                {
                    response.Result = purchaseData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Purchase Order Accepted Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }


        public ValueDataResponse<PurchageOrder> RejectOrder(int PurchaseId)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();
            try
            {
                var purchaseData = _appContext.PurchageOrders.Where(x => x.Id == PurchaseId).FirstOrDefault();


                if (purchaseData != null)
                {
                    purchaseData.StatusTypeId = 16;
                    _appContext.SaveChanges();
                }

                if (purchaseData != null)
                {
                    response.Result = purchaseData;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Purchase Order Rejected Successfull";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "No Purchase Order Found";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.AffectedRecords = 0;
                response.EndUserMessage = ex.InnerException == null ? ex.Message : ex.InnerException.Message;
                response.Exception = ex;
            }

            return response;
        }


        public byte[] GeneratePurchaseOrderPdf(PurchageOrder purchaseResponse, Supplier supplier, List<GetItemsResponse> itemData, Project project, LookUp store)
        {
            //**** genarate pdf *********
            // to develop this functionality use itextsharp dll from nuget package //

            // create instance for memory streem to read pdf file // 
            System.IO.MemoryStream ms = new System.IO.MemoryStream();

            // create  instance for pdf document genaration //
            Document pdfDoc = new Document(PageSize.A4, 35, 10, 25, 10);

            // create instance for table structure
            PdfPTable table = new PdfPTable(4);

            //actual width of table in points
            table.TotalWidth = 420f;

            //fix the absolute width of the table
            table.LockedWidth = true;

            //set col widths in proportions - 1/3 and 2/3
            float[] widths = new float[] { 3f, 2f, 2f, 2f };
            table.SetWidths(widths);
            table.HorizontalAlignment = 0;

            //leave a gap before and after the table
            table.SpacingBefore = 10f;

            //  table.SpacingAfter = 30f;

            table.SetWidths(widths);


            // create instance for Collection table structure
            PdfPTable colTable = new PdfPTable(5);

            //actual width of table in points
            colTable.TotalWidth = 420f;

            //fix the absolute width of the table
            colTable.LockedWidth = true;

            //set col widths in proportions - 1/3 and 2/3
            float[] colWidths = new float[] { 2f, 2f, 2f, 2f, 2f };
            colTable.SetWidths(colWidths);
            colTable.HorizontalAlignment = 0;

            //leave a gap before and after the table
            colTable.SpacingBefore = 10f;

            colTable.SpacingAfter = 30f;

            colTable.SetWidths(colWidths);

            // to write pdf file //
            PdfWriter pdfWriter = PdfWriter.GetInstance(pdfDoc, ms);

            // open for document //
            pdfDoc.Open();

            // ** set water mark ** //
            string watermarkText = "CALIBAR TECH";
            float fontSize = 80;
            float xPosition = 300;
            float yPosition = 400;
            float angle = 45;

            PdfContentByte under = pdfWriter.DirectContentUnder;
            BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
            under.BeginText();
            under.SetColorFill(new BaseColor(229, 232, 232));
            under.SetFontAndSize(baseFont, fontSize);
            under.ShowTextAligned(PdfContentByte.ALIGN_CENTER, watermarkText, xPosition, yPosition, angle);
            under.EndText();
            // ** set water mark end ** //

            // Add Table And Styles //
            PdfPCell colCell = new PdfPCell(new Phrase("Project Name", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase("Store Name", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase("Supplier Name", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(1, "Supplier Address", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(1, "Arriving Date ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(project.Name1));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(store.Name1));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(supplier.Name1));
            colTable.AddCell(colCell);

            colCell = new PdfPCell(new Phrase(supplier.Address));
            colTable.AddCell(colCell);

            DateTime Date = purchaseResponse.ArrivingDate;
            colCell = new PdfPCell(new Phrase(Date.ToString("dd/MM/yyyy")));
            colTable.AddCell(colCell);
   



            // Add Table And Styles //
            PdfPCell cell = new PdfPCell(new Phrase("Item", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            //cell.HorizontalAlignment = Element.ALIGN_LEFT;
            table.AddCell(cell);

            cell = new PdfPCell(new Phrase(1, "Quantity", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            //cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            table.AddCell(cell);

            cell = new PdfPCell(new Phrase(1, "Expected Cost", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            table.AddCell(cell);
            //cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            cell = new PdfPCell(new Phrase(1, "Comments", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            //cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            table.AddCell(cell);

            foreach (var it in itemData)
            {

                cell = new PdfPCell(new Phrase(it.ItemName));
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase(Convert.ToString(it.Quantity)));
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase(Convert.ToString(Math.Round(it.ExpectedCost, 3))));
                table.AddCell(cell);

                cell = new PdfPCell(new Phrase(it.Comments));
                table.AddCell(cell);
            }

            // set font style 
            Font mainHeader = FontFactory.GetFont("Calibri", 20, Font.BOLD, BaseColor.BLACK);
            Font subHeader = FontFactory.GetFont("Calibri", 10, Font.BOLD, BaseColor.BLACK);
            Font mailsubHeader = FontFactory.GetFont("Calibri", 9, Font.BOLD, BaseColor.BLACK);
            Font fontHeader = FontFactory.GetFont("Calibri", 15, Font.BOLD, new BaseColor(0, 25, 51));
            Font fontTitle = FontFactory.GetFont("Calibri", 12, Font.BOLD, new BaseColor(12, 95, 151));
            Font detailstyle = FontFactory.GetFont("Calibri", 13, Font.BOLD);


            string header = "CALIBER MAINTENANCE MANAGEMENT SYSTEM";
            string subheader1 = "132/A, Bluepal Building";
            string subheader2 = "Opp JNTU, Kukatpally, Hyderabad - 500 072.";
            string subheader3 = "email:calibertech@mms.com";

            string itemInfo = "Item Details";
            string purchaseInfo = "Purchase Details";

            // set margins
            header = header.PadLeft(40);
            subheader1 = subheader1.PadLeft(60);
            subheader3 = subheader3.PadLeft(90);


            // set header names with styles //

            Paragraph head = new Paragraph(header + "\n", mainHeader);
            Paragraph subhead = new Paragraph(subheader1 + subheader2 + "\n", subHeader);
            Paragraph subhead2 = new Paragraph(subheader3 + "\n", mailsubHeader);

           
            // get farmer and request details and set font style//
            Paragraph fName = new Paragraph(purchaseResponse.PurchaseReference, mailsubHeader);

           // align Purchase Order details and request details
            Chunk c1 = new Chunk("Purchase Reference :");
            Chunk fc = new Chunk(" " + purchaseResponse.PurchaseReference + "\n", detailstyle);
            c1.Content.PadLeft(30);

            Chunk c2 = new Chunk("Project Name :");
            Chunk fn = new Chunk(" " + project.Name1 + "\n", detailstyle);
            c2.Content.PadLeft(30);

            Chunk c3 = new Chunk("Store Name :");
            Chunk rqc = new Chunk(" " + store.Name1 + "\n", detailstyle);
            c3.Content.PadLeft(30);

            Chunk c4 = new Chunk("Supplier Name:");
            Chunk rqd = new Chunk(" " + supplier.Name1 + "\n", detailstyle);
            c4.Content.PadLeft(30);

            Chunk c5 = new Chunk("Supplier Address:");
            Chunk rqs = new Chunk(" " + supplier.Address + "\n", detailstyle);
            c5.Content.PadLeft(30);

            DateTime DateAr = purchaseResponse.ArrivingDate;

            Chunk c6 = new Chunk("Arriving Date:");
            Chunk rqa = new Chunk(" " + DateAr.ToString("dd/MM/yyyy") + "\n", detailstyle);
            c6.Content.PadLeft(30);
           
            //Chunk glue = new Chunk(new VerticalPositionMark());
            //Phrase ph = new Phrase();
            //ph.Add(new Chunk(Environment.NewLine));

            //Phrase ph1 = new Phrase();
            //ph1.Add(new Chunk(Environment.NewLine));

            //Phrase ph2 = new Phrase();
            //ph1.Add(new Chunk(Environment.NewLine));

            //string reference = "Purchase Reference : " + purchaseResponse.PurchaseReference.ToString();
            //string projectname = "Project Name: " + project.Name1.ToString();
            //string storename = "Store Name: " + store.Name1.ToString();
            //string suppliername = "Supplier Name: " + supplier.Name1.ToString();
            //string supplierAddress = "Supplier Address: " + supplier.Address.ToString();
            //DateTime DateAr = purchaseResponse.ArrivingDate;
            //string arrivingDate = "Arriving Date: " + DateAr.ToString("dd/MM/yyyy");



            //Paragraph main = new Paragraph();
            //ph.Add(new Chunk(reference));
            //ph.Add(glue);
            //glue.Content.PadLeft(100);
            //ph.Add(new Chunk(projectname));

            //Paragraph main1 = new Paragraph();
            //ph1.Add(new Chunk(storename));
            //ph1.Add(glue);
            //glue.Content.PadLeft(100);
            //ph1.Add(new Chunk(suppliername));

            //Paragraph main2 = new Paragraph();
            //ph2.Add(new Chunk(supplierAddress));
            //glue.Content.PadLeft(100);
            //ph2.Add(glue);
            //ph2.Add(new Chunk(arrivingDate));

            //main.Add(ph);
            //main1.Add(ph1);
            //main2.Add(ph2);

            Paragraph purchaseData = new Paragraph(purchaseInfo, fontTitle);

            Paragraph quiclpay = new Paragraph(itemInfo, fontTitle);
            BaseColor bc = new BaseColor(5);

            pdfDoc.Add(head);
            pdfDoc.Add(subhead);
            pdfDoc.Add(subhead2);
            pdfDoc.Add(purchaseData);
            //pdfDoc.Add(main);
            //pdfDoc.Add(main1);
            //pdfDoc.Add(main2);
            pdfDoc.Add(c1);
            pdfDoc.Add(fc);
            pdfDoc.Add(c2);
            pdfDoc.Add(fn);
            pdfDoc.Add(c3);
            pdfDoc.Add(rqc);
            pdfDoc.Add(c4);
            pdfDoc.Add(rqd);
            pdfDoc.Add(c5);
            pdfDoc.Add(rqs);
            pdfDoc.Add(c6);
            pdfDoc.Add(rqa);
            // pdfDoc.Add(para);
            // pdfDoc.Add(colTable);
            pdfDoc.Add(quiclpay);
            pdfDoc.Add(table);
            pdfDoc.Close();
            pdfWriter.Close();
            ms.Close();
            return ms.ToArray();
        }


    }
}
