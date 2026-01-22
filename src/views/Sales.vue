<template>
  <Layout>
    <div class="notification" style="margin-bottom: 0">
      <div class="container">
        <strong>Ventas</strong>
      </div>
    </div>

    <div class="container">
      <div class="tabs is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === 'LOTE' }">
            <a @click="setTab('LOTE')">Lote</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'MEMBRESÍA' }">
            <a @click="setTab('MEMBRESÍA')">Membresía</a>
          </li>
        </ul>
      </div>

      <div class="notification is-warning" v-if="loading">
        Cargando ventas...
      </div>

      <div class="table-container" v-if="!loading">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Vendedor</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Puntos</th>
              <th>Comprador</th>
              <th>Voucher</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sale, i) in sales" :key="i">
              <td>{{ sale.date | date }}</td>
              <td>
                <div v-if="sale.seller">
                   <p><strong>{{ sale.seller.name }} {{ sale.seller.lastName }}</strong></p>
                   <small>DNI: {{ sale.seller.dni }}</small><br>
                   <small>{{ sale.seller.phone }}</small>
                </div>
                <div v-else>
                   <p>No vendedor</p>
                </div>
              </td>
              <td>
                <p><strong>{{ sale.sourceType }}</strong></p>
                <small>{{ sale.name }}</small>
              </td>
              <td>S/ {{ sale.price }}</td>
              <td>{{ sale.points }} pts</td>
              <td>
                 <div v-if="sale.buyer">
                    <p><strong>{{ sale.buyer.name }}</strong></p>
                    <small>DNI: {{ sale.buyer.dni }}</small><br>
                    <small>Celular: {{ sale.buyer.phone }}</small><br>
                    <small>Correo: {{ sale.buyer.email }}</small><br>
                    <small>Dirección: {{ sale.buyer.address }}</small>
                 </div>
                 <div v-else>
                   <small>Sin datos de comprador</small>
                 </div>
              </td>
              <td>
                <a :href="sale.voucher" target="_blank" v-if="sale.voucher">
                   <img :src="sale.voucher" style="max-height: 50px;">
                </a>
                <span v-else>-</span>
              </td>
              <td>
                <span class="tag" :class="{
                  'is-warning': sale.status == 'pending',
                  'is-success': sale.status == 'approved',
                  'is-danger': sale.status == 'rejected'
                }">{{ sale.status | status }}</span>
              </td>
              <td>
                <div class="buttons" v-if="sale.status == 'pending'">
                  <button class="button is-small is-success" @click="approve(sale)">Aprobar</button>
                  <button class="button is-small is-danger" @click="reject(sale)">Rechazar</button>
                </div>
              </td>
            </tr>
            <tr v-if="sales.length === 0">
              <td colspan="9" class="has-text-centered">No hay ventas registradas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'

export default {
  components: { Layout },
  data() {
    return {
      activeTab: 'LOTE',
      loading: false,
      sales: []
    }
  },
  filters: {
    date(val) {
      if (!val) return '-'
      return new Date(val).toLocaleString()
    },
    status(val) {
      if (val == 'pending') return 'Pendiente'
      if (val == 'approved') return 'Aprobado'
      if (val == 'rejected') return 'Rechazado'
      return val
    }
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))
    this.$store.commit('SET_ACCOUNT', account)

    this.fetchSales()
  },
  watch: {
    '$route.params.filter': function() {
       this.fetchSales()
    }
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab
      this.fetchSales()
    },
    async fetchSales() {
      this.loading = true
      const filter = this.$route.params.filter || 'all'
      try {
        if (!api.sales) {
          console.error('API sales module not initialized')
          this.loading = false
          return
        }
        const { data } = await api.sales.GET({ filter, type: this.activeTab })
        
        if (data.sales) {
          this.sales = data.sales
        } else {
          this.sales = []
        }
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },
    async approve(sale) {
      if (!confirm('¿Aprobar esta venta?')) return
      
      await api.sales.POST({
        action: 'approve',
        id: sale.id,
        type: sale.sourceType
      })
      this.fetchSales()
    },
    async reject(sale) {
      if (!confirm('¿Rechazar esta venta?')) return

      await api.sales.POST({
        action: 'reject',
        id: sale.id,
        type: sale.sourceType
      })
      this.fetchSales()
    }
  }
}
</script>
