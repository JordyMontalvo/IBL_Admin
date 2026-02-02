<template>
  <Layout>

    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <!-- Header -->
      <div class="notification is-white shadow-sm mb-4 py-4">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <div>
                <h1 class="title is-3 mb-2" style="color: #1a3b5d; line-height: 1.2;">Bono Constructor</h1>
                <p class="subtitle is-6 has-text-grey mt-0">Panel de seguimiento de metas y premios</p>
              </div>
            </div>
            <div class="level-right">
              <div class="is-flex is-align-items-center">
                <button class="button is-link is-outlined is-rounded px-5" @click="$router.push('/bono-premios')">
                  <span class="icon"><i class="fas fa-gift"></i></span>
                  <span class="has-text-weight-semibold">Premios Otorgados</span>
                </button>
                <div class="field mb-0 ml-3">
                  <div class="control has-icons-left">
                    <div class="select is-rounded shadow-sm">
                      <select v-model="selectedClosure" style="padding-right: 2.5em; border-color: #e2e8f0; vertical-align: middle;">
                        <option :value="null">Cierre Actual (En curso)</option>
                        <option v-for="closure in closures" :key="closure.id" :value="closure.id">
                          Cierre {{ closure.date | dateMonth }}
                        </option>
                      </select>
                    </div>
                    <span class="icon is-left has-text-link">
                      <i class="fas fa-calendar-alt"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container px-4">
        <!-- Main Table Box -->
        <div class="box p-0 is-radiusless-mobile shadow-md overflow-hidden" style="border-radius: 12px; border: 1px solid #e2e8f0;">
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped mb-0">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th class="py-4 px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Usuario</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">DNI</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Ciclo</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Periodo en Ciclo</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Lotes Acumulados</th>
                  <th class="py-4 has-text-right px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="is-vcentered-row">
                  <td class="py-4 px-5">
                    <div class="is-flex is-align-items-center">
                      <div class="user-avatar mr-3">
                        {{ user.userName ? user.userName.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <span class="has-text-weight-semibold" style="color: #1a3b5d;">{{ user.userName }}</span>
                    </div>
                  </td>
                  <td class="py-4">
                    <span class="is-family-monospace has-text-grey">{{ user.dni }}</span>
                  </td>
                  <td class="py-4">
                    <span class="tag is-custom-blue">{{ user.ciclo }}</span>
                  </td>
                  <td class="py-4">
                    <div class="is-flex is-align-items-center">
                      <i class="far fa-clock mr-2 has-text-grey-light"></i>
                      <span>{{ user.periodoEnCiclo }}</span>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="is-flex is-align-items-center">
                      <div class="lotes-indicator mr-2" :class="{'full': user.lotesAcumulados >= 10}"></div>
                      <strong :class="user.lotesAcumulados >= 10 ? 'has-text-success' : 'has-text-weight-bold'">
                        {{ user.lotesAcumulados >= 10 ? 'Bono Lote' : user.lotesAcumulados + (user.lotesAcumulados === 1 ? ' Lote' : ' Lotes') }}
                      </strong>
                    </div>
                  </td>
                  <td class="py-4 has-text-right px-5">
                    <button class="button is-small is-link is-rounded px-4" @click="$router.push(`/bono/${user.id}`)">
                      <span>VER DETALLE</span>
                      <span class="icon is-small ml-1"><i class="fas fa-chevron-right"></i></span>
                    </button>
                  </td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="6" class="has-text-centered py-6">
                    <div class="py-5">
                      <i class="fas fa-folder-open is-size-1 has-text-grey-lighter mb-3"></i>
                      <p class="has-text-grey-light">No se encontraron datos para este periodo.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
          this.users = data.users.sort((a, b) => a.userName.localeCompare(b.userName))
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
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1a3b5d 0%, #2c5282 100%);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(26, 59, 93, 0.2);
}

.is-custom-blue {
  background-color: #f1f5f9;
  color: #1a3b5d;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

.is-vcentered-row td {
  vertical-align: middle !important;
}

.lotes-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #cbd5e1;
  margin-top: 8px; /* Align with text */
}

.lotes-indicator.full {
  background-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.fa-clock {
  transform: translateY(4px); /* Align with text */
}

.table.is-hoverable tbody tr:hover {
  background-color: #f8fafc !important;
  transition: background-color 0.2s ease;
}

.button.is-link.is-rounded {
  font-weight: 600;
  letter-spacing: 0.01em;
  transition: all 0.3s ease;
}

.button.is-link.is-rounded:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(50, 115, 220, 0.2);
}

.overflow-hidden {
  overflow: hidden;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.ml-3 {
  margin-left: 0.75rem !important;
}
</style>
