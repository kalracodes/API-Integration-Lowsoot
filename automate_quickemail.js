const api_key_quickemail = 'a251a31187060827a22f4d0c9f9b10acb87d5385ad471bcfe0711e7cdeae'
const getBtn = document.getElementById('get-btn');
const pushBtn = document.getElementById('push-btn');
const arrlen = document.getElementById('check-len');
const data = document.getElementById('dom');
let picker = document.getElementById("demoPick");
let file_na = document.getElementById("file-name");
let leng = document.getElementById("array-len");
let array = [];
let csv = [];
var arraydata = [];
let filenames = "abc";
let arrayHeader = ["First Name", "Last Name", "Title", "Company", "Email", "Linkedin"]
let final_name = "";
let len = -1;

function removeDuplicates(arr) {
    var unique = [];
    // console.log(arr)
    arr.forEach(element => {
        if (element.Email == undefined) {
            console.log(element.Email);
        } else {
            // console.log(element.Email);
            if (element.Email.lastIndexOf('@') == -1) {} else {
                unique.push([element["First Name"], element["Last Name"], element["Title"], element["Company"], element["Email"], element["Person Linkedin Url"]]);
            }
        }
    });
    return unique;
}

file_na.onchange = () => {
    final_name = file_na.value;
}

leng.onchange = () => {
    len = leng.value;
}

picker.onchange = () => {
    readmultifiles(picker.files)
}

function dom(str) {
    data.innerHTML = str;
}

function arraylen() {
    dom('There are ' + arraydata.length + ' elements in the array')
}

function spliting(str) {
    let splitStrings = [],
        delimiter = ',',
        flag = 0,
        word = "";
    for (i = 0; i < str.length; i++) {
        if (str[i] == `"`) {
            if (flag == 0) {
                flag = 1;
                delimiter = '^';
            } else {
                flag = 0;
                delimiter = ',';
            }
        }
        if (str[i] == delimiter) {
            splitStrings.push(word);
            word = '';
        } else {
            word += str[i];
        }
    }
    splitStrings.push(word.trim("\r"));
    return splitStrings;
}

function csvToArray(str) {
    // covert CSV to array
    const headers = spliting(str.slice(0, str.indexOf("\n")));
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = spliting(row);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

function export_csv(csv, fileName) {
    let csvData = new Blob([csv], {
        type: 'text/csv'
    });
    let csvUrl = URL.createObjectURL(csvData);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
    return csv;
}

function pushData() {
    if (final_name == "" && len <= 0) {
        dom("Enter file name and length");
        return;
    } else if (final_name == "") {
        dom("Enter file name");
        return;
    } else if (len <= 0) {
        dom("Enter length to divide");
        return;
    }
    console.log(arraydata);
    let count = 0;
    let cs = arrayHeader.join(",") + '\n';
    let a = 0;
    for (let i = 0; i < arraydata.length; i++) {
        cs += arraydata[i].join(",");
        cs += '\n';
        count++;
        if (count == len) {
            csv[a] = export_csv(cs, final_name + "(" + a + ")");
            count = 0;
            a++;
            cs = arrayHeader.join(",") + '\n';
        }
    }
    if (cs != "First Name,Last Name,Title,Company,Email,Linkedin\n") {
        csv[a] = export_csv(cs, final_name + "(" + a + ")");
    }
    console.log(csv)
}

function getData() {
    dom("This process takes a mintue so settle down and don't hurry");
    for (let i = 0; i < array.length; i++) {
        abc = array[i]
        console.log(abc)
        var settings = {
            "Access-Control-Allow-Origin":"*",
            "url": "https://api.quickemailverification.com/v1/verify?email=" + abc[4] + "&apikey=" + api_key_quickemail,
            "timeout": 0,
            "methods": "GET",
        };
        $.ajax(settings).done(function (response) {
            console.log(response);
            abc = array[i]
            if (response.safe_to_send == "true") {
                arraydata.push([abc[0], abc[1], abc[2], abc[3], abc[4], abc[5]]);
            }
        });
    }
}

function readmultifiles(files) {
    array = [];
    var reader = new FileReader();
    let data;

    function readFile(index) {
        if (index >= files.length) {
            array = removeDuplicates(array);
            dom('Unique elements: ' + array.length);
            console.log(array);
            return;
        }
        var file = files[index];
        reader.onload = function (e) {
            data = csvToArray(e.target.result);
            abc = JSON.stringify(data)
            abc = JSON.parse(abc);
            for (let i = 0; i < abc.length; i++) {
                if (JSON.stringify(abc[i]) === '{}') {
                    continue;
                }
                array.push(abc[i]);
            }
            readFile(index + 1)
        }
        reader.readAsText(file);
    }
    readFile(0);
}

getBtn.addEventListener('click', getData);
pushBtn.addEventListener('click', pushData);
arrlen.addEventListener('click', arraylen);