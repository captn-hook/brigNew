export class ScreenSizes {

    constructor(override = false, divref = null, spreadsheetCanvasref = null, canvas2dref = null, ctxref = null, width = 650, height = 500) {
        // all the refs of objects that need managed sizes
        // document.getElementById('3d')
        this.div = divref;
        // document.getElementById('spreadsheet')
        this.spreadsheetCanvas = spreadsheetCanvasref;
        //  document.getElementById('2d')
        this.canvas2d = canvas2dref;
        // this.canvas2d.getContext('2d')
        this.ctx = ctxref;
        
        //this.ctx.lineJoin = 'round'
        //this.ctx.miterLimit = 1
        // this.div.offsetWidth
        this.width = width;
        // this.div.offsetHeight
        this.height = height;

        this.webgl = null;

        this.override = override;

    }

    setRefs(divref, spreadsheetCanvasref, canvas2dref) {
        this.div = divref;
        this.spreadsheetCanvas = spreadsheetCanvasref;
        this.canvas2d = canvas2dref;
        this.ctx = this.canvas2d.getContext('2d');
    }

    setViewerRefs(divref, canvas2dref, webglRef) {
        this.div = divref;
        this.canvas2d = canvas2dref;
        this.ctx = this.canvas2d.getContext('2d');
        this.webgl = webglRef;
    }

    setSpreadsheetRef(spreadsheetCanvasref) {
        this.spreadsheetCanvas = spreadsheetCanvasref;
    }

    clearC2d() {
        this.ctx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height)
    }

    updateSizes(props) {
        if (!this.override && (this.div === null || this.spreadsheetCanvas === null || this.canvas2d === null || this.ctx === null)) {
            console.log('ScreenSizes: updateSizes: missing refs');
            console.log('div: ', this.div, ' spreadsheetCanvas: ', this.spreadsheetCanvas, ' canvas2d: ', this.canvas2d, ' ctx: ', this.ctx);
            return;
        }
        
        //base size on the div
        this.width = this.div.offsetWidth;
        this.height = this.div.offsetHeight;
        //console.log('width: ', this.width, ' height: ', this.height);

        //set the canvas sizes
        this.ctx.canvas.innerWidth = this.width;
        this.ctx.canvas.innerHeight = this.height;
        this.canvas2d.width = this.width;
        this.canvas2d.height = this.height;

        if (props.leftPanel != undefined & props.leftPanel.ctx != undefined) {
            props.leftPanel.ctx.canvas.innerWidth = this.spreadsheetCanvas.offsetWidth;

            props.leftPanel.canvas.width = this.spreadsheetCanvas.offsetWidth;

            if (props.leftPanel.spreadsheet) {

                props.leftPanel.canvas.height = this.spreadsheetCanvas.offsetHeight;

                props.leftPanel.ctx.canvas.innerHeight = this.spreadsheetCanvas.offsetHeight;

            } else {

                props.leftPanel.canvas.height = props.leftPanel.groups.length * props.leftPanel.cellHeight

            }

            props.leftPanel.cellSize(this.spreadsheetCanvas.offsetHeight, props);

        }

    }

}