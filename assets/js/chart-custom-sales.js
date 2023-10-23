(function(jQuery) {

    "use strict";

  // for apexchart
  function apexChartUpdate(chart, detail) {
    let color = getComputedStyle(document.documentElement).getPropertyValue('--dark');
    if (detail.dark) {
      color = getComputedStyle(document.documentElement).getPropertyValue('--white');
    }
    chart.updateOptions({
      chart: {
        foreColor: color
      }
    })
  }

  // información inicial
  setData($(this).val());

  // cambio de partner
  $( "#inputGroupSelect01" ).on( "change", function() {
    setData($(this).val());
  } );

  function setData(partnerId) {
    /* FORECAST INFORMATION */
    console.log(partnerId);
    const monthlySales = montlyData.reduce((total, item) => total + item.sales, 0);
    let options = {
      series: [73.33, 66.66],
      labels: ['Expected sales', 'Current sales'],
      chart: {
        height: 400,
        type: 'radialBar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 3000,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        }
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '22px', },
            value: { fontSize: '16px', },
            total: {
              show: true,
              label: 'Monthly Sales',
              formatter: function (w) {
                return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(monthlySales)
              }
            },
            value: {
              fontSize: '16px',
              formatter: function (val) {
                return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(
                  (val == 66.66) ? monthlySales : monthlySales * 1.1
                );
              }
            }
          },
          track: { strokeWidth: '42%', }            
        }
      },
      colors: ['#05bbc9', '#876cfe'],
      stroke: { lineCap: "round" }
    };
    let chart = new ApexCharts(document.querySelector("#layout-1-chart-01"), options);
    chart.render();
    let body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chart, {
        dark: true
      })
    }
    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chart, e.detail)
    })

    /* Yesterdays Sales */
    const yesterdaySales = yesterdayData.reduce((total, item) => total + item.sales, 0).toFixed(2);
    $('#yesterdars_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yesterdaySales));
    const yesterdayUnits = yesterdayData.reduce((total, item) => total + item.quantity, 0).toFixed(0);
    $('#yesterdars_units').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(yesterdayUnits));
    options = {
      chart: {
        height: 80,
        type: 'area',
        sparkline: { enabled: true },
        group: 'sparklines',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 3500,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
        }
      },
      series: [{
        name: 'Sales',
        data: yesterdayData.map(hour => hour.sales)
      }, ],
      colors: ['#50b5ff'],
      xaxis: {
        categories: yesterdayData.map(hour => hour.hour),
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val)
          }
        },
        x: {
          formatter: function (val) {
            return `Hour: ${val}`
          }
        }
      }
    };
    chart = new ApexCharts( document.querySelector("#chart-yesterday-sales"), options );
    chart.render();

    /*Month to Date Sales*/
    $('#montly_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(monthlySales));
    const monthlyUnits = montlyData.reduce((total, item) => total + item.units, 0);
    $('#montly_units').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(monthlyUnits));
    options = {
      chart: {
        height: 80,
        type: 'area',
        sparkline: {
            enabled: true
        },
        group: 'sparklines',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 3500,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      fill: {
          type: 'gradient',
          gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.5,
              opacityTo: 0,
          }
      },
      series: [{
          name: 'Sales',
          data: montlyData.map(hour => hour.sales)
      }, ],
      colors: ['#fd7e14'],
      xaxis: {
        categories: montlyData.map(hour => hour.date),
      },
      tooltip: {
          y: {
            formatter: function (val) {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val)
            }
          },
          x: {
            formatter: function (val) {
              return `Day: ${val}`
            }
          }
      }
    };
    chart = new ApexCharts( document.querySelector("#chart-montly-sales"), options );
    chart.render();

    /* Year to Date Sales */
    const yearSales = yearData.reduce((total, item) => total + item.sales, 0);
    $('#year_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yearSales));
    const yearUnits = yearData.reduce((total, item) => total + item.units, 0);
    $('#year_units').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(yearUnits));
    options = {
      chart: {
        height: 80,
        type: 'area',
        sparkline: {
            enabled: true
        },
        group: 'sparklines',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 3500,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
        }
      },
      series: [{
        name: 'Sales',
        data: yearData.map(hour => hour.sales)
      }, ],
      colors: ['#49f0d3'],
      xaxis: {
        categories: yearData.map(hour => hour.month),
      },
      tooltip: {
          y: {
            formatter: function (val) {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val)
            }
          }
      }
    };
    chart = new ApexCharts(document.querySelector("#chart-year-sales"),options);
    chart.render();

    /* Average Daily Sales */
    const differenceDays = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24));
    $('#average_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yearSales / differenceDays));
    $('#average_units').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(yearUnits / differenceDays));

    /* Month variance vs last year */
    const montlyDataLastYearSales = montlyDataLastYear.reduce((total, item) => total + item.sales, 0);
    $('#average_sales_last_year').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(monthlySales-montlyDataLastYearSales));
    $('#average_percentage_last_year').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((monthlySales - montlyDataLastYearSales) / montlyDataLastYearSales));

    /* Month to date vs Month to date Prior Variance */
    const lastMontlyDataSales = lastMontlyData.reduce((total, item) => total + item.sales, 0);
    $('#average_sales_prio_year').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(monthlySales-lastMontlyDataSales));
    $('#average_percentage_prio_year').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format((monthlySales - lastMontlyDataSales) / lastMontlyDataSales));

    /* Daily sales trend */
    const optionsDailySales = {
      series: [
        {
          name: 'Sales',
          type: 'area',
          data: window.yesterdayData.map(day => day.sales)
        }, {
          name: 'Expected',
          type: 'line',
          data: window.yesterdayData.map(day => (day.sales/(0.8 + Math.random() * (1.5 - 0.8))))
        }],
      chart: {
        height: 500,
        type: 'line',
        stacked: true
      },
      stroke: {
        width: [4, 4],
        curve: 'smooth'
      },
      plotOptions: {
        bar: { columnWidth: "60%" }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: [4, 4]
      },
      xaxis: {
        categories: window.yesterdayData.map(day => day.hour),
        tickPlacement: 'on',
        labels: {
          show: true,
          rotate: -90, // Rota las etiquetas para que sean legibles
        }
      },
      yaxis: [
        {
          seriesName: 'Sales',
          show: false
        },
        {
          seriesName: 'Expected',
          show: false
        }
      ],
      fill: {
        opacity: [0.7, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(y);
            }
            return y;

          }
        }
      }
    };

    let chartDailySales = new ApexChartsNew(document.querySelector("#layout-1-chart-daily"), optionsDailySales);
    chartDailySales.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartDailySales, {
        dark: true
      })
    }

    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartDailySales, e.detail)
    })

    /* Year sales trend */

    const optionsYearSalesTrend = {
      series: [
        {
          name: 'Sales',
          type: 'column',
          data: window.dailyTrendSales.map(day => day.sales)
        }, {
          name: 'Expected',
          type: 'line',
          data: window.dailyTrendSales.map(day => (day.sales/(0.8 + Math.random() * (1.5 - 0.8))))
        }],
      chart: {
        height: 500,
        type: 'line',
        stacked: true,
        events: {
          zoomed: function(chartContext, { xaxis, yaxis }) {
            const zoomStart = xaxis.min >= 1 ? xaxis.min : 1;
            const zoomEnd = xaxis.max <= 151 ? xaxis.max : 151;
            const categories = window.dailyTrendSales.map(day => day.date);
            chartContext.updateOptions({
              xaxis: {
                categories: window.dailyTrendSales.map(day => day.date),
                tickPlacement: 'on',
                labels: { show: true, rotate: -90, },
                min: zoomStart,
                max: zoomEnd,
              }
            }, false, false);
          },
          beforeResetZoom: function(chartContext, opts) {
            return {
              xaxis: {
                min: 140,
                max: 151
              }
            }
          }
        }
      },
      stroke: {
        width: [0, 4]
      },
      plotOptions: {
        bar: { columnWidth: "60%" }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: window.dailyTrendSales.map(day => day.date),
        tickPlacement: 'on',
        labels: {
          show: true,
          rotate: -90, // Rota las etiquetas para que sean legibles
        },
        min: 140,
        max: 151
      },
      yaxis: [
        {
          seriesName: 'Sales',
          show: false
        },
        {
          seriesName: 'Expected',
          show: false
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(y);
            }
            return y;

          }
        }
      }
    };
    let chartYearSales = new ApexChartsNew(document.querySelector("#layout-1-chart-03"), optionsYearSalesTrend);
    chartYearSales.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartYearSales, {
        dark: true
      })
    }

    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartYearSales, e.detail)
    })

  }


})(jQuery);


