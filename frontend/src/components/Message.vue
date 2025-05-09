<template>
  <div>
    <!-- <transition name="message"> -->
    <div class="message-wrapper">
      <div :class="messageStyle == 'Alert' ? 'message alert' : 'message'">{{ textMessage }}</div>
    </div>
    <!-- </transition> -->

  </div>
</template>

<script>
import { ref } from 'vue'
import { consoleLog } from '../util/debug';


export default {
  name: "message",
  props: ['textmessage', 'myStyle'],

  setup(props, context) {

    consoleLog('Message.vue', 2, '----- Message')
    consoleLog('Message.vue', 2, 'Style: ' + props.myStyle)
    const textMessage = ref(props.textmessage)
    const messageStyle = ref(props.myStyle)

    return { textMessage, messageStyle }
  }


}
</script>

<style>
/* Enter transitions */
.message-enter-active {
  animation: wobble 0.5s ease;
}

/* leave transitions */
.message-leave-to {
  opacity: 0;
  /* transform: translateY(-60px); */
}

.message-leave-active {
  transition: all 0.3s ease;
}

@keyframes wobble {
  0% {
    transform: translateY(-100px);
    opacity: 0
  }

  50% {
    transform: translateY(0px);
    opacity: 1
  }

  60% {
    transform: translateX(8px);
    opacity: 1
  }

  70% {
    transform: translateX(-8px);
    opacity: 1
  }

  80% {
    transform: translateX(4px);
    opacity: 1
  }

  90% {
    transform: translateX(-4px);
    opacity: 1
  }

  100% {
    transform: translateX(0px);
    opacity: 1
  }
}

.message-wrapper {
  position: fixed;
  width: 100%;
  top: 20px;
}

.message {
  padding: 20px;
  color: white;
  background: #3ab19b;
  border-radius: 10px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

.message.alert {
  color: white;
  background: #eb84ad;
}
</style>