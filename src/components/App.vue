<template>
  <div id="app">
    <figure class="sidebar">
      <h1 class="site-title">
        <a href="/">Texy</a>
      </h1>
      <div class="description">
        Convert text to image
      </div>
      <div class="settings">
        <div class="form-group">
          <label for="background-color">
            Background Color
          </label>
          <input
            id="background-color"
            class="form-control"
            type="color"
            v-model="settings.backgroundColor">
        </div>
        <div class="form-group">
          <label for="text-color">
            Text Color
          </label>
          <input
            id="text-color"
            class="form-control"
            type="color"
            v-model="settings.textColor">
        </div>
        <div class="form-group">
          <label for="left-to-right">
            <input type="checkbox" id="left-to-right" v-model="settings.leftToRight" />
            Left to Right
          </label>
        </div>
        <div class="form-group">
          <button
            type="button"
            class="button"
            id="link-trigger"
            data-clipboard-target="#link">
            Copy sharable link
          </button>
          <input
            class="form-control"
            type="text"
            v-model="link"
            spellcheck="false"
            id="link" />
        </div>
       </div>
       <div class="tip">
         <p>
           Mama finally doesn't need to worry about the words limit of my tweets! Just copy the image and rock ᕕ(ᐛ)ᕗ
         </p>
       </div>
       <div class="credit">
         <a href="https://github.com/egoist/texy">Built with Vue.</a>
       </div>
       <br/>
       <a class="twitter-share-button"
          :href="`https://twitter.com/intent/tweet?text=${tweet}`">
        Share me on Twitter</a>
    </figure>
    <div
      class="main"
      :class="{'left-to-right': settings.leftToRight}">
      <textarea
        class="input"
        rows="10"
        v-model="text"
        ref="input"
        placeholder="Write your story...">
      </textarea>
      <div class="preview" ref="preview">
        <canvas ref="canvas" style="display: none"></canvas>
        <img v-show="dataURL" ref="image" :src="dataURL" />
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'query-string'
  import throttle from 'lodash.throttle'
  import Clipboard from 'clipboard'
  import toast from 'native-toast'

  const initialQuery = qs.parse(location.hash.substr(1))

  export default {
    data() {
      return {
        text: '',
        dataURL: '',
        settings: {
          backgroundColor: initialQuery.backgroundColor || '#ffffff',
          textColor: initialQuery.textColor || '#000000',
          leftToRight: initialQuery.leftToRight === 'true' ? true : false
        },
        tweet: encodeURIComponent(`Texy - convert text to image, tweet with no words limit by @rem_rin_rin`)
      }
    },
    computed: {
      link() {
        const query = {
          ...this.settings,
          text: this.text
        }
        const hash = `#?${qs.stringify(query)}`
        return location.origin + location.pathname + hash
      }
    },
    mounted() {
      this.$watch('settings', throttle(this.handleChange, 150), {
        deep: true
      })
      this.$watch('text', this.handleChange)

      if (initialQuery.text) {
        this.text = initialQuery.text
      }
      this.handleChange()

      // clipboard
      const clip = new Clipboard('#link-trigger')
      clip.on('success', () => toast('URL is copied!', 'top'))
    },
    methods: {
      updateDataURL() {
        const {canvas} = this.$refs
        const ctx = canvas.getContext('2d')
        this.dataURL = canvas.toDataURL()
      },
      handleChange() {
        console.log('render...')
        const {text} = this

        const {canvas} = this.$refs
        const ctx = canvas.getContext('2d')

        const x = 12.5
        const y = 15
        const lineheight = 30
        const lines = text.split('\n')
        const lineLengthOrder = lines.slice(0).sort((a, b) => {
          return b.length - a.length
        })
        ctx.canvas.width = ctx.measureText(lineLengthOrder[0]).width + 25
        ctx.canvas.height = (lines.length * lineheight)

        ctx.fillStyle = this.settings.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.textBaseline = "middle"
        ctx.font="20px Helvetica"
        ctx.fillStyle = this.settings.textColor
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + (i * lineheight))
        }

        this.updateDataURL()
      }
    }
  }
</script>

<style src="native-toast/dist/native-toast.css"></style>
<style>
  html, body {
    height: 100%;
  }
  body {
    margin: 0;
    font-size: 16px;
    line-height: 1.4;
    font-family: Helvetica, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: #4fc08d;
    &:hover {
      text-decoration: underline;
    }
  }
</style>

<style>
  #app {
    display: flex;
    height: 100%;
  }
  .sidebar {
    margin: 0;
    width: 280px;
    border-right: 1px solid #e2e2e2;
    height: 100%;
    padding: 10px;
    overflow: auto;
    .site-title {
      margin: 0 0 10px 0;
      a {
        color: #333;
        &:hover {
          text-decoration: none;
        }
      }
    }
    .description {
      color: #999;
      margin-bottom: 20px;
    }
  }
  .main {
    width: calc(100% - 280px);
    height: 100%;
    display: flex;
    flex-direction: column;
    &.left-to-right {
      flex-direction: row;
      .input, .preview {
        width: 50%;
        height: 100%;
      }
    }
  }
  .input {
    height: 50%;
    width: 100%;
    border: none;
    outline: none;
    background-color: #f0f0f0;
    resize: none;
    padding: 10px;
    font-size: 18px;
  }
  .preview {
    height: 50%;
    overflow: auto;
    position: relative;
  }
  .settings {
    label {
      display: block;
      user-select: none;
    }
    .form-control {
      display: block;
      margin-top: 5px;
    }
    .form-group {
      margin-bottom: 20px;
    }
  }
  .tip {
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
    color: #666;
    font-size: 13px;
    p {
      margin: 0;
    }
  }
  #link {
    color: #999;
    &:focus {
      color: #333;
    }
  }
</style>

<style>
  .button {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    display: block;
    outline: none;
    background-color: white;
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      background-color: #f0f0f0;
      border-color: #ccc;
    }
  }
  .form-control[type="text"] {
    width: 100%;
    padding: 5px 8px;
    outline: none;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    &:focus {
      border-color: #ccc;
    }
  }
</style>

<style>
  @media screen and (max-width: 768px) {
    .sidebar {
      display: none;
    }
    .main {
      width: 100%;
    }
  }
</style>
