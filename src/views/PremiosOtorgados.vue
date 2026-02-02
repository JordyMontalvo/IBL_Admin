<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <!-- Header / Breadcrumb -->
      <div class="notification is-white shadow-sm mb-0 py-4">
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
                  <li class="is-active"><a href="#" aria-current="page" class="has-text-link has-text-weight-bold">Premios Otorgados</a></li>
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
          <div>
            <h1 class="title is-3 mb-2" style="color: #1a3b5d; line-height: 1.2;">Premios Otorgados</h1>
            <p class="subtitle is-6 has-text-grey mt-0">Historial de reconocimientos y bonos entregados</p>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="container mt-4 px-4">
        <div class="box filters-box shadow-md mb-5" style="border-radius: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc;">
          <div class="columns is-multiline is-vcentered">
            <div class="column is-narrow">
              <div class="field">
                <label class="label is-size-7 has-text-grey-dark uppercase-label">Cierre</label>
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <select v-model="filters.closure">
                      <option :value="null">Todos los cierres</option>
                      <option v-for="c in closures" :key="c.id" :value="c.id">Cierre {{ c.date | dateMonth }}</option>
                    </select>
                  </div>
                  <span class="icon is-left"><i class="fas fa-calendar-check"></i></span>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-size-7 has-text-grey-dark uppercase-label">Usuario</label>
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <select v-model="filters.user">
                      <option :value="null">Todos los usuarios</option>
                      <option v-for="u in uniqueUsers" :key="u.id" :value="u.id">{{ u.name }}</option>
                    </select>
                  </div>
                  <span class="icon is-left"><i class="fas fa-user"></i></span>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-size-7 has-text-grey-dark uppercase-label">Tipo de Premio</label>
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <select v-model="filters.prizeType">
                      <option :value="null">Todos los premios</option>
                      <option value="Cena">Cena</option>
                      <option value="Viaje">Viaje</option>
                      <option value="Yate">Yate</option>
                      <option value="Bono Lote">Bono Lote</option>
                    </select>
                  </div>
                  <span class="icon is-left"><i class="fas fa-trophy"></i></span>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-size-7 has-text-grey-dark uppercase-label">Estado</label>
                <div class="control has-icons-left">
                  <div class="select is-fullwidth">
                    <select v-model="filters.status">
                      <option :value="null">Todos los estados</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                  <span class="icon is-left"><i class="fas fa-info-circle"></i></span>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="buttons is-right mt-4">
                <button class="button is-link is-rounded px-6" @click="applyFilters">
                  <span class="icon"><i class="fas fa-filter"></i></span>
                  <span class="has-text-weight-semibold">Aplicar filtros</span>
                </button>
                <button class="button is-light is-rounded px-5" @click="resetFilters">
                  <span class="has-text-weight-semibold">Reiniciar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="box p-0 shadow-md overflow-hidden mb-6" style="border-radius: 12px; border: 1px solid #e2e8f0;">
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped mb-0">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th class="py-4 px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Usuario</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Premio</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Ciclo</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Periodo</th>
                  <th class="py-4" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Calificado</th>
                  <th class="py-4 has-text-centered" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Entrega</th>
                  <th class="py-4 has-text-centered px-5" style="color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.025em; border-bottom: 2px solid #edf2f7;">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in filteredPremios" :key="p.key" class="is-vcentered-row">
                  <td class="py-4 px-5">
                    <div class="is-flex is-align-items-center">
                      <div class="user-avatar mr-3">
                        {{ p.userName ? p.userName.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <span class="has-text-weight-semibold" style="color: #1a3b5d;">{{ p.userName }}</span>
                    </div>
                  </td>
                  <td class="py-4">
                    <div class="is-flex is-align-items-center">
                      <i class="fas fa-medal mr-2 has-text-link"></i>
                      <strong class="has-text-link">{{ p.prize }}</strong>
                    </div>
                  </td>
                  <td class="py-4">
                    <span class="tag is-light is-rounded">{{ p.ciclo }}</span>
                  </td>
                  <td class="py-4">
                    <span class="has-text-grey-dark">{{ p.periodo }}</span>
                  </td>
                  <td class="py-4">
                    <span class="is-family-monospace has-text-grey">{{ p.calificado }}</span>
                  </td>
                  <td class="py-4 has-text-centered">
                    <button v-if="p.estado === 'Pendiente'" 
                            class="button is-small is-link is-light is-rounded px-3" 
                            @click="markAsDelivered(p)">
                      <span class="icon is-small"><i class="fas fa-hand-holding-heart"></i></span>
                      <span>Entregar</span>
                    </button>
                    <span v-else class="tag is-success is-light is-rounded">
                      <i class="fas fa-check-circle mr-1"></i> Entregado
                    </span>
                  </td>
                  <td class="py-4 has-text-centered px-5">
                     <span class="tag is-rounded" :class="p.estado === 'Entregado' ? 'is-success' : 'is-warning is-light'">
                       <i class="fas mr-1" :class="p.estado === 'Entregado' ? 'fa-lock' : 'fa-lock-open'"></i>
                       {{ p.estado }}
                     </span>
                  </td>
                </tr>
                <tr v-if="filteredPremios.length === 0">
                  <td colspan="7" class="has-text-centered py-6">
                    <div class="py-5">
                      <i class="fas fa-search is-size-1 has-text-grey-lighter mb-3"></i>
                      <p class="has-text-grey-light">No se encontraron premios con los filtros seleccionados.</p>
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
      premios: [],
      closures: [],
      loading: true,
      filters: {
        closure: null,
        user: null,
        prizeType: null,
        status: null
      }
    }
  },
  computed: {
    uniqueUsers() {
      const users = []
      const ids = new Set()
      this.premios.forEach(p => {
        if (!ids.has(p.userId)) {
          ids.add(p.userId)
          users.push({ id: p.userId, name: p.userName })
        }
      })
      return users.sort((a, b) => a.name.localeCompare(b.name))
    },
    filteredPremios() {
      return this.premios.filter(p => {
        if (this.filters.user && p.userId !== this.filters.user) return false
        if (this.filters.prizeType && p.prize !== this.filters.prizeType) return false
        if (this.filters.status && p.estado !== this.filters.status) return false
        // Closure filtering logic would depend on how closure IDs match to prizes
        // For now, simple client side filtering for others
        return true
      })
    }
  },
  filters: {
    dateMonth(val) {
      if (!val) return ''
      return new Date(val).toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    }
  },
  created() {
    this.GET()
  },
  methods: {
    async GET() {
      this.loading = true
      try {
        const { data } = await api.bono.GET_PREMIOS()
        if (data.error) {
          console.error(data.msg)
        } else {
          this.premios = data.premios.sort((a, b) => a.userName.localeCompare(b.userName))
          this.closures = data.closures
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async markAsDelivered(prize) {
      if (!confirm(`¿Marcar "${prize.prize}" como entregado para ${prize.userName}?`)) return
      
      try {
        const { data } = await api.bono.POST_PREMIO({
          action: 'entregar',
          userId: prize.userId,
          prize: prize.prize,
          ciclo: prize.ciclo
        })

        if (!data.error) {
          prize.estado = 'Entregado'
        }
      } catch (err) {
        console.error(err)
      }
    },
    applyFilters() {
      // Logic handled by computed filteredPremios
    },
    resetFilters() {
      this.filters = {
        closure: null,
        user: null,
        prizeType: null,
        status: null
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

.filters-box {
  background-color: #f8fafc;
}

.uppercase-label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-bottom: 0.5rem;
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

.is-vcentered-row td {
  vertical-align: middle !important;
}

.table.is-hoverable tbody tr:hover {
  background-color: #f8fafc !important;
}

.button.is-rounded {
  font-weight: 600;
  letter-spacing: 0.01em;
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

.overflow-hidden {
  overflow: hidden;
}

.mb-6 {
  margin-bottom: 3rem !important;
}
</style>
