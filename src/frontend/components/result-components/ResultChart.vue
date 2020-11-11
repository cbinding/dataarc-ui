<template>
  <canvas id="source-chart" style="width: 904px; height: 676px; display: block;" width="813" height="608" class="chartjs-render-monitor" />
</template>
<script>
import { Bar } from 'vue-chartjs'
export default {
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }],
      },
      options: {
        title: {
          display: true,
          text: ''
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }],
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }]
        }
      }
    }
  },
  mixins: [Bar],
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      var ctx = document.getElementById('source-chart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: this.type,
        responsive: true,
        animation: true,
        data: this.data,
        options: this.options
      })
    }
  }
}
</script>

<style>

</style>
