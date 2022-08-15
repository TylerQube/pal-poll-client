<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from 'vue-chartjs/legacy'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'StatsBarChart',
  components: { Bar },
  props: {
    voteCounts: {
      type: Object
    },  
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [ 
          { 
            data: [],
            backgroundColor: '#9C27B0',
            maxBarThickness: 50
          } 
        ]
      },
      chartOptions: {
        responsive: true,
        scales: {
          xAxes: [{

            gridLines: {
              display: false,
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              fontFamily: 'Nunito',
              fontSize: 15
            },
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              display: false,
              precision: 0,
              fontSize: 20,
              min: 0,
              stepSize: 1
            }
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          titleFontSize: 30,
          bodyFontSize: 30,
          fontFamily: 'Nunito'
        }
      }
    }
  },
  methods: {
    setupData() {
      const votes = this.voteCounts.voteCounts;
      for(const entry in votes) {

        const count = votes[entry];
        this.chartData.labels.push(entry[0].toUpperCase() + entry.slice(1));

        this.chartData.datasets[0].data.push(count)
      }
    }
  },
  watch: {
    voteCounts() {
      this.setupData();
    }
  },  
  mounted() {
    this.setupData();
  }
}
</script>

<style>

</style>