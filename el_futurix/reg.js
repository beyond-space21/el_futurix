
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, collection,updateDoc, arrayUnion , setDoc, getDocs, getDoc, addDoc, runTransaction, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDULqoxGCXzqie03gmHrKt-BqJ-4lrtYCI",
    authDomain: "elfuturix-562eb.firebaseapp.com",
    projectId: "elfuturix-562eb",
    storageBucket: "elfuturix-562eb.appspot.com",
    messagingSenderId: "518115904118",
    appId: "1:518115904118:web:c5214283690b6619b52d57",
    measurementId: "G-DQW58LGMHR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function generateSequentialId() {
    const db = getFirestore(); // Ensure Firestore is initialized properly

    const counterDoc = doc(collection(db, 'counters'), 'studentCounter'); // Reference to counter document

    // Using runTransaction to update the counter atomically
    return runTransaction(db, async (transaction) => {
        const docSnapshot = await transaction.get(counterDoc);

        if (!docSnapshot.exists()) {
            throw new Error("Counter document does not exist!");
        }

        const newCounter = docSnapshot.data().counter + 1;
        transaction.update(counterDoc, { counter: newCounter });

        // Generate custom student ID with zero padding
        const studentId = 'EL-' + String(newCounter).padStart(4, '0');
        return studentId;
    }).catch((error) => {
        console.error("Transaction failed: ", error);
        throw error;
    });
}

function get_details() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                resolve({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                });
            } else {
                // No user is signed in
                resolve(false);
            }
        }, (error) => {
            // If there’s an error in auth state change
            reject(error);
        });
    });
}

function postFirstLogin(obj) {
    return new Promise((resolve, reject) => {
        get_details()
            .then((userDetails) => {
                if (userDetails) {
                    const studentDocRef = doc(collection(db, 'students'), userDetails.email);

                    generateSequentialId()
                        .then((id) => {
                            obj.id = id;
                            obj.registeredCompetitions = []
                            return setDoc(studentDocRef, obj);
                        })
                        .then(() => {
                            console.log("New student registered with ID:", obj.id);
                            resolve(`New student registered with ID: ${obj.id}`);
                        })
                        .catch((error) => {
                            console.error("Error adding student:", error);
                            reject(`Error adding student: ${error}`);
                        });
                } else {
                    console.log("No user is signed in.");
                    reject("No user is signed in. Login before registering.");
                }
            })
            .catch((error) => {
                console.error("Error getting user details:", error);
                reject(`Error getting user details: ${error}`);
            });
    });
}



function registerForCompetition(studentId, competitionId, teamId = null) {
    const studentDocRef = db.collection('students').doc(studentId);
    studentDocRef.update({
        registeredCompetitions: firebase.firestore.FieldValue.arrayUnion({
            competitionId: competitionId,
            teamId: teamId,
            role: teamId ? "teamLeader" : "individual" // Assuming "individual" if no team is created
        })
    }).then(() => {
        console.log("Student registered for competition:", competitionId);
    }).catch((error) => {
        console.error("Error registering for competition: ", error);
    });
}


function getCompetitions(competitionId) {
    const competitionRef = doc(db, 'competitions', competitionId); // Reference to the competition document
    return getDoc(competitionRef)
        .then((doc) => {
            if (doc.exists()) {
                return doc.data(); // Return the document data
            } else {
                console.log("No such competition!");
                return null;
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
            return null;
        });
}

async function getStudentByEmail(email) {
    // Create a reference to the document
    const studentDocRef = doc(db, 'students', email);

    try {
        // Get the document
        const docSnap = await getDoc(studentDocRef);

        if (docSnap.exists()) {
            console.log("Student found:", docSnap.data());
            return docSnap.data(); // Return the student data if found
        } else {
            console.log("No student found with email:", email);
            return null;
        }
    } catch (error) {
        console.error("Error fetching student by email:", error);
        return null;
    }
}

function getStudentEmailById(studentId) {
    return new Promise(async (resolve, reject) => {
        // Reference to the 'students' collection
        const studentsRef = collection(db, "students");

        // Create a query against the collection
        const q = query(studentsRef, where("id", "==", studentId));

        try {
            // Execute the query and get the documents
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Get the first matching document
                const firstDoc = querySnapshot.docs[0];
                const studentData = firstDoc.data(); // Get the document data (fields)
                
                // Return an object with the student's name and email
                const studentDetails = {
                    name: studentData.student_name, // Assuming the field is 'student_name'
                    email: firstDoc.id // The document ID is the email
                };

                console.log("Student Details:", studentDetails);
                resolve(studentDetails); // Resolve the Promise with the student details
            } else {
                console.log("No student found with the given ID ",studentId);
                resolve(null); // Resolve the Promise with null if no student found
            }
        } catch (error) {
            console.error("Error fetching student data: ", error);
            reject(error); // Reject the Promise with the error
        }
    });
}


// async function createTeam(competitionId, teamName, studentId) {
//     const teamRef = collection(db, "teams");
//     const teamDocRef = await addDoc(teamRef, {
//       teamName: teamName,
//       competitionId: competitionId,
//       members: [
//         {
//           studentId: studentId,
//           role: "teamLeader"
//         }
//       ],
//       createdAt: new Date().toISOString()
//     });
  
//     // Update the student's registered competitions
//     const studentRef = doc(db, "students", studentId);
//     await updateDoc(studentRef, {
//       registeredCompetitions: [{
//         competitionId: competitionId,
//         teamId: teamDocRef.id,
//         role: "teamLeader"
//       }]
//     });
  
//     // Update the competition's registered teams
//     const competitionRef = doc(db, "competitions", competitionId);
//     await updateDoc(competitionRef, {
//       registeredTeams: [...(await (await competitionRef.get()).data().registeredTeams), teamDocRef.id]
//     });
  
//     console.log("Team created and student registered in the competition!");
//   }

  async function createCompetition(name,type) {
    const competitionRef = collection(db, "competitions");
    await addDoc(competitionRef, {
      name: name,
      type: type,
      registeredTeams: []
    });
    console.log("Competition created successfully!");
  }


//   createCompetition("product_expo","competition")
//   createCompetition("paper_presentation","competition")
//   createCompetition("line_follower","competition")
//   createCompetition("maze_solver","competition")
//   createCompetition("drone","competition")
//   createCompetition("robo_soccer","competition")
//   createCompetition("circuit_innovators","competition")
//   createCompetition("web_wizards","competition")
//   createCompetition("datacraft","competition")
//   createCompetition("cad_maestro","competition")
//   createCompetition("coders_arena","competition")
//   createCompetition("ipl_auction","competition")
//   createCompetition("cinematic_quiz","competition")
//   createCompetition("bridge_building","competition")
//   createCompetition("investigator","competition")
// createCompetition("pcb_designer","workshop")
// createCompetition("cyber_security","workshop")
// createCompetition("ar_vr","workshop")
// createCompetition("learning","workshop")



function createTeam(competitionId, teamName, studentEmail) { // Pass email instead of studentId
    return new Promise(async (resolve, reject) => {
        try {
            // Add the team to the "teams" collection
            const teamRef = collection(db, "teams");
            const teamDocRef = await addDoc(teamRef, {
                teamName: teamName,
                competitionId: competitionId,
                members: [
                    {
                        studentId: studentEmail, // Use the email as studentId
                        role: "teamLeader"
                    }
                ],
                createdAt: new Date().toISOString()
            });

            // Use student email as document ID
            const studentRef = doc(db, "students", studentEmail);
            const studentDoc = await getDoc(studentRef);

            if (studentDoc.exists()) {
                // Update the student's registered competitions
                await updateDoc(studentRef, {
                    registeredCompetitions: [
                        ...(studentDoc.data().registeredCompetitions || []),
                        {
                            competitionId: competitionId,
                            teamId: teamDocRef.id,
                            role: "teamLeader"
                        }
                    ]
                });
            } else {
                console.error("Student document not found!");
                reject("Student document not found.");
            }

            // Update the competition's registered teams
            const competitionRef = doc(db, "competitions", competitionId);
            const competitionDoc = await getDoc(competitionRef);
            const registeredTeams = competitionDoc.data().registeredTeams || [];

            await updateDoc(competitionRef, {
                registeredTeams: [...registeredTeams, teamDocRef.id]
            });

            console.log("Team created and student registered in the competition!");
            resolve({ teamId: teamDocRef.id, message: "Team successfully created and student registered!" });
        } catch (error) {
            console.error("Error creating team or registering student:", error);
            reject(error); // Reject the promise with the error
        }
    });
}


async function addMemberToTeam(teamId, studentId, competitionId) {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, {
    members: arrayUnion({
      studentId: studentId,
      role: "member"
    })
  });

  // Update the student's registered competitions
  const studentRef = doc(db, "students", studentId);
  await updateDoc(studentRef, {
    registeredCompetitions: arrayUnion({
      competitionId: competitionId,
      teamId: teamId,
      role: "member"
    })
  });

  console.log("Member added to the team successfully!");
}



async function isStudentRegisteredForCompetition(studentEmail, competitionId) {
    try {
        // Reference to the student's document
        const studentRef = doc(db, "students", studentEmail);
        const studentDoc = await getDoc(studentRef);

        // Check if the student document exists
        if (studentDoc.exists()) {
            const registeredCompetitions = studentDoc.data().registeredCompetitions || [];

            // Check if the competitionId is in the registeredCompetitions array
            const isRegistered = registeredCompetitions.some(comp => comp.competitionId === competitionId);

            if (isRegistered) {
                console.log(`Student is registered for competition ${competitionId}`);
                return true;
            } else {
                console.log(`Student is not registered for competition ${competitionId}`);
                return false;
            }
        } else {
            console.error("Student document not found!");
            return false;
        }
    } catch (error) {
        console.error("Error checking registration:", error);
        return false;
    }
}


export { registerForCompetition,addMemberToTeam,getCompetitions, getStudentEmailById, isStudentRegisteredForCompetition, createTeam, getStudentByEmail, postFirstLogin, get_details }
