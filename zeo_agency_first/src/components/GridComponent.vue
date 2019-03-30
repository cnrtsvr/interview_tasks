<template id="grid-template">
    <div>
        <form id="search" style="margin-bottom: 15px">
            Search <input name="query" v-model="filterKey">
        </form>
        <table style="width: 1000px">
            <thead>
            <tr>
                <th v-for="(key, index) in columns" v-bind:key="index"
                    v-on:click="sortBy(key)"
                    v-bind:class="{ active: sortKey == key }">
                    {{ key | capitalize }}
                    <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                    </span>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(entry, i) in paginatedData" v-bind:key="i">
                <td v-for="(key, j) in columns" v-bind:key="j">
                    {{entry[key]}}
                </td>
            </tr>
            </tbody>
        </table>
        <p style="width: 1000px;">
            <button v-on:click="prevPage">Previous</button>
            {{ 'Current Page: ' + currentPage + ' of ' + (Math.ceil(filteredData.length / pageSize)) + ' pages'}}
            <button v-on:click="nextPage">Next</button>
        </p>
        <select v-model="pageSize">
            <option disabled value="">Please select one</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'GridComponent',
        template: '#grid-template',
        props: {
            data: Array,
            columns: Array
        },
        data: function () {
            let sortOrders = {};
            this.columns.forEach(function (key) {
                sortOrders[key] = 1
            });
            return {
                sortKey: '',
                sortOrders: sortOrders,
                currentPage: 1,
                pageSize: 10,
                filterKey: ''
            };
        },
        computed: {
            filteredData: function () {
                let sortKey = this.sortKey;
                let filterKey = this.filterKey && this.filterKey.toLowerCase();
                let order = this.sortOrders[sortKey] || 1;
                let data = this.data;
                if (filterKey) {
                    data = data.filter(function (row) {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                        });
                    });
                }
                if (sortKey) {
                    data = data.slice().sort(function (a, b) {
                        a = a[sortKey];
                        b = b[sortKey];
                        return (a === b ? 0 : a > b ? 1 : -1) * order;
                    });
                }
                return data;
            },
            paginatedData: function () {
                let start = (this.currentPage-1)*this.pageSize;
                let end = this.currentPage*this.pageSize;
                return this.filteredData.slice(start, end);
            }
        },
        watch: {
            filteredData: function () {
                if(this.currentPage > (Math.ceil(this.filteredData.length / this.pageSize))){
                    this.currentPage = (Math.ceil(this.filteredData.length / this.pageSize));
                }
            }
        },
        filters: {
            capitalize: function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        },
        methods: {
            sortBy: function (key) {
                this.sortKey = key;
                this.sortOrders[key] = this.sortOrders[key] * -1;
            },
            nextPage:function() {
                if((this.currentPage*this.pageSize) < this.filteredData.length) this.currentPage++;
            },
            prevPage:function() {
                if(this.currentPage > 1) this.currentPage--;
            }
        }
    }
</script>

<style scoped>
    body {
        font-family: Helvetica Neue, Arial, sans-serif;
        font-size: 14px;
        color: #444;
    }

    table {
        border: 2px solid #42b983;
        border-radius: 3px;
        background-color: #fff;
    }

    th {
        background-color: #42b983;
        color: rgba(255,255,255,0.66);
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    td {
        background-color: #f9f9f9;
    }

    th, td {
        min-width: 120px;
        padding: 10px 20px;
    }

    th.active {
        color: #fff;
    }

    th.active .arrow {
        opacity: 1;
    }

    .arrow {
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;
    }

    .arrow.asc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #fff;
    }

    .arrow.dsc {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #fff;
    }
</style>