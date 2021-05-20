// Put all onload AJAX calls here, and event listeners
let gpxFiles = "";
let latArray = [];
let lonArray = [];
jQuery(document).ready(function() {

    // On page-load AJAX Example
    jQuery.ajax({
        type: 'get',            //Request type
        dataType: 'json',       //Data type - we will use JSON for almost everything 
        url: '/getfileviewpanel',   //The server endpoint we are connecting to
        data: {
            data1: "asasds",
        },
        success: function (data) {
            /*  Do something with returned object
                Note that what we get is an object, not a string, 
                so we do not need to parse it on the server.
                JavaScript really does handle JSONs seamlessly
            */
            let body = document.getElementsByTagName("body")[0];
            let tbl = document.createElement("table");
            let tblBody = document.createElement("tbody");
            let headrow = document.createElement("tr");
            let headcell1 = document.createElement("th");
            let headcellText1 = document.createTextNode("File name(click to download)");
            headcell1.appendChild(headcellText1);
            let headcell2 = document.createElement("th");
            let headcellText2 = document.createTextNode("Version");
            headcell2.appendChild(headcellText2);
            let headcell3 = document.createElement("th");
            let headcellText3 = document.createTextNode("Creator");
            headcell3.appendChild(headcellText3);
            let headcell4 = document.createElement("th");
            let headcellText4 = document.createTextNode("numWaypoints");
            headcell4.appendChild(headcellText4);
            let headcell5 = document.createElement("th");
            let headcellText5 = document.createTextNode("numRoutes");
            headcell5.appendChild(headcellText5);
            let headcell6 = document.createElement("th");
            let headcellText6 = document.createTextNode("numTracks");
            headcell6.appendChild(headcellText6);
            headrow.appendChild(headcell1);
            headrow.appendChild(headcell2);
            headrow.appendChild(headcell3);
            headrow.appendChild(headcell4);
            headrow.appendChild(headcell5);
            headrow.appendChild(headcell6);
            tblBody.appendChild(headrow);
            console.log("hello");
            for(theFile of data.files) {
                let row = document.createElement("tr");
                
                let cell1 = document.createElement("td");
                let cellID1 = document.createElement("a");
                let cellText1 = document.createTextNode((theFile.fileName));
                cellID1.appendChild(cellText1);
                cellID1.href = theFile.fileName;
                cell1.appendChild(cellID1);
                let cell3 = document.createElement("td");
                let cellText3 = document.createTextNode((theFile.version));
                cell3.appendChild(cellText3);
                let cell2 = document.createElement("td");
                let cellText2 = document.createTextNode((theFile.creator));
                cell2.appendChild(cellText2);
                let cell4 = document.createElement("td");
                let cellText4 = document.createTextNode((theFile.numWaypoints));
                cell4.appendChild(cellText4);
                let cell5 = document.createElement("td");
                let cellText5 = document.createTextNode((theFile.numRoutes));
                cell5.appendChild(cellText5);
                let cell6 = document.createElement("td");
                let cellText6 = document.createTextNode((theFile.numTracks));
                cell6.appendChild(cellText6);
                row.appendChild(cell1);
                row.appendChild(cell3);
                row.appendChild(cell2);
                row.appendChild(cell4);
                row.appendChild(cell5);
                row.appendChild(cell6);
                tblBody.appendChild(row);
                //theBody.append(row);
            }
            tables.appendChild(tblBody);
            body.appendChild(tbl);

            //jQuery('#blah').html("On page load, received string '"+data.somethingElse+"' from server");
            
            //We write the object to the console to show that the request was successful
            //console.log(data); 

        },
        fail: function(error) {
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
    $(document).on('click', '.gpxfiles', function() {
        //gpxFiles = $(this).text().toString();
        var e = document.getElementById("myDropdown");
        gpxFiles = e.value;
        //gpxFiles = "simple.gpx";
        console.log(gpxFiles);
        // On page-load AJAX Example
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/getgpxviewpanel',   //The server endpoint we are connecting to
            data: {
                data1: gpxFiles
            },
            success: function (data) {
                
                /*  Do something with returned object
                    Note that what we get is an object, not a string, 
                    so we do not need to parse it on the server.
                    JavaScript really does handle JSONs seamlessly
                */
                $("#table2 tr").remove(); 
                $("#myDropdown2 option").remove(); 
                let body = document.getElementsByTagName("body")[0];
                let tbl = document.createElement("table");
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("Component");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("Name");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("Number of Points");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("Length");
                headcell4.appendChild(headcellText4);
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("Loop");
                headcell5.appendChild(headcellText5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                headrow.appendChild(headcell5);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                console.log(data.dat);
                for (dats of data.dat) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(dats.count);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((dats.name));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((dats.numPoints));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((dats.len));
                    cell4.appendChild(cellText4);
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode((dats.loop));
                    cell5.appendChild(cellText5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    row.appendChild(cell5);
                    tblBody.appendChild(row);
                    let rows = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((dats.count));
                    text.appendChild(text2);
                    rows.appendChild(text);
                    myDropdown2.appendChild(rows);
                    //theBody.append(row);
                }
                table2.appendChild(tblBody);
                body.appendChild(tbl);
    
                //jQuery('#blah').html("On page load, received string '"+data.somethingElse+"' from server");
                
                //We write the object to the console to show that the request was successful
                //console.log(data); 
    
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        });
        
    });
    $(".otherData").click(function() {
        console.log("hell");
        var elem = document.getElementById("myDropdown");
        gpxFiles = elem.value;
        var elem2 = document.getElementById("myDropdown2");
        let comp = elem2.value;
        console.log(comp);
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/getotherdata',   //The server endpoint we are connecting to
            data: {
                data1: gpxFiles,
                data2: comp
            },
            success: function (data) {
                let gpxList = "";
                if (data.other != "") {
                    for (gpx of data.other) {
                        gpxList += "name:" + gpx.name + "\n";
                        gpxList += "value:" + gpx.value + "\n";
                    }
                } else {
                    gpxList = "No Other Data";
                }
                window.alert(gpxList);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });

    $(document).on('click', '.gpxFiles', function() {
        console.log("peep");
        var e = document.getElementById("myDropdown");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getgpxviewpanel',
            data: {
                data1: gpxFiles
            },
            success: function (data) {
                for (dats of data.dat) {
                    let row = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((dats.count));
                    text.appendChild(text2);
                    row.appendChild(text);
                    myDropdown2.appendChild(row);
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    /*$(document).click('.otherData', function() {
        let vara = "";
        window.alert("jake is a poopoo");
    });*/
    
    $(document).ready(function() {
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/getfileviewpanel',   //The server endpoint we are connecting to
            data: {
                data1: "esdbk",
            },
            success: function (data) {
                for(theFile of data.files) {
                    let row = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((theFile.fileName));
                    text.appendChild(text2);
                    console.log(theFile.fileName);
                    //gpxFiles = theFile.fileName;
                    //text.class = "gpxfiles";
                    console.log("hellooo");
                    row.appendChild(text);
                    myDropdown.appendChild(row);
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    })  
    // Event listener form example , we can use this instead explicitly listening for events
    // No redirects if possible
    $('#someform').submit(function(e){
        $('#blah').html("Form has data: "+$('#entryBox').val());
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        if ($('#entryBox').val().endsWith(".gpx")) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: '/writeGPXFile',
                data: {
                    data1: $('#entryBox').val(),
                },
                success: function(data) {
                    console.log("heeee" + data);
                    if (data.parsed != "") {
                        location.reload(true); 
                        window.alert($('#entryBox').val() + "uploaded");
                    } else {
                        window.alert("file exists already");
                    }
                    
                    //let tbl = document.createElement("table");
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    $('#blah').html("On page load, received error from server");
                    console.log(error); 
                }
                //Create an object for connecting to another waypoint
            });
        }
    });
    $('#someform2').submit(function(e){
        var elem = document.getElementById("myDropdown");
        gpxFiles = elem.value;
        var elem2 = document.getElementById("myDropdown2");
        let comp = elem2.value;
        console.log($('#entryBox1').val());
        console.log($('#entryBox2').val());
        e.preventDefault();
        //Pass data to the Ajax call, so it gets passed to the server
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/changeroute',
            data: {
                data1: gpxFiles,
                data2: $('#entryBox2').val(),
                data3: $('#entryBox1').val(),
                data4: comp,
            },
            success: function(data) {
                
                location.reload(true); 
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/changeroutedb',
                    data: {
                        data1: gpxFiles,
                        data2: $('#entryBox1').val(),
                        data3: $('#entryBox2').val(),
                        data4: comp,
                    },
                    success: function(data) {
                        displayDatabase();
                    }, 
                    fail: function(error) {
                        window.alert("Could not change Route or Track Name");
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                });

                //let tbl = document.createElement("table");
            },
            fail: function(error) {
                window.alert("Could not change Route or Track Name");
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
            //Create an object for connecting to another waypoint
        });
    });
    function isInt(n){
        return Number(n) === n && n % 1 === 0;
    }
    
    function isFloat(n){
        return Number(n) === n && n % 1 !== 0;
    }
    $('#someform3').submit(function(e){
        var elem = document.getElementById("myDropdown");
        gpxFiles = elem.value;
        var elem2 = document.getElementById("myDropdown2");
        let comp = elem2.value;
        if (parseFloat($('#entryBox3').val()) && $('#entryBox4').val()) {
            if (($('#entryBox3').val() > -90 && $('#entryBox3').val() < 90) && ($('#entryBox4').val() > -180 && $('#entryBox4').val() < 180)) {
                latArray.push($('#entryBox3').val());
                lonArray.push($('#entryBox4').val());
            } else {
                window.alert("invalid lat/lon");
            }
        } else {
            window.alert("invalid lat/lon");
        }
        
        console.log(latArray);
        console.log(lonArray);
        e.preventDefault();
    });
    $(document).ready(function() {
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/dbdropdown',   //The server endpoint we are connecting to
            data: {
                data1: "esdbk",
            },
            success: function (data) {
                for(let i = 0; i < data.length; i++) {
                    let row = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((data[i]));
                    text.appendChild(text2);
                    //console.log(theFile.fileName);
                    //gpxFiles = theFile.fileName;
                    //text.class = "gpxfiles";
                    console.log("hellooo");
                    row.appendChild(text);
                    myDropdown3.appendChild(row);
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    })  
    $(document).ready(function() {
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/dbdropdown',   //The server endpoint we are connecting to
            data: {
                data1: "esdbk",
            },
            success: function (data) {
                for(let i = 0; i < data.length; i++) {
                    let row = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((data[i]));
                    text.appendChild(text2);
                    console.log(theFile.fileName);
                    //gpxFiles = theFile.fileName;
                    //text.class = "gpxfiles";
                    console.log("hellooo");
                    row.appendChild(text);
                    myDropdown4.appendChild(row);
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    }) 
    $(document).on('click', '.gpxfiles6', function() {
        console.log("im hereee");
        var e = document.getElementById("myDropdown4");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getpointsbyfilenamelength',
            data: {
                data1: gpxFiles
            },
            success: function(data) {
                console.log("brooo" + data);
                if (data.length == 0) {
                    console.log("dsjfsdfsdf");
                    $("#dbtable tr").remove(); 
                } else {
                    $("#dbtable tr").remove(); 
                    let tblBody = document.createElement("tbody");
                    let headrow = document.createElement("tr");
                    let headcell5 = document.createElement("th");
                    let headcellText5 = document.createTextNode("RouteLen");
                    headcell5.appendChild(headcellText5);
                    let headcell1 = document.createElement("th");
                    let headcellText1 = document.createTextNode("PointID");
                    headcell1.appendChild(headcellText1);
                    let headcell2 = document.createElement("th");
                    let headcellText2 = document.createTextNode("PointIndex");
                    headcell2.appendChild(headcellText2);
                    let headcell3 = document.createElement("th");
                    let headcellText3 = document.createTextNode("latitude");
                    headcell3.appendChild(headcellText3);
                    let headcell4 = document.createElement("th");
                    let headcellText4 = document.createTextNode("longitude");
                    headcell4.appendChild(headcellText4);
                    let headcell6 = document.createElement("th");
                    let headcellText6 = document.createTextNode("pointName");
                    headcell6.appendChild(headcellText6);
                    headrow.appendChild(headcell5);
                    headrow.appendChild(headcell1);
                    headrow.appendChild(headcell2);
                    headrow.appendChild(headcell3);
                    headrow.appendChild(headcell4);
                    headrow.appendChild(headcell6);
                    tblBody.appendChild(headrow);
                    //for(theFile of data) {
                    //console.log(data.points);
                    for (let i = 0; i < data.length; i++) {
                        console.log("peep this");
                        let row = document.createElement("tr");
                        let cell5 = document.createElement("td");
                        let cellText5 = document.createTextNode(data[i].RouteLen);
                        cell5.appendChild(cellText5);
                        let cell1 = document.createElement("td");
                        let cellText1 = document.createTextNode(data[i].Point_ID);
                        cell1.appendChild(cellText1);
                        let cell3 = document.createElement("td");
                        let cellText3 = document.createTextNode((data[i].PointIndex));
                        cell3.appendChild(cellText3);
                        let cell2 = document.createElement("td");
                        let cellText2 = document.createTextNode((data[i].latitude));
                        cell2.appendChild(cellText2);
                        let cell4 = document.createElement("td");
                        let cellText4 = document.createTextNode((data[i].longitude));
                        cell4.appendChild(cellText4);
                        let cell6 = document.createElement("td");
                        let cellText6 = document.createTextNode((data[i].point_name));
                        cell6.appendChild(cellText6);
                        row.appendChild(cell5);
                        row.appendChild(cell1);
                        row.appendChild(cell3);
                        row.appendChild(cell2);
                        row.appendChild(cell4);
                        row.appendChild(cell6);
                        tblBody.appendChild(row);
                        //theBody.append(row);
                    }
                    dbtable.appendChild(tblBody);
                }
            }, 
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }

        })
    }); 
    $(document).on('click', '.gpxfiles5', function() {
        console.log("im hereee");
        var e = document.getElementById("myDropdown4");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getpointsbyfilenamename',
            data: {
                data1: gpxFiles
            },
            success: function(data) {
                console.log("brooo" + data);
                if (data.length == 0) {
                    console.log("dsjfsdfsdf");
                    $("#dbtable tr").remove(); 
                } else {
                    $("#dbtable tr").remove(); 
                    let tblBody = document.createElement("tbody");
                    let headrow = document.createElement("tr");
                    let headcell5 = document.createElement("th");
                    let headcellText5 = document.createTextNode("RouteName");
                    headcell5.appendChild(headcellText5);
                    let headcell1 = document.createElement("th");
                    let headcellText1 = document.createTextNode("PointID");
                    headcell1.appendChild(headcellText1);
                    let headcell2 = document.createElement("th");
                    let headcellText2 = document.createTextNode("PointIndex");
                    headcell2.appendChild(headcellText2);
                    let headcell3 = document.createElement("th");
                    let headcellText3 = document.createTextNode("latitude");
                    headcell3.appendChild(headcellText3);
                    let headcell4 = document.createElement("th");
                    let headcellText4 = document.createTextNode("longitude");
                    headcell4.appendChild(headcellText4);
                    let headcell6 = document.createElement("th");
                    let headcellText6 = document.createTextNode("pointName");
                    headcell6.appendChild(headcellText6);
                    headrow.appendChild(headcell5);
                    headrow.appendChild(headcell1);
                    headrow.appendChild(headcell2);
                    headrow.appendChild(headcell3);
                    headrow.appendChild(headcell4);
                    headrow.appendChild(headcell6);
                    tblBody.appendChild(headrow);
                    //for(theFile of data) {
                    //console.log(data.points);
                    for (let i = 0; i < data.length; i++) {
                        console.log("peep this");
                        let row = document.createElement("tr");
                        let cell5 = document.createElement("td");
                        let cellText5 = document.createTextNode(data[i].RouteName);
                        cell5.appendChild(cellText5);
                        let cell1 = document.createElement("td");
                        let cellText1 = document.createTextNode(data[i].Point_ID);
                        cell1.appendChild(cellText1);
                        let cell3 = document.createElement("td");
                        let cellText3 = document.createTextNode((data[i].PointIndex));
                        cell3.appendChild(cellText3);
                        let cell2 = document.createElement("td");
                        let cellText2 = document.createTextNode((data[i].latitude));
                        cell2.appendChild(cellText2);
                        let cell4 = document.createElement("td");
                        let cellText4 = document.createTextNode((data[i].longitude));
                        cell4.appendChild(cellText4);
                        let cell6 = document.createElement("td");
                        let cellText6 = document.createTextNode((data[i].point_name));
                        cell6.appendChild(cellText6);
                        row.appendChild(cell5);
                        row.appendChild(cell1);
                        row.appendChild(cell3);
                        row.appendChild(cell2);
                        row.appendChild(cell4);
                        row.appendChild(cell6);
                        tblBody.appendChild(row);
                        //theBody.append(row);
                    }
                    dbtable.appendChild(tblBody);
                }
            }, 
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }

        })
    });
    $(document).ready(function() {
        jQuery.ajax({
            type: 'get',            //Request type
            dataType: 'json',       //Data type - we will use JSON for almost everything 
            url: '/dbdropdown',   //The server endpoint we are connecting to
            data: {
                data1: "esdbk",
            },
            success: function (data) {
                for(let i = 0; i < data.length; i++) {
                    let row = document.createElement("option");
                    let text = document.createElement("a");
                    let text2 = document.createTextNode((data[i]));
                    text.appendChild(text2);
                    console.log(theFile.fileName);
                    //gpxFiles = theFile.fileName;
                    //text.class = "gpxfiles";
                    console.log("hellooo");
                    row.appendChild(text);
                    myDropdown5.appendChild(row);
                }
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    }) 
    $('#lastonename').submit(function(e) {
        e.preventDefault();
        var e = document.getElementById("myDropdown5");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/lastonename',
            data: {
                data1: gpxFiles,
                data2: $('#N').val(),
                data3: $('#sl').val(),
            },
            success: function(data) {
                
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("filename");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("routeName");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("routeId");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("routeLen");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("gpxId");
                headcell4.appendChild(headcellText4);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].Filename);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Route_name);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].Route_ID));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].len));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].gpx_id));
                    cell4.appendChild(cellText4);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    tblBody.appendChild(row);
                    //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    $('#lastonelength').submit(function(e) {
        e.preventDefault();
        var e = document.getElementById("myDropdown5");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/lastonelength',
            data: {
                data1: gpxFiles,
                data2: $('#N2').val(),
                data3: $('#sl2').val(),
            },
            success: function(data) {
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("filename");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("routeName");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("routeId");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("routeLen");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("gpxId");
                headcell4.appendChild(headcellText4);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].Filename);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Route_name);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].Route_ID));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].len));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].gpx_id));
                    cell4.appendChild(cellText4);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    tblBody.appendChild(row);
                    //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    $(document).on('click', '.gpxfiles2', function() {
        console.log("peep");
        var es = document.getElementById("myDropdown3");
        gpxFiles = es.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getroutebyfilename',
            data: {
                data1: gpxFiles
            },
            success: function (data) {
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("filename");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("routeName");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("routeId");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("routeLen");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("gpxId");
                headcell4.appendChild(headcellText4);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].Filename);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Route_name);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].Route_ID));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].len));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].gpx_id));
                    cell4.appendChild(cellText4);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    tblBody.appendChild(row);
                //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    $(document).on('click', '.gpxfiles3', function() {
        console.log("peep");
        var e = document.getElementById("myDropdown3");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getroutebyfilenamebyname',
            data: {
                data1: gpxFiles
            },
            success: function (data) {
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("filename");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("routeName");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("routeId");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("routeLen");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("gpxId");
                headcell4.appendChild(headcellText4);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].Filename);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Route_name);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].Route_ID));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].len));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].gpx_id));
                    cell4.appendChild(cellText4);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    tblBody.appendChild(row);
                //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    $(document).on('click', '.gpxfiles4', function() {
        console.log("peep");
        var e = document.getElementById("myDropdown3");
        gpxFiles = e.value;
        jQuery.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getroutebyfilenamebylength',
            data: {
                data1: gpxFiles
            },
            success: function (data) {
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("filename");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("routeName");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("routeId");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("routeLen");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("gpxId");
                headcell4.appendChild(headcellText4);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].Filename);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Route_name);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].Route_ID));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].len));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].gpx_id));
                    cell4.appendChild(cellText4);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    tblBody.appendChild(row);
                //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
            },
            fail: function(error) {
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        })
    });
    $('#someform4').submit(function(e){
        var elem = document.getElementById("myDropdown");
        gpxFiles = elem.value;
        var length = lonArray.length;
        console.log($('#entryBox6').val());
        e.preventDefault();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/addwaypointswithroutes',
            data: {
                data1: gpxFiles,
                data2: $('#entryBox6').val(),
                data3: lonArray,
                data4: latArray,
                data5: length,
            },
            success: function(data) {
                
                location.reload(true); 
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/addroutedb',
                    data: {
                        data1: gpxFiles,
                        data2: $('#entryBox1').val(),
                        data3: $('#entryBox2').val()
                    },
                    success: function(data) {
                        displayDatabase();
                    }, 
                    fail: function(error) {
                        window.alert("Could not change Route or Track Name");
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                });
                //let tbl = document.createElement("table");
            },
            fail: function(error) {
                window.alert("Could not change Route or Track Name");
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        });
    });
    $('#login').submit(function(e){
        console.log("helloooooo");
        console.log($('#username').val());
        console.log($('#databaseid').val());
        console.log($('#password').val());
        e.preventDefault();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/logins',
            data: {
                data1: $('#username').val(),
                data2: $('#password').val(),
                data3: $('#databaseid').val(),
            },
            success: function(data) {
                console.log(data);
                if (data == true) {
                    window.alert("sent to databse");
                    displayDatabase();
                } else {
                    window.alert("invalid credentials");
                }
                jQuery.ajax({
                    type: 'get',            //Request type
                    dataType: 'json',       //Data type - we will use JSON for almost everything 
                    url: '/dbdropdown',   //The server endpoint we are connecting to
                    data: {
                        data1: "esdbk",
                    },
                    success: function (data) {
                        for(let i = 0; i < data.length; i++) {
                            let row = document.createElement("option");
                            let text = document.createElement("a");
                            let text2 = document.createTextNode((data[i]));
                            text.appendChild(text2);
                            console.log(theFile.fileName);
                            //gpxFiles = theFile.fileName;
                            //text.class = "gpxfiles";
                            console.log("hellooo");
                            row.appendChild(text);
                            myDropdown3.appendChild(row);
                        }
                    },
                    fail: function(error) {
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                })
                jQuery.ajax({
                    type: 'get',            //Request type
                    dataType: 'json',       //Data type - we will use JSON for almost everything 
                    url: '/dbdropdown',   //The server endpoint we are connecting to
                    data: {
                        data1: "esdbk",
                    },
                    success: function (data) {
                        for(let i = 0; i < data.length; i++) {
                            let row = document.createElement("option");
                            let text = document.createElement("a");
                            let text2 = document.createTextNode((data[i]));
                            text.appendChild(text2);
                            console.log(theFile.fileName);
                            //gpxFiles = theFile.fileName;
                            //text.class = "gpxfiles";
                            console.log("hellooo");
                            row.appendChild(text);
                            myDropdown4.appendChild(row);
                        }
                    },
                    fail: function(error) {
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                })
                jQuery.ajax({
                    type: 'get',            //Request type
                    dataType: 'json',       //Data type - we will use JSON for almost everything 
                    url: '/dbdropdown',   //The server endpoint we are connecting to
                    data: {
                        data1: "esdbk",
                    },
                    success: function (data) {
                        for(let i = 0; i < data.length; i++) {
                            let row = document.createElement("option");
                            let text = document.createElement("a");
                            let text2 = document.createTextNode((data[i]));
                            text.appendChild(text2);
                            console.log(theFile.fileName);
                            //gpxFiles = theFile.fileName;
                            //text.class = "gpxfiles";
                            console.log("hellooo");
                            row.appendChild(text);
                            myDropdown5.appendChild(row);
                        }
                    },
                    fail: function(error) {
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                })
                //let tbl = document.createElement("table");
            },
            fail: function(error) {
                window.alert("Could not connect to database");
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        });
    });
    $('#point').submit(function(e){
        console.log("helloooooo");
        e.preventDefault();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/getpointsinroute',
            data: {
                data1: $('#routename').val(),
            },
            success: function(data) {
                $("#dbtable tr").remove(); 
                let tblBody = document.createElement("tbody");
                let headrow = document.createElement("tr");
                let headcell5 = document.createElement("th");
                let headcellText5 = document.createTextNode("RouteName");
                headcell5.appendChild(headcellText5);
                let headcell1 = document.createElement("th");
                let headcellText1 = document.createTextNode("PointID");
                headcell1.appendChild(headcellText1);
                let headcell2 = document.createElement("th");
                let headcellText2 = document.createTextNode("PointIndex");
                headcell2.appendChild(headcellText2);
                let headcell3 = document.createElement("th");
                let headcellText3 = document.createTextNode("latitude");
                headcell3.appendChild(headcellText3);
                let headcell4 = document.createElement("th");
                let headcellText4 = document.createTextNode("longitude");
                headcell4.appendChild(headcellText4);
                let headcell6 = document.createElement("th");
                let headcellText6 = document.createTextNode("pointName");
                headcell6.appendChild(headcellText6);
                headrow.appendChild(headcell5);
                headrow.appendChild(headcell1);
                headrow.appendChild(headcell2);
                headrow.appendChild(headcell3);
                headrow.appendChild(headcell4);
                headrow.appendChild(headcell6);
                tblBody.appendChild(headrow);
                //for(theFile of data) {
                //console.log(data.points);
                for (let i = 0; i < data.length; i++) {
                    console.log("peep this");
                    let row = document.createElement("tr");
                    let cell5 = document.createElement("td");
                    let cellText5 = document.createTextNode(data[i].RouteName);
                    cell5.appendChild(cellText5);
                    let cell1 = document.createElement("td");
                    let cellText1 = document.createTextNode(data[i].Point_ID);
                    cell1.appendChild(cellText1);
                    let cell3 = document.createElement("td");
                    let cellText3 = document.createTextNode((data[i].PointIndex));
                    cell3.appendChild(cellText3);
                    let cell2 = document.createElement("td");
                    let cellText2 = document.createTextNode((data[i].latitude));
                    cell2.appendChild(cellText2);
                    let cell4 = document.createElement("td");
                    let cellText4 = document.createTextNode((data[i].longitude));
                    cell4.appendChild(cellText4);
                    let cell6 = document.createElement("td");
                    let cellText6 = document.createTextNode((data[i].point_name));
                    cell6.appendChild(cellText6);
                    row.appendChild(cell5);
                    row.appendChild(cell1);
                    row.appendChild(cell3);
                    row.appendChild(cell2);
                    row.appendChild(cell4);
                    row.appendChild(cell6);
                    tblBody.appendChild(row);
                    //theBody.append(row);
                }
                dbtable.appendChild(tblBody);
                //console.log(data);
                //let tbl = document.createElement("table");
            },
            fail: function(error) {
                window.alert("Could not connect to database");
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        });
    });
    
    $(document).on('click','.deletetag',function(){
        console.log("bdlfnsdfsdf");
        //e.preventDefault();
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/deletetables',
            data: {
                data1: "dsdks"
            },
            success: function(data) {
                window.alert("successfully deleted tables");
                displayDatabase();
            }, 
            fail: function(error) {
                window.alert("Could not connect to database");
                // Non-200 return, do something with error
                $('#blah').html("On page load, received error from server");
                console.log(error); 
            }
        });
    });
    
    $('#someform5').submit(function(e){
        var lat1 = $('#entryBox7').val();
        var lon1 = $('#entryBox8').val();
        var lat2 = $('#entryBox9').val();
        var lon2 = $('#entryBox10').val();
        var delta = $('#entryBox11').val();
        e.preventDefault();
        if (parseFloat(lat1) && parseFloat(lon1) && parseFloat(lat2) && parseFloat(lon2)) {
            if ((lat1 > -90 && lat1 < 90) && (lon1 > -180 && lon1 < 180) && (lat2 > -90 && lat2 < 90) && (lon2 > -180 && lon2 < 180)) {
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/getpathbetween',
                    data: {
                        data1: lat1,
                        data2: lon1,
                        data3: lat2,
                        data4: lon2,
                        data5: delta,
                    },
                    success: function(data) {
                        $("#table3 tr").remove(); 
                        console.log(lat1);
                        console.log(lon1);
                        console.log(lat2);
                        console.log(lon2);
                        //$("#myDropdown2 option").remove(); 
                        let body = document.getElementsByTagName("body")[0];
                        let tbl = document.createElement("table");
                        let tblBody = document.createElement("tbody");
                        let headrow = document.createElement("tr");
                        let headcell1 = document.createElement("th");
                        let headcellText1 = document.createTextNode("Component");
                        headcell1.appendChild(headcellText1);
                        let headcell2 = document.createElement("th");
                        let headcellText2 = document.createTextNode("Name");
                        headcell2.appendChild(headcellText2);
                        let headcell3 = document.createElement("th");
                        let headcellText3 = document.createTextNode("Number of Points");
                        headcell3.appendChild(headcellText3);
                        let headcell4 = document.createElement("th");
                        let headcellText4 = document.createTextNode("Length");
                        headcell4.appendChild(headcellText4);
                        let headcell5 = document.createElement("th");
                        let headcellText5 = document.createTextNode("Loop");
                        headcell5.appendChild(headcellText5);
                        headrow.appendChild(headcell1);
                        headrow.appendChild(headcell2);
                        headrow.appendChild(headcell3);
                        headrow.appendChild(headcell4);
                        headrow.appendChild(headcell5);
                        tblBody.appendChild(headrow);
                        //for(theFile of data) {
                        //console.log(data.points);
                        for (dats of data.points) {
                            console.log("peep this");
                            let row = document.createElement("tr");
                            let cell1 = document.createElement("td");
                            let cellText1 = document.createTextNode(dats.count);
                            cell1.appendChild(cellText1);
                            let cell3 = document.createElement("td");
                            let cellText3 = document.createTextNode((dats.name));
                            cell3.appendChild(cellText3);
                            let cell2 = document.createElement("td");
                            let cellText2 = document.createTextNode((dats.numPoints));
                            cell2.appendChild(cellText2);
                            let cell4 = document.createElement("td");
                            let cellText4 = document.createTextNode((dats.len));
                            cell4.appendChild(cellText4);
                            let cell5 = document.createElement("td");
                            let cellText5 = document.createTextNode((dats.loop));
                            cell5.appendChild(cellText5);
                            row.appendChild(cell1);
                            row.appendChild(cell3);
                            row.appendChild(cell2);
                            row.appendChild(cell4);
                            row.appendChild(cell5);
                            tblBody.appendChild(row);
                            let rows = document.createElement("option");
                            let text = document.createElement("a");
                            let text2 = document.createTextNode((dats.count));
                            text.appendChild(text2);
                            rows.appendChild(text);
                            myDropdown2.appendChild(rows);
                            //theBody.append(row);
                        }
                        table3.appendChild(tblBody);
                        body.appendChild(tbl);
                    },
                    fail: function(error) {
                        window.alert("Could not change Route or Track Name");
                        // Non-200 return, do something with error
                        $('#blah').html("On page load, received error from server");
                        console.log(error); 
                    }
                });
            }
        }
    });
});

function deleteTable() {
    console.log("bdlfnsdfsdf");
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/deletetables',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            if (data == true) {
                window.alert("successfully deleted tables");
                $("#dbtable tr").remove(); 
            } else {
                window.alert("no tables have been made");
            }
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}

function createtables() {
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/populate',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            console.log("success");
            jQuery.ajax({
                type: 'get',            //Request type
                dataType: 'json',       //Data type - we will use JSON for almost everything 
                url: '/dbdropdown',   //The server endpoint we are connecting to
                data: {
                    data1: "esdbk",
                },
                success: function (data) {
                    $("#myDropdown3 option").remove();
                    for(let i = 0; i < data.length; i++) {
                        let row = document.createElement("option");
                        let text = document.createElement("a");
                        let text2 = document.createTextNode((data[i]));
                        text.appendChild(text2);
                        console.log(theFile.fileName);
                        //gpxFiles = theFile.fileName;
                        //text.class = "gpxfiles";
                        console.log("hellooo");
                        row.appendChild(text);
                        myDropdown3.appendChild(row);
                    }
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    $('#blah').html("On page load, received error from server");
                    console.log(error); 
                }
            })
            jQuery.ajax({
                type: 'get',            //Request type
                dataType: 'json',       //Data type - we will use JSON for almost everything 
                url: '/dbdropdown',   //The server endpoint we are connecting to
                data: {
                    data1: "esdbk",
                },
                success: function (data) {
                    $("#myDropdown4 option").remove();
                    for(let i = 0; i < data.length; i++) {
                        let row = document.createElement("option");
                        let text = document.createElement("a");
                        let text2 = document.createTextNode((data[i]));
                        text.appendChild(text2);
                        console.log(theFile.fileName);
                        //gpxFiles = theFile.fileName;
                        //text.class = "gpxfiles";
                        console.log("hellooo");
                        row.appendChild(text);
                        myDropdown4.appendChild(row);
                    }
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    $('#blah').html("On page load, received error from server");
                    console.log(error); 
                }
            }) 
            jQuery.ajax({
                type: 'get',            //Request type
                dataType: 'json',       //Data type - we will use JSON for almost everything 
                url: '/dbdropdown',   //The server endpoint we are connecting to
                data: {
                    data1: "esdbk",
                },
                success: function (data) {
                    $("#myDropdown5 option").remove();
                    for(let i = 0; i < data.length; i++) {
                        let row = document.createElement("option");
                        let text = document.createElement("a");
                        let text2 = document.createTextNode((data[i]));
                        text.appendChild(text2);
                        console.log(theFile.fileName);
                        //gpxFiles = theFile.fileName;
                        //text.class = "gpxfiles";
                        console.log("hellooo");
                        row.appendChild(text);
                        myDropdown5.appendChild(row);
                    }
                },
                fail: function(error) {
                    // Non-200 return, do something with error
                    $('#blah').html("On page load, received error from server");
                    console.log(error); 
                }
            })
            displayDatabase();
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}

function displayDatabase() {
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/displaydbinfo',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            window.alert("number of files: " + data.x1 + " Number of Routes: " + data.x2 + " Number of Points: " + data.x3);
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}

function displayAllRoutesName() {
    let body = document.getElementsByTagName("body")[0];
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/allRoutesDisplayName',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            console.log("broskiii");
            $("#dbtable tr").remove(); 
            let tblBody = document.createElement("tbody");
            let headrow = document.createElement("tr");
            let headcell5 = document.createElement("th");
            let headcellText5 = document.createTextNode("filename");
            headcell5.appendChild(headcellText5);
            let headcell1 = document.createElement("th");
            let headcellText1 = document.createTextNode("routeName");
            headcell1.appendChild(headcellText1);
            let headcell2 = document.createElement("th");
            let headcellText2 = document.createTextNode("routeId");
            headcell2.appendChild(headcellText2);
            let headcell3 = document.createElement("th");
            let headcellText3 = document.createTextNode("routeLen");
            headcell3.appendChild(headcellText3);
            let headcell4 = document.createElement("th");
            let headcellText4 = document.createTextNode("gpxId");
            headcell4.appendChild(headcellText4);
            headrow.appendChild(headcell5);
            headrow.appendChild(headcell1);
            headrow.appendChild(headcell2);
            headrow.appendChild(headcell3);
            headrow.appendChild(headcell4);
            tblBody.appendChild(headrow);
            //for(theFile of data) {
            //console.log(data.points);
            for (let i = 0; i < data.length; i++) {
                console.log("peep this");
                let row = document.createElement("tr");
                let cell5 = document.createElement("td");
                let cellText5 = document.createTextNode(data[i].Filename);
                cell5.appendChild(cellText5);
                let cell1 = document.createElement("td");
                let cellText1 = document.createTextNode(data[i].Route_name);
                cell1.appendChild(cellText1);
                let cell3 = document.createElement("td");
                let cellText3 = document.createTextNode((data[i].Route_ID));
                cell3.appendChild(cellText3);
                let cell2 = document.createElement("td");
                let cellText2 = document.createTextNode((data[i].len));
                cell2.appendChild(cellText2);
                let cell4 = document.createElement("td");
                let cellText4 = document.createTextNode((data[i].gpx_id));
                cell4.appendChild(cellText4);
                row.appendChild(cell5);
                row.appendChild(cell1);
                row.appendChild(cell3);
                row.appendChild(cell2);
                row.appendChild(cell4);
                tblBody.appendChild(row);
                //theBody.append(row);
            }
            dbtable.appendChild(tblBody);
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}
function displayAllRoutesLength() {
    let body = document.getElementsByTagName("body")[0];
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/allRoutesDisplayLength',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            console.log("broskiii");
            $("#dbtable tr").remove(); 
            let tblBody = document.createElement("tbody");
            let headrow = document.createElement("tr");
            let headcell5 = document.createElement("th");
            let headcellText5 = document.createTextNode("filename");
            headcell5.appendChild(headcellText5);
            let headcell1 = document.createElement("th");
            let headcellText1 = document.createTextNode("routeName");
            headcell1.appendChild(headcellText1);
            let headcell2 = document.createElement("th");
            let headcellText2 = document.createTextNode("routeId");
            headcell2.appendChild(headcellText2);
            let headcell3 = document.createElement("th");
            let headcellText3 = document.createTextNode("routeLen");
            headcell3.appendChild(headcellText3);
            let headcell4 = document.createElement("th");
            let headcellText4 = document.createTextNode("gpxId");
            headcell4.appendChild(headcellText4);
            headrow.appendChild(headcell5);
            headrow.appendChild(headcell1);
            headrow.appendChild(headcell2);
            headrow.appendChild(headcell3);
            headrow.appendChild(headcell4);
            tblBody.appendChild(headrow);
            //for(theFile of data) {
            //console.log(data.points);
            for (let i = 0; i < data.length; i++) {
                console.log("peep this");
                let row = document.createElement("tr");
                let cell5 = document.createElement("td");
                let cellText5 = document.createTextNode(data[i].Filename);
                cell5.appendChild(cellText5);
                let cell1 = document.createElement("td");
                let cellText1 = document.createTextNode(data[i].Route_name);
                cell1.appendChild(cellText1);
                let cell3 = document.createElement("td");
                let cellText3 = document.createTextNode((data[i].Route_ID));
                cell3.appendChild(cellText3);
                let cell2 = document.createElement("td");
                let cellText2 = document.createTextNode((data[i].len));
                cell2.appendChild(cellText2);
                let cell4 = document.createElement("td");
                let cellText4 = document.createTextNode((data[i].gpx_id));
                cell4.appendChild(cellText4);
                row.appendChild(cell5);
                row.appendChild(cell1);
                row.appendChild(cell3);
                row.appendChild(cell2);
                row.appendChild(cell4);
                tblBody.appendChild(row);
                //theBody.append(row);
            }
            dbtable.appendChild(tblBody);
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}
function displayAllRoutes() {
    let body = document.getElementsByTagName("body")[0];
    //e.preventDefault();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/allRoutesDisplay',
        data: {
            data1: "dsdks"
        },
        success: function(data) {
            $("#dbtable tr").remove(); 
            let tblBody = document.createElement("tbody");
            let headrow = document.createElement("tr");
            let headcell5 = document.createElement("th");
            let headcellText5 = document.createTextNode("filename");
            headcell5.appendChild(headcellText5);
            let headcell1 = document.createElement("th");
            let headcellText1 = document.createTextNode("routeId");
            headcell1.appendChild(headcellText1);
            let headcell2 = document.createElement("th");
            let headcellText2 = document.createTextNode("routeName");
            headcell2.appendChild(headcellText2);
            let headcell3 = document.createElement("th");
            let headcellText3 = document.createTextNode("routeLen");
            headcell3.appendChild(headcellText3);
            let headcell4 = document.createElement("th");
            let headcellText4 = document.createTextNode("gpxId");
            headcell4.appendChild(headcellText4);
            headrow.appendChild(headcell5);
            headrow.appendChild(headcell1);
            headrow.appendChild(headcell2);
            headrow.appendChild(headcell3);
            headrow.appendChild(headcell4);
            tblBody.appendChild(headrow);
            //for(theFile of data) {
            //console.log(data.points);
            for (let i = 0; i < data.length; i++) {
                let row = document.createElement("tr");
                let cell5 = document.createElement("td");
                let cellText5 = document.createTextNode(data[i].Filename);
                cell5.appendChild(cellText5);
                let cell1 = document.createElement("td");
                let cellText1 = document.createTextNode(data[i].Route_ID);
                cell1.appendChild(cellText1);
                let cell3 = document.createElement("td");
                let cellText3 = document.createTextNode((data[i].Route_name));
                cell3.appendChild(cellText3);
                let cell2 = document.createElement("td");
                let cellText2 = document.createTextNode((data[i].len));
                cell2.appendChild(cellText2);
                let cell4 = document.createElement("td");
                let cellText4 = document.createTextNode((data[i].gpx_id));
                cell4.appendChild(cellText4);
                row.appendChild(cell5);
                row.appendChild(cell1);
                row.appendChild(cell3);
                row.appendChild(cell2);
                row.appendChild(cell4);
                tblBody.appendChild(row);
                //theBody.append(row);
            }
            dbtable.appendChild(tblBody);
        }, 
        fail: function(error) {
            window.alert("Could not connect to database");
            // Non-200 return, do something with error
            $('#blah').html("On page load, received error from server");
            console.log(error); 
        }
    });
}


