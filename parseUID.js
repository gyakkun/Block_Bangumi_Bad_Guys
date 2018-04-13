var AVATAR_LARGE_UID_REG = /pic\/user\/l\/\d+\/\d+\/\d+\/(\d+)\.jpg/;

var getUidFromEachUsername = function(username, blockUidList) {
    blockUidList = [];
    var resultUID;
    var userDetailPageURL = '/user/' + username;
    var toReturn = "Nothing Now";
    $.get(userDetailPageURL, function returnUID(data) {
        var uidWeGet = AVATAR_LARGE_UID_REG.exec(data);
        if (!!uidWeGet) {
            toReturn = parseInt(uidWeGet[1]);
            alert(toReturn + typeof(toReturn));
            console.log(toReturn, typeof(toReturn));
            blockUidList.push(toReturn);
            alert(blockUidList[blockUidList.length - 1]);
        } else {
            alert("Username " + username + " not found!");
            console.error("Username " + username + " not found!");
        }
        alert(blockUidList);
    });
};

$("input[type='submit']").click(function handleUsernameAndUid() {

    BLOCK_USERNAME_LIST = $("#busrnl").attr("value").replace(/\s+/g, "").split(",");
    BLOCK_UID_LIST = [];

    var BLOCK_USERNAME_LIST_COPY = BLOCK_USERNAME_LIST.slice(0);
    var setUsernameAndUidCallBack = function() {
        localStorage["blockUsernameList"] = '["' + BLOCK_USERNAME_LIST.join('","') + '"]';
        localStorage["blockUidList"] = '[' + BLOCK_UID_LIST + ']';
    }

    var bulCtr = BLOCK_USERNAME_LIST_COPY.length;

    BLOCK_USERNAME_LIST_COPY.forEach(function getUid(item, index, input, setUsernameAndUidCallBack) {
        getUidFromEachUsername(item, BLOCK_UID_LIST);
        if (!bulCtr--) {
            setUsernameAndUidCallBack();
            alert(BLOCK_UID_LIST);
            return;
        }
        //BLOCK_UID_LIST.push(ret.UID);
    });


    console.log("Block UID List Updated: " + localStorage["blockUidList"]);
    console.log("Block Username List Updated: " + localStorage["blockUsernameList"]);
});

//arr to obj
var arr = [];
for (var index in obj) {
    arr.push(obj[index]);
}

//obj to arr
var obj = {};
for (var index in arr) {
    obj[index] = arr[index];
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