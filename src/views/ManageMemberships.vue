<template>
  <Layout>
    <i class="load" v-if="loading"></i>
    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Gestión de Membresías</strong>
        </div>
      </div>

      <div class="container" style="padding-top: 20px;">
        <div class="columns">
          <!-- Lista de Membresías -->
          <div class="column is-12" v-if="!isEditing">
            <div class="level">
              <div class="level-left">
                <p class="subtitle is-6">Gestiona las membresías del club disponibles en la plataforma.</p>
              </div>
              <div class="level-right">
                <button class="button is-link" @click="createNew()">+ Nueva membresía</button>
              </div>
            </div>

            <div class="table-container">
              <table class="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Orden</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in memberships" :key="i">
                    <td>
                      <img :src="item.img" v-if="item.img" style="max-height: 40px; border-radius: 4px;" alt="img" />
                      <span v-else>Sin imagen</span>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>S/ {{ item.price }}</td>
                    <td>
                      <span class="tag" :class="item.active ? 'is-success' : 'is-light'">
                        {{ item.active ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>{{ item.order }}</td>
                    <td>
                      <button class="button is-small is-info is-light" style="margin-right: 5px;" @click="editItem(item)">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button class="button is-small is-danger is-light" @click="removeItem(item)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="memberships.length === 0">
                    <td colspan="6" class="has-text-centered">No hay membresías registradas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Formulario de Edición/Creación -->
          <div class="column is-12" v-if="isEditing">
            <div class="box">
              <div class="level">
                <div class="level-left">
                  <h4 class="title is-5">{{ currentItem.id ? 'Editar Membresía' : 'Nueva Membresía' }}</h4>
                  <p class="subtitle is-6" style="margin-left: 10px;">Modifica la información de la membresía.</p>
                </div>
                <div class="level-right">
                  <label class="checkbox">
                    <input type="checkbox" v-model="currentItem.active"> Activo
                  </label>
                </div>
              </div>
              <hr>

              <!-- 1. Información General -->
              <h5 class="title is-6"><span class="tag is-info is-rounded">1</span> Información general</h5>
              <div class="columns is-multiline">
                <div class="column is-4">
                  <div class="field">
                    <label class="label">Imagen (URL) *</label>
                    <div class="control">
                      <div v-if="currentItem.img" class="mb-2">
                        <img :src="currentItem.img" style="max-height: 100px; border-radius: 4px;" alt="preview" />
                      </div>
                      <input class="input" type="text" v-model="currentItem.img" placeholder="https://...">
                    </div>
                  </div>
                </div>
                
                <div class="column is-8">
                  <div class="columns is-multiline">
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">Nombre *</label>
                        <div class="control">
                          <input class="input" type="text" v-model="currentItem.name" placeholder="Ej: Membresía Estándar">
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">Precio (S/) *</label>
                        <div class="control">
                          <input class="input" type="number" v-model.number="currentItem.price">
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">Orden de visualización</label>
                        <div class="control">
                          <input class="input" type="number" v-model.number="currentItem.order">
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">Etiqueta (opcional)</label>
                        <div class="control">
                          <input class="input" type="text" v-model="currentItem.tag" placeholder="Ej: Membresía">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr>
              <!-- 2. Texto de presentación -->
              <h5 class="title is-6"><span class="tag is-info is-rounded">2</span> Texto de presentación</h5>
              <div class="columns is-multiline">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Título corto (opcional)</label>
                    <div class="control">
                      <input class="input" type="text" v-model="currentItem.title" placeholder="Ej: Membresía Estándar">
                    </div>
                  </div>
                </div>
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Subtítulo *</label>
                    <div class="control">
                      <input class="input" type="text" v-model="currentItem.subtitle" placeholder="Ej: Acceso a los beneficios del club">
                    </div>
                  </div>
                </div>
              </div>

              <hr>
              <!-- 3. Beneficios -->
              <div class="level">
                <div class="level-left">
                  <h5 class="title is-6"><span class="tag is-info is-rounded">3</span> Beneficios</h5>
                </div>
                <div class="level-right">
                  <button class="button is-small is-link" @click="addBenefit()">+ Agregar beneficio</button>
                </div>
              </div>
              <p class="help mb-3">Estos beneficios se mostrarán en la plataforma a los usuarios.</p>
              
              <div v-for="(ben, idx) in currentItem.benefits" :key="idx" class="field has-addons mb-2">
                <div class="control">
                  <a class="button is-static"><i class="fa-solid fa-grip-vertical"></i></a>
                </div>
                <div class="control is-expanded">
                  <input class="input" type="text" v-model="currentItem.benefits[idx]" placeholder="Beneficio">
                </div>
                <div class="control">
                  <button class="button is-danger is-light" @click="removeBenefit(idx)"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>

              <div class="level mt-5">
                <div class="level-left">
                  <button class="button" @click="cancelEdit()">Cancelar</button>
                </div>
                <div class="level-right">
                  <button class="button is-success" @click="saveItem()"><i class="fa-solid fa-save"></i> &nbsp; Guardar cambios</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      loading: false,
      products: [],
      isEditing: false,
      currentItem: this.getDefaultItem()
    }
  },
  computed: {
    memberships() {
      return this.products
        .filter(p => p.type && (p.type.toUpperCase().includes('MEMBRESÍA') || p.type.toUpperCase().includes('MEMBRESIA')))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))
    this.$store.commit('SET_ACCOUNT', account)
    this.GET()
  },
  methods: {
    getDefaultItem() {
      return {
        id: null,
        name: '',
        price: 0,
        active: true,
        order: 1,
        tag: '',
        title: '',
        subtitle: '',
        benefits: [],
        type: 'MEMBRESÍA',
        img: ''
      }
    },
    async GET() {
      this.loading = true
      const { data } = await api.products.GET()
      this.loading = false
      if (data && data.products) {
        this.products = data.products.map(p => ({
          ...p,
          active: p.active !== undefined ? p.active : true,
          benefits: Array.isArray(p.benefits) ? p.benefits : [],
        }))
      }
    },
    createNew() {
      this.currentItem = this.getDefaultItem()
      this.isEditing = true
    },
    editItem(item) {
      this.currentItem = JSON.parse(JSON.stringify(item))
      if (!this.currentItem.benefits) this.currentItem.benefits = []
      this.isEditing = true
    },
    async saveItem() {
      if (!this.currentItem.name || this.currentItem.price === '' || !this.currentItem.img) {
        alert("Por favor complete los campos obligatorios (*)")
        return
      }

      if (!confirm('¿Seguro que deseas guardar los cambios?')) {
        return
      }

      this.loading = true
      let action = this.currentItem.id ? 'edit' : 'add'
      
      let payload = {
        name: this.currentItem.name,
        price: this.currentItem.price,
        active: this.currentItem.active,
        order: this.currentItem.order,
        tag: this.currentItem.tag,
        title: this.currentItem.title,
        subtitle: this.currentItem.subtitle,
        benefits: this.currentItem.benefits,
        type: 'MEMBRESÍA',
        img: this.currentItem.img,
        code: this.currentItem.id || Math.random().toString(36).substring(7)
      }

      await api.products.POST({
        action: action,
        id: this.currentItem.id,
        data: payload
      })

      await this.GET()
      this.isEditing = false
      this.loading = false
    },
    async removeItem(item) {
      if (!confirm('¿Está seguro de eliminar esta membresía?')) return
      this.loading = true
      await api.products.POST({
        action: 'delete',
        id: item.id
      })
      await this.GET()
      this.loading = false
    },
    cancelEdit() {
      this.isEditing = false
    },
    addBenefit() {
      this.currentItem.benefits.push('')
    },
    removeBenefit(idx) {
      this.currentItem.benefits.splice(idx, 1)
    }
  }
}
</script>
