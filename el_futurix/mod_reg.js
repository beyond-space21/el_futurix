

        import { get_details } from './login.js'
        import { getStudentEmailById, getStudentByEmail, createTeam, isStudentRegisteredForCompetition } from "./reg.js"

        var cur_std = ""

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
        function validateForm(event) {
            event.preventDefault();
            // console.log("sdwd");
            // return

            if (flg_a) {
                flg_a = false;
                let fg = true;
                let obj = {
                    leader: "",
                    members: []
                };

                // Collect all the promises for async calls
                let promises = [];

                // Get all elements with the class "id_flds"
                document.querySelectorAll(".id_flds").forEach(elm => {
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
                            }).catch(error => {
                                console.error("Error occurred:", error);
                                return
                            });

                        promises.push(promise); // Add the promise to the array
                    }
                });

                // Once all promises are resolved, execute the final action
                Promise.all(promises).then(() => {
                    console.log("All data fetched, triggering final action...");
                    // Trigger your final function or action here
                    console.log(obj);
                    var tmp_arr = obj.members
                    tmp_arr.push(obj.leader)
                    if (new Set(obj.members).size !== obj.members.length) {
                        alert("Duplicate IDs not allowed");
                    } else {
                        getStudentEmailById(obj.leader)
                            .then((o) => {
                                if (o) {
                                    createTeam(competitionID, document.getElementById("team-name").value, o.email, obj.leader).then(() => {
                                        document.getElementsByClassName("btn")[0].innerHTML = "Registered";
                                        document.getElementsByClassName("btn")[0].onclick = "unset";                                     
                                        alert("registed successfully")
                                        document.getElementById("frm_cv").style.display = "none";
                                    })
                                }
                            }).catch(error => {
                                console.error("Error occurred:", error);
                                return
                            });
                    }
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