

import { get_details } from './login.js'
import { getStudentEmailById, getStudentByEmail, createTeam, addMemberToTeam, isStudentRegisteredForCompetition, payment_img } from "./reg.js"

var cur_std = ""

var isSpecial = false;

// document.getElementsByClassName('btn')[0].innerHTML

get_details().then((userDetails) => {
    if (userDetails) {
        console.log(userDetails);
        isStudentRegisteredForCompetition(userDetails.email, competitionID)
            .then(isRegistered => {
                if (isRegistered) {
                    console.log("The student is registered for this competition.");
                    document.getElementsByClassName('btn')[0].innerHTML = "Registered"
                    document.getElementsByClassName('btn')[0].onclick = "unset"
                } else {
                    document.getElementsByClassName('btn')[0].onclick = reg_op
                    console.log("The student is not registered for this competition.");
                }
            });

    } else {
        console.log("No user is signed in.");
        alert("login before registering...");
    }
}).catch((error) => {
    console.error("Error getting user details:", error);
});


document.getElementById("studentForm").onsubmit = validateForm;

var flg_a = true
var flg_valid = true;

function validateForm(event) {
    event.preventDefault();
    // console.log("sdwd");
    // return

    document.getElementById("submit").value = "processing"

    if (flg_a) {
        flg_a = false;
        let fg = true;
        let obj = {
            leader: "",
            members: []
        };

        // Collect all the promises for async calls
        let promises = [];
        let promises_a = [];

        // Get all elements with the class "id_flds"
        document.querySelectorAll(".id_flds").forEach(elm => {
            if (elm.value != "")
                if (fg) {
                    obj.leader = elm.value;
                    fg = false;
                } else {
                    // Store each async getStudentEmailById call in the promises array
                    const promise = getStudentEmailById(elm.value)
                        .then((o) => {
                            if (o) {
                                obj.members.push(elm.value);
                            }
                            const promise_a = isStudentRegisteredForCompetition(o.email, competitionID)
                                .then(isRegistered => {
                                    if (isRegistered) {
                                        document.getElementById("submit").value = "Submit"
                                        document.getElementById("img_load").innerHTML = ''
                                        alert(elm.value + " registered for the competition already.")
                                        document.getElementById("img_load").innerHTML = ''
                                        flg_a = true;
                                        flg_valid = false;
                                    } else {
                                        console.log(elm.value + " valid!");
                                    }
                                });
                            promises_a.push(promise_a)
                        }).catch(error => {
                            console.error("Error occurred:", error);
                            document.getElementById("img_load").innerHTML = ''
                            document.getElementById("submit").value = "Submit"
                            alert(elm.value + " one invalid ID")
                            document.getElementById("img_load").innerHTML = ''
                            flg_a = true;
                            flg_valid = false;
                            return
                        });

                    promises.push(promise); // Add the promise to the array
                }
        });

        // Once all promises are resolved, execute the final action
        Promise.all(promises).then(() => {
            Promise.all(promises_a).then(() => {


                if (flg_valid) {
                    console.log("All data fetched, triggering final action...");
                    // Trigger your final function or action here
                    console.log(obj);
                    var tmp_arr = [...obj.members];
                    tmp_arr.push(obj.leader)
                    if (new Set(tmp_arr).size !== tmp_arr.length) {
                        document.getElementById("submit").value = "Submit"
                        alert("Duplicate IDs not allowed");
                        document.getElementById("img_load").innerHTML = ''
                        flg_a = true;
                        flg_valid = true;
                    } else {

                        payment_img() //upload image
                            .then((downloadURL) => {
                                console.log('done upload');
                                getStudentEmailById(obj.leader)
                                    .then((o) => {
                                        if (o) {
                                            var transaction = {
                                                id:document.getElementById("traction-id").value,
                                                amt:document.getElementById("traction-ammount").value,
                                                date:document.getElementById("traction-date").value,
                                                name:document.getElementById("holder-name").value
                                            }
                                            createTeam(transaction,downloadURL,competitionID, document.getElementById("team-name").value, o.email, obj.leader).then((klo) => {

                                                obj.members.forEach((lp) => {
                                                    console.log(lp);
                                                    getStudentEmailById(lp).then((eml) => {
                                                        addMemberToTeam(klo.teamId, eml.email, competitionID).then((olp) => {
                                                            document.getElementById("img_load").innerHTML = ' 100%'
                                                            document.getElementsByClassName("btn")[0].innerHTML = "Registered";
                                                            document.getElementsByClassName("btn")[0].onclick = "unset";
                                                            alert("event registed successfully")
                                                            document.getElementById("submit").value = "Submit"
                                                            document.getElementById("frm_cv").style.display = "none";
                                                        })
                                                    }).catch(error => {
                                                        console.error("Error occurred:", error);
                                                        flg_a = true;
                                                        flg_valid = true;
                                                        return
                                                    });
                                                })

                                                if (obj.members.length == 0) {
                                                    document.getElementById("img_load").innerHTML = ' 100%'
                                                    document.getElementsByClassName("btn")[0].innerHTML = "Registered";
                                                    document.getElementsByClassName("btn")[0].onclick = "unset";
                                                    alert("event registed successfully")                                  
                                                    document.getElementById("submit").value = "Submit"
                                                    document.getElementById("frm_cv").style.display = "none";
                                                }
                                            })
                                        }
                                    }).catch(error => {
                                        console.error("Error occurred:", error);
                                        flg_a = true;
                                        flg_valid = true;
                                        return
                                    });


                            })
                            .catch((error) => {
                                console.error("Error occurred:", error);
                                flg_a = true;
                                flg_valid = true;
                                alert("error while uploading image.")
                                return
                            });
                    }
                } else {
                    console.log("prms rejected");
                    flg_a = true;
                    flg_valid = true;
                }
            })
        }).catch(error => {
            console.error("Error occurred during async operations:", error);
        });
    }
}

// document.getElementById("frm_cv").style.

var rg = document.getElementById("frm_cnt")
rg.style.marginLeft = (window.innerWidth - 354) / 2 + 'px'
document.getElementById("frm_cv").style.display = 'none'

function reg_op() {
    get_details().then((userDetails) => {
        if (userDetails) {
            console.log("user loged in");
            console.log(userDetails);
            document.getElementById("frm_cv").style.display = 'block'
            document.getElementsByClassName("nameOfID")[0].innerHTML = userDetails.name
            getStudentByEmail(userDetails.email).then((dta) => {
                cur_std = dta.id;
                document.getElementById("mem1").value = dta.id;
                document.getElementById("mem1").readOnly = true;
            })
        } else {
            console.log("No user is signed in.");
            alert("login before registering...");
        }
    }).catch((error) => {
        console.error("Error getting user details:", error);
    });
}

document.getElementsByClassName('close')[0].onclick = reg_cl
function reg_cl() {
    document.getElementById("frm_cv").style.display = 'none'
}


document.addEventListener('click', function (event) {
    // Check if the clicked element has the class 'gt_btn'
    if (event.target.classList.contains('gt_btn')) {
        // Call your function when a '.gt_btn' element is clicked
        var nme_hre = event.target.parentElement.parentElement.getElementsByClassName("nameOfID")[0]
        var if_fld = event.target.parentElement.getElementsByClassName("id_flds")[0]

        getStudentEmailById(if_fld.value).then((obj) => {
            if (obj != null) {
                nme_hre.innerHTML = obj.name
                console.log("Retrieved Student Email:", obj.email); // Use obj.email since email is the expected property
            } else {
                nme_hre.innerHTML = "invalid"
            }
        }).catch(error => {
            console.error("Error occurred:", error);
            alert("couldnt connect");
        });
    }
});

if(["1HFUDpVdTCKQ7Pi9TH8f","M9NXDdwgGRemUnRi2kbr","Un6FvqsAdt6VVitBedIj","m4l2L0xYZkuplUvZTvT9","p564W5i3pRR3zYKAWDRw"].includes(competitionID)){
document.getElementsByClassName('id_elm')[0].getElementsByTagName("label")[0].innerHTML = "Participant ID"
document.getElementById('studentForm').getElementsByTagName("label")[0].style.display = "none"
document.getElementById('team-name').style.display = "none"
document.getElementById('team-name').value = "$null$";
document.getElementById('frm_cnt').getElementsByTagName("h4")[0].style.display = 'none'
isSpecial = true
}
