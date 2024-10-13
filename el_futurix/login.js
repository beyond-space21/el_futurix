import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore,getDoc,collection,doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
try {
  document.getElementById("log_in_btn").onclick=login;
  document.getElementById("log_out_btn").onclick=logout; 
} catch (error){}

function login() {
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in:", user);
      document.getElementsByClassName("pic")[0].src = user.photoURL
      document.getElementById("log_in_btn").style.display = "none"
      document.getElementById("log_out_btn").style.display = "block"
      document.getElementById("profile_btn").style.display = "block"
      handleStudentLogin(user.email);
    }).catch((error) => {
      console.error("Error during sign-in:", error);
    });
}

function get_details() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          handleStudentLogin(user.email);
          resolve({
            name: user.displayName,
            photo: user.photoURL, // Fixed photo to be photoURL
            uid: user.uid,
            email: user.email
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

  function logout() {
    signOut(auth)
        .then(() => {
            console.log("User signed out");
            document.getElementsByClassName("pic")[0].src = "el_futurix/img/profile_blank.png";
            document.getElementById("log_in_btn").style.display = "block"
            document.getElementById("log_out_btn").style.display = "none"
            document.getElementById("profile_btn").style.display = "none"
        })
        .catch((error) => {
            console.error("Error during sign-out:", error);
        });
}

function handleStudentLogin(email) {
  const studentDocRef = doc(collection(db, 'students'), email); // Correct way to reference a doc in a collection
  getDoc(studentDocRef).then((docSnapshot) => {
      if (!docSnapshot.exists()) {
          page_show(cur_page, "/el_futurix/get_details.html");
      } else {
          console.log("Student already exists:", docSnapshot.data().studentId);
      }
  }).catch((error) => {
      console.error("Error fetching student document: ", error);
  });
}



export { login, get_details, logout};