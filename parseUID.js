var getUIDfromUsername = function(username, ret) {
    var resultUID;
    var userDetailPageURL = '/user/' + username;
    var AVATAR_UID_REG = /pic\/user\/l\/\d+\/\d+\/\d+\/(\d+)\.jpg/;
    var toReturn = "Nothing Now";
    $.get(userDetailPageURL, function returnUID(data) {
        var uidWeGet = AVATAR_UID_REG.exec(data);
        if (!!uidWeGet) {
            //alert(uidWeGet[1]);
            toReturn = parseInt(uidWeGet[1]);
            console.log(toReturn, typeof(toReturn));
            ret.UID = toReturn;
        } else {
            //alert("Nothing Get!");
            throw "Nothing Get!"
        }
    });
}

Array.prototype.unique = function() {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
}


$("input[type='submit']").click(function() {
    BLOCK_USERNAME_LIST = $("#busrnl").attr("value").replace(/\s+/g, "").split(",");
    BLOCK_UID_LIST = [];
    BLOCK_USERNAME_LIST.forEach(function(item, index, input) {
        if (!isNaN(parseInt(item))) {
            BLOCK_UID_LIST.push(parseInt(item));
        }
    });
    //JS你是个⑨吗!!!
    localStorage["blockUsernameList"] = '["' + BLOCK_USERNAME_LIST.join('","') + '"]';
    localStorage["blockUidList"] = '[' + BLOCK_UID_LIST + ']';
    //console.log(localStorage["blockUsernameList"], localStorage["blockUidList"]);
    console.log("Block UID List Updated: " + localStorage["blockUidList"]);
    console.log("Block Username List Updated: " + localStorage["blockUsernameList"]);
});