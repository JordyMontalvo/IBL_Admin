<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0;">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <strong>Bono Constructor</strong>
            </div>
            <div class="level-right">
              <div class="is-flex is-align-items-center">
                <button class="button is-link is-light is-small mr-3" @click="$router.push('/bono-premios')">
                  <span class="icon is-small"><i class="fas fa-gift"></i></span>
                  <span>PREMIOS OTORGADOS</span>
                </button>
                <div class="select is-small">
                  <select v-model="selectedClosure">
                    <option :value="null">Cierre Actual (En curso)</option>
                    <option v-for="closure in closures" :key="closure.id" :value="closure.id">
                      Cierre {{ closure.date | dateMonth }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-4">
        <div class="table-container">
          <table class="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>DNI</th>
                <th>Ciclo</th>
                <th>Periodo en Ciclo</th>
                <th>Lotes Acumulados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.userName }}</td>
                <td>{{ user.dni }}</td>
                <td>
                  <span class="tag is-info is-light">{{ user.ciclo }}</span>
                </td>
                <td>{{ user.periodoEnCiclo }}</td>
                <td>
                  <strong :class="{'has-text-success': user.lotesAcumulados >= 10}">
                    {{ user.lotesAcumulados >= 10 ? 'Bono Lote' : user.lotesAcumulados + (user.lotesAcumulados === 1 ? ' Lote' : ' Lotes') }}
                  </strong>
                </td>
                <td>
                  <button class="button is-small is-link" @click="$router.push(`/bono/${user.id}`)">VER</button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="6" class="has-text-centered">No se encontraron datos.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api    from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      users: [],
      closures: [],
      selectedClosure: null,
      loading: true
    }
  },
  filters: {
    dateMonth(val) {
      if (!val) return ''
      return new Date(val).toLocaleString('es-ES', { month: 'long', year: 'numeric' })
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
      try {
        const { data } = await api.bono.GET()
        if (data.error) {
          console.error(data.msg)
        } else {
          this.users = data.users
          this.closures = data.closures
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.table thead th {
  background-color: #f5f7fa;
  color: #1a3b5d;
}
.tag.is-info.is-light {
  background-color: #eef2f7;
  color: #1a3b5d;
  font-weight: 600;
}
</style>
