<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <!-- Breadcrumb / Header -->
      <div class="notification is-white shadow-sm mb-0">
        <div class="container">
          <nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
            <ul>
              <li><a href="/bono"><span class="icon is-small"><i class="fas fa-crown" aria-hidden="true"></i></span> BONOS</a></li>
              <li><a href="/bono">Bono Constructor</a></li>
              <li class="is-active"><a href="#" aria-current="page">Premios Otorgados</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="container mt-4">
        <div class="box filters-box">
          <div class="columns is-multiline is-vcentered">
            <div class="column is-narrow">
              <div class="field">
                <label class="label is-small">Cierre</label>
                <div class="control">
                  <div class="select is-small">
                    <select v-model="filters.closure">
                      <option :value="null">Todos</option>
                      <option v-for="c in closures" :key="c.id" :value="c.id">Cierre {{ c.date | dateMonth }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-small">Usuario</label>
                <div class="control">
                  <div class="select is-small">
                    <select v-model="filters.user">
                      <option :value="null">Todos</option>
                      <option v-for="u in uniqueUsers" :key="u.id" :value="u.id">{{ u.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-small">Tipo de Premio</label>
                <div class="control">
                  <div class="select is-small">
                    <select v-model="filters.prizeType">
                      <option :value="null">Todos</option>
                      <option value="Cena">Cena</option>
                      <option value="Viaje">Viaje</option>
                      <option value="Yate">Yate</option>
                      <option value="Bono Lote">Bono Lote</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-narrow">
              <div class="field">
                <label class="label is-small">Estado</label>
                <div class="control">
                  <div class="select is-small">
                    <select v-model="filters.status">
                      <option :value="null">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Entregado">Entregado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="buttons is-right">
                <button class="button is-link is-small" @click="applyFilters">Aplicar filtros</button>
                <button class="button is-light is-small" @click="resetFilters">Borrar filtros</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container box p-0 overflow-hidden">
          <table class="table is-fullwidth is-hoverable is-striped mb-0">
            <thead>
              <tr class="is-selected-custom">
                <th>Usuario</th>
                <th>Premio</th>
                <th>Ciclo</th>
                <th>Periodo</th>
                <th>Calificado</th>
                <th class="has-text-centered">Entrega</th>
                <th class="has-text-centered">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in filteredPremios" :key="p.key">
                <td class="is-vcentered">
                  <div class="is-flex is-align-items-center">
                    <figure class="image is-32x32 mr-3">
                      <img class="is-rounded" :src="p.userAvatar || require('@/assets/avatar2.png')" alt="User">
                    </figure>
                    <strong>{{ p.userName }}</strong>
                  </div>
                </td>
                <td class="is-vcentered">
                  <strong>{{ p.prize }}</strong>
                </td>
                <td class="is-vcentered">{{ p.ciclo }}</td>
                <td class="is-vcentered">{{ p.periodo }}</td>
                <td class="is-vcentered">{{ p.calificado }}</td>
                <td class="is-vcentered has-text-centered">
                  <button v-if="p.estado === 'Pendiente'" 
                          class="button is-small is-link is-outlined" 
                          @click="markAsDelivered(p)">
                    <span class="icon is-small"><i class="fas fa-box"></i></span>
                    <span>Marcar como entregado</span>
                  </button>
                  <span v-else class="tag is-success is-light">
                    <span class="icon is-small mr-1"><i class="fas fa-check"></i></span>
                    Entregado
                  </span>
                </td>
                <td class="is-vcentered has-text-centered">
                   <span class="tag" :class="p.estado === 'Entregado' ? 'is-success' : 'is-warning'">
                     <span class="icon is-small mr-1">
                       <i class="fas" :class="p.estado === 'Entregado' ? 'fa-lock' : 'fa-lock-open'"></i>
                     </span>
                     {{ p.estado }}
                   </span>
                </td>
              </tr>
              <tr v-if="filteredPremios.length === 0">
                <td colspan="7" class="has-text-centered py-5">
                  <p class="has-text-grey">No se encontraron premios con los filtros seleccionados.</p>
                </td>
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
          this.premios = data.premios
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
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
.filters-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
.is-selected-custom th {
  background-color: #f1f3f5;
  color: #495057;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
}
.table td.is-vcentered {
  vertical-align: middle;
}
.breadcrumb {
  font-size: 0.85rem;
}
.breadcrumb a {
  color: #6c757d;
}
.breadcrumb li.is-active a {
  color: #1a3b5d;
  font-weight: 600;
}
.overflow-hidden {
  overflow: hidden;
}
</style>
