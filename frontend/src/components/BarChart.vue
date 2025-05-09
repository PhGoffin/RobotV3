<template>
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" @hello="hello" />
</template>

<script>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

export default {
    name: 'SuiteEdit',
    props: ['trace', 'graphTitle', 'graphLabels', 'graphData'],
    components: { Bar },

    setup(props, context) {

        ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

        const graphTitle = props.graphTitle
        const graphLabels = props.graphLabels
        const barcolour = '#85c1db'
        const graphData = props.graphData

        const chartData = ref({
            labels: graphLabels,
            datasets: [
                {
                    label: graphTitle,
                    backgroundColor: barcolour,
                    data: graphData
                }
            ]
        })
        const chartOptions = ref({ responsive: true })

        const hello = async () => {
            console.log ('**********************  Hello !!!!!!!!!!')

        }


        return { chartOptions, chartData, hello }
    }

}
</script>

<style></style>