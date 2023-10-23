(function(jQuery) {

  "use strict";
  let chartForecastInformation = null;
  let chartYesterdaySales = null;
  let chartMonthlySales = null;
  let chartYearToDateSales = null;
  let chartYearSalesTrend = null;
  let chartDailySalesTrend = null;

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
  setData(607);

  // cambio de partner
  $( "#inputGroupSelect01" ).on( "change", function() {
    setData($(this).val());
  } );

  function setData(partnerId) {
    /* FORECAST INFORMATION */
    const monthlySales = montlyData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.sales, 0);
    let options = {
      series: [73.33, 66.66],
      labels: ['Expected sales', 'Current sales'],
      chart: {
        height: 400,
        type: 'radialBar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 2000,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 150
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

    if( chartForecastInformation != null ) {
      chartForecastInformation.destroy();
    }
    chartForecastInformation = new ApexCharts(document.querySelector("#layout-1-chart-01"), options);
    chartForecastInformation.render();

    let body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartForecastInformation, {
        dark: true
      })
    }
    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartForecastInformation, e.detail)
    })

    /* Yesterdays Sales */
    const yesterdaySales = yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.sales, 0).toFixed(2);
    $('#yesterdars_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yesterdaySales));
    const yesterdayUnits = yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.quantity, 0).toFixed(0);
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
        data: yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.sales)
      }, ],
      colors: ['#50b5ff'],
      xaxis: {
        categories: yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.hour),
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
    if( chartYesterdaySales != null ) {
      chartYesterdaySales.destroy();
    }
    chartYesterdaySales = new ApexCharts( document.querySelector("#chart-yesterday-sales"), options );
    chartYesterdaySales.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartYesterdaySales, {
        dark: true
      })
    }
    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartYesterdaySales, e.detail)
    })

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
          data: montlyData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.sales)
      }, ],
      colors: ['#fd7e14'],
      xaxis: {
        categories: montlyData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.date),
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
    if( chartMonthlySales != null ) {
      chartMonthlySales.destroy();
    }
    chartMonthlySales = new ApexCharts( document.querySelector("#chart-montly-sales"), options );
    chartMonthlySales.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartMonthlySales, {
        dark: true
      })
    }
    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartMonthlySales, e.detail)
    })

    /* Year to Date Sales */
    const yearSales = yearData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.sales, 0);
    $('#year_sales').text(new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(yearSales));
    const yearUnits = yearData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.units, 0);
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
        data: yearData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.sales)
      }, ],
      colors: ['#49f0d3'],
      xaxis: {
        categories: yearData.filter(item => Number(item.brandId) == Number(partnerId)).map(hour => hour.month),
      },
      tooltip: {
          y: {
            formatter: function (val) {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val)
            }
          }
      }
    };
    if( chartYearToDateSales != null ) {
      chartYearToDateSales.destroy();
    }
    chartYearToDateSales = new ApexCharts(document.querySelector("#chart-year-sales"),options);
    chartYearToDateSales.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartYearToDateSales, {
        dark: true
      })
    }
    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartYearToDateSales, e.detail)
    })

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
          data: window.yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.sales)
        }, {
          name: 'Expected',
          type: 'line',
          data: window.yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(day => (day.sales/(0.8 + Math.random() * (1.5 - 0.8))))
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
        categories: window.yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.hour),
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
    if( chartDailySalesTrend != null ) {
      chartDailySalesTrend.destroy();
    }
    chartDailySalesTrend = new ApexChartsNew(document.querySelector("#layout-1-chart-daily"), optionsDailySales);
    chartDailySalesTrend.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartDailySalesTrend, {
        dark: true
      })
    }

    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartDailySalesTrend, e.detail)
    })

    /* Year sales trend */
    const baseUnit = window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).length;
    const optionsYearSalesTrend = {
      series: [
        {
          name: 'Sales',
          type: 'column',
          data: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.sales)
        }, {
          name: 'Expected',
          type: 'line',
          data: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => (day.sales/(0.8 + Math.random() * (1.5 - 0.8))))
        }],
      chart: {
        height: 500,
        type: 'line',
        stacked: true,
        events: {
          zoomed: function(chartContext, { xaxis, yaxis }) {
            const zoomStart = xaxis.min >= 1 ? xaxis.min : 1;
            const zoomEnd = xaxis.max <= baseUnit ? xaxis.max : baseUnit;
            chartContext.updateOptions({
              xaxis: {
                categories: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.date),
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
                min: baseUnit - 10,
                max: baseUnit
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
        categories: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.date),
        tickPlacement: 'on',
        labels: {
          show: true,
          rotate: -90, // Rota las etiquetas para que sean legibles
        },
        min: baseUnit - 10,
        max: baseUnit
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
    if( chartYearSalesTrend != null ) {
      chartYearSalesTrend.destroy();
    }
    chartYearSalesTrend = new ApexChartsNew(document.querySelector("#layout-1-chart-03"), optionsYearSalesTrend);
    chartYearSalesTrend.render();
    body = document.querySelector('body')
    if (body.classList.contains('dark')) {
      apexChartUpdate(chartYearSalesTrend, {
        dark: true
      })
    }

    document.addEventListener('ChangeColorMode', function (e) {
      apexChartUpdate(chartYearSalesTrend, e.detail)
    })

    const $counters = $(".counter");
    const counterUp = window.counterUp["default"]
    $counters.each(function (ignore, counter) {
            var waypoint = new Waypoint({
                element: $(this),
                handler: function () {
                    counterUp(counter, {
                        duration: 1000,
                        delay: 10
                    });
                    this.destroy();
                },
                offset: 'bottom-in-view',
            });
    });

  }


})(jQuery);


