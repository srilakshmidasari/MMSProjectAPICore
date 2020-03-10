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

using DAL.Helpers;
using CoreHtmlToImage;
using Microsoft.EntityFrameworkCore;

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
                                  BillingAddress = po.BillingAddress,
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
                var purchaseExists = _appContext.PurchageOrders.Where(x => x.PurchaseReference == purchages.PurchaseReference).FirstOrDefault();
                if (purchaseExists == null)
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
                    // string message = EmailTemplates.GetPurchaseOrder(pro.PurchaseReference, pro.ArrivingDate, project.Name1, supplier.Name1, supplier.Address, store.Name1, pro.BillingAddress, pro.ShippingAddress, items, null);

                    // string message = EmailTemplates.GetPurchaseOrder(pro.PurchaseReference, pro.ArrivingDate, project.Name1, supplier.Name1, supplier.Address, store.Name1, pro.BillingAddress, pro.ShippingAddress, items.ItemName, items.Quantity, items.ExpectedCost, items.Comments, null);
                    byteArray = GeneratePurchaseOrderPdf(pro, supplier, items, project, store);
                    if (byteArray != null)
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

                        pro.FileName = repo.UploadFile(byteArray, pro.FileExtention, Location);

                        pro.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                        _appContext.SaveChanges();

                        //var converter = new HtmlConverter();
                        //var html = message;

                        //Byte[] bytes = converter.FromHtmlString(html);

                        //string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);

                        //string ImageUrl = "data:image/png;base64," + base64String;

                        //byte[] FileBytes = Convert.FromBase64String(base64String);

                        //pro.FileName = repo.UploadFile(FileBytes, pro.FileExtention, Location);

                        //pro.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                        //_appContext.SaveChanges();
                    }


                    if (pro != null)
                    {
                        response.Result = string.Format("{0}/{1}/{2}{3}", FileRepoBaseUrl, pro.FileLocation, pro.FileName, pro.FileExtention);
                        response.IsSuccess = true;
                        response.AffectedRecords = 1;
                        response.EndUserMessage = "Purchage Order Added Successfully";
                    }
                    else
                    {
                        response.IsSuccess = true;
                        response.AffectedRecords = 0;
                        response.EndUserMessage = "Purchage Order Added Failed";
                    }
                }
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Purchage Order Reference Already Exists";
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
                var purchaseExists = _appContext.PurchageOrders.Where(x => x.Id != purchages.Id && x.PurchaseReference == purchages.PurchaseReference).FirstOrDefault();
                if (purchaseExists == null)
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
                        result.BillingAddress = purchages.BillingAddress;
                        result.ShippingAddress = purchages.ShippingAddress;
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

                        //  string message = EmailTemplates.GetPurchaseOrder(pro.PurchaseReference, pro.ArrivingDate, project.Name1, supplier.Name1, supplier.Address, store.Name1, pro.BillingAddress, pro.ShippingAddress, items.ItemName, items.Quantity, items.ExpectedCost, items.Comments, null);
                        // string message = EmailTemplates.GetPurchaseOrder(pro.PurchaseReference, pro.ArrivingDate, project.Name1, supplier.Name1, supplier.Address, store.Name1, pro.BillingAddress, pro.ShippingAddress, items, null);
                        byteArray = GeneratePurchaseOrderPdf(pro, supplier, items, project, store);

                        if (byteArray != null)
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

                            //var converter = new HtmlConverter();
                            //var html = message;

                            //Byte[] bytes = converter.FromHtmlString(html);

                            //string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);

                            //string ImageUrl = "data:image/png;base64," + base64String;

                            //byte[] FileBytes = Convert.FromBase64String(base64String);


                            //result.FileName = repo.UploadFile(FileBytes, pro.FileExtention, Location);


                            //result.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                            //_appContext.SaveChanges();



                            result.FileName = repo.UploadFile(byteArray, pro.FileExtention, Location);

                            result.FileLocation = Path.Combine(yearName, monthName, dayName, ModuleName);

                            _appContext.SaveChanges();
                        }



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
                else
                {
                    response.IsSuccess = false;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Purchage Order Reference Already Exists";
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
                if (ast != null)
                {
                    _appContext.PurchageItemXrefs.RemoveRange(ast);

                    var inventoryItems = _appContext.Inventories.Where(x => x.PurchaseOrderId == PurchaseId).ToList();
                    _appContext.Inventories.RemoveRange(inventoryItems);

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
                var res = _appContext.Inventories.GroupBy(n => new { n.PurchaseOrderId, n.ItemId })
                .Select(g => new
                {
                    PurchaseOrderId = g.Key.PurchaseOrderId,   
                    ItemId = g.Key.ItemId,
                    ReceivedCost = 0,
                    Quantity = g.Sum(x => x.Quantity)
                }).Where(x => x.PurchaseOrderId == purchaseId).ToList();

                //var res = _appContext.Inventories.GroupBy(n => new { n.PurchaseOrderId, n.ItemId,  n.ReceivedCost, n.Quantity })
                //.Select(g => new
                //{
                //    PurchaseOrderId = g.Key.PurchaseOrderId,
                //    ItemId = g.Key.ItemId,
                //    ReceivedCost = g.Key.ReceivedCost,
                //    Quantity = g.Key.Quantity
                //}).Where(x => x.PurchaseOrderId == purchaseId).ToList();

                var result = (from pi in _appContext.PurchageItemXrefs.Include(x=>x.Item_Id).Include(x=>x.Purchage_Id).Where(x=>x.PurchageId== purchaseId).ToList()
                              join iv in res on pi.ItemId equals iv.ItemId into Details
                              from m in Details.DefaultIfEmpty()
                              select new GetItemsResponse
                              {
                                  PurchaseId = pi.PurchageId,
                                  PurchaseReference = pi.Purchage_Id.PurchaseReference,
                                  ItemReference = pi.Item_Id.ItemReference,
                                  ItemId = pi.ItemId,
                                  ItemName = pi.Item_Id.Name1,
                                  Quantity = pi.Quantity,
                                  ExpectedCost = pi.ExpectdCost,
                                  Comments = pi.Comments,
                                  RemainingQuantity = m != null ? pi.Quantity - m.Quantity: 0,
                                  ReceivedQuantity = m!=null?0:0,
                                  ReceivedCost = m != null ? 0.0 : 0.0

                              }).Where(x => x.PurchaseId == purchaseId).Distinct().ToList();

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


        public ValueDataResponse<List<Inventory>> UpdateInventory(List<Inventory> inventory)
        {
            ValueDataResponse<List<Inventory>> response = new ValueDataResponse<List<Inventory>>();

            try
            {
                foreach (var it in inventory)
                {
                    _appContext.Inventories.Add(new Inventory
                    {
                        PurchaseOrderId = it.PurchaseOrderId,
                        ItemId = it.ItemId,
                        Quantity = it.Quantity,
                        ReceivedCost = it.ReceivedCost
                    });

                    _appContext.SaveChanges();
                }
                if (inventory != null)
                {
                    response.Result = inventory;
                    response.IsSuccess = true;
                    response.AffectedRecords = 1;
                    response.EndUserMessage = "Inventory Updated Successfully";
                }
                else
                {
                    response.IsSuccess = true;
                    response.AffectedRecords = 0;
                    response.EndUserMessage = "Inventory Updatiton Failed";
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



        public byte[] GeneratePurchaseOrderPdf(PurchageOrder purchase, Supplier supplier, List<GetItemsResponse> itemData, Project project, LookUp store)
        {
            //**** genarate pdf *********
            // to develop this functionality use itextsharp dll from nuget package //

            // create instance for memory streem to read pdf file // 
            System.IO.MemoryStream ms = new System.IO.MemoryStream();

            // create  instance for pdf document genaration //
            Document pdfDoc = new Document(PageSize.A4, 35, 10, 25, 10);
            //  PdfPCell cell1 = null;
            // PdfPTable table1 = null;
            // PdfPTable table2 = null;

            /* Item Table Styles start */

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

            /* Item Table Styles End */

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
            colTable.DefaultCell.Border = 0;


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


            // Add Table And Styles Item Table //
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

            PdfPTable mtable = new PdfPTable(2);
            mtable.WidthPercentage = 100;
            mtable.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

            PdfPTable table1 = new PdfPTable(2);
            table.WidthPercentage = 100;
            PdfPCell cell1 = new PdfPCell(new Phrase(""));
            cell1.BorderColor = BaseColor.WHITE;

            table1.AddCell(PhraseCell(new Phrase("Purchase Reference:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table1.AddCell(PhraseCell(new Phrase(purchase.PurchaseReference, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell1 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell1.Colspan = 2;
            cell1.PaddingBottom = 10f;
            table1.AddCell(cell1);
            mtable.AddCell(table1);


            PdfPTable table2 = new PdfPTable(2);
            table2.WidthPercentage = 100;
            PdfPCell cell2 = new PdfPCell(new Phrase(""));
            cell1.BorderColor = BaseColor.WHITE;
            table2.AddCell(PhraseCell(new Phrase("Project Name:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table2.AddCell(PhraseCell(new Phrase(project.Name1, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell2 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell2.Colspan = 2;
            cell2.PaddingBottom = 10f;
            table2.AddCell(cell1);
            mtable.AddCell(table2);

            PdfPTable mtable1 = new PdfPTable(2);
            mtable1.WidthPercentage = 100;
            mtable1.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

            PdfPTable table3 = new PdfPTable(2);
            table3.WidthPercentage = 100;
            PdfPCell cell3 = new PdfPCell(new Phrase(""));
            cell3.BorderColor = BaseColor.WHITE;

            table3.AddCell(PhraseCell(new Phrase("Store Name:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table3.AddCell(PhraseCell(new Phrase(store.Name1, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell3 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell3.Colspan = 2;
            cell3.PaddingBottom = 10f;
            table3.AddCell(cell3);
            mtable1.AddCell(table3);


            PdfPTable table4 = new PdfPTable(2);
            table4.WidthPercentage = 100;
            PdfPCell cell4 = new PdfPCell(new Phrase(""));
            cell4.BorderColor = BaseColor.WHITE;
            DateTime Date = purchase.ArrivingDate;
            table4.AddCell(PhraseCell(new Phrase("Arriving Date:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table4.AddCell(PhraseCell(new Phrase(Date.ToString("dd/MM/yyyy"), FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell4 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell4.Colspan = 2;
            cell4.PaddingBottom = 10f;
            table4.AddCell(cell4);
            mtable1.AddCell(table4);

            PdfPTable mtable2 = new PdfPTable(2);
            mtable2.WidthPercentage = 100;
            mtable2.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

            PdfPTable table5 = new PdfPTable(2);
            table5.WidthPercentage = 100;
            PdfPCell cell5 = new PdfPCell(new Phrase(""));
            cell5.BorderColor = BaseColor.WHITE;

            table5.AddCell(PhraseCell(new Phrase("Supplier Name:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table5.AddCell(PhraseCell(new Phrase(supplier.Name1, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell5 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell5.Colspan = 2;
            cell5.PaddingBottom = 10f;
            table5.AddCell(cell5);
            mtable2.AddCell(table5);


            PdfPTable table6 = new PdfPTable(2);
            table6.WidthPercentage = 100;
            PdfPCell cell6 = new PdfPCell(new Phrase(""));
            cell6.BorderColor = BaseColor.WHITE;

            table6.AddCell(PhraseCell(new Phrase("Supplier Address:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table6.AddCell(PhraseCell(new Phrase(supplier.Address, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell6 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell6.Colspan = 2;
            cell6.PaddingBottom = 10f;
            table6.AddCell(cell6);
            mtable2.AddCell(table6);

            PdfPTable mtable3 = new PdfPTable(2);
            mtable3.WidthPercentage = 100;
            mtable3.DefaultCell.Border = iTextSharp.text.Rectangle.NO_BORDER;

            PdfPTable table7 = new PdfPTable(2);
            table7.WidthPercentage = 100;
            PdfPCell cell7 = new PdfPCell(new Phrase(""));
            cell7.BorderColor = BaseColor.WHITE;

            table7.AddCell(PhraseCell(new Phrase("Billing Address:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table7.AddCell(PhraseCell(new Phrase(purchase.BillingAddress, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell7 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell7.Colspan = 2;
            cell7.PaddingBottom = 10f;
            table7.AddCell(cell7);
            mtable3.AddCell(table7);


            PdfPTable table8 = new PdfPTable(2);
            table6.WidthPercentage = 100;
            PdfPCell cell8 = new PdfPCell(new Phrase(""));
            cell8.BorderColor = BaseColor.WHITE;

            table8.AddCell(PhraseCell(new Phrase("Shipping Address:", FontFactory.GetFont("Arial", 10, Font.BOLD, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            table8.AddCell(PhraseCell(new Phrase(purchase.ShippingAddress, FontFactory.GetFont("Arial", 11, Font.NORMAL, BaseColor.BLACK)), PdfPCell.ALIGN_LEFT));
            cell8 = PhraseCell(new Phrase(), PdfPCell.ALIGN_CENTER);
            cell8.Colspan = 2;
            cell8.PaddingBottom = 10f;
            table8.AddCell(cell8);
            mtable3.AddCell(table8);





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

            subhead2.SpacingAfter = 10;

            Paragraph purchaseData = new Paragraph(purchaseInfo, fontTitle);

            purchaseData.SpacingAfter = 10;


            Paragraph itemHeader = new Paragraph(itemInfo, fontTitle);

            itemHeader.SpacingAfter = 10;

            BaseColor bc = new BaseColor(5);

            pdfDoc.Add(head);
            pdfDoc.Add(subhead);
            pdfDoc.Add(subhead2);
            pdfDoc.Add(purchaseData);
            pdfDoc.Add(mtable);
            pdfDoc.Add(mtable1);
            pdfDoc.Add(mtable2);
            pdfDoc.Add(mtable3);
            pdfDoc.Add(itemHeader);
            pdfDoc.Add(table);
            pdfDoc.Close();
            pdfWriter.Close();
            ms.Close();
            return ms.ToArray();
        }

        private static PdfPCell PhraseCell(Phrase phrase, int align)
        {
            PdfPCell cell = new PdfPCell(phrase);
            cell.BorderColor = BaseColor.WHITE;
            cell.VerticalAlignment = Element.ALIGN_TOP;
            cell.HorizontalAlignment = align;
            cell.PaddingBottom = 2f;
            cell.PaddingTop = 0f;
            return cell;
        }

    }
}
