<template>
  <Layout>
    <i class="load" v-if="loading"></i>
    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Proyectos</strong>
        </div>
      </div>

      <div class="container" style="padding-top: 25px; padding-bottom: 50px;">
        <div v-if="error" class="notification is-danger is-light" style="margin-bottom: 20px;">
          <button class="delete" @click="error = null"></button>
          {{ error }}
        </div>

        <div class="level">
          <div class="level-left">
            <p class="subtitle is-6" style="color: #666;">
              Los proyectos registrados aparecen en la sección «Proyectos» de la app.
            </p>
          </div>
          <div class="level-right">
            <button class="button is-primary" @click="openNew">Nuevo proyecto</button>
          </div>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Ubicación</th>
                <th>Mapa (PDF)</th>
                <th class="has-text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id">
                <td>{{ project.name }}</td>
                <td>{{ project.location }}</td>
                <td>{{ project.fileName }}</td>
                <td class="has-text-right">
                  <button class="button is-small is-danger is-light" :disabled="saving" @click="confirmDelete = project">
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr v-if="!projects.length">
                <td colspan="4" class="has-text-centered">No hay proyectos registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Nuevo proyecto -->
      <div class="modal is-active" v-if="showForm">
        <div class="modal-background" @click="closeForm"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Nuevo proyecto</p>
            <button class="delete" @click="closeForm"></button>
          </header>
          <section class="modal-card-body">
            <div v-if="formError" class="notification is-danger is-light">{{ formError }}</div>
            <div class="field">
              <label class="label">Nombre del proyecto</label>
              <div class="control">
                <input class="input" v-model="form.name" placeholder="Ej. Mirador de Chancay 01">
              </div>
            </div>
            <div class="field">
              <label class="label">Ubicación</label>
              <div class="control">
                <input class="input" v-model="form.location" placeholder="Ej. Chancay, Huaral, Lima">
              </div>
            </div>
            <div class="field">
              <label class="label">Mapa (PDF, máx. 8 MB)</label>
              <div class="file has-name is-fullwidth">
                <label class="file-label">
                  <input class="file-input" type="file" accept="application/pdf,.pdf" @change="pickFile">
                  <span class="file-cta"><span class="file-label">Seleccionar PDF</span></span>
                  <span class="file-name">{{ form.file ? form.file.name : 'Ningún archivo seleccionado' }}</span>
                </label>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-primary" :class="{ 'is-loading': saving }" @click="save">Guardar</button>
            <button class="button" :disabled="saving" @click="closeForm">Cancelar</button>
          </footer>
        </div>
      </div>

      <!-- Confirmar eliminación -->
      <div class="modal is-active" v-if="confirmDelete">
        <div class="modal-background" @click="confirmDelete = null"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Eliminar proyecto</p>
            <button class="delete" @click="confirmDelete = null"></button>
          </header>
          <section class="modal-card-body">
            ¿Seguro que deseas eliminar <strong>{{ confirmDelete.name }}</strong>? Dejará de aparecer para los usuarios.
          </section>
          <footer class="modal-card-foot">
            <button class="button is-danger" :class="{ 'is-loading': saving }" @click="remove">Eliminar</button>
            <button class="button" :disabled="saving" @click="confirmDelete = null">Cancelar</button>
          </footer>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout.vue'
import api from '@/api'

const MAX_PDF = 8 * 1024 * 1024

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result.split(',')[1])
  reader.onerror = reject
  reader.readAsDataURL(file)
})

export default {
  components: {
    Layout
  },
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      projects: [],
      showForm: false,
      formError: null,
      form: { name: '', location: '', file: null },
      confirmDelete: null,
    }
  },
  async created() {
    const { data } = await api.projects.GET()
    this.loading = false
    if (data.error) return this.error = data.msg
    this.projects = data.projects
  },
  methods: {
    openNew() {
      this.form = { name: '', location: '', file: null }
      this.formError = null
      this.showForm = true
    },
    closeForm() {
      if (!this.saving) this.showForm = false
    },
    pickFile(e) {
      const file = e.target.files[0]
      this.formError = null
      if (!file) return this.form.file = null
      if (file.type !== 'application/pdf') {
        this.formError = 'El archivo debe ser un PDF'
        return this.form.file = null
      }
      if (file.size > MAX_PDF) {
        this.formError = 'El PDF no debe superar los 8 MB'
        return this.form.file = null
      }
      this.form.file = file
    },
    async save() {
      const { name, location, file } = this.form
      if (!name.trim()) return this.formError = 'Ingresa el nombre del proyecto'
      if (!location.trim()) return this.formError = 'Ingresa la ubicación del proyecto'
      if (!file) return this.formError = 'Sube el PDF del mapa'

      this.saving = true
      this.formError = null
      try {
        const pdf = await toBase64(file)
        const { data } = await api.projects.POST({ action: 'add', name, location, pdf, fileName: file.name })
        if (data.error) return this.formError = data.msg
        this.projects = data.projects
        this.showForm = false
      } catch (e) {
        this.formError = 'No se pudo guardar. Intenta nuevamente.'
      } finally {
        this.saving = false
      }
    },
    async remove() {
      this.saving = true
      try {
        const { data } = await api.projects.POST({ action: 'delete', id: this.confirmDelete.id })
        if (data.error) this.error = data.msg
        else this.projects = data.projects
      } catch (e) {
        this.error = 'No se pudo eliminar. Intenta nuevamente.'
      } finally {
        this.saving = false
        this.confirmDelete = null
      }
    },
  },
}
</script>
