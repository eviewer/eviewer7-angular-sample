import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class IntegrationService {

    public docIds: any = [];
    public savedGroups: any;
    public splitGroups: any = [];
    public splitPageNos: string = '';
    files: any;
    base64Url: any;
    width: any;
    height: any;
    viewerUrl: string;
    savingEndPoint: string;
    scannerPath: string;
    licencePath: string;
    licenceStatus: string = 'failed';
    iframeID: string;
    selecteddocId: string;
    totalPage: any;
    userName: string;
    serverEndPoint: string;
    cgPromiseResolver: any;
    sgPromiseResolve: any;
    tpPromiseResolve: any;
    gaDocPromiseResolver: any;
    splitGroupPromiseResolver: any;
    inDocPromiseResolver: any;
    upDocPromiseResolver: any;
    saveGroupsResolver: any;
    isDocLoaded: any;
    loadViewerPromiseResolver: any;
    deleteDocumentPromiseResolver: any;
    isdeleteGroupDisable: string;
    currentSelectedGroup: { docId: any; docName: any; };

    tabChange = new Subject<any>();
    viewerStatus = new Subject<any>();
    deleteModifyGroup = new Subject<any>();
    blankViewer = new Subject<any>();
    appPath: string;
    isViewerLoaded: Subject<boolean> = new Subject<boolean>();

    constructor() {
        if (window.addEventListener) {
            window.addEventListener("message", this.receiveMessage.bind(this), false);
        } else {
            (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
        }
    }

    receiveMessage(event: MessageEvent) {
        let message;
        let response;
        if (event.data[0] !== undefined) {
            message = JSON.parse(event.data[0]['message']);
            response = message['function_name'];
        }
        switch (response) {

            case 'uploadDocument':
                let updoc = {
                    docId: message.responseData.docId,
                    docName: message.responseData.docName
                }
                if (this.upDocPromiseResolver !== undefined && this.upDocPromiseResolver !== null) {
                    this.upDocPromiseResolver(message.responseData);
                }
                if (message.responseData.eViewerStatus)
                    this.docIds.push(updoc);
                break;

            case 'saveSelectedGroup':
                let savegroup = {
                    docId: message['docId'],
                    docName: message['docName']
                }
                this.savedGroups = savegroup;
                if (this.sgPromiseResolve !== undefined && this.sgPromiseResolve !== null) {
                    this.sgPromiseResolve(savegroup);
                }
                break;

            case 'checkLicence':
                // let eViewerFrame: any = document.getElementById(this.iframeID);
                // this.licenceStatus = message["status"];
                // if (this.licenceStatus === 'active') {
                //     eViewerFrame.style.display = "block";
                //     this.loadViewerPromiseResolver("viewer Loaded");
                // } else {
                //     eViewerFrame.src = '';
                // }
                break;

            case 'currentDoc':
                let selectedDoc = message['currentDoc'];
                this.selecteddocId = selectedDoc.docId;
                if (this.cgPromiseResolver !== undefined && this.cgPromiseResolver !== null) {
                    this.cgPromiseResolver(selectedDoc);
                }
                break;

            case 'getAllDoc':
                let allGroup = message['docs'];
                this.docIds = allGroup;
                if (this.gaDocPromiseResolver !== undefined && this.gaDocPromiseResolver !== null) {
                    this.gaDocPromiseResolver(allGroup);
                }
                break;

            case 'deleteDocument':
                let closeDocId = message['docIds'];
                for (let index = 0; index < this.docIds.length; index++) {
                    let element = this.docIds[index];
                    if (element.docId == closeDocId) {
                        this.docIds.splice(index, 1);
                    }
                }
                if (this.deleteDocumentPromiseResolver !== undefined && this.deleteDocumentPromiseResolver !== null) {
                    this.deleteDocumentPromiseResolver(closeDocId);
                }
                break;

            case 'splitDocument':
                let doc = {
                    docId: message['docIds'],
                    docName: message['docName']
                }
                this.docIds.push(doc);
                if (this.splitGroupPromiseResolver !== undefined && this.splitGroupPromiseResolver !== null) {
                    this.splitGroupPromiseResolver(doc);
                }
                break;

            case "onCompleteDocumentLoad":
                this.isDocLoaded = message['isDocLoaded'];
                console.log('document load successfully!');
                break;

            case "viewerStatus":
                if (this.viewerStatus.observers.length === 0)
                    this.viewerStatus.subscribe(isBlankViewer => {
                        if (!isBlankViewer)
                            alert('Please close the already opened document before the opening of the new document');
                    });
                this.viewerStatus.next(message['isBlankViewer']);
                break;

            case "onBlankViewer":
                if (this.blankViewer.observers.length === 0)
                    this.blankViewer.subscribe(() => {
                        console.log('enable the Upload Document button as there are no more groups left');
                    });
                this.blankViewer.next();
                break;

            default:
                break;
        }
    }

    loadViewer(appPath: string, viewerUrl: string, docSaveUrl: string,
        iframeId: string, iframeHeight: number, docLoadUrl: string, userName: string) {
        // , viewerDiv: any
        
        this.isViewerLoaded.next(true);
        let loadViewerPromise: any;
        // loadViewerPromise = new Promise((resolve, reject) => {
        //     let integrationService = this;
        //     this.savingEndPoint = docSaveUrl;
        //     this.viewerUrl = viewerUrl;
        //     this.serverEndPoint = docLoadUrl;
        //     this.appPath = appPath;
        //     this.userName = userName
        //     this.iframeID = iframeId + "-id";
        //     let iframe = document.createElement('iframe');
        //     iframe.setAttribute("id", iframeId + "-id"); //-id added

        //     // viewerDiv.appendChild(iframe);
        //     let iframeContainer = document.getElementById(iframeId);
        //     iframeContainer.appendChild(iframe);


        //     iframe.style.width = '100%';
        //     iframe.style.height = iframeHeight + "px"
        //     iframe.style.display = "none";
        //     iframe.onload = function () {
        //         setTimeout(() => {
        //             integrationService.setViewerURL(viewerUrl, docSaveUrl, docLoadUrl, userName);
        //         }, 10);
        //     }
        //     iframe.src = 'http://192.168.10.100:4200/#/dashboard/dashboard'; this.appPath;//'http://192.168.10.100:4200/#/dashboard/dashboard';
        //     this.loadViewerPromiseResolver = resolve;
        // });
        return loadViewerPromise;
    }

    setViewerURL(viewerUrl: string, docSaveUrl: string, docLoadUrl: string, userName: string) {
        let data = [];
        this.viewerUrl = 'http://192.168.10.100:9090/eViewerServer-0.0.17/api/v1'; viewerUrl; 'http://192.168.10.100:9090/eViewerServer-0.0.17/api/v1';
        this.savingEndPoint = docSaveUrl;//'http://192.168.10.100:9090/eViewerServer-0.0.16/api/v1/createTiffFile';
        this.serverEndPoint = docLoadUrl;//'http://192.168.10.100:9090/eViewerServer-0.0.16/api/v1/getBase64Data';
        this.userName = userName;
        data.push('appPath');
        data.push(this.viewerUrl);
        data.push(this.serverEndPoint);
        data.push(this.savingEndPoint);
        data.push(this.userName);
        const message = JSON.stringify(data);
        this.sendMessage(message);
    }

    uploadDocument(urlPayload: string, httpHeader?: any) {
        let upDocPromise: any;
        upDocPromise = new Promise((resolve, reject) => {
            let data = [];
            data.push('uploadDocument');
            data.push(urlPayload); //docIds = http://192.168.10.100:8988/Svg/temp/Apple.pdf
            data.push(this.serverEndPoint);
            data.push(httpHeader);
            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.upDocPromiseResolver = resolve;
        });
        return upDocPromise;
    }

    saveSelectedDoc(docId: string) {
        let sgPromise: any;
        sgPromise = new Promise((resolve, reject) => {
            let data = [];
            data.push('saveSelectedGroup');
            data.push(docId);
            data.push(this.savingEndPoint);
            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.sgPromiseResolve = resolve;
        });
        return sgPromise;
    }

    sendMessage(message: string) {
        let eViewerFrame: any = document.getElementById(this.iframeID);
        eViewerFrame.contentWindow.postMessage([{ message: message }], '*');
    }

    getCurrentDoc() {
        let cgPromise: any;
        cgPromise = new Promise((resolve, reject) => {

            let data = [];
            data.push('currentDoc');
            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.cgPromiseResolver = resolve;
        });
        return cgPromise;
    }

    getAllDoc() {
        let gaDocPromise: any;
        gaDocPromise = new Promise((resolve, reject) => {

            let data = [];
            data.push('getAllDoc');
            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.gaDocPromiseResolver = resolve;
        });
        return gaDocPromise;
    }

    deleteDoc(docId: any) {
        let deleteDocumentPromise: any;
        deleteDocumentPromise = new Promise((resolve, reject) => {
            let data = [];
            data.push('deleteDocument');
            data.push(docId);
            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.deleteDocumentPromiseResolver = resolve;
        });
        return deleteDocumentPromise;
    }

    splitDocument(docId: string, pagerange: string, docName: string) {
        this.splitPageNos = '';

        let pattern = new RegExp(/^[0-9,-]*$/);
        if (!pattern.test(pagerange)) {
            alert("Invalid Page range");
            return;
        }
        let sdPromise: any;
        sdPromise = new Promise((resolve, reject) => {
            let pageRange = pagerange.split(',');
            for (let index = 0; index < pageRange.length; index++) {
                let pages = pageRange[index];
                let range = pages.split('-');
                if (pages.indexOf('-') !== -1) {
                    let startPage = parseInt(range[0]);
                    let endPage = parseInt(range[1]);
                    for (let page = startPage; page <= endPage; page++) {
                        this.splitPageNos = this.splitPageNos + page.toString() + ',';
                    }
                } else {
                    this.splitPageNos = this.splitPageNos + range[0] + ',';
                }
            }
            this.splitPageNos = this.splitPageNos.slice(0, this.splitPageNos.lastIndexOf(','));
            let splitdocName = docName.split(',');
            this.splitGroups.push(splitdocName);

            let data = [];
            data.push('splitDocument');
            data.push(docId);
            data.push(this.splitPageNos);
            data.push(splitdocName);

            const message = JSON.stringify(data);
            this.sendMessage(message);
            this.splitGroupPromiseResolver = resolve;
        });
        return sdPromise;
    }
}
