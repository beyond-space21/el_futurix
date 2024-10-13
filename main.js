//application
import { login,get_details} from './el_futurix/login.js'
document.getElementById('log_in_btn').onclick = login

get_details().then((userDetails) => {
    if (userDetails) {
    console.log("user loged in");
    console.log(userDetails);
    document.getElementsByClassName("pic")[0].src = userDetails.photo
    document.getElementById("log_in_btn").style.display = "none"
    document.getElementById("log_out_btn").style.display = "block"
    document.getElementById("profile_btn").style.display = "block"
    } else {
      console.log("No user is signed in.");
    }
  }).catch((error) => {
    console.error("Error getting user details:", error);
  });


  // document.getElementsByClassName("profile")[0].onclick = ()=>{
  //   alert(countdown())
  // }

  // setInterval(()=>{
  //   console.log(countdown());
    
  // },1000)

  function countdown(){
    const countDate = new Date("October 13, 2024 13:00:00").getTime();

    const now = new Date().getTime();
    const gap = countDate - now;

    // Time calculations for days, hours, minutes, and seconds
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(gap / day);
    const hours = Math.floor((gap % day) / hour);
    const minutes = Math.floor((gap % hour) / minute);
    const seconds = Math.floor((gap % minute) / second);

    return "Event launches in " + hours + "Hours " + minutes + "Minutes " + seconds + "Seconds"
};
