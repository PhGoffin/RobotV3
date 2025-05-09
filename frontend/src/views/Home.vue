<template>

<div class="theContainer">

  <div class="home">
    <h2>Welcome to a new Testing Experience</h2>
    <h4>If you are looking for an easy but powerfull tool to perform 'Busines Test', your are at the right page!</h4>
    <p>&nbsp;</p>
  </div>

  <div class="home">
    <h2>Documentation</h2>
    <h4>Documentation is available for each role</h4>
    <p>&nbsp;</p>
  </div>

  <div class="home">
    <h2>General Data Protection Regulation (GDPR)</h2>
    <h4>We don't collect any personal information.<br>
      User is responsible in case he wants to use his personal login and pasword in the section 'Dummy User'<br>
      We strongly recommended that you encrypt your password and opt for generic users for the execution of the tests 
    </h4>
    <p>&nbsp;</p>
  </div>

</div>


</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


export default {
  name: 'Home',
  props: ['trace', 'userrole', 'role', 'currentuser', 'connected'],
  components: {},

  setup(props) {
    const router = useRouter()
    const trace = ref(props.trace)

    if (!props.connected) {
      router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1024px;
  margin: 20px auto;
  text-align: left;
}

.theContainer {
    margin: 3rem auto;
    max-width: 1400px;
    padding: 10px;
    background: linear-gradient(to right, #70ada2, #4cbf87);
    border-radius: 3rem;
    height: 80%;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}
</style>
