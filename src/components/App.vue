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
          :href="`https://twitter.com/intent/tweet?text=${tweet}&via=rem_rin_rin`">
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
        autofocus
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
  import tabOverride from 'taboverride'

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
        tweet: encodeURIComponent(`#texy - convert text to image, tweet with no words limit`)
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

      tabOverride.set(this.$refs.input)
      tabOverride.tabSize(2)

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
        const lineHeight = 30
        const lines = text.split('\n')
        const lineLengthOrder = lines.slice(0).sort((a, b) => {
          return b.length - a.length
        })
        ctx.canvas.width = ctx.measureText(lineLengthOrder[0]).width + 25
        ctx.canvas.height = (lines.length * lineHeight)

        ctx.fillStyle = this.settings.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.textBaseline = 'middle'
        ctx.font = '20px Helvetica'
        ctx.fillStyle = this.settings.textColor
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + (i * lineHeight))
        }

        this.updateDataURL()
      }
    }
  }
</script>

<style src="native-toast/dist/native-toast.css"></style>
<style src="css/reset.css"></style>
<style src="css/main.css"></style>
<style src="css/form-control.css"></style>
<style src="css/responsive.css"></style>
