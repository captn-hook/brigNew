import { updateCam } from "./updateCam";

class Panel {
    constructor() {
        this.state = {
            0: 'spreadsheet',
            1: 'both',
            2: 'areas'
        }

        this.areas = [];

        this.spreadsheet = this.state[0];

        this.groups = [];

        this.firstClick = false;

        this.secondClickX = null;
        this.secondClickY = null;

        this.firstClickX = null;
        this.firstClickY = null;

        this.cellX = null;
        this.cellY = null;

        this.cellWidth = null;
        this.cellHeight = null;

        this.looking = true;

        this.canvas;

        this.dropd;

        this.sh;

        this.bw = true;

        this.camFree = true;

        this.mt = 0;

        this.n = 0;

        this.text = ''

        this.gi;

        this.ai = 0;

        this.fontsize = 12;

        this.siteheader = '';

        this.clickCallback = undefined;

    }

    setPanelRef(spreadsheetcanvas) {

        this.canvas = spreadsheetcanvas;
        //log the canvas id
        this.ctx = spreadsheetcanvas.getContext('2d');

        this.ctx.lineJoin = 'round';

        this.sh = this.canvas.height;

    }

    setDropdRef(dropd) {
        this.dropd = dropd;
    }

    camPos(x, y, props) {

        if (this.camFree) {

            if (x <= 1 && y <= 1) {

                this.mt = 0;
                this.n = 0;

            } else if (y == 1) {
                //if y (row) == 1, ts
                this.mt = 2;
                this.n = x - 2;
                //throws errors if it trys to select row before/after last

            } else if (1 < y && y < props.ms.length + 2) {
                //if x (column) == 1, ms
                this.mt = 1;
                this.n = y - 2;
            }
        }
    }

    next(props) {
        if (this.spreadsheet == this.state[0]) {
            this.spreadsheet = this.state[1];

        } else if (this.spreadsheet == this.state[1]) {
            this.spreadsheet = this.state[2];

        } else if (this.spreadsheet == this.state[2]) {
            this.spreadsheet = this.state[0];
        }
        this.blankClicks();
        this.cellSize(this.ctx.canvas.height, props);
    }

    // setTracers(ms, ts, tracers) {
    //     props.tracers = tracers;
    //     props.ms = ms;
    //     props.ts = ts;
    //     this.setFontsize(tracers.length);
    // }

    setFontsize(props) {
        if (this.canvas == undefined) {
            return
        }
        var l = props.tracers.length

        let min = this.cellHeight < this.cellWidth ? true : false;
        let minv = min ? this.cellHeight : this.cellWidth;
        if (min) {
            //cellHeight
            var scale = (window.innerHeight / this.canvas.height) / 2;
            this.fontsize = this.cellHeight / 1.6;
        } else {
            //cellWidth
            var scale = Math.sqrt(window.innerWidth / this.canvas.width);
            this.fontsize = this.cellWidth / 2.7;
        }
    }

    setbw(bw) {
        this.bw = bw;
    }

    blankClicks() {
        this.firstClick = true;
        this.firstClickX = null;
        this.firstClickY = null;
        this.secondClickX = null;
        this.secondClickY = null;
    }

    cellSize(h, props) {
        if (props != undefined && props.ms != undefined && props.ts != undefined && this.spreadsheet == this.state[0]) {
            this.cellWidth = (this.canvas.width / (props.ts.length + 1));
            this.cellHeight = (this.canvas.height / (props.ms.length + 1));
        } else if (this.areas != undefined) {
            this.cellHeight = (h / (this.areas.length));
        }

        this.setFontsize(props)
    }

    clicks(e) {
        if (this.spreadsheet == this.state[0]) {
            if (this.firstClick) {
                this.firstClick = false;

                this.secondClickX = null;
                this.secondClickY = null;

                //grabs position of mouse, upaated by mousemove event
                this.firstClickX = this.cellX;
                this.firstClickY = this.cellY;

                //this is for linking to a specific location
                window.location.hash = (this.siteheader + '&X=' + this.cellX + '&Y=' + this.cellY);

                if (this.clickCallback != undefined) {
                    // index is 1 dim so: x + y * width
                    this.clickCallback(this.cellX, this.cellY)
                }
            }
        } else if (this.spreadsheet == this.state[2] || this.spreadsheet == this.state[1]) {
            if (this.ai != this.cellY - 1) {
                this.ai = this.cellY - 1

                if (this.camFree) {
                    this.looking = true;
                }

                window.location.hash = (this.siteheader + '&A=' + this.ai);
            } else {
                this.ai = -1;
            }
        }
    }

    getClicks() {
        var minx = ((this.firstClickX < this.secondClickX) ? this.firstClickX : this.secondClickX) - 1;
        var miny = ((this.firstClickY < this.secondClickY) ? this.firstClickY : this.secondClickY) - 1;
        var x = Math.abs(this.secondClickX - this.firstClickX) + minx;
        var y = Math.abs(this.secondClickY - this.firstClickY) + miny;
        return [minx, miny, x, y]
    }

    place(e, props) {
        if (this.spreadsheet == this.state[0]) {
            if (this.camFree) {
                this.looking = true;
            }
            //single click, place markers 1 and 2
            if (e.detail == 1) {
                if (this.firstClick) {

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY, props)

                    //grabs position of mouse, upaated by mousemove event
                    this.firstClickX = this.cellX;
                    this.firstClickY = this.cellY;

                    //window.location.hash = ('X=' + cellX + '&Y=' + cellY)

                } else {
                    this.firstClick = true;

                    //grabs position of mouse, upated by mousemove event
                    this.secondClickX = this.cellX;
                    this.secondClickY = this.cellY;

                    //update camera on mouse click
                    this.camPos(this.cellX, this.cellY, props)

                    //window.location.hash = ('X=' + this.cellX + '&Y=' + this.cellY)

                }
                //double click, clear markers
            } else if (e.detail == 2) {

                this.blankClicks();

                this.camPos(this.cellX, this.cellY, props)

                //get m/t/tracer by cellX and cellY
                if (this.cellX <= 1 && this.cellY <= 1) {
                    //flip only points, not tracers
                    props.ms.forEach(m => {
                        m.visible = !m.visible
                    })
                    props.ts.forEach(t => {
                        t.visible = !t.visible
                    })
                } else if (this.cellY == 1) {

                    var state = !props.ts[this.cellX - 2].visible

                    props.ts[this.cellX - 2].visible = state;

                    props.tracers.forEach((t) => {
                        if (t.t.i == this.cellX - 1) {
                            t.visible = state;
                        }
                    })

                } else if (this.cellX == 1) {

                    var state = !props.ms[this.cellY - 2].visible

                    props.ms[this.cellY - 2].visible = state;

                    if (state == true) {
                        props.ts.forEach(t => {
                            t.visible = true
                        })
                    }

                    props.tracers.forEach((t) => {
                        if (t.m.i == this.cellY - 1) {
                            t.visible = state;
                        }
                    })

                } else {
                    props.tracers.forEach((t) => {
                        if (t.m.i == this.cellY - 1 && t.t.i == this.cellX - 1) {
                            t.visible = !t.visible;
                        }
                    })

                }

            }
        } else {

        }
    }

    //spreadsheet mouse move, tracks mouse position to cellX and cellY
    move(e) {
        if (this.canvas == undefined) {
            return
        }
        var rect = this.canvas.getBoundingClientRect();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;

        this.cellX = Math.ceil(x / this.cellWidth);

        this.cellY = Math.ceil(y / this.cellHeight);

    }

    selectLastX(props) {
        this.firstClickY = 1;
        this.secondClickY = 1;
        this.firstClickX = props.ts.length + 1;
        this.secondClickX = props.ts.length + 1;
    }

    selectLastY(props) {
        this.firstClickX = 1;
        this.secondClickX = 1;
        this.firstClickY = props.ms.length + 1;
        this.secondClickY = props.ms.length + 1;
    }

    bounds(x1, y1, x2, y2) {
        //returns the bounds of the current selection
        var x = (((x1 < x2) ? x1 : x2) - 1) * this.cellWidth
        var y = (((y1 < y2) ? y1 : y2) - 1) * this.cellHeight

        var w = (Math.abs(x1 - x2) + 1) * this.cellWidth
        var h = (Math.abs(y1 - y2) + 1) * this.cellHeight

        return [x, y, w, h]
    }

    frame() {
        if (this.spreadsheet == this.state[0]) {
            this.spreadsheetFrame();
        } else if (this.spreadsheet == this.state[1]) {
            this.areaFrame();
        } else if (this.spreadsheet == this.state[2]) {
            this.areaFrame();
        }
    }

    groupFrame() {
        if (this.ctx == undefined) {
            return
        }
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        if (this.groups && this.groups.length > 0) {
            for (var i in this.groups) { //plus scroll?
                if (this.groups[i] && i != 0) { //safety check, omit first group

                    var h = Math.ceil(this.cellHeight)

                    i = parseInt(i)

                    if (i < this.cellY && this.cellY <= (i + 1)) {
                        this.ctx.fillStyle = 'yellow'
                    } else if (i == this.gi) {
                        this.ctx.fillStyle = 'lightgrey'
                    } else {
                        this.ctx.fillStyle = 'grey'
                    }

                    this.ctx.fillRect(0, i * h, this.canvas.width, h);

                    this.ctx.lineJoin = "round";
                    this.ctx.font = String(this.fontsize) + "px Arial";
                    this.ctx.textAlign = "center";
                    this.ctx.strokeStyle = 'black';
                    this.ctx.lineWidth = 2;
                    this.ctx.fillStyle = 'white';

                    var text = this.groups[i]['name'];


                    this.ctx.strokeText(text, this.canvas.width / 2, i * h + h / 1.3);
                    this.ctx.fillStyle = this.color;
                    this.ctx.fillText(text, this.canvas.width / 2, i * h + h / 1.3);

                    //textbox.value = (this.text == null) ? '' : decodeURI(this.text).replaceAll('~', ',');
                }
            }
        }
    }

    spreadsheetFrame() {
        // clear the 0, 0 cell
        var [x, y, w, h] = this.bounds(1, 1, 1, 1);
        this.ctx.clearRect(x, y, w, h);


        //click 1
        //this.ctx.fillRect(0, 0, this.cellWidth, this.cellHeight);

        if (this.firstClick != null) {

            //click 2
            if (this.secondClickX == null && this.secondClickY == null) {

                //spreadsheet highlight mousemove
                this.ctx.beginPath();
                this.ctx.strokeStyle = 'yellow'
                this.ctx.lineWidth = 2;

                var [x, y, w, h] = this.bounds(this.firstClickX, this.firstClickY, this.cellX, this.cellY);

                this.ctx.rect(x, 0, w, this.cellHeight * (((this.firstClickY < this.cellY) ? this.cellY : this.firstClickY)));
                this.ctx.stroke()

                this.ctx.rect(0, y, this.cellWidth * (((this.firstClickX < this.cellX) ? this.cellX : this.firstClickX)), h);
                this.ctx.stroke()

                this.ctx.beginPath();

                this.ctx.strokeStyle = 'grey'
                this.ctx.lineWidth = 4;

                this.ctx.rect((this.firstClickX - 1) * this.cellWidth, (this.firstClickY - 1) * this.cellHeight, this.cellWidth, this.cellHeight);
                this.ctx.stroke()


            } else {

                this.ctx.beginPath();

                if (this.bw) {
                    this.ctx.strokeStyle = 'white'
                } else {
                    this.ctx.strokeStyle = 'black'
                }
                this.ctx.lineWidth = 4;

                var [x, y, w, h] = this.bounds(this.secondClickX, this.secondClickY, this.firstClickX, this.firstClickY);
                this.ctx.rect(x, y, w, h);
                this.ctx.stroke()

            }

        }

        // console.log('clicks n stuff');
        // console.log('firstClicks', this.firstClickX, this.firstClickY);
        // console.log('secondClicks', this.secondClickX, this.secondClickY);
        // console.log('cellX', this.cellX, 'cellY', this.cellY);
        // console.log('cellWidth', this.cellWidth, 'cellHeight', this.cellHeight);


    }

    areaFrame() {
        if (this.ctx == undefined) {
            return
        }
        //console.log('this.areas', this.areas)

        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        for (var i in this.areas) { //plus scroll?
            if (this.areas[i]) { //safety check, omit first group

                // var h = Math.ceil(this.cellHeight)
                var h = this.ctx.canvas.height / this.areas.length

                i = parseInt(i)
                if (i < this.cellY && this.cellY <= (i + 1)) {
                    this.ctx.fillStyle = 'yellow'
                } else if (i == this.ai) {
                    this.ctx.fillStyle = 'lightgrey'
                } else {
                    this.ctx.fillStyle = 'grey'
                }

                this.ctx.fillRect(0, i * h, this.canvas.width, h);

                this.ctx.lineJoin = "round";
                this.ctx.font = String(h / 2) + "px Arial";
                this.ctx.textAlign = "center";
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.fillStyle = 'white';

                var text = this.areas[i].name;

                this.ctx.strokeText(text, this.canvas.width / 2, i * h + h / 1.3);
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(text, this.canvas.width / 2, i * h + h / 1.3);

                //textbox.value = (this.text == null) ? '' : decodeURI(this.text).replaceAll('~', ',');
            }
        }
    }
}

export {
    Panel
}