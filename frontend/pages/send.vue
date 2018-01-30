<template>
  <div>
    <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title primary-title>Center the QR Code</v-card-title>
        <v-card-text>
          <video class="qr-preview" ref="qrPreview"></video>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-layout row wrap>
      <v-flex xs12>
        <h2>Send your files</h2>
      </v-flex>
      <v-flex xs12 md6>
        <h6>Type your code</h6>
        <v-text-field v-model="code" maxlength="5" minlength="5"></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-btn color="primary" @click.stop="openScarDialog">Scan your code </v-btn>
      </v-flex>
      <v-flex xs12>
        <div v-if="showFilePicker" class="pick-file">
          <dropzone id="drop-box" :options="options"></dropzone>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Dropzone from 'nuxt-dropzone';
  import 'nuxt-dropzone/dropzone.css';
  export default {
    components: {
      Dropzone
    },
    layout: 'main',
    data () {
      return {
        code: null,
        dialog: false
      };
    },
    computed: {
      showFilePicker () {
        return this.code && this.code.length === 5;
      },
      options () {
        return {
          url: '/api/send-file',
          dictDefaultMessage: 'Touch to upload files',
          params: {
            uuid: this.code
          }
        };
      },
      uploadUrl () {
        return '/api/send-file';
      }
    },
    methods: {
      async openScarDialog () {
        this.dialog = true;
        this.code = null;
        this.scanner = new this.$istascan.Scanner({ video: this.$refs.qrPreview });
        this.scanner.addListener('scan', (content) => {
          this.code = content;
          this.dialog = false;
        });

        const cameras = await this.$istascan.Camera.getCameras();
        if (cameras.length > 0) {
          this.scanner.start(cameras[0]);
        } else {
          console.error('No cameras found.');
        }
      },
      closeScanDialog () {
        this.dialog = false;
      }
    },
    watch: {
      dialog: {
        immediate: false,
        handler (value) {
          if (!value && this.scanner) {
            this.scanner.stop();
          }
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .qr-preview {
    width: 100%;
    height: auto;
  }
</style>
