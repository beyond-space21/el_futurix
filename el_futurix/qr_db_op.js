
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore,increment, doc, collection, updateDoc, setDoc, getDocs, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

async function update_qr_cnt(code) {
    // Reference to Firestore document
    const qrRef = doc(db, 'qr_scaned', code);

    try {
        // Check if the document exists
        const docSnapshot = await getDoc(qrRef);

        if (docSnapshot.exists()) {
            // Document exists, so we increment the counter
            await updateDoc(qrRef, { count: increment(1) });
            // console.log("Incremented count for existing document.");
        } else {
            // Document does not exist, so we create it with an initial count of 1
            await setDoc(qrRef, { count: 1 });
            // console.log("Document created with initial count of 1.");
        }

    } catch (error) {
        console.error("Error updating or creating counter:", error);
    }
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

async function getTeamById(id) {
    // Create a reference to the document
    const teamDocRef = doc(db, 'teams', id);

    try {
        // Get the document
        const docSnap = await getDoc(teamDocRef);

        if (docSnap.exists()) {
            console.log("team found:", docSnap.data());
            return docSnap.data(); // Return the student data if found
        } else {
            console.log("No team found with id:", id);
            return null;
        }
    } catch (error) {
        console.error("Error fetching team by id:", error);
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
                console.log("No student found with the given ID ", studentId);
                resolve(null); // Resolve the Promise with null if no student found
            }
        } catch (error) {
            console.error("Error fetching student data: ", error);
            reject(error); // Reject the Promise with the error
        }
    });
}


async function getStudentByqr(qr) {
    // Create a reference to the document
    const profDocRef = doc(db, 'identification', qr);

    try {
        // Get the document
        const docSnap = await getDoc(profDocRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Return the student data if found
        } else {
            console.log("No member found with id:", qr);
            return null;
        }
    } catch (error) {
        console.error("Error fetching member by id:", error);
        return null;
    }
}

export {update_qr_cnt, getStudentByEmail, getCompetitions, getTeamById, getStudentByqr }