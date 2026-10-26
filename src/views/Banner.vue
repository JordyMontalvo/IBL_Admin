<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">

      <div class="container">
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': tab === 'banners' }"><a @click="tab = 'banners'">Banners</a></li>
            <li :class="{ 'is-active': tab === 'pins' }"><a @click="tab = 'pins'">Pines</a></li>
          </ul>
        </div>
      </div>

      <div v-show="tab === 'banners'">

      <div class="container">
        <strong>Banner 1 (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending" class="button is-primary" @click="save">Guardar</button>
          <button v-if="sending" disabled class="button is-primary">Guardar</button>

        </div>
      </div> <br><br>

      <div class="container">
        <strong>Banner 2 (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img2" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange2" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending2" class="button is-primary" @click="save2">Guardar</button>
          <button v-if="sending2" disabled class="button is-primary">Guardar</button>

        </div>
      </div> <br><br>

      <div class="container">
        <strong>Banner 3 (1920 x 508) px</strong> <br><br>

        <div>

          <figure >
            <img :src="banner.img3" style="max-height: 400px;">
          </figure> <br>


          <label>

            <span class="button">
              <span class="icon">
                <i class="fas fa-upload"></i>
              </span>
              <span>Cambiar imágen</span>
            </span>

            <input type="file" @change="onFileChange3" style="display: none;">

          </label>&nbsp;

          <button v-if="!sending3" class="button is-primary" @click="save3">Guardar</button>
          <button v-if="sending3" disabled class="button is-primary">Guardar</button>

        </div>
      </div> <br><br>
      </div>

      <!-- Pines de rango -->
      <div class="container" v-show="tab === 'pins'">
        <p style="margin-bottom: 20px; color: #666;">
          Imagen del pin de cada rango. Se recomienda PNG con fondo transparente (cuadrada, mínimo 400 x 400 px).
        </p>

        <div class="columns is-multiline">
          <div class="column is-3-desktop is-6-tablet" v-for="rank in ranks" :key="rank.key">
            <div class="box has-text-centered">
              <strong>{{ rank.label }}</strong>

              <figure style="height: 160px; display: flex; align-items: center; justify-content: center; margin: 15px 0;">
                <img v-if="pinPreview[rank.key] || pins[rank.key]" :src="pinPreview[rank.key] || pins[rank.key]" style="max-height: 160px; max-width: 100%;">
                <span v-else class="has-text-grey-light">Sin imagen</span>
              </figure>

              <label>
                <span class="button is-small">
                  <span class="icon"><i class="fas fa-upload"></i></span>
                  <span>{{ pins[rank.key] ? 'Reemplazar' : 'Subir imagen' }}</span>
                </span>
                <input type="file" accept="image/*" @change="onPinChange($event, rank.key)" style="display: none;">
              </label>&nbsp;

              <button class="button is-small is-primary" :class="{ 'is-loading': pinSending[rank.key] }"
                :disabled="!pinFiles[rank.key] || pinSending[rank.key]" @click="savePin(rank.key)">Guardar</button>

              <p class="help is-danger" v-if="pinError[rank.key]">{{ pinError[rank.key] }}</p>
              <p class="help is-success" v-if="pinSaved[rank.key]">Guardado</p>
            </div>
          </div>
        </div>
      </div>

    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'
import lib    from '@/lib'

export default {
  components: { Layout },
  data() {
    return{
      banner:  null,

      loading: true,
      sending: false,
      sending2: false,
      sending3: false,

      title: null,

      tab: 'banners',
      ranks: [
        { key: 'emprendedor',    label: 'Emprendedor' },
        { key: 'empresario',     label: 'Empresario' },
        { key: 'master',         label: 'Máster' },
        { key: 'top_empresario', label: 'Top Empresario' },
      ],
      pins: {},
      pinPreview: {},
      pinFiles: {},
      pinSending: {},
      pinError: {},
      pinSaved: {},
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)
    this.GET()
  },
  methods: {
    async GET() {

      this.loading = true

      // GET data
      const { data } = await api.promos.GET(); console.log({ data })

      this.loading = false

      // success
      this.banner  = data.banner

      const pins = await api.pins.GET()
      if (!pins.data.error) this.pins = pins.data.pins || {}
    },

    onPinChange(e, key) {
      const file = e.target.files[0]
      if (!file) return

      this.$set(this.pinFiles, key, file)
      this.$set(this.pinError, key, null)
      this.$set(this.pinSaved, key, false)

      const reader = new FileReader()
      reader.onload = (ev) => this.$set(this.pinPreview, key, ev.target.result)
      reader.readAsDataURL(file)
    },

    async savePin(key) {
      const file = this.pinFiles[key]
      if (!file) return

      this.$set(this.pinSending, key, true)
      this.$set(this.pinError, key, null)

      try {
        const img = await lib.upload(file, `pin-${key}-${file.name}`, 'pins')
        const { data } = await api.pins.POST({ rank: key, img })

        if (data.error) {
          this.$set(this.pinError, key, data.msg)
        } else {
          this.pins = data.pins
          this.$set(this.pinFiles, key, null)
          this.$set(this.pinPreview, key, null)
          this.$set(this.pinSaved, key, true)
        }
      } catch (err) {
        this.$set(this.pinError, key, 'No se pudo subir la imagen. Intenta nuevamente.')
      } finally {
        this.$set(this.pinSending, key, false)
      }
    },


    async onFileChange(e) {

      this.file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img = e.target.result

      }

      reader.readAsDataURL(this.file)
    },

    async onFileChange2(e) {

      this.file2 = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img2 = e.target.result

      }

      reader.readAsDataURL(this.file2)
    },

    async onFileChange3(e) {

      this.file3 = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        this.banner.img3 = e.target.result

      }

      reader.readAsDataURL(this.file3)
    },


    async save() {
      this.sending = true

      const img = await lib.upload(this.file, this.file.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 1 })
      this.sending = false
    },

    async save2() {
      this.sending2 = true

      const img = await lib.upload(this.file2, this.file2.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 2 })
      this.sending2 = false
    },

    async save3() {
      this.sending3 = true

      const img = await lib.upload(this.file3, this.file3.name, 'banner')
      console.log({ img })

      const { data } = await api.promos.POST({ id: this.banner.id, img, pos: 3 })
      this.sending3 = false
    },
  }
};
</script>
