<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="0">
        Magic Pouch
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <div  class="code-input full-width">
        <h6>Type your code</h6>
        <input v-model="code" class="" maxlength="5" minlength="5">
      </div>
      <div class="generic-margin code-scan">
        <h6>OR</h6>
        <button class="primary" @click="scanQr()">scan</button>
      </div>

      <div v-show="showFilePicker" class="pick-file">
        <q-uploader url="/api/send-file" @start="showLoading()" @finish="hideLoading()" :additional-fields="uploadParams"></q-uploader>
      </div>

      <div class="send-file" v-show="showFileSend">
        <button class="primary generic-margin" @click="sendCode()">Send</button>
      </div>
    </div>
  </q-layout>
</template>

<script>
  import { Loading } from 'quasar';

  export default {
    components: {
    },
    data () {
      return {
        code: null,
        file: null
      };
    },
    computed: {
      showFilePicker ({code}) {
        return code && code.length === 5;
      },
      showFileSend ({file}) {
        return !!file;
      },
      uploadParams ({code}) {
        return [{name: 'uuid', value: code}];
      }
    },
    methods: {
      scanQr () {
        window.cordova.plugins.barcodeScanner.scan(
          result => {
            this.code = result.text;
          },
          error => {
            console.error(error);
          },
          {
            preferFrontCamera: false,
            prompt: 'Scan the code',
            resultDisplayDuration: 0,
            formats: 'QR_CODE',
            orientation: 'portrait'
          }
        );
      },
      showLoading () {
        Loading.show();
      },
      hideLoading () {
        Loading.hide();
      }
    }
  };
</script>

<style lang="stylus">
  .code-input {
    margin: 24px;
    text-align: center;
  }
  .code-scan {
    text-align: center;
  }

  .pick-file {
    margin-top:24px;
    text-align: center;

    input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  }
  .send-file {
    text-align: center;
  }

  .q-uploader .card {
    margin:auto;
  }

</style>
