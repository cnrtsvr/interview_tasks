<template id="chart-template">
    <div>
        <div id="info-box"></div>
        <svg id="graphSVG" version="1.2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="graph" aria-labelledby="title" role="img">
            <title id="title">Clicks by date</title>
            <g class="grid x-grid" id="xGrid">
                <line x1="90" x2="90" y1="5" y2="515"></line>
            </g>
            <g class="grid y-grid" id="yGrid">
                <line x1="90" x2="840" y1="515" y2="515"></line>
            </g>
            <g class="grid x-grid" id="xGrid2">
                <line x1="840" x2="840" y1="5" y2="515"></line>
            </g>
            <g class="labels x-labels">
                <text v-for="(value, index) in dateArray" v-bind:key="value.date" :x="90 + index * 25" y="550">{{ value.date.split('-')[2] }}</text>
                <text x="475" y="575" class="label-title">Day of March 2018</text>
            </g>
            <g class="labels y-labels">
                <text x="80" y="15">250</text>
                <text x="80" y="115">200</text>
                <text x="80" y="215">150</text>
                <text x="80" y="315">100</text>
                <text x="80" y="415">50</text>
                <text x="80" y="515">0</text>
                <text x="50" y="250" class="label-title">Clicks</text>
            </g>
            <g class="labels y-labels">
                <text x="880" y="15">20000</text>
                <text x="880" y="115">16000</text>
                <text x="880" y="215">12000</text>
                <text x="880" y="315">8000</text>
                <text x="880" y="415">4000</text>
                <text x="880" y="515">0</text>
                <text x="980" y="250" class="label-title">Impressions</text>
            </g>
            <g v-for="(value, index) in dateArray" v-bind:key="value.date">
                <line v-if="clicksActive && index < dateArray.length -1" :x1="90 + index * 25" :y1="15 + (250 - value.clicks) * 2"
                      :x2="90 + (index + 1) * 25" :y2="15 + (250 - (dateArray[index + 1] ? dateArray[index + 1].clicks : 0)) * 2" class="dataClicks"></line>
                <circle v-if="clicksActive && index < dateArray.length" :cx="90 + index * 25" :cy="15 + (250 - value.clicks) * 2" r="5"
                        v-on:mouseover="onHover($event, '<div>Clicks: ' + value.clicks + '</div><div>Impressions: ' + value.impressions + '</div>')"
                        v-on:mouseleave="onMouseLeave()"></circle>
                <line v-if="impressionsActive && index < dateArray.length -1" :x1="90 + index * 25" :y1="15 + (20000 - value.impressions) * 0.025"
                      :x2="90 + (index + 1) * 25" :y2="15 + (20000 - (dateArray[index + 1] ? dateArray[index + 1].impressions : 0)) * 0.025" class="dataImpressions"></line>
                <circle v-if="impressionsActive && index < dateArray.length" :cx="90 + index * 25" :cy="15 + (20000 - value.impressions) * 0.025" r="5"
                        v-on:mouseover="onHover($event, '<div>Clicks: ' + value.clicks + '</div><div>Impressions: ' + value.impressions + '</div>')"
                        v-on:mouseleave="onMouseLeave()"></circle>
            </g>
            <g id="hoverLine">
                <line x1="0" y1="0" x2="0" y2="0" style="stroke: black; stroke-width: 1;"></line>
            </g>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "ChartComponent",
        template: '#chart-template',
        props: {
            dateArray: Array,
            clicksActive: Boolean,
            impressionsActive: Boolean
        },
        methods: {
            onHover: function (e, innerHtml) {
                document.getElementById('info-box').style.display = 'block';
                document.getElementById('info-box').innerHTML = innerHtml;
                let el = document.getElementById('graphSVG');
                let elemRect = document.querySelector('#graphSVG').getBoundingClientRect();
                let elemLeft = elemRect.left;
                let x = (Math.round((e.pageX - elemLeft - 90) / 25) * 25) +90;
                let gEl = el.querySelector('#hoverLine');
                gEl.style.display = 'block';
                gEl.innerHTML = '<line x1="' + x.toString() + '" y1="5" x2="'+ x.toString() + '" y2="515" style="stroke: black; stroke-width: 1;"></line>';
            },
            onMouseLeave: function () {
                document.getElementById('info-box').style.display = 'none';
                document.getElementById('info-box').innerHTML = '';
                let el = document.getElementById('graphSVG');
                let gEl = el.querySelector('#hoverLine');
                gEl.style.display = 'none';
                gEl.innerHTML = '';
            },
        }
    }
</script>

<style scoped>
    .graph .labels.x-labels {
        text-anchor: middle;
    }

    .graph .labels.y-labels {
        text-anchor: end;
    }


    .graph {
        height: 600px;
        width: 1000px;
    }

    .graph .grid {
        stroke: #ccc;
        stroke-dasharray: 0;
        stroke-width: 1;
    }

    .labels {
        font-size: 13px;
    }

    .label-title {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
        fill: black;
    }

    .dataClicks {
        stroke: red;
        stroke-width: 1;
    }
    .dataImpressions {
        stroke: blue;
        stroke-width: 1;
    }
    #info-box {
        display: none;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 1;
        background-color: #ffffff;
        border: 2px solid #BF0A30;
        border-radius: 5px;
        padding: 5px;
        font-family: arial;
    }

</style>