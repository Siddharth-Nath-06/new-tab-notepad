// #region Global Variable Initialization
const notepadcontainer = document.getElementsByTagName('body')[0];
const parentproto = document.createElement('div');
const lightToneHslLightness = '95%';
const darktoneHslLightness = '10%'
var deletednotes = [];
var notes = [];
var previousContextTarget = '';
var prototype;
const parentmin = document.createElement('div');
var minimizedPrototype;
var noteBeingLoaded = false;
// #endregion Global Variable Initialization


// Message Listeners for Background script for context menu buttons
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
        else if (request.action === "change") {
            location.reload();
        }
    });
} catch (error) {
    console.error('Error in message listener:', error);
}

// #region for fetching and initializing external html
async function getFileFromExtension(path) {
    const url = chrome.runtime.getURL(path);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching file:', error);
        return null;
    }
}

async function initProto() {
    parentproto.innerHTML = await getFileFromExtension('./prototype.html');
    prototype = parentproto.children[0];
    parentmin.innerHTML = await getFileFromExtension('./minimized.html');
    minimizedPrototype = parentmin.children[0];
    return true;
}
// #endregion for fetching and initializing external html


window.onload = function () {
    notepadcontainer.style.overflow = "hidden";
    createLinkTooltip();
    initProto().then(loadnote);
}

// #region for Basic Notepad Functions
function createnotepad(note) {
    positionchanger(note);
    notepadcontainer.appendChild(note);
    titleToEllipsis(note);
    addEventListenersToNote(note);
    checkTitlebarWidthChange(note);
    fontStyleObserver(note);
}

function loadnote() {
    var savefile = JSON.parse(localStorage.getItem("savefile")) || savefile;
    noteBeingLoaded = true;
    for (i in savefile) {
        var note = prototype.cloneNode(true);
        note.id = i;
        note.getElementsByClassName("title")[0].textContent = savefile[i].title || "Notepad";
        note.getElementsByClassName("note")[0].innerHTML = savefile[i].content || "";
        note.style.left = savefile[i].position.left || "0px";
        note.style.top = savefile[i].position.top || "0px";
        note.style.width = savefile[i].size.width || "30vw";
        note.style.height = savefile[i].size.height || "30em";
        note.setAttribute('data-theme', savefile[i].theme || "darkmode");
        var opacity = savefile[i].opacity || 0.8;
        note.getElementsByClassName("note")[0].style.backgroundColor = `hsla(0,0%, ${darktoneHslLightness}, ${opacity})`;
        setmodeswitch(note, note.getAttribute('data-theme'));
        switchmode([note], note.getAttribute('data-theme'));
        notes.push(note);
        createnotepad(note);
        var minimized = savefile[i].minimized;
        if (minimized)
            minimizeNote(note);
    }
    noteBeingLoaded = false;
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
    var minimize = note.getElementsByClassName("minimize")[0];
    var titlebar = note.getElementsByClassName("titlebar")[0];
    var resizer = note.getElementsByClassName("resizer")[0];

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

    resizer.addEventListener("mousedown", (e) => {
        var offsetX = e.clientX - note.offsetWidth;
        var offsetY = e.clientY - note.offsetHeight;

        function onMouseMove(event) {
            var X = event.clientX - offsetX;
            var Y = event.clientY - offsetY;

            note.style.height = Y + 'px';
            note.style.width = X + 'px';
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
            saveNote();
            note.onmouseup = null;
        }, false);
    }, true);

    title.addEventListener('input', saveNote);

    title.addEventListener('beforeinput', (e) => {
        if(e.inputType === 'insertParagraph'){
            e.preventDefault();
            notearea.focus();
        }
    });

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
    minimize.addEventListener("click", () => {
        minimize.previousElementSibling.style.display = 'none';
        minimizeNote(note);
    }, true);


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

    var tooltippers = [darkmode, lightmode, contrastmode1, contrastmode2, title, down, up, defaultOpacity, exit, minimize];
    tooltippers.forEach((e) => {
        e.addEventListener("mouseover", () => {
            e.previousElementSibling.style.display = "block";
        });
        e.addEventListener("mouseout", () => {
            e.previousElementSibling.style.display = "none";
        });
    });

    // event listener for mode switch
    var modes = [darkmode, lightmode, contrastmode1, contrastmode2];

    modeswitch.addEventListener("click", () => {
        var syncTheme = localStorage.getItem("syncTheme") || "false";
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

    notearea.addEventListener("keydown", (e) => {
        if (e.code === "KeyA" && e.ctrlKey) {
            e.preventDefault();
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(notearea);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
}

function saveNote() {
    if (!noteBeingLoaded) {
        var savefile = {};
        notes.forEach((note, index) => {
            var title = retrievetitle(note);
            var content = note.querySelector('.note').innerHTML || "";
            var position = {
                left: note.style.left || "0px",
                top: note.style.top || "0px"
            };
            var size = {
                width: note.style.width || "30vw",
                height: note.style.height || "30em"
            };
            var opacity = note.querySelector('.note').style.backgroundColor.slice(-4, -1) || "0.8";
            var theme = note.getAttribute('data-theme') || "darkmode";
            var minimized = !notepadcontainer.contains(note);
            savefile["notepad" + index] = {
                title: title,
                content: content,
                position: position,
                size: size,
                opacity: opacity,
                theme: theme,
                minimized: minimized
            };
        });
        if (localStorage.getItem("savefile") !== JSON.stringify(savefile))
            chrome.runtime.sendMessage({ action: "changed" });
        localStorage.setItem("savefile", JSON.stringify(savefile));
    }
}
// #endregion for Basic Notepad Functions


// #region Note State Changes and Deletion
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

function undoDelete() {
    var note = deletednotes.pop();
    note.getElementsByClassName("exittooltip")[0].style.display = "none";
    note.id = "notepad" + notes.length;
    notes.push(note);
    notepadcontainer.appendChild(note);
    saveNote();
    titleToEllipsis(note);
}

function minimizeNote(note) {
    saveNote();
    var notemin = minimizedPrototype.cloneNode(true);

    //set sttributes to notemin
    notemin.id = note.id;
    if (note.getAttribute("data-theme") == 'lightmode' || note.getAttribute("data-theme") == 'contrastmode1')
        notemin.style.backgroundColor = 'white';
    else
        notemin.style.backgroundColor = 'black';
    notemin.style.color = note.getElementsByClassName('titlebar')[0].style.color;
    notemin.style.top = note.style.top;
    notemin.style.left = note.style.left;

    var title = notemin.getElementsByClassName('title')[0];
    var titlebar = notemin.getElementsByClassName('titlebar')[0];

    title.innerHTML = retrievetitle(note);
    title.title = title.innerHTML;

    var maximizeButton = notemin.getElementsByClassName('maximize')[0];
    maximizeButton.addEventListener("mouseover", () => {
        maximizeButton.previousElementSibling.style.display = "block";
    });
    maximizeButton.addEventListener("mouseout", () => {
        maximizeButton.previousElementSibling.style.display = "none";
    });
    maximizeButton.addEventListener("click", () => {
        notepadcontainer.removeChild(notemin);
        notepadcontainer.appendChild(note);
        saveNote();
    });

    notepadcontainer.removeChild(note);
    notepadcontainer.appendChild(notemin);

    if (title.scrollHeight > titlebar.clientHeight) {
        title.textContent = title.textContent.slice(0, 10) + '...';
    }

    titlebar.addEventListener("mousedown", (e) => {
        if (e.target.className === "titlebar" || e.target.className == 'title') {
            var offsetX = e.clientX - notemin.getBoundingClientRect().left;
            var offsetY = e.clientY - notemin.getBoundingClientRect().top;

            function onMouseMovemin(event) {
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
                notemin.style.top = Y + 'px';
                note.style.left = X + 'px';
                notemin.style.left = X + 'px';
            }

            document.addEventListener('mousemove', onMouseMovemin);
            document.addEventListener('mouseup', function () {
                document.removeEventListener('mousemove', onMouseMovemin);
                //save position of notepad in local storage
                saveNote();
                note.onmouseup = null;
            }, false);
        }
    }, true);

    saveNote();
}
// #endregion Note State Changes and Deletion


// #region Opacity Control
function opacitydown(note) {
    var color = note.style.backgroundColor;
    try {
        var alpha = color.split(',')[3].split(')')[0];
    } catch (error) {
        alpha = 0.05;
    }
    alpha = parseFloat(alpha) - 0.1;
    if (alpha <= 0.1) {
        alpha = 0.05;
    }
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, ${lightToneHslLightness}, ${alpha})`;
    } else {
        note.style.backgroundColor = `hsla(0,0%, ${darktoneHslLightness}, ${alpha})`;
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
    if (alpha >= 1) {
        alpha = 0.99;
    }
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, ${lightToneHslLightness}, ${alpha})`;
    } else {
        note.style.backgroundColor = `hsla(0,0%, ${darktoneHslLightness}, ${alpha})`;
    }
    saveNote();
}

function opacitydefault(note) {
    var noteparent = note.parentNode;
    if (noteparent.getAttribute('data-theme') === "lightmode" || noteparent.getAttribute('data-theme') === "contrastmode2") {
        note.style.backgroundColor = `hsla(0, 0%, ${lightToneHslLightness}, 0.8)`;
    } else {
        note.style.backgroundColor = `hsla(0,0%, ${darktoneHslLightness}, 0.8)`;
    }
    saveNote();
}
// #endregion for Opacity Control


// #region for Title to Ellipsis
function checkTitlebarWidthChange(note) {
    var titlebar = note.getElementsByClassName("titlebar")[0];
    var resObs = new ResizeObserver((obs) => {
        obs.forEach((e) => {
            if (e.target === titlebar) {
                titleToEllipsis(note);
            }
        });
    });
    resObs.observe(titlebar, {
        box: "content-box"
    })
}

function titleToEllipsis(note) {
    var title = note.getElementsByClassName("title")[0];
    var titlebar = note.getElementsByClassName("titlebar")[0];
    saveNote();
    var titleMaxLetters = Math.floor((titlebar.clientWidth - 123) / 7.054) - 3;
    if (title.scrollHeight > titlebar.clientHeight || title.innerHTML.endsWith('...')) {
        title.textContent = retrievetitle(note).slice(0, titleMaxLetters) + '...';
    }

    setTitleMaxWidth(title, (titlebar.clientWidth - 123));
}

function setTitleMaxWidth(title, titleMaxWidth) {
    title.style.maxWidth = titleMaxWidth + 'px';
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
// #endregion for Title to Ellipsis


// #region for Linkify
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

function preventTrailingRemoveLinkify(range) {
    if (range[0].startContainer.className === 'nolinkify') {
        range[0].endContainer.className = '';
    }
}
// #endregion for Linkify


// #region for Theme Switch

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
        try {
            var opacity = n.getElementsByClassName("note")[0].style.backgroundColor.split(',')[3].split(')')[0];
        } catch {
            var opacity = 0.8;
        }
        n.setAttribute('data-theme', mode);
        var notearea = n.getElementsByClassName("note")[0];
        var titlebar = n.getElementsByClassName("titlebar")[0];

        var titlebackcolor = (mode === 'lightmode' || mode === "contrastmode1") ? 'white' : 'black';
        var titlecolor = !(mode === 'lightmode' || mode === "contrastmode1") ? 'white' : 'black';

        var backgroundBackcolor = (mode === 'lightmode' || mode === "contrastmode2") ? lightToneHslLightness : darktoneHslLightness;
        var backgroundcolor = (mode === 'lightmode' || mode === 'contrastmode2') ? 'black' : 'white';

        titlebar.style.backgroundColor = titlebackcolor;
        titlebar.style.color = titlecolor;

        notearea.style.backgroundColor = `hsla(0, 0%, ${backgroundBackcolor}, ${opacity})`;
        notearea.style.color = backgroundcolor;
    });
}
// #endregion for Theme Switch


// #region for Link Tooltip
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
// #endregion for Link Tooltip


// #region General Formatting
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

function fontStyleObserver(note) {
    var mutObs = new MutationObserver((mutRec) => {
        mutRec.forEach((record) => {
            record.addedNodes.forEach((newNode) => {
                try {
                    newNode.style.fontSize = '1em';
                    newNode.style.fontFamily = 'monospace';
                } catch { }
            });
        });
    });
    mutObs.observe(note, {
        subtree: true,
        childList: true
    });
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
// #endregion General formatting
