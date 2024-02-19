/***
 *
 * Conversion utilities. Currently just from TabsOutliner json format
 * Used by BT import or in conjunction with associated converters.md file
 * 
 ***/


function getDateString(googleTimestamp = null) {
    // return minimal date representation to append to bookmark tag, optionally work on TS from google
    const d = googleTimestamp ? new Date(googleTimestamp) : new Date();
    const mins = d.getMinutes() < 10 ? "0"+d.getMinutes() : d.getMinutes();
    return (`${d.getMonth()+1}/${d.getDate()}/${d.getYear()-100} ${d.getHours()}:${mins}`);
}


function tabsToBT(tabsStr) {
    // take a TO export str and output a BT orgmode equivalent
    
    let tabsJson;
    try {
        tabsJson = JSON.parse(tabsStr);
    }
    catch (e) {
        alert("Error parsing TabsOutliner malformed json");
        throw(e);
    }
    const lastIndex = tabsJson.length - 1;
    let node, title, numwin = 1;
    let dateStr = getDateString().replace(':', ';');
    let BTText = "* TabsOutliner Import - " + dateStr + "\n";
    tabsJson.forEach((elt, ind) => {
        // ignore first and last elements, TO seems to use them for some special purpose 
        if (!ind || ind == lastIndex) return;   
        const info = elt[1];
        const nesting = elt[2];
        // Handle window/container type elements
        if (info.type && (info.type == 'win' || info.type == 'savedwin')) {
            node = '*'.repeat(nesting.length + 1);
            title = (info.marks && info.marks.customTitle) ?
                info.marks.customTitle : 'Window'+numwin++;
            node += ` ${title}\n`;
            BTText += node;
        }
        // Handle tab/link type elements
        if (info.data && info.data.url) {
            // Create org header row
            node = '*'.repeat(nesting.length+1);
            title = info.data.title || 'Title';
            node += ` [[${info.data.url}][${title}]]\n`;
            // Add note if any - its stored in marks.customTitle
            if (info?.marks?.customTitle) node+= `${info.marks.customTitle}\n`;
            BTText += node;
        }
    });
    console.log("Copy this text to your BrainTool.org file:\n");
    console.log(BTText);
    return BTText;
}

