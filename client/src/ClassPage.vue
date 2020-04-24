<template>
  <div>
    <nav>
      <ul>
        <li><a class="active" href="#top" style="font-size: 150%; padding: 13px 16px;" >{{myText}}</a></li>
        <li v-if="authenticated"><a href="#about">About</a></li>
        <li v-if="authenticated"><a href="#contact">Contact</a></li>
        <li v-if="authenticated"><a href="/api-docs" target="_blank">View API Documentation</a></li>
        <li v-if="authenticated" @click="logout()"><a>Logout</a></li>
        <li v-else><a @click="openForm()">Login</a></li>
        <div class="welcome">
          Welcome, {{username}}
        </div>
      </ul>
    </nav>

  <div class="form-popup" id="myForm">
    <div class="form-container">
      <h1>Login</h1>

      <label for="email"><b>Email</b></label>
      <input type="text" placeholder="Enter Email" name="email" v-model="email" required>

      <label for="password"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="password" v-model="password" required>

      <button class="btn" @click="login(), closeForm()">Login</button>
      <button class="btn cancel" @click="closeForm()">Close</button>
    </div>
  </div>

    
    <h2>Assignments</h2>
    <div v-for="(assignment, index) in Assignments" :key="`assignment-${index}`">
      <div id="assignment_list">
        <!-- TODO: Fix the pdf viewer
        TODO: add pdfs directly to assignment object in db -->
        <a v-if="authenticated" href="/assets/schoolDocs/unitSummary.pdf" download><h3>{{ assignment.title }}</h3></a>
        <div v-else><h3>{{assignment.title}}</h3></div>
        <p style="font-size: 150%">{{ assignment.description }}</p>

        <div v-if="teacher">
          <a style="padding-left: 2em; padding-bottom: 2em;" @click="openNewForm()"><i class='material-icons'>edit</i></a>
          <div style="position: fixed;" class="form-popup-new" id="myNewForm">
            <div class="form-container-new">
              <h1>Edit {{assignment.title}}</h1>

              <label for="Title"><b>Title</b></label>
              <input type="text" placeholder="Enter a new title..." name="title" v-model="assignmentTitle">

              <label for="description"><b>Description</b></label>
              <input type="text" placeholder="Enter a new description..." name="description" v-model="assignmentDescription">

              <label for="dueDate"><b>Due Date</b></label>
              <input type="text" placeholder="Enter a new due date..." name="dueDate" v-model="assignmentDate">

              <button class="btn" @click="updateAssignment(), closeNewForm()">Save</button>
              <button class="btn cancel" @click="closeNewForm()">Cancel</button>
            </div>
          </div>
        </div>

      </div>
      <br>
    </div>

    <div v-if="teacher">
        <a class="assignment_list" @click="openLatestForm()"><i class='material-icons'>add</i></a>
          <div style="position: fixed;" class="form-popup-new" id="myLatestForm">
            <div class="form-container-new">
              <h1>Create New Assignment</h1>

              <label for="Title"><b>Title</b></label>
              <input type="text" placeholder="Enter a new title..." name="title" v-model="assignmentTitle">

              <label for="description"><b>Description</b></label>
              <input type="text" placeholder="Enter a new description..." name="description" v-model="assignmentDescription">

              <label for="dueDate"><b>Due Date</b></label>
              <input type="text" placeholder="Enter a new due date..." name="dueDate" v-model="assignmentDate">
              
              <button class="btn" @click="createAssignment(), closeLatestForm()">Save</button>
              <button class="btn cancel" @click="closeLatestForm()">Cancel</button>
            </div>
          </div>
    </div>


    <div v-if="authenticated">
      <a name="about"><h2>About</h2></a>
      <div style="margin: 0 auto; display: block;">
        <div class="polaroid">
          <img src="./assets/inaPhotos/cutepcc.png"  alt="Ina's Profile Picture" style="width:100%">
          <div class="container">
            <p>I am Mrs. Robertson!</p>
          </div>
        </div>
        <div class="polaroid">
          <img src="./assets/inaPhotos/beautifulWeddingPic.jpg" alt="Wedding Photo" style="width:100%">          
          <div class="container">
            <p>This is me on my wedding day.</p>
          </div>
        </div>
        <div class="polaroid">
          <img src="./assets/inaPhotos/rosie.jpg" alt="Doggo" style="width:100%">
          <div class="container">
            <p>This is my dog Rosie!</p>
          </div>
        </div>
        <div class="polaroid">
          <img src="./assets/inaPhotos/germany.jpg" alt="Traveling" style="width:100%">
          <div class="container">
            <p>This is me in Germany.</p>
          </div>
        </div>
      </div>
    </div>

    <br>

    <div v-if="authenticated">
      <div class="aboutMe">
        <div>
          Thank you for visiting my website and looking around. I love to teach history and am here to help with whatever I can.
        </div>
        <div>  
          Feel free to reach out in the contact section of this web page!
        </div>
      </div>
    </div>
 
    <br>
    <div v-if="authenticated">
      <a name="contact"><h2>Contact</h2></a>
      <div id="assignment_list">
        <h3>Email</h3>
        <p><a href="mailto:mcarr17@byu.edu" style="font-size:175%">mcarr17@byu.edu</a></p>
      </div>
      <br>
    </div>
  </div>
  
  <div v-if="authenticated">
    <h2>Students</h2>
    <div v-for="(user, index) in users" :key="`user-${index}`">
      <div id="assignment_list">
        <h3>{{ user.firstName }} {{ user.lastName }}</h3>
        <div v-if="teacher"><p style="font-size: 150%">{{ user.email }}</p></div>
      </div>
    </div>
  </div>

</template>

<script>
const openForm = () => {
  document.getElementById("myForm").style.display = "block";
}
const closeForm = () => {
  document.getElementById("myForm").style.display = "none";
}
const openNewForm = () => {
  document.getElementById("myNewForm").style.display = "block";
}
const closeNewForm = () => {
  document.getElementById("myNewForm").style.display = "none";
}
const openLatestForm = () => {
  document.getElementById("myLatestForm").style.display = "block";
}
const closeLatestForm = () => {
  document.getElementById("myLatestForm").style.display = "none";
}

const users = []
const messages = []
const Assignments = []
//change back to false for authenticated and teacher
let authenticated = false
let teacher = false
let username = "Visitor"
const deleteComment = (itemId) => {
  messages.splice(itemId, 1);
}

export default {
  name: 'class-page',
  data: () => {
    return {
      myText: "Mrs. Robertson's Class",
      username,
      messages,
      userInput: "",
      Assignments,
      authenticated,
      teacher,
      email: "",
      password: "",
      assignmentTitle: "",
      assignmentDescription: "",
      assignmentDate: "",
    }
  },
  created: function () {
    this.getAssignments()
    this.getUsers()
  },
  methods: {
    deleteComment,
    openForm,
    closeForm,
    openNewForm,
    closeNewForm,
    openLatestForm,
    closeLatestForm,
    addComment () {
      console.log('adding')
      if (this.allSpaces() || this.empty()) {
        return
      }
      messages.push(this.userInput)
      this.userInput = ""
    },
    allSpaces() {
      //check if user input is more than spaces
      const input = this.userInput
      if(input.trim().length == 0) {
        return true
      }
      return false
    },
    empty() {
      const input = this.userInput
      if(input == "") {
        return true
      }
      return false
    },
    validateForm (event) {
      this.attemptSubmit = true;
      if (this.allSpaces || this.empty) event.preventDefault()
    },
    getUsers: async () => {
      const response = await fetch("/api/users", {
          method: 'get',
          headers: {
            "accept": "application/json"
          }
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });  
    
      if (response.status === 200) {
        const result = await response.json()
        while (users.length) { users.pop(); }
        result.forEach(item => {
          users.push(item);
        })
      } else {
        console.log('request failed', response)
      }
    },
    getAssignments: async () => {
      const response = await fetch("/api/assignments", {
          method: 'get',
          headers: {
            "accept": "application/json"
          }
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });  
    
      if (response.status === 200) {
        const result = await response.json()
        while (Assignments.length) { Assignments.pop(); }
        result.forEach(item => {
          Assignments.push(item);
        })
      } else {
        console.log('request failed', response)
      }
    },
    //update and Assignment
    //create an Assignment
    async createAssignment () {
      const input = {
        title: this.assignmentTitle,
        description: this.assignmentDescription,
        dueDate: this.assignmentDate,
        queryTitle: this.assignmentTitle.trim()
      }
      const response = await fetch("/api/assignments", {
          method: 'post',
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });  
    
      if (response.status === 200) {
        this.assignmentTitle = ""
        this.assignmentDescription = ""
        this.assignmentDate = ""
        this.getAssignments()
      } else {
        console.log('request failed', response)
      }
    },
    // log a user in and out
    async login () {
      const input = {
        username: this.email,
        password: this.password
      }
      const response = await fetch("/api/login", {
          method: 'post',
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input)
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });  
    
      if (response.status === 200) {
        const result = await response.json()
        console.log(username)
        this.username = result.firstName
        this.teacher = result.teacher
        this.authenticated = true
      } else {
        console.log('request failed', response)
      }
    },
    async logout() {
      const response = await fetch("/api/logout", {
        method: 'get',
          headers: {
            "accept": "*/*",
          },
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });  
    
      if (response.status === 200) {
        //const result = await response.json()
        this.username = "Visitor"
        this.teacher = false
        this.authenticated = false

      } else {
        console.log('request failed', response)
      }     
    }
  }
}
</script>

<style scoped>
form,
form > *,
form > button,
form > input[type=submit],

a {
  color: rgb(164, 89, 211);
}

h1 {
  color: rgb(70, 70, 70);
}

b {
  color: rgb(70, 70, 70);
}

h2 {
  margin: 0 auto;
  padding-top: 3em;
  padding-left: .5em;
  padding-right: .5em;
  padding-bottom: .5em;
}
#assignment_list {
  border: solid rgb(211, 211, 211) 2px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 95%;
  margin: 0 auto;
  border-radius: 10px;
}

h3 {
  padding-top: .5em;
  padding-left: .5em;
  padding-right: .5em;
}

p {
  padding-left: 2em;
  padding-right: .5em;
  padding-bottom: .5em;
}

ul {
  list-style-type: none;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* border: .5px solid #e7e7e7; */
  background-color: #f3f3f3;
}

li {
  float: left;
}

li a {
  display: block;
  color: #666;
  text-align: center;
  padding: 18px 16px;
  text-decoration: none;
}

li a:hover:not(.active) {
  background-color: #ddd;
}

li a.active {
  color: rgb(255, 251, 251);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  background-color: rgba(145, 6, 163, 0.671);
}

nav {
  position: fixed;
  left: 0;
  right: 0;
}

div.polaroid {
  width: 21%;
  float: left;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: block;
  margin: 25px;
}

div.container {
  text-align: center;
  padding: 10px 20px;
  font-size: 150%;
}

div.aboutMe {
  display: inline-block;
  font-size: 150%;
  text-align: center;
  border: solid rgb(211, 211, 211) 2px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
  margin: 0 auto;
  border-radius: 10px;
  padding: 5em;
  width: 100%;
}


/* The popup form - hidden by default */
.form-popup {
  display: none;
  position: fixed;
  top: 5em;
  left: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

/* Add styles to the form container */
.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

/* Full-width input fields */
.form-container input[type=text], .form-container input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}

/* When the inputs get focus, do something */
.form-container input[type=text]:focus, .form-container input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/login button */
.form-container .btn {
  background-color: rgb(71, 121, 73);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: rgb(192, 82, 82);
}

/* Add some hover effects to buttons */
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}

.welcome {
  float:right;
  font-size: 125%;
  display: block;
  color: rgb(117, 117, 117);
  text-align: center;
  padding: 14px 12px;
  text-decoration: none;
}

/* The popup form - hidden by default */
.form-popup-new {
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid #f1f1f1;
  z-index: 9;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

/* Add styles to the form container */
.form-container-new {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

/* Full-width input fields */
.form-container-new input[type=text], .form-container input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
}

/* When the inputs get focus, do something */
.form-container-new input[type=text]:focus, .form-container input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/login button */
.form-container-new .btn {
  background-color: rgb(84, 122, 158);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container-new .cancel {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: rgb(226, 162, 124);
}

/* Add some hover effects to buttons */
.form-container-new .btn:hover, .open-button:hover {
  opacity: 1;
}
</style>
