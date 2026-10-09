<template>
  <Layout>
    <i class="load" v-if="loading"></i>
    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Configuración de Comisiones por Niveles</strong>
        </div>
      </div>

      <div class="container" style="padding-top: 25px; padding-bottom: 50px;">
        <div v-if="message" class="notification is-success is-light" style="margin-bottom: 20px;">
          <button class="delete" @click="message = null"></button>
          {{ message }}
        </div>
        <div v-if="error" class="notification is-danger is-light" style="margin-bottom: 20px;">
          <button class="delete" @click="error = null"></button>
          {{ error }}
        </div>

        <div class="columns is-multiline">
          <!-- Tabla de Configuración -->
          <div class="column is-7">
            <div class="box">
              <div class="level">
                <div class="level-left">
                  <h4 class="title is-5" style="margin-bottom: 0;">Plan de Compensación (7 Niveles)</h4>
                </div>
                <div class="level-right">
                  <button class="button is-small is-light" @click="resetDefaults">
                    <i class="fas fa-undo" style="margin-right: 5px;"></i> Restablecer por defecto
                  </button>
                </div>
              </div>
              <p class="subtitle is-6" style="margin-top: 5px; color: #666;">
                Configura los porcentajes que se aplicarán automáticamente sobre el precio vigente de las membresías vendidas.
              </p>
              <hr>

              <div class="table-container">
                <table class="table is-fullwidth is-striped is-hoverable">
                  <thead>
                    <tr>
                      <th style="width: 90px;">Nivel</th>
                      <th>Beneficiario / Origen</th>
                      <th style="width: 140px;" class="has-text-centered">Porcentaje (%)</th>
                      <th class="has-text-right">Comisión simulada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(p, i) in percentages" :key="i">
                      <td>
                        <span class="tag is-link is-light" style="font-weight: bold;">
                          Nivel {{ i + 1 }}
                        </span>
                      </td>
                      <td>
                        <strong>{{ levelLabels[i].title }}</strong>
                        <br>
                        <small class="has-text-grey">{{ levelLabels[i].desc }}</small>
                      </td>
                      <td class="has-text-centered">
                        <div class="field has-addons" style="justify-content: center;">
                          <div class="control" style="width: 75px;">
                            <input
                              class="input is-small has-text-centered"
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              v-model.number="percentages[i]"
                            >
                          </div>
                          <div class="control">
                            <a class="button is-small is-static">%</a>
                          </div>
                        </div>
                      </td>
                      <td class="has-text-right" style="vertical-align: middle;">
                        <span class="has-text-weight-bold has-text-success">
                          S/ {{ money((simPrice * (percentages[i] || 0)) / 100) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="2">Total repartido:</th>
                      <th class="has-text-centered">
                        <span class="tag is-primary is-medium">
                          {{ totalPercentage }}%
                        </span>
                      </th>
                      <th class="has-text-right">
                        <span class="has-text-weight-bold">
                          S/ {{ money((simPrice * totalPercentage) / 100) }}
                        </span>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div class="field is-grouped is-grouped-right" style="margin-top: 20px;">
                <div class="control">
                  <button class="button is-link" :class="{ 'is-loading': saving }" @click="save">
                    <i class="fas fa-save" style="margin-right: 5px;"></i> Guardar porcentajes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Simulador Interactivo e Información de Reglas -->
          <div class="column is-5">
            <div class="box">
              <h4 class="title is-5"><i class="fas fa-calculator" style="margin-right: 8px;"></i>Simulador de Comisiones</h4>
              <p class="subtitle is-6" style="color: #666;">
                Verifica en tiempo real cuánto se generará por cada nivel según el valor de venta de la membresía.
              </p>

              <div class="field">
                <label class="label">Valor de venta de membresía (S/)</label>
                <div class="control has-icons-left">
                  <input class="input" type="number" step="50" min="1" v-model.number="simPrice">
                  <span class="icon is-small is-left">
                    <i class="fas fa-coins"></i>
                  </span>
                </div>
              </div>

              <!-- Valores rápidos de ejemplo -->
              <div class="buttons are-small" style="margin-top: 10px;">
                <button class="button" :class="{'is-info': simPrice === 2000}" @click="simPrice = 2000">S/ 2,000</button>
                <button class="button" :class="{'is-info': simPrice === 3000}" @click="simPrice = 3000">S/ 3,000</button>
                <button class="button" :class="{'is-info': simPrice === 5000}" @click="simPrice = 5000">S/ 5,000</button>
                <button class="button" :class="{'is-info': simPrice === 10000}" @click="simPrice = 10000">S/ 10,000</button>
              </div>

              <hr>

              <div class="content" style="font-size: 0.9rem;">
                <h6><strong>Reglas del Plan de Comisiones:</strong></h6>
                <ul>
                  <li><strong>Base de cálculo:</strong> Las comisiones se calculan siempre sobre el precio vigente de la membresía vendida.</li>
                  <li><strong>Usuario Activo:</strong> La comisión generada se abona a <em>saldo disponible</em>.</li>
                  <li><strong>Usuario Inactivo:</strong> La comisión se abona a <em>saldo no disponible</em>. Puede activarse antes del cierre para habilitarlo.</li>
                  <li><strong>Cierre de período:</strong> Si el usuario permanece inactivo al cierre, el saldo no disponible se elimina.</li>
                  <li><strong>Activaciones:</strong> No generan comisiones (100% separado de las membresías).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout.vue'
import api from '@/api'

const DEFAULT_PERCENTAGES = [15, 5, 3, 2, 1, 0.5, 0.5]

export default {
  components: {
    Layout
  },
  data() {
    return {
      loading: true,
      saving: false,
      message: null,
      error: null,
      percentages: [15, 5, 3, 2, 1, 0.5, 0.5],
      simPrice: 2000,
      levelLabels: [
        { title: 'Venta Directa', desc: 'Usuario que realiza la venta de la membresía' },
        { title: 'Patrocinador Directo', desc: 'Padre inmediato en la red (Nivel 1 de red)' },
        { title: 'Red Nivel 3', desc: 'Ascendente de 2do grado en la red' },
        { title: 'Red Nivel 4', desc: 'Ascendente de 3er grado en la red' },
        { title: 'Red Nivel 5', desc: 'Ascendente de 4to grado en la red' },
        { title: 'Red Nivel 6', desc: 'Ascendente de 5to grado en la red' },
        { title: 'Red Nivel 7', desc: 'Ascendente de 6to grado en la red' }
      ]
    }
  },
  computed: {
    totalPercentage() {
      const sum = this.percentages.reduce((a, b) => a + (parseFloat(b) || 0), 0)
      return parseFloat(sum.toFixed(2))
    }
  },
  async created() {
    await this.fetchRates()
    this.loading = false
  },
  methods: {
    money(val) {
      const num = Number(val) || 0
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    async fetchRates() {
      try {
        const { data } = await api.commissions.GET()
        if (data && data.success && data.percentages && data.percentages.length === 7) {
          this.percentages = data.percentages.map(p => Number(p))
        }
      } catch (e) {
        console.error('Error al cargar comisiones:', e)
      }
    },
    resetDefaults() {
      this.percentages = [...DEFAULT_PERCENTAGES]
      this.message = 'Se restablecieron los valores por defecto (recuerde hacer clic en Guardar para aplicar).'
      setTimeout(() => { this.message = null }, 4000)
    },
    async save() {
      this.error = null
      this.message = null

      if (!this.percentages || this.percentages.length !== 7) {
        this.error = 'Debe configurar los 7 niveles de comisiones.'
        return
      }

      for (let i = 0; i < this.percentages.length; i++) {
        const val = parseFloat(this.percentages[i])
        if (isNaN(val) || val < 0 || val > 100) {
          this.error = `El porcentaje en Nivel ${i + 1} no es válido. Debe ser un número entre 0 y 100.`
          return
        }
      }

      this.saving = true
      try {
        const { data } = await api.commissions.POST({ percentages: this.percentages })
        this.saving = false

        if (data && data.error) {
          this.error = data.msg || data.error
          return
        }

        this.message = '¡Porcentajes de comisiones actualizados con éxito! Las nuevas ventas aplicarán estos valores.'
        setTimeout(() => { this.message = null }, 5000)
      } catch (e) {
        this.saving = false
        this.error = 'Ocurrió un error al guardar los porcentajes.'
      }
    }
  }
}
</script>
