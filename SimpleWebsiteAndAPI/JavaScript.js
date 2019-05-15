$("#btnLoadSubject").click(function () {
    var d = "<table class='table table-striped table-bordered' style='max-width:700px;'><th>Professor's Name</th>";
    var subject = document.getElementById("sel");
    var sub = subject.options[subject.selectedIndex].value;
    var sub1 = String(sub);
    service("getSubject", "{ subject:" + "\"" + sub1 + "\"" + "}",
        function (response) {
            for (var i = 0; i < response.courseSections.length; i++) {
                if (response.courseSections[i].instructors[0]) {
                    console.log(response.courseSections[i].instructors[0].nameDisplayInformal);
                    if (!d.includes(response.courseSections[i].instructors[0].nameDisplayInformal)) {
                        d += "<tr>" +
                            "<td onclick='showCourses(" + "\"" + sub1 + "\"," + "\"" + response.courseSections[i].instructors[0].username + "\"" + ");'><a class=\"text-primary\">" + response.courseSections[i].instructors[0].nameDisplayInformal + "</a></td>" +
                            "</tr>";
                    }
                }
            }
            if (d == "<table class='table table-striped table-bordered' style='max-width:700px;'><tr>Professor's Name</tr>") {
                $("#subjectList").html("No classes for this subject!");
                $("#subjectDetails").html("");
            }
            else {
                $("#subjectList").html(d + "</table>");
                $("#subjectDetails").html("");
                $("#subjectCourseDetails").html("");
                $("#myInput").val("");
            }
        }, function (response) {
            alert("Error...");
            console.log(response);
        });
});

function showCourses(subject, name) {
    console.log(subject);
    service("getSubject", "{ subject:" + "\"" + subject + "\"" + "}",
        function (response) {
            var d = "<table class='table table-striped table-bordered' style='max-width:700px;'>";
            d += "<tr>" +
                "<th>Professor</th>" +
                "<th>Miami Unique ID</th>" +
                "<th>Course</th>" +
                "<th>Start Date</th>" +
                "<th>End Date</th>" +
                "<th>Room</th>" +
                "<th>Days</th>" +
                "<th>Start Time</th>" +
                "<th>End Time</th>" +
                "</tr>"
            for (var i = 0; i < response.courseSections.length; i++) {
                if (response.courseSections[i].instructors.length > 0 && response.courseSections[i].instructors[0].username == name) {
                    var s = "<td>";
                    var letter = "";
                    //Course Days
                    for (var j = 0; j < response.courseSections[i].courseSchedules.length; j++) {
                        if (response.courseSections[i].courseSchedules[j].scheduleTypeDescription != "Final Exam")
                            letter = response.courseSections[i].courseSchedules[j].days + "\n" + letter;
                    }
                    s += letter + "</td> <td>";
                    letter = "";

                    //Course Start Times
                    for (var j = 0; j < response.courseSections[i].courseSchedules.length; j++) {
                        if (response.courseSections[i].courseSchedules[j].scheduleTypeDescription != "Final Exam")
                            letter = response.courseSections[i].courseSchedules[j].startTime + "\n" + letter;
                    }
                    s += letter + "</td> <td>";
                    letter = "";

                    var desc = "";

                    //Course Descriptions
                    for (var j = 0; j < response.courseSections[i].courseSchedules.length; j++) {
                        if (response.courseSections[i].courseDescription) {
                            console.log(response.courseSections[i].courseDescription);
                            desc = escape(response.courseSections[i].courseDescription.split("\n").join(" "));
                            desc = desc.split("%20").join(" ");
                        }
                        //Course End Times
                        if (response.courseSections[i].courseSchedules[j].scheduleTypeDescription != "Final Exam")
                            letter = response.courseSections[i].courseSchedules[j].endTime + "\n" + letter;
                    }
                    s += letter + "</td>";
                    s = s.split("null").join("Not provided.");

                    var room = response.courseSections[i].courseSchedules[0].buildingCode + " " + response.courseSections[i].courseSchedules[0].room;
                    if (room == "null null")
                        room = "Not provided.";
                    else if (room.includes("null"))
                        room = room.substring(0, room.indexOf("null"));

                    var exam = "<p><strong>Final Exam: </strong><table>" +
                        "<th>Day</th>" +
                        "<th>Time</th>" +
                        "<th>Room</th><tr>";
                    for (var j = 0; j < response.courseSections[i].courseSchedules.length; j++) {
                        if (response.courseSections[i].courseSchedules[j].scheduleTypeDescription == "Final Exam") {
                            if (j > 0)
                                exam += "</tr><tr>";
                            exam += "<td>" + response.courseSections[i].courseSchedules[j].startDate + " " + response.courseSections[i].courseSchedules[j].days + "</td><td>" + response.courseSections[i].courseSchedules[j].startTime + "-" + response.courseSections[i].courseSchedules[j].endTime + "</td><td>" + response.courseSections[i].courseSchedules[j].buildingCode + " " + response.courseSections[i].courseSchedules[j].room + "</td>";
                        }
                    }
                    exam = exam.split(" M").join(" Monday");
                    exam = exam.split(" T").join(" Tuesday");
                    exam = exam.split(" W").join(" Wednesday");
                    exam = exam.split(" R").join(" Thursday");
                    exam = exam.split(" F").join(" Friday");

                    exam += "</tr></table>";
                    if (exam == "<p><strong>Final Exam: </strong><table><th>Day</th><th>Time</th><th>Room</th><tr></tr></table>")
                        exam = "</p><p><strong>Final Exam: </strong>None.";
                    d += "<tr>" +
                        "<td>" + response.courseSections[i].instructors[0].nameDisplayInformal + "</td>" +
                        "<td>" + name + "</td>" +
                        "<td onclick='showCourseDesc(" + "\"" + desc + "\", \"" + exam + "\");'><a class=\"text-primary\">" + response.courseSections[i].courseCode + "</a></td>" +
                        "<td>" + response.courseSections[i].courseSchedules[0].startDate + "</td>" +
                        "<td>" + response.courseSections[i].courseSchedules[0].endDate + "</td>" +
                        "<td>" + room + "</td>" +
                        s +
                        "</tr>";

                    console.log(response.courseSections[i].courseCode + response.courseSections.length + " ");
                }
            }
            var course = response.courseSections;
            $("#subjectDetails").html(d + "</table>");
            $("#subjectCourseDetails").html("");
        }, function (response) {
            alert(response);
            console.log(response);
        });
}

function showCourseDesc(courseDesc, exam) {
    console.log(exam);

    if (courseDesc == "")
        courseDesc = "<p>None."
    else {
        courseDesc = courseDesc.split("%28").join("(");
        courseDesc = courseDesc.split("%29").join(")");
        courseDesc = courseDesc.split("%3A").join(":");
        courseDesc = courseDesc.split("%2C").join(",");
        courseDesc = courseDesc.split("%22").join("\"");
        courseDesc = courseDesc.split("%27").join("'");
        courseDesc = courseDesc.split("%3B").join(";");
        courseDesc = courseDesc.split("%26").join("&");
        courseDesc = courseDesc.split("%3F").join("?");
        courseDesc = courseDesc.split("%3C").join("<");
        courseDesc = courseDesc.split("%3E").join(">");
        courseDesc = courseDesc.split("%23").join("#");
        courseDesc = courseDesc.split("%25").join("%");
        courseDesc = courseDesc.split("%7B").join("{");
        courseDesc = courseDesc.split("%7D").join("}");
        courseDesc = courseDesc.split("%5E").join("^");
        courseDesc = courseDesc.split("%7E").join("~");
        courseDesc = courseDesc.split("%24").join("$");
        courseDesc = courseDesc.split("%2F").join("/");
        courseDesc = "<p><strong>" + courseDesc.substring(0, courseDesc.indexOf(")") + 1) + "</strong></p><p>" + courseDesc.substring(courseDesc.indexOf(")") + 1) + "</p>";
    }

    $("#subjectCourseDetails").html(courseDesc + exam + "</p>");
}

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#subjectList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});