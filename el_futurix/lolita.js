window.onload = () => {
    var rg = document.getElementById("frm_cnt")
    rg.style.marginLeft = (window.innerWidth - 354) / 2 + 'px'


}


// Function to simulate fetching member name by student ID
function fetchMemberName(member) {
    const studentId = document.getElementById(member).value;
    const nameDisplay = document.getElementById(`${member}-name`);

    if (studentId) {
        // Simulate fetching name with student ID (replace with real API call)
        const memberName = "Name for " + studentId; // Simulated response
        nameDisplay.textContent = memberName;
    } else {
        nameDisplay.textContent = "Please enter a valid Student ID";
    }
}


// Function to close modal
function closeModal() {
    document.getElementById('frm_cv').style.display = 'none';
}

// Optional: Function to open modal (if needed)
function openModal() {
    document.getElementById('frm_cv').style.display = 'block';
}


//registration time r
// setInterval(()=>{
//     document.getElementsByClassName('btn')[0].innerHTML = countdown()
// },1000)

function countdown() {
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

    return "Register in " + hours + " : " + minutes + " : " + seconds
};

document.getElementsByClassName("container")[0].style.backgroundColor = "transparent"
document.getElementsByClassName("container")[0].style.margin = "unset"
document.getElementsByClassName("container")[0].style.padding = "unset"
document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(61, 61, 61, 0.47)"


var mem_coun = 1;

function add_mem_fld(e) {
    if (mem_coun < e) {
        const truCon = document.getElementsByClassName("tru_con")[0];

        // Create a new element dynamically and add it without resetting the form
        const newMember = document.createElement('div');
        newMember.classList.add('id_elm');
        newMember.innerHTML = `
            <label for="college">Member ${mem_coun + 1}</label><br>
            <div class="ip_flx">
                <input class="id_flds" type="text" id="mem${mem_coun + 1}" name="Member-${mem_coun + 1}" placeholder="Member ID"><br><br>
                <button class="gt_btn" type="button">Get</button>
            </div>
            <h6 class="nameOfID">student name</h6>
        `;

        truCon.appendChild(newMember); // Append the new member
        mem_coun++; // Increment the counter
    }
}

[
   
// "I assure that I have read all the guidelines mentioned in the Rulebook and adhere to the guidelines.",
// "The entered details are correct and will not be changed in the future.",
// "I understand that in case of any disputes or discrepancies, the organizers' decision will be final and binding.",
// "I know that once the payment is confirmed, it will not be refunded under any circumstances.",
"I verified that the event schedule does not clash with any other event that my teammates and I have registered for."
].forEach((elm) => {
    const con = document.createElement('div')
    con.innerHTML = `
   <div class="ip_flx ch">
       <input type="checkbox" name="assurance" required>
       <label for="assurance">${elm}</label>
   </div>
   <br>
   `
   document.getElementsByTagName('h4')[0].insertAdjacentElement('afterend',con)
})
