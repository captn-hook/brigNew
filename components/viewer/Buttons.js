//Value button texts: Show Values, Hide Values - Effect: toggle doVals
//Opacity button texts: Transparent, Opaque - Effect: toggle alpha

//Flip button texts: Flip ◐, Flip ◑ - Effect: modify ts, ms, and tracers visibility
export function FlipButton(leftPanel, ms, ts, tracers) {
    //find the difference between click 1 and click 2
    var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
    var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
    var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
    var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

    tracers.forEach((t) => {
        if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
            t.visible = !t.visible;
        }
    })

    if (minx == 0) {
        ms.forEach((m) => {
            if (m.i >= miny && m.i <= y) {
                m.visible = !m.visible;
            }
        })
    }

    if (miny == 0) {
        ts.forEach((d) => {
            if (d.i >= minx && d.i <= x) {
                d.visible = !d.visible;
            }
        })
    }
}


// Cam button texts: Multi 🎥, Locked 📷, Free 📹 - Effect: toggle camFree, comtrols, and setCam
export function CamButton(s, camFree, leftPanel) {
    if (s == 0) {
        //e.target.innerHTML = 'Locked 📷';
        //controls.enabled = false;
        camFree = true;
        leftPanel.setcam(camFree, false)
    } else if (s == 1) {
        //e.target.innerHTML = 'Free 📹';
        //controls.enabled = true;
        camFree = false;
        leftPanel.setcam(camFree, true)
    } else {
        //e.target.innerHTML = 'Multi 🎥';
        //controls.enabled = true;
        camFree = true;
        leftPanel.setcam(camFree, true)
    }

}

// Reset button texts: Toggle all ❎, Toggle all ✅ - Effect: toggle ms, ts, and tracers visibility
export function ResetButton(bool, ms, ts, tracers) {
    if (bool) {
        //set every m, t, and tracer to visible
        ms.forEach((m) => {
            m.visible = true;
        })
        ts.forEach((t) => {
            t.visible = true;
        })
        tracers.forEach((t) => {
            t.visible = true;
        })
    } else {
        //set every m, t, and tracer to hidden
        ms.forEach((m) => {
            m.visible = false;
        })
        ts.forEach((t) => {
            t.visible = false;
        })
        tracers.forEach((t) => {
            t.visible = false;
        })

    }
}

//Toggle btn text: Toggle ◧, Toggle ◨ - set leftpanel ms, ts, tracers
export function ToggleButton(mode, leftPanel, ms, ts, tracers) {
    //find the difference between click 1 and click 2
    var minx = ((leftPanel.firstClickX < leftPanel.secondClickX) ? leftPanel.firstClickX : leftPanel.secondClickX) - 1;
    var miny = ((leftPanel.firstClickY < leftPanel.secondClickY) ? leftPanel.firstClickY : leftPanel.secondClickY) - 1;
    var x = Math.abs(leftPanel.secondClickX - leftPanel.firstClickX) + minx;
    var y = Math.abs(leftPanel.secondClickY - leftPanel.firstClickY) + miny;

    tracers.forEach((t) => {
        if (t.t.i >= minx && t.t.i <= x && t.m.i >= miny && t.m.i <= y) {
            t.visible = mode;
        }
    })

    if (minx == 0) {
        ms.forEach((m) => {
            if (m.i >= miny && m.i <= y) {
                m.visible = mode;
            }
        })
    }

    if (miny == 0) {
        ts.forEach((d) => {
            if (d.i >= minx && d.i <= x) {
                d.visible = mode;
            }
        })
    }
}

//group button texts: Groups, Areas, tracers
export function GroupButton(leftPanel) {
    leftPanel.next();
}