<template>
  <div class="popupContainer">
    <div class="popupGroup">
      <div class="popup" role="dialog" aria-modal="true">
        <h3>Do you confirm?</h3>
        <div class="button">
          <!-- We will handle these emits later -->
          <button @click="$emit('confirm')">Yes</button>
          <button @click="$emit('close')">&nbsp;No&nbsp;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.popupContainer {
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  inset: 0;
  background-color: rgb(57, 55, 55, 0.3);
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.4);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popupGroup {
  position: relative;
  text-align: center;
  height: 80%;
  top: 20%;
  max-width: 100%;
}

.popup {
  margin: 2rem auto;
  background-color: white;
  color: black;
  text-align: center;
  padding: 2.3rem 2.2rem;
  border-radius: 1.5rem;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.4);
}

button {
  margin: 2rem auto;
  font-size: large;
  background-color: #afb3b3;
  color: black;
  border-radius: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  margin: 1.3rem 0.5rem 0.5rem 0;
  padding: 1rem 1.5rem;
}

button:hover {
  background-color: white;
  color: black;
}
</style>