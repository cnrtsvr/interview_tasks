<template>
  <div id="app">
    <div v-if="!initFinished">
      <span>Downloading and analyzing data</span>
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <div v-if="initFinished" v-on:mousemove="onDocumentMouseMove">
      <div style="width: 1000px; padding: 15px 0 15px 0; margin-bottom: 15px; display: inline-block" class="card">
        <button class="clicksButton" v-on:click="clicksActive = !clicksActive" v-bind:class="{disabledButton: !clicksActive}">
          {{'Total Clicks: ' + (totalClicks > 1000 ? Math.round( totalClicks / 1000 * 10 ) / 10 + 'K' : totalClicks)}}
        </button>
        <button class="impressionsButton" v-on:click="impressionsActive = !impressionsActive" v-bind:class="{disabledButton: !impressionsActive}">
          {{'Total Impressions: ' + (totalImpressions > 1000 ? Math.round( totalImpressions / 1000 * 10 ) / 10 + 'K' : totalImpressions)}}
        </button>
      </div>
      <div class="card" style="width: 1000px; padding: 15px 0 15px 0; margin-top: 15px; display: inline-block">
        <chart-component :date-array="dateArray" :clicks-active="clicksActive" :impressions-active="impressionsActive"></chart-component>
      </div>
      <div class="card" style="width: 1000px; padding: 15px 0 15px 0; margin-top: 15px; display: inline-block">
        <grid-component :data="gridData" :columns="gridColumns"></grid-component>
      </div>
    </div>
  </div>
</template>

<script>
  import GridComponent from './components/GridComponent';
  import ChartComponent from './components/ChartComponent'
export default {
  name: 'app',
  components: {
    GridComponent,
    ChartComponent
  },
  data: function() {
    return {
      dateArray: [],
      initFinished: false,
      totalClicks: 0,
      totalImpressions: 0,
      gridData: [],
      clicksActive: true,
      impressionsActive: true,
    };
  },
  created: function() {
    this.httpGetData();
  },
  computed: {
    gridColumns: function () {
      let array = ['keyword'];
      if(this.clicksActive) {
        array.push('clicks');
      }
      if(this.impressionsActive) {
        array.push('impressions');
      }
      return array;
    }
  },
  methods: {
    httpGetData: function() {
      /*
      let username = 'interview_1';
      let password = 'int_candidate12';
      this.$http.get('https://cors-anywhere.herokuapp.com/http://35.243.142.103:5000/get_data', {
        headers: {
          'Authorization': 'Basic ' +  btoa(username + ":" + password)
        }
      })
      */
      // Getting the copy of data from localhost as the server is down now.
      this.$http.get('/data/data.json').then((response) => {
        let dateToNumber = (d) => {
          d = d.split("-"); return Number(d[0]+d[1]+d[2]);
        };
        for(let index in response.body){
          const date = response.body[index].date;
          if(this.dateArray.find(x => x.date === date)) {
            let obj = this.dateArray.find(x => x.date === date);
            obj.clicks += response.body[index].clicks;
            obj.impressions += response.body[index].impressions;
          } else {
            const obj = {
              date: date,
              clicks: response.body[index].clicks,
              impressions: response.body[index].impressions
            };
            this.dateArray.push(obj);
          }
          this.totalClicks += response.body[index].clicks;
          this.totalImpressions += response.body[index].impressions;
          let keyword = response.body[index].keyword;
          if(this.gridData.find(x => x.keyword === keyword)) {
            let obj = this.gridData.find(x => x.keyword === keyword);
            obj.clicks += response.body[index].clicks;
            obj.impressions += response.body[index].impressions;
          } else {
            const obj = {
              keyword: keyword,
              clicks: response.body[index].clicks,
              impressions: response.body[index].impressions
            };
            this.gridData.push(obj);
          }
        }
        this.dateArray.sort((a,b)=> {return dateToNumber(a.date) - dateToNumber(b.date);});
        this.initFinished = true;
      });
    },
    onDocumentMouseMove: function (e) {
        document.getElementById('info-box').style.top = (e.pageY - document.getElementById('info-box').clientHeight-30).toString() + 'px';
        document.getElementById('info-box').style.left = (e.pageX -(document.getElementById('info-box').clientWidth)/2).toString() + 'px';
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  body {
    font-family: 'Open Sans', sans-serif;
  }

  .clicksButton {
    background-color: red;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }
  .impressionsButton {
    background-color: blue;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

  .disabledButton {
    background-color: dimgray;
  }

  .card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  }

  .spinner {
    margin: 100px auto 0;
    width: 70px;
    text-align: center;
  }

  .spinner > div {
    width: 18px;
    height: 18px;
    background-color: #333;

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% {
        -webkit-transform: scale(1.0);
        transform: scale(1.0);
      }
  }
</style>