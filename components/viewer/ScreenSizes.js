export class ScreenSizes {

    constructor(divref = null, spreadsheetDivref = null, canvas2dref = null, ctxref = null, width = 650, height = 500) {
        // all the refs of objects that need managed sizes
        // document.getElementById('3d')
        this.div = divref;
        // document.getElementById('spreadsheet')
        this.spreadsheetDiv = spreadsheetDivref;
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

    }

    setRefs(divref, spreadsheetDivref, canvas2dref) {
        this.div = divref;
        this.spreadsheetDiv = spreadsheetDivref;
        this.canvas2d = canvas2dref;
        this.ctx = this.canvas2d.getContext('2d');
    }

    setViewerRefs(divref, canvas2dref) {
        this.div = divref;
        this.canvas2d = canvas2dref;
        this.ctx = this.canvas2d.getContext('2d');
    }

    setSpreadsheetRef(spreadsheetDivref) {
        this.spreadsheetDiv = spreadsheetDivref;
    }

    clearC2d() {
        this.ctx.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height)
    }

    updateSizes(leftPanel) {
        if (this.div === null || this.spreadsheetDiv === null || this.canvas2d === null || this.ctx === null) {
            //console.log('ScreenSizes: updateSizes: missing refs');
            //onsole.log('div: ', this.div, ' spreadsheetDiv: ', this.spreadsheetDiv, ' canvas2d: ', this.canvas2d, ' ctx: ', this.ctx);
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

        //console.log('leftPanel: ', leftPanel,' ctx ' , leftPanel.ctx);
        if (leftPanel) {
            leftPanel.ctx.canvas.innerWidth = this.spreadsheetDiv.offsetWidth;

            leftPanel.canvas.width = this.spreadsheetDiv.offsetWidth;

            if (leftPanel.spreadsheet) {

                leftPanel.canvas.height = this.spreadsheetDiv.offsetHeight;

                leftPanel.ctx.canvas.innerHeight = this.spreadsheetDiv.offsetHeight;

            } else {

                leftPanel.canvas.height = leftPanel.groups.length * leftPanel.cellHeight

            }

            leftPanel.cellSize(this.spreadsheetDiv.offsetHeight);

        }

    }

}