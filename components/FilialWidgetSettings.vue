<template>
  <v-card flat color="grey lighten-3" class="card-rounded">
    <v-card-text>
      <v-switch
        v-model="showDetails"
        label="Создать прямые ссылки для сети филиалов"
        color="blue"
        class="compact mt-0 pb-1 px-2"
        height="10px"
        hide-details
      />
    </v-card-text>
    <template v-if="showDetails">
      <v-divider class="card-divider" />
      <v-card-text>
        <v-layout row wrap>
          <v-flex pa-2>
            <v-layout column>
              <v-flex v-for="filial in filials" :key="filial.id" py-3>
                <v-layout
                  row
                  wrap
                  align-start
                  fill-height
                  justify-space-between
                >
                  <v-flex xs12 md4>
                    {{ (filial.j && filial.j.name) || `<${filial.id}>` }}
                  </v-flex>
                  <v-flex xs12 md5>
                    {{ filial.j && filial.j.address && filial.j.address.name }}
                  </v-flex>
                  <v-flex xs12 md3>
                    <v-btn
                      small
                      ripple
                      rounded
                      color="primary"
                      outlined
                      @click="copyLink(filial.id)"
                    >
                      Скопировать
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '~/api/backend'
import { widgetHost } from '~/components/utils'

export default {
  props: {
    //
  },
  data () {
    return {
      showDetails: false,
      filials: []
    }
  },
  computed: {
    ...mapGetters({ businessId: 'business/businessId' })
  },
  watch: {
    businessId: 'load'
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      if (!this.businessId) { return }
      Api()
        .get(`business?parent=eq.${this.businessId}&order=id&limit=10`)
        .then((res) => {
          this.filials = res.data
        })
    },
    link (id) {
      return `${widgetHost()}?b=${id}`
    },
    copyLink (id) {
      const el = document.createElement('textarea')
      el.value = this.link(id)
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}
</script>

<style scoped>
@import 'https://widget.uno.salon/css/widget.css';
.button-container {
  height: 60px;
}
.button-example {
  position: relative !important;
}
.card-rounded {
  border-radius: 24px;
}
.card-divider {
  border-color: rgba(255, 255, 255, 1);
}
.script-text {
  width: 100%;
  background: white;
  min-height: 6em;
  padding: 0.5em;
}
.rounded {
  font-size: 10px;
  display: inline-block;
  border: solid;
  border-width: 1px;
  border-radius: 1em;
  text-align: center;
  position: relative;
  bottom: 1px;
  width: 14px;
  height: 14px;
  margin-right: 0.5em;
}
</style>
