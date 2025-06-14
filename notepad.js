const notepadcontainer = document.getElementsByTagName('body')[0];
const parentproto = document.createElement('div');
var deletednotes = [];
var notes = [];
var previousContextTarget = '';
parentproto.innerHTML =
    `<div id="notepad" style="height: 30em; width: 30vw; min-width: 20em; position: absolute; top: 0; left: 0; z-index: 10;">
    <div class="titlebar"
        style="display: flex; flex-direction: row; align-items: center; width: 100%; height:2em; align-content: center; background-color: black; color: white; font-family:monospace; font-size: 1.2em; font-weight: bold; user-select:none;">
        <span
            style="display:none; text-align: center; top:-2em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute;margin-left: 0.5em; padding: 0.5em"
            class="titletooltip">Click to edit title</span>
        <div class="title" contenteditable="" spellcheck="false" style="margin-left: 0.5em; max-width: 23em; padding: 0em 0.5em;">Notepad</div>
        <span class="toolbar" style="position:relative; user-select:none; margin-left: auto; display: flex;">
            <span class="modeswitch" style="position: relative; padding-right: 0.75em; cursor: pointer;">
                <span class="tooltiplightmode"
                    style="display:none; text-align: center; width:13em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">Switch to light-mode</span>
                <span class="lightmode" style="display: block; padding-right: 0.06em;">☀</span>
                <span class="tooltipdarkmode"
                    style="display:none; text-align: center; width:12.5em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">Switch to dark-mode</span>
                <span class="darkmode" style="display: none; padding-right: 0.34em;">☾</span>
                <span class="tooltipcontrastmode1"
                    style="display:none; text-align: center; width:16em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">Switch to contrast-mode-1</span>
                <span class="contrastmode1" style="display: none;">◐</span>
                <span class="tooltipcontrastmode2"
                    style="display:none; text-align: center; width:16em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">Switch to contrast-mode-2</span>
                <span class="contrastmode2" style="display: none;">◑</span>
            </span>
            <span class="opacitycontrols"
                style="position: relative; padding-right: 0.5em; cursor: pointer; display: flex; align-items: center;">
                <span class="tooltipopup"
                    style="display:none; text-align: center; width:10em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">
                    Increase Opacity</span>
                <svg class="up" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z">
                    </path>
                </svg>
                <span class="tooltipopdefault"
                    style="display:none; text-align: center; width:10em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">
                    Default Opacity</span>
                <svg class="default" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M13.905 2.923l.098 .135l4.92 7.306a7.566 7.566 0 0 1 1.043 3.167l.024 .326c.007 .047 .01 .094 .01 .143l-.002 .06c.056 2.3 -.944 4.582 -2.87 6.14c-2.969 2.402 -7.286 2.402 -10.255 0c-1.904 -1.54 -2.904 -3.787 -2.865 -6.071a1.052 1.052 0 0 1 .013 -.333a7.66 7.66 0 0 1 .913 -3.176l.172 -.302l4.893 -7.26c.185 -.275 .426 -.509 .709 -.686c1.055 -.66 2.446 -.413 3.197 .55zm-2.06 1.107l-.077 .038l-.041 .03l-.037 .036l-.033 .042l-4.863 7.214a5.607 5.607 0 0 0 -.651 1.61h11.723a5.444 5.444 0 0 0 -.49 -1.313l-.141 -.251l-4.891 -7.261a.428 .428 0 0 0 -.5 -.145z">
                    </path>
                </svg>
                <span class="tooltipopdown"
                    style="display:none; text-align: center; width:10em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em">
                    Decrease Opacity</span>
                <svg class="down" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path
                        d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z">
                    </path>
                </svg>
            </span>
            <span
                style="display:none; text-align: center; width:8em; right:-6em; top:-2.5em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; padding: 0.5em"
                class="exittooltip">Delete Note</span>
            <span class="exit"
                style="position:relative; padding-right: 0.5em; cursor:pointer; user-select: none;">[X]</span>
        </span>
    </div>
    <div contenteditable="" placeholder="Write here..." class="note" spellcheck="false"
        style="overflow-y: auto; scrollbar-width: thin; scrollbar-color: black hsl(0, 0%, 30%); outline: none; resize: none; width: 100%; height: 94.44%; background-color: hsla(0,0%,10%, 0.8); color: white; font-family:monospace; font-size: 1.2em; padding:1.2em;"></div>`;

const prototype = parentproto.firstChild;

try {
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "addNote") {
            console.log('Add Note request received');
            var newNote = prototype.cloneNode(true);
            newNote.id = "notepad" + notes.length;
            notes.push(newNote);
            createnotepad(newNote);
            saveNote();
        }
        else if (request.action === "removeLink") {
            console.log('Remove Link request received');
            //remove trailing / from linkUrl if it exists
            if (request.linkUrl.endsWith('/')) {
                request.linkUrl = request.linkUrl.slice(0, -1);
            }
            var link = previousContextTarget.href;
            link = (link.endsWith('/')) ? link.slice(0, -1) : link;
            if (link === request.linkUrl) {
                removelinkify(previousContextTarget);
                saveNote();
            } else {
                console.warn('Link not found:', request.linkUrl);
            }
        }
        else if (request.action === "syncTheme") {
            console.log('Sync Theme request received');
            localStorage.setItem("syncTheme", request.sync);
            if (request.sync === true) {
                syncmodeswitch(notes[0].getAttribute('data-theme'));
                switchmode(notes, notes[0].getAttribute('data-theme'));
                saveNote();
            }
        }
        else if (request.action === "undoDelete") {
            if (deletednotes.length > 0) {
                undoDelete();
            } else {
                console.warn('No deleted notes to restore');
            }
            if (deletednotes.length === 0) {
                // send message to background script to disable undo delete option
                chrome.runtime.sendMessage({ action: "undoDelete", enabled: false }).catch((error) => {
                    console.error('Error disabling undo delete action:', error);
                });
            }
        }
    });
} catch (error) {
    console.error('Error in message listener:', error);
}

window.onload = function () {
    notepadcontainer.style.overflow = "hidden";
    createLinkTooltip();
    loadnote();
}

function createnotepad(note) {
    positionchanger(note);
    notepadcontainer.appendChild(note);
    titleToEllipsis(note);
    addEventListenersToNote(note);
}

function loadnote() {
    var savefile = JSON.parse(localStorage.getItem("savefile")) || savefile;
    for (i in savefile) {
        var note = prototype.cloneNode(true);
        note.id = i;
        note.getElementsByClassName("title")[0].textContent = savefile[i].title || "Notepad";
        note.getElementsByClassName("note")[0].innerHTML = savefile[i].content || "";
        note.style.left = savefile[i].position.left || "0px";
        note.style.top = savefile[i].position.top || "0px";
        note.setAttribute('data-theme', savefile[i].theme || "darkmode");
        var opacity = savefile[i].opacity;
        setnotebackground(note, opacity || "0.8");
        setmodeswitch(note, note.getAttribute('data-theme'));
        switchmode([note], note.getAttribute('data-theme'));
        notes.push(note);
        createnotepad(note);
    }
    console.log('Notes loaded from local storage');
}

function addEventListenersToNote(note) {
    note.querySelector('.note').addEventListener('input', saveNote);

    var title = note.getElementsByClassName("title")[0];
    var notearea = note.getElementsByClassName("note")[0];
    var down = note.getElementsByClassName("down")[0];
    var up = note.getElementsByClassName("up")[0];
    var defaultOpacity = note.getElementsByClassName("default")[0];
    var exit = note.getElementsByClassName("exit")[0];
    var modeswitch = note.getElementsByClassName("modeswitch")[0];
    var lightmode = note.getElementsByClassName("lightmode")[0];
    var darkmode = note.getElementsByClassName("darkmode")[0];
    var contrastmode1 = note.getElementsByClassName("contrastmode1")[0];
    var contrastmode2 = note.getElementsByClassName("contrastmode2")[0];
    var titlebar = note.getElementsByClassName("titlebar")[0];

    titlebar.addEventListener("mousedown", (e) => {
        if (e.target.className === "titlebar") {
            var offsetX = e.clientX - note.getBoundingClientRect().left;
            var offsetY = e.clientY - note.getBoundingClientRect().top;

            function onMouseMove(event) {
                var X = event.clientX - offsetX;
                var Y = event.clientY - offsetY;
                //stop moving if exceeds window size
                if (X < 0) X = 0;
                if (Y < 0) Y = 0;

                if (X + note.offsetWidth > window.innerWidth) {
                    X = window.innerWidth - note.offsetWidth;
                }
                if (Y + note.offsetHeight > window.innerHeight) {
                    Y = window.innerHeight - note.offsetHeight;
                }

                note.style.top = Y + 'px';
                note.style.left = X + 'px';
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', function () {
                document.removeEventListener('mousemove', onMouseMove);
                //save position of notepad in local storage
                saveNote();
                note.onmouseup = null;
            }, false);
        }
    }, false);

    title.addEventListener('input', saveNote);

    connectLinkToTooltip(note);

    // event listener to linkify when focusout of note area
    notearea.addEventListener('focusout', () => {
        linkify(note);
        connectLinkToTooltip(notearea);
        saveNote();
    });

    notearea.addEventListener('input', () => {
        handleimg(notearea);
        saveNote();
    });

    notearea.addEventListener('beforeinput', (e) => {
        preventTrailingRemoveLinkify(e.getTargetRanges());
    })

    // event listener to make link non contenteditable when ctrl is pressed
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            var links = notearea.querySelectorAll('a');
            links.forEach(link => {
                link.setAttribute('contenteditable', 'false');
            });
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            var links = notearea.querySelectorAll('a');
            links.forEach(link => {
                link.setAttribute('contenteditable', 'true');
            });
        }
    });

    document.addEventListener('contextmenu', (e) => {
        previousContextTarget = e.target;
    });


    down.addEventListener("click", () => { opacitydown(note.getElementsByClassName("note")[0]) });
    up.addEventListener("click", () => { opacityup(note.getElementsByClassName("note")[0]) });
    defaultOpacity.addEventListener("click", () => { opacitydefault(note.getElementsByClassName("note")[0]) });
    exit.addEventListener("click", () => { removenote(note) }, true);

    ["focusin", "input"].forEach((e) => {
        title.addEventListener(e, () => {
            title.previousElementSibling.style.display = "none";
        });
    });

    title.addEventListener("focusin", () => {
        title.textContent = retrievetitle(note);
    });

    title.addEventListener("focusout", () => {
        if (title.textContent.trim() === "") {
            title.textContent = "Notepad";
        }
        titleToEllipsis(note);
    });

    [darkmode, lightmode, contrastmode1, contrastmode2, title, down, up, defaultOpacity, exit].forEach((e) => {
        e.addEventListener("mouseover", () => {
            e.previousElementSibling.style.display = "block";
        });
    });
    [darkmode, lightmode, contrastmode1, contrastmode2, title, down, up, defaultOpacity, exit].forEach((e) => {
        e.addEventListener("mouseout", () => {
            e.previousElementSibling.style.display = "none";
        });
    });

    // event listener for mode switch
    var modes = [darkmode, lightmode, contrastmode1, contrastmode2];

    modeswitch.addEventListener("click", () => {
        var syncTheme = localStorage.getItem("syncTheme") || "false";
        console.log(`Sync Theme is set to: ${syncTheme}`);
        if (syncTheme === "false") {
            for (let i = 0; i < modes.length; i++) {
                if (modes[i].style.display === "block") {
                    modes[i].style.display = "none";
                    (modes[i + 1]) ? modes[i + 1].style.display = "block" : modes[0].style.display = "block";
                    switchmode([note], modes[i].className);
                    break;
                }
            }
        } else {
            for (let i = 0; i < modes.length; i++) {
                if (modes[i].style.display === "block") {
                    var modeClassName = modes[i].className;
                    switchModeButton(modeClassName);
                    switchmode(notes, modes[i].className);
                    break;
                }
            }
        }
        saveNote();
    });
}

function removenote(note) {
    notepadcontainer.removeChild(note);
    var saved = JSON.parse(localStorage.getItem("savefile")) || {};
    note.getElementsByClassName("title")[0].textContent = saved[note.id].title;
    deletednotes.push(note);
    notes = notes.filter(n => n !== note);
    saveNote();
    console.log('Note removed and saved');
    // send message to background script to enable undo delete option
    chrome.runtime.sendMessage({ action: "undoDelete", enabled: true }).then(() => {
        console.log('Undo delete action enabled');
    }).catch((error) => {
        console.error('Error enabling undo delete action:', error);
    });
}

function saveNote() {
    var savefile = {};
    notes.forEach((note, index) => {
        var title = retrievetitle(note);
        var content = note.querySelector('.note').innerHTML || "";
        var position = {
            left: note.style.left || "0px",
            top: note.style.top || "0px"
        };
        var opacity = note.querySelector('.note').style.backgroundColor.slice(-4, -1) || "0.8";
        var theme = note.getAttribute('data-theme') || "darkmode";
        savefile["notepad" + index] = {
            title: title,
            content: content,
            position: position,
            opacity: opacity,
            theme: theme
        };
    });
    localStorage.setItem("savefile", JSON.stringify(savefile));
}

//changes the alpha of background color of note element instead of opacity
function opacitydown(note) {
    var color = note.style.backgroundColor;
    try {
        var alpha = color.split(',')[3].split(')')[0];
    } catch (error) {
        alpha = 0.05;
    }
    alpha = parseFloat(alpha) - 0.1;
    if (alpha < 0.1) {
        alpha = 0.05;
    }
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, 85%, ${alpha})`;
    } else {
        note.style.backgroundColor = `hsla(0,0%,10%, ${alpha})`;
    }
    saveNote();
}

function opacityup(note) {
    var color = note.style.backgroundColor;
    try {
        var alpha = color.split(',')[3].split(')')[0];
    } catch (error) {
        alpha = 0.99;
    }
    alpha = parseFloat(alpha) + 0.1;
    if (alpha > 1) {
        alpha = 0.99;
    }
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, 85%, ${alpha})`;
    } else {
        note.style.backgroundColor = `hsla(0,0%,10%, ${alpha})`;
    }
    saveNote();
}

function opacitydefault(note) {
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, 85%, 0.8)`;
    } else {
        note.style.backgroundColor = `hsla(0,0%,10%, 0.8)`;
    }
    saveNote();
}

//if not position overlap, change position of note to avoid overlap
function positionchanger(note) {
    var overlap = true;
    var left = parseInt(note.style.left) || 0;
    var top = parseInt(note.style.top) || 0;

    while (overlap) {
        overlap = false;
        let rect1, rect2;
        for (var i = 0; i < notes.length; i++) {
            if (notes[i] !== note) {
                rect1 = { left: parseInt(note.style.left), top: parseInt(note.style.top) };
                rect2 = { left: parseInt(notes[i].style.left), top: parseInt(notes[i].style.top) };
                if ((Math.abs(rect1.left - rect2.left) < 10 &&
                    Math.abs(rect1.top - rect2.top) < 10)) {
                    overlap = true;
                    left = rect2.left + 20;
                    top = rect2.top + 20;
                    note.style.left = left + 'px';
                    note.style.top = top + 'px';
                    overlap = false;
                }
            }
        }
    }
}

function titleToEllipsis(note) {
    var title = note.getElementsByClassName("title")[0];
    var titlebar = note.getElementsByClassName("titlebar")[0];
    saveNote();
    if (title.scrollHeight > titlebar.clientHeight) {
        title.textContent = title.textContent.slice(0, 37) + '...';
    }
}

function retrievetitle(note) {
    //if ends with ellipsis, get original title from local storage
    title = note.getElementsByClassName("title")[0];
    var saved = JSON.parse(localStorage.getItem("savefile")) || {};
    if (title.textContent.endsWith('...')) {
        return saved[note.id].title || "Notepad";
    }
    else {
        return note.querySelector('.title').textContent || "Notepad";
    }
}

function linkify(note) {
    var content = note.querySelector('.note').innerHTML;
    var addlength;
    var newcontent = content;
    const domainRegex = /\b(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[a-zA-Z0-9\-_.\/:=+?|`~]*)?(?:#[a-zA-Z0-9\-_.\/:=+?|`~]*)?\b/g;
    content.matchAll(domainRegex).forEach((url) => {
        var href = url[0].startsWith('http') ? url[0] : 'http://' + url[0];
        if (!linkified(content, url) && !inhref(content, url) && !insrc(content, url)) {
            if (!nolinkifycheck(content, url)) {
                addlength = newcontent.length - content.length;
                url.index += addlength;
                newcontent = newcontent.substring(0, url.index) + `<a class="linkified" href="${href}" style="color:#0b91bd; font-weight: bold;">${url[0]}</a>` + newcontent.substring(url.index + url[0].length);
            }
        }

    });
    note.querySelector('.note').innerHTML = newcontent;
}

//change links to span and remove href attribute and make them non-linkifiable by adding a class as identifier
function removelinkify(link) {
    if (link.tagName === 'A') {
        var span = document.createElement('span');
        span.className = 'nolinkify';
        span.textContent = link.textContent;
        link.parentNode.replaceChild(span, link);
    }
}

function linkified(content, url) {
    var b = false;
    content.matchAll(`<a class=\"linkified\"`).forEach((atag) => {
        var i = atag.index;
        for (; i < content.length && i <= url.index; i++) {
            if (content[i] === '>') {
                break;
            }
        }
        if (i + 1 === url.index) {
            b = true;
            return b;
        }
    });
    return b;
}

function nolinkifycheck(content, url) {
    var b = false;
    content.matchAll(`<span class=\"nolinkify\"`).forEach((stag) => {
        var i = stag.index;
        for (; i < content.length && i <= url.index; i++) {
            if (content[i] === '>') {
                break;
            }
        }
        if (i + 1 === url.index) {
            b = true;
            return b;
        }
    });
    return b;
}

function inhref(content, url) {
    var b = false;
    if (content.substring(url.index - 6, url.index - 1) == 'href=') {
        b = true;
    }
    return b;
}

function insrc(content, url) {
    var b = false;
    if (content.substring(url.index - 5, url.index - 1) == 'src=') {
        b = true;
    }
    return b;
}

function switchModeButton(modeClass) {
    var mode = document.getElementsByClassName(modeClass);
    var modes = ["darkmode", "lightmode", "contrastmode1", "contrastmode2"];
    var nextModeClassName = modes[(modes.indexOf(modeClass) + 1) % modes.length];
    var nextMode = document.getElementsByClassName(nextModeClassName);
    for (el of mode) {
        el.style.display = "none";
    }
    for (el of nextMode) {
        el.style.display = "block";
    }
}

function syncmodeswitch(mode) {
    var modes = ["darkmode", "lightmode", "contrastmode1", "contrastmode2"];
    var modeIndex = (modes.indexOf(mode) + 1) % modes.length;
    for (let i = 0; i < modes.length; i++) {
        var elements = document.getElementsByClassName(modes[i]);
        if (i === modeIndex) {
            for (let el of elements) {
                el.style.display = "block";
            }
        } else {
            for (let el of elements) {
                el.style.display = "none";
            }
        }
    }
}

function setmodeswitch(note, mode) {
    var modes = ["darkmode", "lightmode", "contrastmode1", "contrastmode2"];
    var modeIndex = modes.indexOf(mode);
    var nextModeIndex = (modeIndex + 1) % modes.length;
    var modeElements = note.getElementsByClassName(modes[nextModeIndex]);
    for (let i = 0; i < modes.length; i++) {
        if (i === nextModeIndex) {
            modeElements[0].style.display = "block";
        } else {
            note.getElementsByClassName(modes[i])[0].style.display = "none";
        }
    }
}

function switchmode(note, mode) {
    note.forEach((n) => {
        var opacity = n.getElementsByClassName("note")[0].style.backgroundColor.split(',')[3].split(')')[0] || "0.8";
        n.setAttribute('data-theme', mode);
        var notearea = n.getElementsByClassName("note")[0];
        var titlebar = n.getElementsByClassName("titlebar")[0];
        if (mode === "lightmode") {
            titlebar.style.backgroundColor = "white";
            titlebar.style.color = "black";
            notearea.style.backgroundColor = `hsla(0, 0%, 85%, ${opacity})`;
            notearea.style.color = "black";
        } else if (mode === "darkmode") {
            notearea.style.backgroundColor = `hsla(0, 0%, 10%, ${opacity})`;
            notearea.style.color = "white";
            titlebar.style.backgroundColor = "black";
            titlebar.style.color = "white";
        } else if (mode === "contrastmode1") {
            titlebar.style.backgroundColor = "white";
            titlebar.style.color = "black";
            notearea.style.backgroundColor = `hsla(0, 0%, 10%, ${opacity})`;
            notearea.style.color = "white";
        } else if (mode === "contrastmode2") {
            titlebar.style.backgroundColor = "black";
            titlebar.style.color = "white";
            notearea.style.backgroundColor = `hsla(0, 0%, 85%, ${opacity})`;
            notearea.style.color = "black";
        }
    });
}

function setnotebackground(note, opacity) {
    var notearea = note.getElementsByClassName("note")[0];
    var titlebar = note.getElementsByClassName("titlebar")[0];
    if (note.getAttribute('data-theme') === "lightmode") {
        titlebar.style.backgroundColor = "white";
        titlebar.style.color = "black";
        notearea.style.backgroundColor = `hsla(0, 0%, 85%, ${opacity})`;
        notearea.style.color = "black";
    } else if (note.getAttribute('data-theme') === "darkmode") {
        notearea.style.backgroundColor = `hsla(0, 0%, 10%, ${opacity})`;
        notearea.style.color = "white";
        titlebar.style.backgroundColor = "black";
        titlebar.style.color = "white";
    } else if (note.getAttribute('data-theme') === "contrastmode1") {
        titlebar.style.backgroundColor = "white";
        titlebar.style.color = "black";
        notearea.style.backgroundColor = `hsla(0, 0%, 10%, ${opacity})`;
        notearea.style.color = "white";
    } else if (note.getAttribute('data-theme') === "contrastmode2") {
        titlebar.style.backgroundColor = "black";
        titlebar.style.color = "white";
        notearea.style.backgroundColor = `hsla(0, 0%, 85%, ${opacity})`;
        notearea.style.color = "black";
    }
}

function undoDelete() {
    var note = deletednotes.pop();
    note.getElementsByClassName("exittooltip")[0].style.display = "none";
    note.id = "notepad" + notes.length;
    notes.push(note);
    notepadcontainer.appendChild(note);
    saveNote();
    titleToEllipsis(note);
}


function createLinkTooltip() {
    var tooltipParent = document.createElement('div');
    tooltipParent.innerHTML = `<span contenteditable="false" style="display:none; top:0px; left:0px; pointer-events: none; text-align: center; font-size:0.8em; color: hsl(0,0%,30%); border: 0.05em solid gray; background-color:hsl(0,0%,80%); position: absolute; z-index: 11; width:11em; padding: 0em 0em 0.1em 0em;" id="linktooltip">Follow Link: Ctrl+Click</span>`;
    var tooltip = tooltipParent.firstChild.cloneNode(true);
    notepadcontainer.appendChild(tooltip);
}

function connectLinkToTooltip(note) {
    [...note.getElementsByClassName('linkified')].forEach((e) => {
        var tooltip = document.getElementById("linktooltip");
        e.addEventListener("mouseover", (f) => {
            let extraY = f.target.offsetHeight - f.offsetY;
            tooltip.style.left = (f.x) + 'px';
            tooltip.style.top = (f.y + extraY + 4) + 'px';
            tooltip.style.display = 'block';
        });
        e.addEventListener("mouseout", () => {
            tooltip.style.display = "none";
        });
        checkfordeleted(note, e, tooltip);
    });
}

function checkfordeleted(note, e, tooltip) {
    var mutObs = new MutationObserver((mutRec) => {
        mutRec.forEach((record) => {
            if ([...record.removedNodes].includes(e))
                tooltip.style.display = "none";
        });
    });
    mutObs.observe(note, {
        subtree: true,
        childList: true
    });
}

function handleimg(note) {
    var imgs = [...note.getElementsByTagName('img')];
    var handledImgs = [...note.getElementsByClassName('handled')];
    var toHandle = imgs.filter(element => !handledImgs.includes(element));
    toHandle.forEach((e) => {
        e.style.maxWidth = '100%';
        e.style.height = 'auto';
        e.className = "handled";
    });
}

function preventTrailingRemoveLinkify(range) {
    if (range[0].startContainer.className === 'nolinkify') {
        range[0].endContainer.className = '';
    }
}