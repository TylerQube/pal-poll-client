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
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
          xAxis: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                family: 'Nunito',
                size: 15
              }
            },
          },
          
          yAxis: {
            display: false,
            grid: {
              display: false,
            },
          },
        },
        animation: {
          duration: 600,
          easing: 'easeInOutQuad'
        },
        plugins: {
          tooltip: {
          titleFont: {
            size: 25
          },
          bodyFont: {
            size: 20
          },
          bodyFontSize: 30,
          fontFamily: 'Nunito'
        },
          legend: {
            display: false
          }
        },
      }
    }
  },
  methods: {
    setupData() {
      const votes = this.voteCounts.voteCounts;
      for(const entry in votes) {

        const count = votes[entry];
        console.log("Entry: " + typeof(entry))
        if(entry != "null") {
          const label = entry[0].toUpperCase() + entry.slice(1)
          this.chartData.labels.push(label);
          this.chartData.datasets[0].data.push(count)
        }

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