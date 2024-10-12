//application
import { login,loginBtn,get_details} from './el_futurix/login.js'
loginBtn.addEventListener('click',login)

get_details().then((userDetails) => {
    if (userDetails) {
    console.log("user loged in");
    console.log(userDetails);
    document.getElementsByClassName("pic")[0].src = userDetails.photo
    } else {
      console.log("No user is signed in.");
    }
  }).catch((error) => {
    console.error("Error getting user details:", error);
  });
