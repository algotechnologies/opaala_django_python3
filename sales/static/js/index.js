init();

function init() {
    var code = getUrlVars()["code"];
    if (code == null) {
        document.getElementById("btn_auth").style.display = "block";
    } else {
        httpGetAsync('http://127.0.0.1:8000/vend/' + code, callBack);
    }
}

function connectWithVend() {
    window.location.href = 'https://secure.vendhq.com/connect?response_type=code&client_id=dqM1aaPKaIjQSDtdHezyHzeZzB6MnVN3&redirect_uri=http://127.0.0.1:8000&state=true';
}

function callBack(result) {
    var obj = JSON.parse(result);

    var table = document.getElementById('table_data');
    table.style.display = "block";
    
    obj.forEach(function(item, index) {
        console.log(item.fields.name);
        var tr = document.createElement('tr');
        
        var td_id = document.createElement('td');
        var td_item = document.createElement('td');
        var td_category = document.createElement('td');
        var td_price = document.createElement('td');
        var td_btn = document.createElement('BUTTON');

        var text_id = document.createTextNode(item.fields.uid);
        var text_item = document.createTextNode(item.fields.name);
        var text_category = document.createTextNode(item.fields.category);
        var text_price = document.createTextNode(item.fields.price);
        var text_btn = document.createTextNode('Place Order');

        td_btn.id = index;
        td_btn.onclick = function() {

            var prod_id = obj[td_btn.id].fields.uid.trim();
            var prod_price = obj[td_btn.id].fields.price;

            var params = 'prod_id='+prod_id+'&prod_price='+prod_price;

            console.log(params);

            httpPostAsync('http://127.0.0.1:8000/vend_place_order/', params, callBackOrder);
            return false;
        };

        td_id.appendChild(text_id);
        td_item.appendChild(text_item);
        td_category.appendChild(text_category);
        td_price.appendChild(text_price);
        td_btn.appendChild(text_btn);

        tr.appendChild(td_id);
        tr.appendChild(td_item);
        tr.appendChild(td_category);
        tr.appendChild(td_price);
        tr.appendChild(td_btn);

        table.appendChild(tr);
    });
}

function callBackOrder(result) {
    alert(result)
}

//For Get Requests
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(null);
}

//For Post Requests
function httpPostAsync(theUrl, params, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(params);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}