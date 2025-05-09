<template>
  
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/price">Price</router-link> |
    <router-link to="/documentation">Documentation</router-link>  |
    <router-link to="/ctrlpanel">Control Panel</router-link>
  </div>
</template>


<script>
export default {

}
</script>

<style>

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>