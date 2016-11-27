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
       </div>
       <div class="tip">
         <p>
           Mama finally doesn't need to worry about the words limit of my tweets! Just copy the image and rock ᕕ(ᐛ)ᕗ
         </p>
       </div>
       <div class="credit">
         <a href="https://github.com/egoist/texy">Built with Vue.</a>
       </div>
    </figure>
    <div class="main">
      <textarea
        class="input"
        rows="10"
        v-model="text"
        placeholder="Write your story...">
      </textarea>
      <div class="preview">
        <canvas ref="canvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'query-string'

  const initialQuery = qs.parse(location.hash.substr(1))

  export default {
    data() {
      return {
        text: initialQuery.text || '',
        settings: {
          backgroundColor: initialQuery.backgroundColor || '#ffffff',
          textColor: initialQuery.textColor || '#000000'
        }
      }
    },
    mounted() {
      this.$watch('settings', this.handleChange, {
        deep: true
      })
      this.$watch('text', this.handleChange)

      this.handleChange()
    },
    methods: {
      handleChange() {
        console.log('render...')
        const {text} = this

        if (text) {
          this.updateHash()
        }

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
      },
      updateHash() {
        const query = {
          ...this.settings,
          text: this.text
        }
        const hash = `#?${qs.stringify(query)}`
        location.hash = hash
      }
    }
  }
</script>

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
      color: #333;
      &:hover {
        text-decoration: none;
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
