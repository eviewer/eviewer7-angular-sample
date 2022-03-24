import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IntegrationService } from './integration.service';
import { HttpClient } from '@angular/common/http';
import {
  DocumentService,
  EditingService,
  eViewerApp,
  ViewerPreferenceService,
  AnnotationService,
  StatusService,
} from '@mstechusa/eviewer7-cli';
import { Router } from '@angular/router';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css'],
})
export class IntegrationComponent implements OnInit {
  @ViewChild('uploadForm') uploadFormDetail: NgForm;
  @ViewChild('annotationForm') annotationFormDetail: NgForm;
  @ViewChild('gotoPageForm') gotoPageFormDetail: NgForm;
  @ViewChild('insertForm') insertFormDetail: NgForm;
  @ViewChild('saveForm') saveFormDetail: NgForm;
  @ViewChild('splitForm') splitFormDetail: NgForm;
  @ViewChild('loadViewerForm') loadViewerForm: NgForm;
  @ViewChild('totalPageForm') totalPageForm: NgForm;
  @ViewChild('deleteGroupForm') deleteGroupForm: NgForm;
  @ViewChild('deleteAllGroupForm') deleteAllGroupForm: NgForm;
  @ViewChild('scanDocumentForm') scanDocumentForm: NgForm;
  @ViewChild('textSearchForm') textSearchForm: NgForm;
  @ViewChild('exportForm') exportForm: NgForm;
  @ViewChild('deleteAnnForm') deleteAnnForm: NgForm;
  @ViewChild('editAnnForm') editAnnForm: NgForm;
  @ViewChild('addReplyAnnForm') addReplyAnnForm: NgForm;
  @ViewChild('getAllReplies') getAllRepliesForm: NgForm;
  @ViewChild('stampTextForm') stampTextForm: NgForm;
  @ViewChild('printDocumentForm') printDocumentForm: NgForm;
  @ViewChild('userPrefForm') userPrefForm: NgForm;
  @ViewChild('multiAnnotationForm') multiAnnotationForm: NgForm;
  @ViewChild('multiStampTextForm') multiStampTextForm: NgForm;
  @ViewChild('commentUpdateForm') commentUpdateForm: NgForm;
  @ViewChild('replyUpdateForm') replyUpdateForm: NgForm;
  @ViewChild('removeReplyForm') removeReplyForm: NgForm;
  @ViewChild('removeAllReplyForm') removeAllReplyForm: NgForm;
  @ViewChild('getReplyByUserForm') getReplyByUserForm: NgForm;
  @ViewChild('getAllAnnForm') getAllAnnForm: NgForm;
  @ViewChild('getAnnDetailForm') getAnnDetailForm: NgForm;
  @ViewChild('getFilteredAnnForm') getFilteredAnnForm: NgForm;
  @ViewChild('replyAddForm') replyAddForm: NgForm;

  public selectedOption = '';
  private isHideToolBar = false;
  // private files: File[];
  public fileName = '';
  public exportDocName = 'export';
  public isViewerLoad = false;
  public isAnnotation = false;
  public selectedAnnotation: string = null;
  public selectedMultiAnnotation: string = null;
  isTextInput = false;
  isTextInputForMultiPage = false;
  isDeleteAnn = false;
  isEditAnn = false;
  addReplyToAnn = false;
  getAllRepliesFromAnn = false;
  isImageStamp = false;
  isMultiAnnotation = false;
  isCommentToUpdate = false;
  updateAnnComment = false;
  updateAnnReply = false;
  removeReplyId = false;
  removeAllReplyByAnnId = false;
  getReplyByUser = false;
  isGetAllAnn = false;
  isGetAnnDetails = false;
  isGetFilteredAnn = false;
  addAnnReply = false;
  viewerServerURL: any;
  file: any;
  fileUrl: string | ArrayBuffer;
  height: any;
  width: any;
  showHideToolbar = 'HideToolBar';
  stampArray = [];

  constructor(
    private integrationService: IntegrationService,
    private httpClient: HttpClient,
    private eViewer_App: eViewerApp,
    private viewer_preference: ViewerPreferenceService,
    private documentService: DocumentService,
    private editingService: EditingService,
    private router: Router,
    private annotationService: AnnotationService,
    private stService: StatusService
  ) {}

  loadViewer() {
    let savingEndPoint = this.loadViewerForm.value.savingEndpoint;
    let viewerServerURL = this.loadViewerForm.value.viewerServerURL;
    const authToken = this.loadViewerForm.value.authToken;
    const userName = this.loadViewerForm.value.userName;
    const saveMultipartPayLoadType =
      this.loadViewerForm.value.savePayloadMultipart;
    const hideToolBar = false;
    let savePayloadType = 'application/json';

    if (saveMultipartPayLoadType === true) {
      savePayloadType = 'multipart/form-data';
    }
    let options = {
      type: 'GET',
      headers: {
        Authorization: 'Bearer ' + authToken,
        Accept: 'application/octet-stream.',
      },
      savePayLoadType: savePayloadType,
    };

    this.eViewer_App.loadViewer();

    this.eViewer_App.setDocumentEndPointOptions(
      viewerServerURL,
      savingEndPoint,
      userName,
      '',
      options,
      hideToolBar
    );

    this.isViewerLoad = true;
  }

  ngOnInit() {}

  deleteAnnotion() {
    this.isDeleteAnn = true;
  }

  onEditAnnotation() {
    this.isEditAnn = true;
  }

  getAllReplies() {
    this.getAllRepliesFromAnn = true;
  }

  updateComment() {
    this.isCommentToUpdate = true;
  }

  removeReply(): void {
    this.removeReplyId = true;
  }

  removeAllReply(): void {
    this.removeAllReplyByAnnId = true;
  }

  getReply(): void {
    this.getReplyByUser = true;
  }

  getAllAnn(): void {
    this.isGetAllAnn = true;
  }

  getAnnDetails(): void {
    this.isGetAnnDetails = true;
  }

  getFilteredAnn(): void {
    this.isGetFilteredAnn = true;
  }

  imageStamp(): void {
    const iThis = this;
    this.annotationService.getStamps(undefined);
    setTimeout(() => {
      iThis.stampArray = [];
      iThis.stampArray.push(this.stService.stampDetailsArray);
      iThis.isImageStamp = true;
    }, 50);
  }

  chooseStamps(event): void {
    const stampValue = event.target.value;
    const stampDetails = this.stService.stampDetailsArray;
    const stampInfo = {
      stampType: 'imageStamp',
      info: [],
    };
    stampDetails[0].forEach((stamp) => {
      if (stamp.stampName === stampValue) {
        stampInfo.info.push(stamp);
      }
    });
    switch (stampValue) {
      case 'Approved':
      case 'Question':
      case 'Warning':
      case 'Confidential':
      case 'Denied':
      case 'Initial':
      case 'Initial Left':
      case 'Initail Right':
      case 'Pending':
      case 'Received':
      case 'SignHere Left':
      case 'SignHere Right':
      case 'Urgent':
        this.selectedMultiAnnotation = 'imageStamp';
        this.annotationService.selectShape(
          this.selectedMultiAnnotation,
          stampInfo
        );
        this.isImageStamp = false;
        break;

      default:
        break;
    }
  }

  drawMultiAnnotation() {
    this.isMultiAnnotation = true;
  }

  submitDeleteAnnDetails() {
    const annId: string = this.deleteAnnForm.value.annId;
    const pageNO: number = +this.deleteAnnForm.value.pageNO;
    this.annotationService.deleteShape(pageNO, annId);

    this.isDeleteAnn = false;
  }

  submitEditDetails() {
    let options = {
      borderWidth: +this.editAnnForm.value.borderWidth,
      borderColor: this.editAnnForm.value.borderColor,
      fillColor: this.editAnnForm.value.fillColor,
      // text: optionValue[3],
      opacity: +this.editAnnForm.value.opacity,
      fontFace: this.editAnnForm.value.fontFace,
      fontSize: +this.editAnnForm.value.fontSize,
      FontColor: this.editAnnForm.value.fontColor,
      // image: "BASE64STRING or relative path to image"
    };
    if (
      options.borderWidth === 0 &&
      options.borderColor === '' &&
      options.fillColor === '' &&
      (isNaN(options.opacity) || this.editAnnForm.value.opacity === '') && // nilesh for Generic_eVewer7_2181: APINPM:S2,P2
      options.fontFace === '' &&
      options.fontSize === 0 &&
      options.FontColor === ''
    ) {
      options = undefined;
    }
    const annId: string = this.editAnnForm.value.annId;
    const pageNO: number = +this.editAnnForm.value.pageNO;
    let position = {
      X: +this.editAnnForm.value.annCanvasStartX, //434, //inputData.annCanvasStartX
      Width: +this.editAnnForm.value.annCanvasEndX, // 607, //inputData.annCanvasEndX
      Y: +this.editAnnForm.value.annCanvasStartY, //299, //inputData.annCanvasStartY
      Height: +this.editAnnForm.value.annCanvasEndY, // 446, //inputData.annCanvasEndY
    };

    this.annotationService.editShape(annId, pageNO, position, options);
    this.isEditAnn = false;
  }

  getAllRepliesFromAnndata() {
    let annId: string = this.getAllRepliesForm.value.annId;

    this.annotationService.getAllReplies(annId);
    this.getAllRepliesFromAnn = false;
  }

  selectMultiPageAnnotation(event): void {
    const annType = event.target.value;
    if (annType !== 'stamp') {
      this.selectedMultiAnnotation = annType;
    }

    if (annType === 'stamp') {
      this.selectedMultiAnnotation = null;
      this.isTextInputForMultiPage = true;
    } else if (annType === 'imageStamp') {
      this.selectedMultiAnnotation = null;
      this.imageStamp();
    } else {
      this.annotationService.selectShape(annType);
    }
  }

  OnUpdateCommentChange(event) {
    let value = event.target.value;
    switch (value) {
      case 'comment':
        this.updateAnnReply = false;
        this.addAnnReply = false;
        this.updateAnnComment = true;
        break;

      case 'addReply':
        this.updateAnnReply = false;
        this.updateAnnReply = false;
        this.addAnnReply = true;
        break;

      case 'reply':
        this.updateAnnComment = false;
        this.addAnnReply = false;
        this.updateAnnReply = true;
        break;
    }
  }

  submitCRUpdateDetails() {
    let textUpdate;
    let replyId;
    let annId;
    if (this.updateAnnComment) {
      annId = this.commentUpdateForm.value.annId;
      textUpdate = this.commentUpdateForm.value.inputText;
      this.annotationService.updateCommentOrReply(annId, textUpdate, replyId);
    }

    if (this.updateAnnReply) {
      annId = this.replyUpdateForm.value.annId;
      textUpdate = this.replyUpdateForm.value.inputText;
      replyId = this.replyUpdateForm.value.replyId;
      this.annotationService.updateCommentOrReply(annId, textUpdate, replyId);
    }

    if (this.addAnnReply) {
      annId = this.replyAddForm.value.annId;
      textUpdate = this.replyAddForm.value.inputText;
      this.annotationService.addReply(annId, textUpdate);
    }
    this.updateAnnComment = false;
    this.updateAnnReply = false;
    this.addAnnReply = false;
  }

  removeReplyByRId(): void {
    const replyId = this.removeReplyForm.value.replyId;
    const annId = this.removeReplyForm.value.annId;
    this.annotationService.removeReply(replyId, annId);
    this.removeReplyId = false;
  }

  removeAllReplyByAId(): void {
    const annId = this.removeAllReplyForm.value.annId;
    this.annotationService.removeAllReplies(annId);
    this.removeAllReplyByAnnId = false;
  }

  setDefaultValue(): void {
    this.isAnnotation = false;
    this.selectedAnnotation = null;
    this.selectedMultiAnnotation = null;
    this.isTextInput = false;
    this.isTextInputForMultiPage = false;
    this.isDeleteAnn = false;
    this.isEditAnn = false;
    this.addReplyToAnn = false;
    this.getAllRepliesFromAnn = false;
    this.isImageStamp = false;
    this.isMultiAnnotation = false;
    this.isCommentToUpdate = false;
    this.updateAnnComment = false;
    this.updateAnnReply = false;
    this.removeReplyId = false;
    this.removeAllReplyByAnnId = false;
    this.getReplyByUser = false;
    this.isGetAllAnn = false;
    this.isGetAnnDetails = false;
    this.isGetFilteredAnn = false;
  }

  getReplyByUsername(): void {
    const annId = this.getReplyByUserForm.value.annId;

    this.annotationService.getReplyByUser(annId);
    this.getReplyByUser = false;
  }

  getAllAnnotation(): void {
    const username = this.getAllAnnForm.value.userName;
    this.annotationService.getAllAnnotations(username);
    this.isGetAllAnn = false;
  }

  getAnnotationDetails(): void {
    const annId = this.getAnnDetailForm.value.annId;
    this.annotationService.getAnnotationDetails(annId);
    this.isGetAnnDetails = false;
  }

  getFilteredAnnotation(): void {
    const username = this.getFilteredAnnForm.value.userName;
    const anntype = this.getFilteredAnnForm.value.annType;
    const pageNo = this.getFilteredAnnForm.value.pageNo;

    let pageArray;
    const pageRange = [];
    if (pageNo.includes(',')) {
      pageArray = pageNo.split(',');
      pageArray.forEach((page) => {
        if (page.includes('-')) {
          page = page.split('-');
          let startPage = +page[0];
          const endPage = +page[1];
          for (startPage; startPage <= endPage; startPage++) {
            pageRange.push(startPage);
          }
        } else {
          pageRange.push(+page);
        }
      });
    } else {
      if (pageNo.includes('-')) {
        pageArray = pageNo.split('-');
        let startPage = +pageArray[0];
        const endPage = +pageArray[1];
        for (startPage; startPage <= endPage; startPage++) {
          pageRange.push(startPage);
        }
      } else {
        pageRange.push(+pageNo);
      }
    }

    this.annotationService.getAnnotationsByFilter(username, anntype, pageRange);
    this.isGetFilteredAnn = false;
  }

  chooseOption(event) {
    this.fileName = this.integrationService.docIds;
    this.selectedOption = event.target.value;

    // let inputData: any;
    this.setDefaultValue();
    switch (this.selectedOption) {
      case 'saveDoc':
        this.documentService.saveDocument();
        break;
      case 'viewerPreference':
        this.selectedOption = 'viewerPreference';
        // this.viewer_preference.setUserPreferences('');
        break;

      case 'nextPage':
        this.documentService.nextPage();
        break;

      case 'prevPage':
        this.documentService.prevPage();
        break;

      case 'firstPage':
        this.documentService.firstPage();
        break;

      case 'lastPage':
        this.documentService.lastPage();
        break;

      case 'getPageCount':
        const docId = this.stService.currentViewDocId;
        this.documentService.getPageCount(docId);
        break;

      case 'searchText':
        this.selectedOption = 'textSearch';
        // this.documentService.searchText(inputData.text);
        break;

      case 'insertDoc':
        let file: any = null;
        let fileUrl = null;
        this.documentService.insertDocument(file, fileUrl);
        break;

      case 'goToDocument':
        // this.documentService.gotoDocument();
        break;

      case 'appendDoc':
        this.documentService.appendDocument(this.file, this.fileUrl);
        break;

      case 'newDoc':
        this.documentService.newDocument('pdf');
        break;

      case 'getOpenDoc':
        this.documentService.getOpenDocuments();
        break;

      case 'getActiveDoc':
        this.documentService.getActiveDocument();
        break;

      case 'closeFile':
        const docID = this.stService.currentViewDocId;
        this.documentService.closeDocument(docID);
        break;

      case 'closeAllDoc':
        let docIDs: any = null;
        this.documentService.closeAllDocuments(docIDs);
        break;

      case 'saveAllDoc':
        this.documentService.saveAllDocuments();
        break;

      case 'zoomIn':
        this.editingService.zoomIn();
        break;

      case 'zoomOut':
        this.editingService.zoomOut();
        break;

      case 'rotateClockwise':
        this.editingService.rotateClockwise();
        break;

      case 'fitToWidth':
        this.editingService.zoomTo('Fit To Width');
        break;

      case 'fitToHeight':
        this.editingService.zoomTo('Fit To Height');
        break;

      case 'fitToWindow':
        this.editingService.zoomTo('Fit To Window');
        break;

      case 'ActualSize':
        this.editingService.zoomTo('Actual Size');
        break;

      case 'deletePage':
        this.editingService.deletePage();
        break;

      case 'copyPage':
        this.editingService.copyPage();
        break;

      case 'cutPage':
        this.editingService.cutPage();
        break;

      case 'pastePage':
        this.editingService.pastePage();
        break;

      case 'export':
        this.selectedOption = 'exportDocument';
        break;

      case 'printDocument':
        this.selectedOption = 'printDocument';

        break;

      // case 'hideToolBar':
      //   //this.eViewer_App.toggleThumbnail();
      //   this.isHideToolBar = !this.isHideToolBar;
      //   this.eViewer_App.showHideToolbar(this.isHideToolBar);
      //   break;

      case 'hideAnnotation':
        this.eViewer_App.hideAnnotations(true);
        break;

      case 'hideThumbnails':
        this.eViewer_App.hideThumbnails(true);
        break;

      case 'selectPanning':
        this.eViewer_App.selectPanning(true);
        break;

      case 'getAllReplies':
        this.getAllReplies();
        break;

      case 'updateComment':
        this.updateComment();
        break;

      case 'editAnnotation':
        this.onEditAnnotation();
        break;

      case 'drawMultiAnnotation':
        this.drawMultiAnnotation();
        break;

      case 'deleteAnnotation':
        this.deleteAnnotion();
        break;

      case 'removeReply':
        this.removeReply();
        break;

      case 'removeAllReply':
        this.removeAllReply();
        break;

      case 'getReplyFromUser':
        this.getReply();
        break;

      case 'getAllAnn':
        this.getAllAnn();
        break;

      case 'getAnnDetails':
        this.getAnnDetails();
        break;

      case 'getFilteredAnn':
        this.getFilteredAnn();
        break;

      default:
        break;
    }

    console.log(this.selectedOption);
  }

  onShowHideToolbar() {
    this.isHideToolBar = !this.isHideToolBar;
    this.eViewer_App.showHideToolbar(this.isHideToolBar);
    this.showHideToolbar =
      this.showHideToolbar === 'HideToolBar' ? 'ShowToolBar' : 'HideToolBar';
  }

  submitStampTextForMultiPage(): void {
    const annType = 'stamp';

    const stampData = {
      stampType: 'textStamp',
      info: [],
    };
    stampData.info.push(this.multiStampTextForm.value.inputText);
    this.annotationService.selectedStamp = 'default';
    this.annotationService.selectShape(annType, stampData);
    this.selectedMultiAnnotation = 'stamp';
    this.isTextInputForMultiPage = false;
  }

  drawMultiPageAnnotation(): void {
    let options = {
      borderWidth: +this.multiAnnotationForm.value.borderWidth,
      borderColor: this.multiAnnotationForm.value.borderColor,
      fillColor: this.multiAnnotationForm.value.fillColor,
      // text: optionValue[3],
      opacity: +this.multiAnnotationForm.value.opacity,
      fontFace: this.multiAnnotationForm.value.fontFace,
      fontSize: +this.multiAnnotationForm.value.fontSize,
      FontColor: this.multiAnnotationForm.value.fontColor,
      // image: "BASE64STRING or relative path to image"
    };
    
    if (this.multiAnnotationForm.value.opacity === '') {
      options.opacity = undefined;
    }
    if (
      (options.borderWidth === 0 || options.borderWidth === undefined) &&
      (options.borderColor === '' || options.borderColor === undefined) &&
      (options.fillColor === '' || options.fillColor === undefined) &&
      (options.opacity === undefined || isNaN(options.opacity)) &&
      (options.fontFace === '' || options.fontFace === undefined) &&
      (options.fontSize === 0 ||
        options.fontSize === undefined ||
        isNaN(options.fontSize)) &&
      (options.FontColor === '' || options.FontColor === undefined)
    ) {
      options = undefined;
    }
    const pageNo = this.multiAnnotationForm.value.pageNo;
    let pageArray;
    const pageRange = [];
    if (pageNo.includes(',')) {
      pageArray = pageNo.split(',');
      pageArray.forEach((page) => {
        if (page.includes('-')) {
          page = page.split('-');
          let startPage = +page[0];
          const endPage = +page[1];
          for (startPage; startPage <= endPage; startPage++) {
            pageRange.push(startPage);
          }
        } else {
          pageRange.push(+page);
        }
      });
    } else {
      if (pageNo.includes('-')) {
        pageArray = pageNo.split('-');
        let startPage = +pageArray[0];
        const endPage = +pageArray[1];
        for (startPage; startPage <= endPage; startPage++) {
          pageRange.push(startPage);
        }
      } else {
        pageRange.push(+pageNo);
      }
    }

    const position = {
      X: +this.multiAnnotationForm.value.annCanvasStartX, // 434
      Width: +this.multiAnnotationForm.value.annCanvasEndX, // 607
      Y: +this.multiAnnotationForm.value.annCanvasStartY, // 299
      Height: +this.multiAnnotationForm.value.annCanvasEndY, // 446
    };

    this.annotationService.drawShapes(pageRange, position, options);
    this.selectedMultiAnnotation = null;
    this.isMultiAnnotation = false;
  }

  submitUploadDetail() {
    let uploadData = {
      repositoryType: 'filesystem',
      docUrl: this.uploadFormDetail.value.docURLs,
      annotationUrl: this.uploadFormDetail.value.annURLs,
      clientDocID: 'client_' + Math.floor(Math.random() * 100),
      dbUsername: this.uploadFormDetail.value.userName,
    };

    this.documentService.loadDocument(uploadData);

    this.uploadFormDetail.reset();
    this.selectedOption = '';
  }

  submitGotoPageDetail() {
    this.documentService.gotoPage(this.gotoPageFormDetail.value.pageNO);
    this.gotoPageFormDetail.reset();
    this.selectedOption = '';
  }

  submitTextDetail() {
    this.documentService.searchText(this.textSearchForm.value.inputText);
    this.textSearchForm.reset();
    this.selectedOption = '';
  }

  actualFilePath(event: any) {
    let input: any = document.getElementById('fil-id');
    let file = input.files[0];
    this.file = file;

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.fileUrl = reader.result;
      let img: any = new Image();
      img.onload = () => {
        this.width = img.width;
        this.height = img.height;
      };
      img.src = reader.result;
    };
  }

  submitInsertDetail() {
    if (this.selectedOption === 'insertDocument') {
      // nilesh for Generic_eVewer7_1722: S3,P3
      if (this.stService.docNo <= 1) {
        // do routing
        this.router.navigate(['/dashboard/insert']);
      }
      // nilesh for Generic_eVewer7_1873 {S3,P3}
      if (
        this.file.type === 'image/jpeg' ||
        this.file.type === 'image/png' ||
        this.file.type === 'image/bmp' ||
        this.file.type === 'image/gif'
      ) {
        this.documentService.insertDocument(
          this.file,
          this.fileUrl,
          this.width,
          this.height
        );
      } else this.documentService.insertDocument(this.file, this.fileUrl);
    } else if (this.selectedOption === 'appendDocument') {
      this.documentService.appendDocument(this.file, this.fileUrl);
    }
    this.file = null;
    this.fileUrl = null;
    this.selectedOption = '';
  }
  submitExportDetail() {
    let exportData = {
      docName: this.exportForm.value.DocName,
      pageOption: this.exportForm.value.pagOption,
      formName: 'export',
      selectedOption: this.exportForm.value.doctype,
      withAnn: 'false',
      startPageExport: 0,
      endPageExport: 0,
      withwatermark: true,
    };
    this.exportForm.reset();
    this.selectedOption = '';
    this.editingService.exportDocument(exportData);
  }

  submitPrintDocumentDetail() {
    let printData = {
      pageOption: this.printDocumentForm.value.pageOptions, // 'allPages',//'allDocuments',//'currentPage','allPages',//
      withannotation: 'false',
      startPage: 0,
      endPage: 0,
      withwatermark: true,
    };
    this.editingService.printDocument(printData);
    this.printDocumentForm.reset();
    this.selectedOption = '';
  }

  saveDoc() {
    let docId = this.saveFormDetail.value.docName;
    this.integrationService.saveSelectedDoc(docId);
    this.saveFormDetail.reset();
  }

  postRequest() {
    let httpHeader: any;
    this.httpClient.get('assets/files/saveHeader.json').subscribe((data) => {
      httpHeader = data;
      // this.integrationService.postRequest(httpHeader);
    });
  }

  allDoc() {
    this.integrationService.getAllDoc();
    this.fileName = this.integrationService.docIds;
  }

  currentDoc() {
    this.integrationService.getCurrentDoc();
  }

  totalPagesOfGroup() {
    let docId = this.totalPageForm.value.docName;
    // this.integrationService.getTotalPagesInGroup(docId);
    this.totalPageForm.reset();
  }

  deleteGroup() {
    let docId = [];
    docId.push(this.deleteGroupForm.value.docName);
    this.integrationService.deleteDoc(docId);
    this.deleteGroupForm.reset();
  }

  deleteAllGroup() {
    // this.integrationService.deleteAllGroup();
  }

  scanDocument() {
    // this.integrationService.scanDocument();
  }
}
