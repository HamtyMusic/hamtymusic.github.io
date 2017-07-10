var detailProperties = [ "genre", "duration", "tempo", "type" ],
  linksToDisplay = [[ "soundcloud", "Soundcloud" ], [ "youtube", "Youtube" ], [ "spotify", "Spotify" ], [ "itunes", "iTunes" ], [ "googleMusic", "Google Play Music" ], [ "amazon", "Amazon" ], [ "routenote", "Routenote Direct" ], [ "bandcamp", "Bandcamp" ]];

function Search(str) {
  str = str || "";
  if (str.length == 0) {
    return Tracks
  }
  var srchTgs = str.split(" ");
  for (var i = 0; i < srchTgs.length; i++) {
    srchTgs[i] = srchTgs[i].toLowerCase()
  }
  var mObj = {};
  for (i in Tracks) {
    if (!Tracks.hasOwnProperty(i)) { continue }
    mObj[i] = true
  }
  for (var i = 0; i < srchTgs.length; i++) {
    for (var y in mObj) {
      if (Tracks[y].name && mObj.hasOwnProperty(y)) {
        if (((Tracks[y].name).toLowerCase()).search(srchTgs[i]) == -1) {
          delete mObj[y]
        }
      }
    }
  }
  var results = {};
  for (i in mObj) {
    if (!mObj.hasOwnProperty(i)) { continue }
    results[i] = (Tracks[i])
  }
  return results
}

function drawTracks(Tracks, defTracks) {
  if (!Tracks || Tracks.length == 0) {
    return false;
  }
  defTracks = defTracks || window.Tracks || Tracks;
  var trackParent = $("#TrackList")[0];
  /* hideTracks(Tracks); */
  var showAfter = 0;
  for (var i in defTracks) {
    if (!defTracks.hasOwnProperty(i)) { continue }
    (function () {
      var Track = defTracks[i];
      var should = Tracks.hasOwnProperty(i);
      if(!Track.elem) {
        var wrap = newElem("div", trackParent, "track-wrap" + ((document.documentElement.classList && document.documentElement.classList.toggle) ? " hide invisible" : ""));
        var elem = newElem("div", wrap, "track pb shadow-2 dynamic");
        Track.elem = wrap;
        Track.shown = false;
        if (Track.img) {
          var imgPar = newElem("a", elem, { class: "track-image-wrap lighten", href: "#" + i });
          var img = newElem("img", imgPar, { class: "track-image shadow dynamic", src: Track.img.replace(/^http:\/\//i, 'https://') })
        }
        var title = newElem("div", elem, { class: "track-title", innerHTML: Track.title, title: Track.name });
        addEvent(title, "dblclick", function() {
          selectText(title)
        });
        var author = newElem("div", elem, { class: "track-author", innerHTML: Track.author, title: Track.name });
        newElem("div", elem, { class: "divider-1" });
        //Release Date
        if (Track.date) {
          if (Object.prototype.toString.call(Track.date) === "[object Date]") {
            var date = Track.date;
            var dates = newElem("div", elem, "DateContainer");
            var date1 = newElem("div", dates, {
              class: "dateText dateAbsolute",
              innerHTML: date.toLocaleDateString([], {
                day: "numeric",
                month: "short",
                year: "numeric"
              }),
              title: (date.toLocaleDateString([], {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) + " | " + date.toLocaleTimeString([]))
            });
            var date2 = newElem("div", dates, { class: "dateText dateRelative", innerHTML: timeAgo(date, 1), title: timeAgo(date) })
          }
        }
      }
      if(Track.shown != should && Track.elem.classList && Track.elem.classList.toggle) {
        if(should) {
          Track.elem.classList.remove("hide");
          Track.shown = true;
          if(showAfter < 5) {
            Track.elem.classList.remove("invisible")
          } else {
            setTimeout(function() {
              if(Track.shown) { Track.elem.classList.remove("invisible") }
            }, showAfter)
          }
          showAfter += 60
        } else {
          Track.elem.classList.add("invisible");
          Track.elem.classList.add("hide");
          Track.shown = false
        }
      }
    }())
  }
  return true
}
function drawTrack(Track) {
  if (Track) {} else {
    return false
  }
  var img = $("#TrackImage")[0];
  if (Track.img) {
    img.src = processLink(Track.img, true)
  } else {
    img.src = ""
  }
  var title = $("#TrackTitle")[0];
  title.innerHTML = Track.name || "No name";
  title.setAttribute("title", Track.title + " by " + Track.author);
  addEvent(title, "dblclick", function() {
    selectText(title)
  });

  var links = $("#TrackLinks")[0];
  links.innerHTML = "";
  var dlLinks = $("#TrackDlLinks")[0];
  dlLinks.innerHTML = "";
  if(Track.download && Track.download.length != 0) {
    for (var key in Track.download) {
      if (!Track.download.hasOwnProperty(key)) { continue; }
      var a = newElem("a", dlLinks, { class: "btn shadow dynamic wave", href: processLink(Track.download[key]), target: "_blank", innerHTML: "." + key, title: ("Free Download ." + key + " (" + Track.name + ")") })
    }
  } else {
    dlLinks.innerHTML = "Nothing here..."
  }
  linksToDisplay.forEach(function(key) {
    if(Track.links.hasOwnProperty(key[0]) && Track.links[key[0]]) {
      var a = newElem("a", links, { class: "link", href: processLink(Track.links[key[0]]), target: "_blank", title: ("\"" + Track.name + "\" on " + key[1]) });
      var dlbtn = newElem("svg", a, "link-button");
      setVectorSource(dlbtn, key[0])
    }
  });

  //Release Date
  $("#dateAbsolute")[0].innerHTML = "";
  $("#dateRelative")[0].innerHTML = "";
  if (Track.date) {
    if (Object.prototype.toString.call(Track.date) === "[object Date]") {
      var date = Track.date;
      var date1 = $("#dateAbsolute")[0];
      date1.innerHTML = date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      date1.setAttribute("title", (date.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year: "numeric"
      }) + " | " + date.toLocaleTimeString([])));
      var date2 = $("#dateRelative")[0];
      date2.innerHTML = timeAgo(date, 1);
      date2.setAttribute("title", (timeAgo(date)))
    }
  }

  var table = $("#TrackDetailsTable")[0];
  table.innerHTML = "";
  if(Track.details) {
    detailProperties.forEach(function(i) {
      if(Track.details.hasOwnProperty(i)) {
        var name = i.capFirstLetter();
        var value = Track.details[i];
        if(i == "type") {
          value = ["Original", "Remix"][value]
        } else if(i == "duration") {
          var min = Math.floor(value / 60);
          var sec = value - min * 60;
          sec = (sec < 10) ? "0" + sec : sec;
          value = min + ":" + sec
        }
        var row = newElem("div", table, "track-details-table-row");
        newElem("div", row, { class: "track-details-table-cell name", innerHTML: name });
        newElem("div", row, { class: "track-details-table-cell value", innerHTML: value })
      }
    });
    var price = Track.details.price;
  }
  $("#TrackPrice")[0].innerHTML = price || "Free";

  if(Track.links && (window.curEmbedTrack != Track || $("#embeds")[0].innerHTML == "")) {
    $("#embeds")[0].innerHTML = "";
    window.curEmbedTrack = Track;
    if(Track.links.youtube) {
      var ytid = Track.links.youtube.id;
      if(ytid) {
        var ytEmbedWrap = newElem("div", $("#embeds")[0], "yt-embed-wrap embed-wrap");
        var ytEmbedWrap2 = newElem("div", ytEmbedWrap, "yt-embed-wrap2");
        if(Track.links.youtube.aspectRatio) {
          ytEmbedWrap2.style["padding-bottom"] = 100 / Track.links.youtube.aspectRatio + "%"
        }
        var ytEmbed = newElem("iframe", ytEmbedWrap2, { class: "yt-embed embed shadow dynamic", src: "https://www.youtube.com/embed/" + ytid + "?autoplay=0&origin=" + (location.href || (location + "") || location.pathname), frameborder: 0, allowfullscreen: true });
        window.curYtEmbed = ytEmbedWrap2
      }
      window.curYtEmbedId = ytid
    }
    if($("#embeds")[0].innerHTML != "") {
      var closeButton = newElem("div", $("#embeds")[0], "close-wrap small", "embeds-close");
      var closeButtonIcon = newElem("div", closeButton, "close", "embeds-close-icon");
      addEvent(closeButton, "click", function() {
        $("#embeds")[0].innerHTML = ""
      })
    }
  }
  return true
}
function downloadTrack(Track) {
  if(!isObject(Track)) {
    Track = Tracks[Track]
  }
  if (!Track || !Track.download) return false;
  var popup = newPopup();
  if (Track.img) {
    var img = newElem("img", popup, { class: "track-image shadow", src: processLink(Track.img, true) })
  }
  var dlTextWrap = newElem("div", popup, { class: "center popup-dl-text-wrap" });
  newElem("span", dlTextWrap, { innerHTML: "Download", title: Track.name });
  if (Track.title) {
    var title = newElem("span", dlTextWrap, { class: "track-title", innerHTML: "\"" + Track.title + "\"", title: Track.name })
  }
  var linksWrap = newElem("div", popup, "popup-dl-links-wrap");
  var n = 0;
  for (var key in Track.download) {
    if (Track.download.hasOwnProperty(key)) n++
  }
  for (var key in Track.download) {
    if (Track.download.hasOwnProperty(key)) {
      var linkWrap = newElem("div", linksWrap, "link-wrap");
      linkWrap.style.width = 100 / n + "%";
      var a = newElem("a", linkWrap, { class: "btn shadow dynamic wave", href: processLink(Track.download[key]), target: "_blank", innerHTML: "." + key, title: ("Free Download ." + key + " (" + Track.name + ")") })
    }
  }
}
function drawPage(hash) {
  if (typeof hash === 'string' || hash instanceof String) {
    hash = hash || location.hash
  } else {
    hash = location.hash
  }
  hash = hash.replace('#','');
  console.log("Drawing the page using hash: " + hash);
  if(hash === "") {
    removeHash();
    if(document.body.id == "list") return false;
    document.body.id = "list";
    document.title = "Hamty\'s Music";
    drawTracks(Tracks);
  } else if(Tracks[hash]) {
    document.body.id = "info";
    document.title = Tracks[hash].name + " \| Hamty\'s Website"
    drawTrack(Tracks[hash]);
  } else {
    removeHash()
  }
}
function updateSearchValue() {
  var elem = document.getElementById("SearchInput"),
      value = elem.value;
  elem.setAttribute('value', value);
  return value
}
function updateSearch() {
  requestAnimationFrame(function() {
    if(document.body.id == "list") {
      submitSearch();
    } else {
      updateSearchValue();
    }
  });
}
function submitSearch() {
  try {
    if(document.body.id != "list") {
      location.hash = "";
      setTimeout(submitSearch, 100);
      return false;
    } else drawTracks(Search(updateSearchValue()))
  } catch(error) {}
  return false
}
function clearSearch() {
  var elem = document.getElementById("SearchInput");
  if(elem) {
    elem.value = "";
    elem.setAttribute('value', "");
    drawTracks(Tracks);
  }
}
addEvent(document, "DOMContentLoaded", function() {
  addEvent(window, "hashchange", function() {
    drawPage()
  });
  addEvent($("#TrackImage")[0], "click", function() {
    newElem("img", newPopup(), { class: "track-image shadow", src: $("#TrackImage")[0].src })
  });
  drawPage()
}, { once: true })
