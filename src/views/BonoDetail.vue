<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading && detail">
      <!-- Header -->
      <div class="notification is-white shadow-sm mb-5 py-4">
        <div class="container">
          <div class="level mb-4">
            <div class="level-left">
              <nav class="breadcrumb has-succeeds-separator mb-0" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <router-link to="/bono" class="has-text-grey">
                      <span class="icon is-small"><i class="fas fa-crown"></i></span>
                      <span>BONOS</span>
                    </router-link>
                  </li>
                  <li><router-link to="/bono" class="has-text-grey">Bono Constructor</router-link></li>
                  <li class="is-active"><a href="#" aria-current="page" class="has-text-link has-text-weight-bold">Detalle de Usuario</a></li>
                </ul>
              </nav>
            </div>
            <div class="level-right">
              <button class="button is-light is-rounded shadow-sm px-5" @click="$router.push('/bono')">
                <span class="icon is-small"><i class="fas fa-arrow-left"></i></span>
                <span class="has-text-weight-semibold">Volver</span>
              </button>
            </div>
          </div>

          <div class="is-flex is-align-items-center">
            <div class="user-avatar-large mr-4">
              {{ detail.userName ? detail.userName.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div>
              <h1 class="title is-4 mb-2" style="color: #1a3b5d; line-height: 1.2;">{{ detail.userName }}</h1>
              <p class="subtitle is-6 has-text-grey mt-0">
                <span class="icon is-small mr-1"><i class="fas fa-id-card"></i></span>
                DNI: {{ detail.dni }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container px-4">
        <!-- Progress Card -->
        <div class="box shadow-md mb-4" style="border-radius: 16px; border: 1px solid #e2e8f0; padding: 2rem;">
          <div class="level mb-5">
            <div class="level-left">
              <div>
                <h2 class="title is-4 mb-2" style="color: #1a3b5d; line-height: 1.2;">Progreso del Ciclo 1</h2>
                <p class="subtitle is-6 has-text-grey mt-0">Seguimiento de lotes acumulados</p>
              </div>
            </div>
            <div class="level-right">
              <div class="has-text-right">
                <span class="tag is-link is-light is-medium is-rounded has-text-weight-bold">
                  {{ detail.accumulatedLots }} / 10 Lotes
                </span>
              </div>
            </div>
          </div>

          <div class="progress-container-premium mb-2">
            <div class="progress-bar-premium">
              <div class="progress-fill-premium" :style="{ width: Math.min(detail.accumulatedLots / 10 * 100, 100) + '%' }">
                <div class="progress-glow"></div>
              </div>
            </div>
            <div class="progress-markers-premium">
              <div class="marker-premium" style="left: 10%;"><span class="marker-label">1</span></div>
              <div class="marker-premium" style="left: 40%;"><span class="marker-label">4</span></div>
              <div class="marker-premium" style="left: 70%;"><span class="marker-label">7</span></div>
              <div class="marker-premium" style="left: 100%;"><span class="marker-label">10</span></div>
            </div>
          </div>
        </div>

        <!-- Details Table Box -->
        <h3 class="title is-6 mb-3 px-1" style="color: #1a3b5d;">Hitos y Premios</h3>
        <div class="box p-0 shadow-md overflow-hidden mb-6" style="border-radius: 12px; border: 1px solid #e2e8f0;">
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped mb-0">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th class="py-4 px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Meta</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Lotes acumulados</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Premio alcanzado</th>
                  <th class="py-4 has-text-centered px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, i) in detail.milestones" :key="i" class="is-vcentered-row">
                  <td class="py-4 px-5">
                    <div class="is-flex is-align-items-center">
                      <div class="milestone-icon mr-3" :class="m.status === 'completed' ? 'is-completed' : 'is-locked'">
                        <i class="fas" :class="m.status === 'completed' ? 'fa-check' : 'fa-lock'"></i>
                      </div>
                      <div>
                        <span class="has-text-weight-semibold" :style="{ color: m.status === 'completed' ? '#1a3b5d' : '#94a3b8' }">{{ m.label }}</span>
                        <p v-if="m.note" class="is-size-7 has-text-grey">{{ m.note }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="is-flex is-align-items-center">
                      <progress class="progress is-small is-link mr-3" :value="Math.min(detail.accumulatedLots, m.lots)" :max="m.lots" style="width: 80px;"></progress>
                      <span class="has-text-grey-dark">{{ detail.accumulatedLots }} / {{ m.lots }}</span>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="is-flex is-align-items-center">
                      <i class="fas fa-trophy mr-2" :class="m.status === 'completed' ? 'has-text-warning' : 'has-text-grey-lighter'"></i>
                      <span :class="m.status === 'completed' ? 'has-text-weight-bold has-text-link' : 'has-text-grey-light'">
                        {{ m.status === 'completed' ? m.prize : 'No calificado' }}
                      </span>
                    </div>
                  </td>
                  <td class="py-4 has-text-centered px-5">
                    <span v-if="m.status === 'completed'" class="tag is-success is-light is-rounded">
                      <i class="fas fa-check-circle mr-1"></i> Completado
                    </span>
                    <span v-else class="tag is-light is-rounded">
                      <i class="fas fa-hourglass-half mr-1"></i> Pendiente
                    </span>
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
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      detail: null,
      loading: true
    }
  },
  created() {
    this.GET()
  },
  methods: {
    async GET() {
      this.loading = true
      try {
        const { data } = await api.bono.GET({ id: this.$route.params.id })
        if (data.error) {
          console.error(data.msg)
        } else {
          this.detail = data.detail
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

.user-avatar-large {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1a3b5d 0%, #2c5282 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(26, 59, 93, 0.2);
}

.progress-container-premium {
  position: relative;
  height: 60px;
  padding-top: 20px;
}

.progress-bar-premium {
  height: 14px;
  background-color: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.progress-fill-premium {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #4caf50);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-glow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: progress-shine 2s infinite;
}

@keyframes progress-shine {
  from { transform: translateX(-100%); }
  to { transform: translateX(500%); }
}

.progress-markers-premium {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.marker-premium {
  position: absolute;
  top: 15px;
  width: 2px;
  height: 24px;
  background-color: #e2e8f0;
}

.marker-label {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 700;
}

.milestone-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.milestone-icon.is-completed {
  background-color: #e8f5e9;
  color: #4caf50;
  border: 1px solid #c8e6c9;
}

.milestone-icon.is-locked {
  background-color: #f8fafc;
  color: #cbd5e1;
  border: 1px solid #e2e8f0;
}

.is-vcentered-row td {
  vertical-align: middle !important;
}

.table.is-hoverable tbody tr:hover {
  background-color: #f8fafc !important;
}

.overflow-hidden {
  overflow: hidden;
}

.mb-6 {
  margin-bottom: 3rem !important;
}

.breadcrumb {
  font-size: 1.1rem;
  font-weight: 500;
}

.breadcrumb a {
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #1a3b5d !important;
}
</style>
