<template>
  <Layout>
    <i class="load" v-if="loading"></i>

    <section v-if="!loading">
      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Productos</strong>
        </div>
      </div>

      <div class="container">
        <div class="tabs is-boxed">
          <ul>
            <li :class="{ 'is-active': activeTab === 'ACTIVACIÓN' }">
              <a @click="activeTab = 'ACTIVACIÓN'">Activaciones</a>
            </li>
            <li :class="{ 'is-active': activeTab === 'TERRENO' }">
              <a @click="activeTab = 'TERRENO'">Terrenos</a>
            </li>
            <li :class="{ 'is-active': activeTab === 'MEMBRESÍA' }">
              <a @click="activeTab = 'MEMBRESÍA'">Membresías</a>
            </li>
          </ul>
        </div>
      </div>


      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Imágen</th>
                <th>Titulo</th>
                <th>SubTitulo</th>
                <!-- Field specific depending on tab -->
                <th v-if="activeTab === 'ACTIVACIÓN'">Duración</th>
                <th v-if="activeTab === 'TERRENO'">Área</th>
                <th v-if="activeTab === 'TERRENO' || activeTab === 'MEMBRESÍA'">Ubicación</th>
                
                <th>Precio</th>
                <th>Tipo</th>
                <th>Puntos</th>
                <th>Código</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, i) in filteredProducts" :key="i">
                <!-- Imágen Producto -->
                <td>
                  <small v-if="!product.edit"><a :href="product.img" target="_blank" v-if="product.img">Ver</a></small>
                  <input
                    class="input"
                    placeholder="URL Imágen"
                    style="max-width: 150px"
                    v-model="product._img"
                    v-if="product.edit"
                  />
                </td>
                
                <!-- Titulo (Nombre) -->
                <td>
                  <span v-if="!product.edit">{{ product.name }}</span>
                  <input
                    class="input"
                    placeholder="Titulo"
                    style="max-width: 150px"
                    v-model="product._name"
                    v-if="product.edit"
                  />
                </td>

                <!-- SubTitulo -->
                <td>
                  <span v-if="!product.edit">{{ product.subtitle }}</span>
                  <input
                    class="input"
                    placeholder="SubTitulo"
                    style="max-width: 150px"
                    v-model="product._subtitle"
                    v-if="product.edit"
                  />
                </td>

                <!-- Duración (Solo Activación) -->
                <td v-if="activeTab === 'ACTIVACIÓN'">
                  <span v-if="!product.edit">{{ product.duration }}</span>
                  <input
                    class="input"
                    placeholder="Duración"
                    style="max-width: 100px"
                    v-model="product._duration"
                    v-if="product.edit"
                  />
                </td>

                <!-- Área (Solo Terreno) -->
                <td v-if="activeTab === 'TERRENO'">
                  <span v-if="!product.edit">{{ product.area }}</span>
                  <input
                    class="input"
                    placeholder="Área"
                    style="max-width: 100px"
                    v-model="product._area"
                    v-if="product.edit"
                  />
                </td>

                <!-- Ubicación (Terreno y Membresía) -->
                <td v-if="activeTab === 'TERRENO' || activeTab === 'MEMBRESÍA'">
                  <span v-if="!product.edit">{{ product.location }}</span>
                  <input
                    class="input"
                    placeholder="Ubicación"
                    style="max-width: 150px"
                    v-model="product._location"
                    v-if="product.edit"
                  />
                </td>

                <!-- Precio Producto -->
                <td>
                  <span v-if="!product.edit">{{ product.price }}</span>
                  <div v-if="product.edit">
                    <input
                      class="input"
                      type="number"
                      placeholder="Precio"
                      style="max-width: 80px"
                      v-model.number="product._price"
                    />
                  </div>
                </td>

                <!-- Tipo (Categoría) -->
                <td>
                  <span v-if="!product.edit">{{ product.type }}</span>
                  <input
                    class="input"
                    placeholder="Tipo"
                    style="max-width: 100px"
                    v-model="product._type"
                    v-if="product.edit"
                  />
                </td>

                <!-- Puntos Producto -->
                <td>
                  <span v-if="!product.edit">{{ product.points }}</span>
                  <div v-if="product.edit">
                    <input
                      class="input"
                      type="number"
                      placeholder="Puntos"
                      style="max-width: 80px"
                      v-model.number="product._points"
                    />
                  </div>
                </td>

                <!-- Código -->
                <td>
                  <span v-if="!product.edit">{{ product.code }}</span>
                  <input
                    class="input"
                    placeholder="Código"
                    style="max-width: 100px"
                    v-model="product._code"
                    v-if="product.edit"
                  />
                </td>


                <!-- Edit Options -->
                <td v-if="product.edit">
                  <button @click="remove(product)">Eliminar</button>
                </td>
                <td>
                  <i
                    class="fa-regular fa-pen-to-square"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="!product.edit"
                    @click="edit(product)"
                  ></i>
                  <i
                    class="fa-solid fa-check"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="product.edit"
                    @click="save(product)"
                  ></i>
                  <i
                    class="fa-solid fa-xmark"
                    style="color: #ccc; cursor: pointer; margin-right: 8px"
                    v-if="product.edit"
                    @click="cancel(product)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />

      <div class="notification" style="margin-bottom: 0">
        <div class="container">
          <strong>Nuevo producto</strong>
        </div>
      </div>

      <div class="container">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Imágen (URL)</th>
                <th>Titulo</th>
                <th>SubTitulo</th>
                <th v-if="activeTab === 'ACTIVACIÓN'">Duración</th>
                <th v-if="activeTab === 'TERRENO'">Área</th>
                <th v-if="activeTab === 'TERRENO' || activeTab === 'MEMBRESÍA'">Ubicación</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Puntos</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <tr>
                <!-- Imagen -->
                <td>
                   <input
                    class="input"
                    placeholder="URL"
                    style="max-width: 150px"
                    v-model="new_product.img"
                  />
                </td>
                <!-- Titulo -->
                <td>
                  <input
                    class="input"
                    placeholder="Titulo"
                    style="max-width: 150px"
                    v-model="new_product.name"
                  />
                </td>
                <!-- Subtitulo -->
                <td>
                  <input
                    class="input"
                    placeholder="Subtitulo"
                    style="max-width: 150px"
                    v-model="new_product.subtitle"
                  />
                </td>
                
                <!-- Duración -->
                <td v-if="activeTab === 'ACTIVACIÓN'">
                  <input
                    class="input"
                    placeholder="Duración"
                    style="max-width: 100px"
                    v-model="new_product.duration"
                  />
                </td>

                <!-- Área -->
                <td v-if="activeTab === 'TERRENO'">
                  <input
                    class="input"
                    placeholder="Área"
                    style="max-width: 100px"
                    v-model="new_product.area"
                  />
                </td>

                <!-- Ubicación -->
                <td v-if="activeTab === 'TERRENO' || activeTab === 'MEMBRESÍA'">
                  <input
                    class="input"
                    placeholder="Ubicación"
                    style="max-width: 150px"
                    v-model="new_product.location"
                  />
                </td>

                <!-- Precio -->
                <td>
                  <input
                    class="input"
                    type="number"
                    placeholder="Precio"
                    style="max-width: 80px"
                    v-model.number="new_product.price"
                  />
                </td>

                <!-- Tipo -->
                <td>
                   <input
                    class="input"
                    placeholder="Tipo"
                    style="max-width: 100px"
                    v-model="new_product.type"
                  />
                </td>

                <!-- Puntos -->
                <td>
                  <input
                    class="input"
                    type="number"
                    placeholder="Puntos"
                    style="max-width: 80px"
                    v-model.number="new_product.points"
                  />
                </td>
                <!-- Add -->
                <td>
                  <button class="button is-primary" @click="add">
                    Agregar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
    </section>
  </Layout>
</template>

<script>
import Layout from '@/views/Layout'
import api from '@/api'
import lib from '@/lib'

export default {
  components: { Layout },
  data() {
    return {
      activeTab: 'ACTIVACIÓN',
      loading: false,
      products: [],
      new_product: {
        price: [],
        aff_price: [],
        name: '',
        subtitle: '',
        duration: '',
        area: '',
        location: '',
        type: 'ACTIVACIÓN', 
        points: 0,
        img: '',
        code: ''
      },
    }
  },
  watch: {
    activeTab(val) {
      if(val) this.new_product.type = val;
    }
  },
  computed: {
    filteredProducts() {
      if (!this.products) return []
      return this.products.filter(p => {
        // Simple mapping to match the tabs with possible data variations
        if (this.activeTab === 'ACTIVACIÓN') return p.type.toUpperCase().includes('ACTIVACIÓN') || p.type.toUpperCase().includes('ACTIVACION')
        if (this.activeTab === 'TERRENO') return p.type.toUpperCase() === 'TERRENO'
        if (this.activeTab === 'MEMBRESÍA') return p.type.toUpperCase().includes('MEMBRESÍA') || p.type.toUpperCase().includes('MEMBRESIA')
        return false
      })
    }
  },
  filters: {
    date(val) {
      return new Date(val).toLocaleDateString()
    },
  },
  created() {
    const account = JSON.parse(localStorage.getItem('session'))

    this.$store.commit('SET_ACCOUNT', account)

    this.GET()
  },

  methods: {
    async GET() {
      this.loading = true

      // GET data
      const { data } = await api.products.GET() /*; console.log({ data })*/

      this.loading = false

      this.products = data.products.map((el) => (el.code = el.id))

      this.products = data.products.map((p) => ({
        ...p,
        sending: false,
        edit: false,
        _code: '',
        _name: '',
        _type: '',
        _description: '',
        _subtitle: '',
        _duration: '',
        _area: '',
        _location: '',
        _price: 0,
        _points: 0,
        _img: '',
      }))
    },

    async remove(product) {

      if (!confirm('¿Está seguro de eliminar este producto?')) {
        return
      }
      await api.products.POST({
        action: 'delete',
        id: product.id
      })

      location.reload()
    },

    edit(product) {
      product.edit = true

      product._code = product.code
      product._name = product.name
      product._type = product.type
      product._description = product.description
      product._subtitle = product.subtitle
      product._duration = product.duration
      product._area = product.area
      product._location = product.location
      product._price = product.price
      product._points = product.points
      product._img = product.img
    },

    async save(product) {
      await api.products.POST({
        action: 'edit',
        id: product.id,
        data: {
          _code: product._code,
          _name: product._name, 
          _type: product._type,
          _description: product._description,
          _subtitle: product._subtitle,
          _duration: product._duration,
          _area: product._area,
          _location: product._location,
          _price: product._price,
          _points: product._points,
          _img: product._img,
        },
      })

      product.code = product._code
      product.name = product._name
      product.type = product._type
      product.description = product._description
      product.subtitle = product._subtitle
      product.duration = product._duration
      product.area = product._area
      product.location = product._location
      product.price = product._price
      product.points = product._points
      product.img = product._img

      product.edit = false
    },

    cancel(product) {
      product.edit = false
    },

    async add() {
      const { code, name, type, price, points, description, img, subtitle, duration, area, location } = this.new_product

      // Generate a code if not present, though typically user might want to enter it. 
      // The prompt didn't ask for a code field in the "A) B) C)" lists, effectively removing it from the requirement? 
      // But the table has it. I'll rely on the input or just send what we have. 
      // The backend uses a random ID if not provided, but here 'code' is passed.
      
      await api.products.POST({
        action: 'add',
        data: {
          code: code || Math.random().toString(36).substring(7), // fallback if needed
          name,
          type,
          price,
          points,
          description,
          img,
          subtitle,
          duration,
          area,
          location
        },
      })

      location.reload()
    },
  },
}
</script>
