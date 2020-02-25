﻿using AutoMapper;
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
                              join t in _appContext.TypeCdDmts on po.StatusTypeId equals t.TypeCdDmtId
                              select new GetPurchageResponse
                              {
                                  Id = po.Id,
                                  SupplierId = po.SupplierId,
                                  PurchaseReference = po.PurchaseReference,
                                  SupplierName = s.Name1,
                                  SupplierAddress = s.Address,
                                  StatusTypeId = po.StatusTypeId,
                                  StatusName = t.Description,
                                  ArrivingDate = po.ArrivingDate,
                                  IsActive = po.IsActive,
                                  CreatedBy = po.CreatedBy,
                                  CreatedDate = po.CreatedDate,
                                  UpdatedBy = po.UpdatedBy,
                                  UpdatedDate = po.UpdatedDate,

                              }).ToList();

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

        public ValueDataResponse<PurchageOrder> InsertPurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();
            byte[] byteArray = null;
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
                        ExpectdCost = it.ExpectdCost
                    });
                }
                _appContext.SaveChanges();

                if (pro != null)
                {
                    response.Result = pro;
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

        public ValueDataResponse<PurchageOrder> UpdatePurchaseOrder(UpsertPurchaseOrder purchages)
        {
            ValueDataResponse<PurchageOrder> response = new ValueDataResponse<PurchageOrder>();

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
                        ExpectdCost = it.ExpectdCost
                    });
                }
                if (result != null)
                {
                    result.SupplierId = purchages.SupplierId;
                    result.IsActive = purchages.IsActive;
                    result.CreatedBy = purchages.CreatedBy;
                    result.CreatedDate = purchages.CreatedDate;
                    result.UpdatedBy = purchages.UpdatedBy;
                    result.UpdatedDate = purchages.UpdatedDate;
                    result.ArrivingDate = purchages.ArrivingDate;
                    result.PurchaseReference = purchages.PurchaseReference;
                    _appContext.SaveChanges();

                    if (pro != null)
                    {
                        response.Result = pro;
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

        public ValueDataResponse<string> GetPurchageItemsPdf(int purchaseId)
        {
            ValueDataResponse<string> response = new ValueDataResponse<string>();           
                var purchaseDetails = _appContext.PurchageOrders.Where(x => x.Id == purchaseId).FirstOrDefault();

                var supplierDetails = _appContext.Suppliers.Where(x => x.Id == purchaseDetails.SupplierId).FirstOrDefault();

                var result = (from pi in _appContext.PurchageItemXrefs
                              join i in _appContext.Items on pi.ItemId equals i.Id
                              join p in _appContext.PurchageOrders on pi.PurchageId equals p.Id
                              select new GetItemsResponse
                              {
                                  Id = pi.Id,
                                  ItemId = pi.ItemId,
                                  ItemName = i.Name1,
                                  ItemReference = i.ItemReference,
                                  Quantity = pi.Quantity,
                                  ExpectedCost = pi.ExpectdCost,

                              }).Where(x => x.PurchaseId == purchaseId).ToList();

                var pdfResponse = GeneratePurchaseOrderPdf(purchaseDetails, supplierDetails, result);
            return response;
        }

        public byte[] GeneratePurchaseOrderPdf(PurchageOrder purchaseResponse, Supplier supplier, List<GetItemsResponse> itemData)
        {
            //**** genarate pdf *********
            // to develop this functionality use itextsharp dll from nuget package //

            // create instance for memory streem to read pdf file // 
            System.IO.MemoryStream ms = new System.IO.MemoryStream();

            // create  instance for pdf document genaration //
            Document pdfDoc = new Document(PageSize.A4, 35, 10, 25, 10);

            // create instance for table structure
            PdfPTable table = new PdfPTable(2);

            //actual width of table in points
            table.TotalWidth = 216f;

            //fix the absolute width of the table
            table.LockedWidth = true;

            //set col widths in proportions - 1/3 and 2/3
            float[] widths = new float[] { 2f, 1f };
            table.SetWidths(widths);
            table.HorizontalAlignment = 0;

            //leave a gap before and after the table
            table.SpacingBefore = 10f;

            //table.SpacingAfter = 30f;

            table.SetWidths(widths);


            // create instance for Collection table structure
            PdfPTable colTable = new PdfPTable(3);

            //actual width of table in points
            colTable.TotalWidth = 420f;

            //fix the absolute width of the table
            colTable.LockedWidth = true;

            //set col widths in proportions - 1/3 and 2/3
            float[] colWidths = new float[] { 3f, 1f, 1f };
            colTable.SetWidths(colWidths);
            colTable.HorizontalAlignment = 0;

            //leave a gap before and after the table
            colTable.SpacingBefore = 10f;

            //colTable.SpacingAfter = 30f;

            colTable.SetWidths(colWidths);

            // to write pdf file //
            PdfWriter pdfWriter = PdfWriter.GetInstance(pdfDoc, ms);

            // open for document //
            pdfDoc.Open();

            // ** set water mark ** //
            string watermarkText = "Caliber Tech";
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
            PdfPCell colCell = new PdfPCell(new Phrase("Supplier", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);
            colCell = new PdfPCell(new Phrase(1, "Address ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);
            colCell = new PdfPCell(new Phrase(1, "Mobile Number ", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            colTable.AddCell(colCell);




            // Add Table And Styles //
            PdfPCell cell = new PdfPCell(new Phrase("ItemName", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            //cell.HorizontalAlignment = Element.ALIGN_LEFT;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(1, "Quantity", FontFactory.GetFont("Arial", 12, iTextSharp.text.Font.BOLD, BaseColor.BLACK)));
            //cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            table.AddCell(cell);


            cell = new PdfPCell(new Phrase("ExpectedCost"));
            //cell.HorizontalAlignment = Element.ALIGN_LEFT;
            table.AddCell(cell);
            cell = new PdfPCell(new Phrase(Convert.ToString(Math.Round((decimal)itemData.Select(x => x.ExpectedCost).FirstOrDefault(), 3))));
            //cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            table.AddCell(cell);

            // set font style 
            Font mainHeader = FontFactory.GetFont("Calibri", 20, Font.BOLD, BaseColor.BLACK);
            Font subHeader = FontFactory.GetFont("Calibri", 10, Font.BOLD, BaseColor.BLACK);
            Font mailsubHeader = FontFactory.GetFont("Calibri", 9, Font.BOLD, BaseColor.BLACK);
            Font fontHeader = FontFactory.GetFont("Calibri", 15, Font.BOLD, new BaseColor(0, 25, 51));
            Font fontTitle = FontFactory.GetFont("Calibri", 12, Font.BOLD, new BaseColor(12, 95, 151));
            Font detailstyle = FontFactory.GetFont("Calibri", 10, Font.BOLD);

            // ** set logo ** //
            // string logo = "";
            string logo = "http://183.82.111.111/MMS/assets/images/arkaan-logo-blue.png";

            //string logo = ConfigurationManager.AppSettings["ServerRootPath"].ToString()+"\\"+ "3FLogo.png";
            string header = "CALIBAR MAINTENANCE MANAGEMENT SYSTEM";
            string subheader3 = "email:caliberTech@mms.com";
            string quickpayName = "Item Details";
            string collectionInfo = "Supplier(s) Details";
            string singatureName = "(Signature)";

            subheader3 = subheader3.PadLeft(90);
            singatureName = singatureName.PadLeft(410);



            // set header names with styles //
            Paragraph head = new Paragraph(header + "\n", mainHeader);
            //Paragraph subhead = new Paragraph(subheader1 + subheader2 + "\n", subHeader);
            Paragraph subhead2 = new Paragraph(subheader3 + "\n", mailsubHeader);


            // get farmer and request details and set font style//
            //Paragraph fName = new Paragraph(req.PurchaseReference, mailsubHeader);
            //// Paragraph fCode = new Paragraph(req.FarmerCode, mailsubHeader);
            //Paragraph reqCode = new Paragraph(requestCode, mailsubHeader);
            //Paragraph reqDate = new Paragraph(DateTime.Now.ToString("dd/MM/yyyy") + "\n\n", mailsubHeader);

            // align farmer details and request details
            Chunk c1 = new Chunk("Purchase Reference :");
            Chunk fc = new Chunk(" " + purchaseResponse.PurchaseReference + "\n", detailstyle);

            Paragraph unpaidCollections = new Paragraph(collectionInfo, fontTitle);

            //foreach(var uc in unpaidCollectionsInfo.ListResult)
            //{
            //    Paragraph colId = new Paragraph("Collection Id : " + uc.CollectionId + "\n", mailsubHeader);
            //    Paragraph ColWeight = new Paragraph("Net Weight (MT) : " + req.FarmerCode + "\n", mailsubHeader);
            //}

            Paragraph quiclpay = new Paragraph(quickpayName, fontTitle);
            BaseColor bc = new BaseColor(5);

            System.Drawing.Image oldlogog = System.Drawing.Image.FromFile(logo);
            Image newlogo = Image.GetInstance(oldlogog, bc, false);
            newlogo.ScaleToFit(45f, 45f);
            //newlogo.Border = iTextSharp.text.Rectangle.BOX;
            //newlogo.BorderColor = iTextSharp.text.BaseColor.BLACK;
            //newlogo.BorderWidth = 5f;
            newlogo.Alignment = Image.TEXTWRAP | Image.ALIGN_LEFT | Image.ALIGN_TOP;
            newlogo.IndentationLeft = 50f;
            newlogo.SpacingAfter = 20f;
            newlogo.SpacingBefore = 20f;
            Paragraph singaturename = new Paragraph("\n\n\n" + singatureName);

            pdfDoc.Add(newlogo);
            pdfDoc.Add(head);
            pdfDoc.Add(subhead2);
            pdfDoc.Add(c1);
            pdfDoc.Add(fc);
            pdfDoc.Add(unpaidCollections);
            pdfDoc.Add(colTable);
            pdfDoc.Add(quiclpay);
            pdfDoc.Add(table);
            pdfDoc.Close();
            pdfWriter.Close();
            ms.Close();
            return ms.ToArray();
        }
    }
}
