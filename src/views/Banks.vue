<template>
  <Layout>
    <i class="load" v-if="loading"></i>
    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Bancos</strong>
        </div>
      </div>

      <div class="container" style="padding-top: 25px; padding-bottom: 50px;">
        <div v-if="error" class="notification is-danger is-light" style="margin-bottom: 20px;">
          <button class="delete" @click="error = null"></button>
          {{ error }}
        </div>

        <div class="box">
          <p class="subtitle is-6" style="color: #666;">
            Los bancos habilitados aparecen en la app al elegir «Transferencia / Depósito bancario».
          </p>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input" v-model="newName" placeholder="Nombre del banco (ej. BCP)" @keyup.enter="add">
            </div>
            <div class="control">
              <button class="button is-primary" :class="{ 'is-loading': saving }" @click="add">Agregar</button>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table class="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Banco</th>
                <th>Estado</th>
                <th class="has-text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bank in banks" :key="bank.id">
                <td>
                  <input class="input is-small" v-if="editing === bank.id" v-model="editName" @keyup.enter="save(bank)">
                  <span v-else>{{ bank.name }}</span>
                </td>
                <td>
                  <span class="tag" :class="bank.active ? 'is-success' : 'is-light'">
                    {{ bank.active ? 'Habilitado' : 'Deshabilitado' }}
                  </span>
                </td>
                <td class="has-text-right">
                  <template v-if="editing === bank.id">
                    <button class="button is-small is-primary" :disabled="saving" @click="save(bank)">Guardar</button>
                    <button class="button is-small" @click="editing = null">Cancelar</button>
                  </template>
                  <template v-else>
                    <button class="button is-small" :disabled="saving" @click="edit(bank)">Editar</button>
                    <button class="button is-small" :class="bank.active ? 'is-danger is-light' : 'is-success is-light'"
                      :disabled="saving" @click="toggle(bank)">
                      {{ bank.active ? 'Deshabilitar' : 'Habilitar' }}
                    </button>
                  </template>
                </td>
              </tr>
              <tr v-if="!banks.length">
                <td colspan="3" class="has-text-centered">No hay bancos registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout.vue'
import api from '@/api'

export default {
  components: {
    Layout
  },
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      banks: [],
      newName: '',
      editing: null,
      editName: '',
    }
  },
  async created() {
    const { data } = await api.banks.GET()
    this.loading = false
    if (data.error) return this.error = data.msg
    this.banks = data.banks
  },
  methods: {
    async send(payload) {
      this.saving = true
      this.error = null
      try {
        const { data } = await api.banks.POST(payload)
        if (data.error) {
          this.error = data.msg
          return false
        }
        this.banks = data.banks
        return true
      } catch (e) {
        this.error = 'No se pudo guardar. Intenta nuevamente.'
        return false
      } finally {
        this.saving = false
      }
    },
    async add() {
      if (await this.send({ action: 'add', name: this.newName })) this.newName = ''
    },
    edit(bank) {
      this.editing = bank.id
      this.editName = bank.name
    },
    async save(bank) {
      if (await this.send({ action: 'edit', id: bank.id, name: this.editName })) this.editing = null
    },
    toggle(bank) {
      this.send({ action: 'toggle', id: bank.id })
    },
  },
}
</script>
