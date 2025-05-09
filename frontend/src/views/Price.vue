<template>

<div class="theContainer">

  <div class="price">
    <h2>Special Agreement with DG INTPA</h2>
    <h4><li>DG INTPA received a full version free of charge deployed on the INTPA Server.</li>
    <li>DG INTPA is not the owner of the product.</li>
      <li>All the sources including all the data stored in the database, are
      the property of Philippe Goffin.</li></h4>
    <h4><li>DG INTPA can create multiple projects and subprojects with the tool.</li>
    <li>DG INTPA can use the version for free but cannot share the tool with other DGs.</li>
      <li>All the users of the application must work internaly for DG INTPA only.</li>
    </h4>
  </div>

  <div class="price">
    <h2>Disclaimer</h2>
    <h4><li>Philippe Goffin cannot be responsible for any disruption of the tool or corruption of the data<br>&nbsp;&nbsp;&nbsp;&nbsp;(data of the tool or data of the tested application).</li>
    <li>Backup of the sources and the database is the responsibility of DG INTPA.</li>
    <li>Philippe Goffin has no obligation to provide upgrade of the tool.</li>
    </h4>
  </div>

</div>



</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


export default {
  name: 'Price',
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

<style>
.price {
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
