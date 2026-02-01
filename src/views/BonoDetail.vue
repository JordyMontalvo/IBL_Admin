<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading && detail">
      <!-- Header -->
      <div class="notification" style="margin-bottom: 2rem;">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <div>
                <h1 class="title is-4">{{ detail.userName }}</h1>
                <p class="subtitle is-6">DNI: {{ detail.dni }}</p>
              </div>
            </div>
            <div class="level-right">
              <button class="button is-light" @click="$router.push('/bono')">
                <i class="fas fa-arrow-left mr-2"></i> Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- Progress Section -->
        <div class="box mb-5">
          <div class="level mb-2">
            <div class="level-left">
              <h2 class="title is-5">Ciclo 1</h2>
            </div>
            <div class="level-right">
              <i class="fas fa-calendar-alt has-text-grey-light is-size-4"></i>
            </div>
          </div>

          <div class="progress-container mb-4">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: Math.min(detail.accumulatedLots / 10 * 100, 100) + '%' }"></div>
            </div>
            <div class="progress-markers">
              <div class="marker" style="left: 10%;"><span>1</span></div>
              <div class="marker" style="left: 40%;"><span>4</span></div>
              <div class="marker" style="left: 70%;"><span>7</span></div>
              <div class="marker" style="left: 100%;"><span>10</span></div>
            </div>
          </div>
        </div>

        <!-- Details Table -->
        <div class="table-container">
          <table class="table is-fullwidth is-bordered">
            <thead>
              <tr>
                <th>Meta</th>
                <th>Lotes acumulados</th>
                <th>Premio alcanzado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(m, i) in detail.milestones" :key="i">
                <td>
                  <div class="is-flex is-align-items-center">
                    <i class="fas mr-2" :class="m.status === 'completed' ? 'fa-check has-text-success' : 'fa-lock has-text-grey-light'"></i>
                    <span><strong>{{ m.label }}</strong> <small v-if="m.note" class="has-text-grey"> {{ m.note }}</small></span>
                  </div>
                </td>
                <td>
                  {{ detail.accumulatedLots }} / {{ m.lots }}
                </td>
                <td>
                  <span :class="m.status === 'completed' ? 'has-text-success has-text-weight-bold' : 'has-text-grey'">
                    {{ m.status === 'completed' ? m.prize : 'No calificado' }}
                  </span>
                </td>
                <td class="has-text-centered">
                  <div class="is-flex is-justify-content-center gap-2">
                    <span class="icon" :class="m.status === 'completed' ? 'has-text-link' : 'has-text-grey-lighter'">
                      <i class="fas fa-image"></i>
                    </span>
                    <span class="icon has-text-grey-lighter">
                      <i class="fas fa-cog"></i>
                    </span>
                  </div>
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
.progress-container {
  position: relative;
  height: 40px;
  padding-top: 10px;
}
.progress-bar {
  height: 12px;
  background-color: #eef2f7;
  border-radius: 6px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  transition: width 0.5s ease;
}
.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}
.marker {
  position: absolute;
  top: 5px;
  width: 1px;
  height: 20px;
  background-color: #ddd;
}
.marker span {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}
.gap-2 {
  gap: 0.5rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-5 {
  margin-bottom: 1.5rem !important;
}
</style>
