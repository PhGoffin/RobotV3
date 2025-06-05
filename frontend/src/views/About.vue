<template>
  <div class="theContainer">
  <div class="about">
    <h2>Our Story</h2>
    <h4>I am a professional in IT, working for a big IT Company since 1991.<br>
      In 2018, I decided to develop a tool to help the Testers with automated tests.
      My objective was to provide a tool that can be used without any technical skills.<br>
      In 2024/2025, I decided to fully rewrite the tool to offer a more flexible solution, that can be used by a Team.</h4>
  </div>

  <div class="about">
    <h2>Our Mission</h2>
    <h4>Nowaday, testing an application, is a real challenge. Mimic the actions of a user is not enough!
      We want a tool easy to use and able to provide workarounds in case of issues, we need to be able to write algorithms to 
      verify the processes, the tool must be able to make decision and of course we need to have different dataset to play simulation.
      And last but not least, we want to work as a team with different skills and share our experience.
      Some people in the team will be in charge of the design of the scenario while other people will run the scenario
      in order to prepare assets (a contract, a partial workflow...) for the final demo with the end users.  
    </h4>
  </div>

  <div class="about">
    <h2>About the Robot</h2>
    <h4>The Robot is designed to handle 'Business Test' using the user interface, just like a normal user would do.
      It's a smart Robot, meaning he is able of relaunching a test knowing the current context, he will restart exactly 
      in the right place, he will only move on to the next scenario if the current test has been executed successfully
    </h4>
  </div>

  <div class="about">
    <h2>How to start</h2>
    <h3>Version of the Robot</h3>
    <h4>The Robot tool is declined in different versions:
      <li>A free version with limited capacities but enough to evaluate the tool</li>
      <li>A tool with licences for professional experience</li>
    </h4>

    <h3>Registration of the user</h3>
    <h4>There are three possibilities:
      <li>You want to play with a free version:
        In this case, register as a new user with a new workspace</li>
      <li>You are a professional and you want to setup a new workspace for your Company or Customer.
        Like for the free version, start by creating a new login and define a new workspace.
        Check the suitable licence for your company and after the pruchase, you will be able to invite
        other members of your team to join the workspace.
      </li>
      <li> You are a professional and you want to join an existing workspace.
        Start by creating a new login and select the right workspace.
        Send a message to the Administrator to justify the need to join the group.
        If your request is accepted, the Administrator will promote you to a role on a project: Tester, Designer or Administrator.
        As soon as you are promoted, you can start your testing journey!
      </li>
    </h4>
  </div>
</div>

</template>

<script>
import gsap from 'gsap'
import { ref } from 'vue'


export default {
  setup() {

    return {}

  }

}
</script>

<style scoped>
.theContainer {
    margin: 3rem auto;
    max-width: 1400px;
    padding: 10px;
    background: linear-gradient(to right, #70ada2, #4cbf87);
    border-radius: 3rem;
    height: 80%;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}

.about {
  max-width: 1024px;
  margin: 20px auto;
  text-align: left;
}
</style>