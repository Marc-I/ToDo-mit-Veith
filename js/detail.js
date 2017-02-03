/**
 * Created by marc-iten on 03.02.17.
 */

var $MyToDoList;
var $CurrentToDoItem;

$(document).ready(function () {
    LoadList();
    $CurrentToDoItem=GetListItemByID(QueryString.id);
    $('.detail .caption input').val($CurrentToDoItem.Title);
});

function LoadList() {
    if (typeof (Storage) !== undefined) {
        var $tmp = localStorage.getItem('MyToDoList');
        if ($tmp != null) {
            $MyToDoList = JSON.parse($tmp);
            return;
        }
    }
    $MyToDoList = [];
}

function SaveList() {
    if (typeof (Storage) !== undefined)
        localStorage.setItem('MyToDoList', JSON.stringify($MyToDoList));
}

function GetListItemByID($ListID) {
    return $MyToDoList.filter(function (f) {
        return f.ID == $ListID;
    })[0];
}

var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();
