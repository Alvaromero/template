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
    jQuery("#load").fadeOut();
    jQuery("#loading").delay().fadeOut("");
    /* FORECAST INFORMATION */
    const monthlySales = montlyData.filter(item => Number(item.brandId) == Number(partnerId)).reduce((total, item) => total + item.sales, 0);
    
    let options = {
      series: [{
        name: 'Sales',
        data: [monthlySales*0.9, monthlySales]
      }],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: ['#05bbc9', '#876cfe'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [
          'Expected sales',
          'Current sales'
        ]
      },
      yaxis: [
        {
          seriesName: 'Sales',
          show: false
        }
      ],
      tooltip: {
        y: {
          formatter: function (val) {
            return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(val)
          }
        },
        x: {
          formatter: function (val) {
            return val;
          }
        }
      }
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
        categories: window.yesterdayData.filter(item => Number(item.brandId) == Number(partnerId)).map(day => {
          return `${day.hour} ${day.hour < 12 ? 'A.M' : 'P.M'}`
        }),
        tickPlacement: 'on',
        labels: {
          show: true,
          rotate: -90, // Rota las etiquetas para que sean legibles
        },
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
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(y);
            }
            return y;

          }
        },
        x: {
          formatter: function (x, z) {
            if (typeof x !== "undefined") {
              const category = window.yesterdayData.filter(item => Number(item.brandId) == Number(partnerId))[x-1];
              return `Hour: ${category.hour} ${Number(category.hour) < 12 ? 'A.M' : 'P.M'}`;
            }
            return x;
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
    //const baseUnit = window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).length;
    const optionsYearSalesTrend = {
      series: [{
        name: ' Sales',
        type: 'column',
        data: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.sales)
      }, {
          name: ' Expected',
        type: 'line',
        data: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => (day.sales/(0.8 + Math.random() * (1.5 - 0.8))))
      }],
      chart: {
        height: 500,
        type: 'line',
        stacked: false,
        events: {
          zoomed: function(chartContext, { xaxis, yaxis }) {
            const zoomStart = xaxis.min >= new Date('01 Jan 2022').getTime() ? xaxis.min : new Date('01 Jan 2022').getTime();
            const zoomEnd = xaxis.max <= new Date('24 Oct 2023').getTime() ? xaxis.max : new Date('24 Oct 2023').getTime();
            chartContext.updateOptions({
              xaxis: {
                type: 'datetime',
                min: zoomStart,
                max: zoomEnd,
              }
            }, false, false);
          },
          beforeResetZoom: function(chartContext, opts) {
            return {
              xaxis: {
                type: 'datetime',
                min: new Date('01 Oct 2023').getTime(),
                maz: new Date('24 Oct 2023').getTime()
              }
            }
          }
        }
      },
      stroke: {
        width: [0, 2],
        curve: 'smooth'
      },
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      },

      fill: {
        opacity: [0.85, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100]
        }
      },
      labels: window.dailyTrendSales.filter(item => Number(item.brandId) == Number(partnerId)).map(day => day.date),
      colors: ['#05bbc9', '#fe721c'],
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime',
        min: new Date('01 Oct 2023').getTime()
      },
      yaxis: {
        show: true,
        labels: {
          minWidth: 20,
          maxWidth: 20
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

    setTimeout(() => {
      //PNotify.defaultModules.set(PNotifyMobile, {});
      const notyf = new Notyf();
      notyf
        .success({
          duration: 10000,
          position: {
            x: 'right',
            y: 'top',
          },
          message: 'Three <b>new SKUs</b> have been added to your account.',
          dismissible: true
        })
    }, 8000);

    setTimeout(() => {
      const notyf = new Notyf({
        duration: 10000,
        position: {
          x: 'right',
          y: 'top',
        },
        types: [
          {
            type: 'warning',
            background: 'orange',
            icon: {
              className: 'material-icons',
              tagName: 'i',
              text: 'warning'
            }
          }
        ],
        icon: false,
        dismissible: true
      });
      notyf
        .open({
          type: 'warning',
          message: 'Shipment <b>FBA17GZ81F2T</b> has arrived at Amazon FBA.'
        })
    }, 19000);

    setTimeout(() => {
      const notyf = new Notyf();
      notyf
        .success({
          duration: 10000,
          position: {
            x: 'right',
            y: 'top',
          },
          message: 'ASIN <b>B0089Y91HM</b> was your best selling product yesterday: USD <b><u>91,627.00</u></b>.',
          dismissible: true
        })
    }, 30000);

  }


  const startYear = 1960,
  endYear = 2018,
  btn = document.getElementById('play-pause-button'),
  input = document.getElementById('play-range'),
  nbr = 20;

let dataset, chart;


/*
 * Animate dataLabels functionality
 */
(function (H) {
  const FLOAT = /^-?\d+\.?\d*$/;

  // Add animated textSetter, just like fill/strokeSetters
  H.Fx.prototype.textSetter = function () {
    let startValue = this.start.replace(/ /g, ''),
      endValue = this.end.replace(/ /g, ''),
      currentValue = this.end.replace(/ /g, '');

    if ((startValue || '').match(FLOAT)) {
      startValue = parseInt(startValue, 10);
      endValue = parseInt(endValue, 10);

      // No support for float
      currentValue = Highcharts.numberFormat(
        Math.round(startValue + (endValue - startValue) * this.pos),
        0
      );
    }

    this.elem.endText = this.end;

    this.elem.attr(this.prop, currentValue, null, true);
  };

  // Add textGetter, not supported at all at this moment:
  H.SVGElement.prototype.textGetter = function () {
    const ct = this.text.element.textContent || '';
    return this.endText ? this.endText : ct.substring(0, ct.length / 2);
  };

  // Temporary change label.attr() with label.animate():
  // In core it's simple change attr(...) => animate(...) for text prop
  H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
    const attr = H.SVGElement.prototype.attr,
      chart = this.chart;

    if (chart.sequenceTimer) {
      this.points.forEach(point =>
        (point.dataLabels || []).forEach(
          label =>
            (label.attr = function (hash) {
              if (
                hash &&
                hash.text !== undefined &&
                chart.isResizing === 0
              ) {
                const text = hash.text;

                delete hash.text;

                return this
                  .attr(hash)
                  .animate({ text });
              }
              return attr.apply(this, arguments);

            })
        )
      );
    }

    const ret = proceed.apply(
      this,
      Array.prototype.slice.call(arguments, 1)
    );

    this.points.forEach(p =>
      (p.dataLabels || []).forEach(d => (d.attr = attr))
    );

    return ret;
  });
}(Highcharts));


function getData(year) {
  const output = Object.entries(dataset)
    .map(country => {
      const [countryName, countryData] = country;
      return [countryName, isNaN(Number(countryData[year])) ? 0 : Number(countryData[year])];
    })
    .sort((a, b) => b[1] - a[1]);
  return [output[0], output.slice(1, nbr)];
}

function getDateFromDayOfYear(year, dayOfYear) {
  if(dayOfYear == 0) {
    return '2022-12-31';
  }
  // Crea una nueva fecha en el año especificado y establece el día del año
  var date = new Date(year, 0); // El mes 0 es enero
  date.setDate(dayOfYear);

  // Formatea la fecha en el formato "YYYY-MM-DD"
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, '0'); // El mes es 0-indexado
  var dd = String(date.getDate()).padStart(2, '0');

  return yyyy + '-' + mm + '-' + dd;
}

function getSubtitle() {
  const population = (getData(input.value)[0][1]).toFixed(2);
  const value = getDateFromDayOfYear(2023, input.value);
  return `<span style="font-size: 40px">${value}</span>
    <br>
    <span style="font-size: 22px">
      Total: <b>: ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(population)}</b> dollars
    </span>`;
}

(async () => {

  /*dataset = await fetch(
    'https://demo-live-data.highcharts.com/population.json'
  ).then(response => response.json());*/

  dataset = {};

    window.productsData.forEach(item => {
        const { asin, sales, month_number } = item;

        if (!dataset[asin]) {
          dataset[asin] = {};
        }

        dataset[asin][month_number] = parseFloat(sales);
    });

  chart = Highcharts.chart('container', {
    chart: {
      animation: {
        duration: 500
      },
      marginRight: 50
    },
    title: {
      text: 'Sales of main products in 2023',
      align: 'left'
    },
    subtitle: {
      useHTML: true,
      text: getSubtitle(),
      floating: true,
      align: 'right',
      verticalAlign: 'middle',
      y: 0,
      x: -20
    },

    legend: {
      enabled: true
    },
    xAxis: {
      type: 'category',
      labels: {
        align: "left",
        reserveSpace: true,
        allowOverlap:true,
        maxStaggerLines:5,
        overflow:"justify",
        useHTML: true,
        formatter: function(label) {
          switch (label.value) {
            case "B07L6QL784":
              return  `<img src='assets/images/asins/B07L6QL784.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'>Natural Adjustable`;
            case "B09Z3942HF":
              return "<img src='assets/images/asins/B09Z3942HF.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Cushion with Tray";
            case "B07JP4QRTY":
              return "<img src='assets/images/asins/B07JP4QRTY.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Newborn Set Grey";
            case "B0089Y91HM":
              return "<img src='assets/images/asins/B0089Y91HM.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Tray, White Designed";
            case "B07KQQHX6H":
              return "<img src='assets/images/asins/B07KQQHX6H.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Adjustable Wooden Natural";
            case "B07RJ3C7DX":
              return "<img src='assets/images/asins/B07RJ3C7DX.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Flexi Bath X-Large";
            case "B07Z6R81ZS":
              return "<img src='assets/images/asins/B07Z6R81ZS.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Cloud Grey  with Tray";
            case "B09QH6PGHQ":
              return "<img src='assets/images/asins/B09QH6PGHQ.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> CloudSleeper Kids Inflatable   .....  ";
            case "B07KQR7GBK":
              return "<img src='assets/images/asins/B07KQR7GBK.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Whitewash, Adjustable";
            case "B07KQRJBG1":
              return "<img src='assets/images/asins/B07KQRJBG1.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Black Adjustable";
            case "B07KQPSPJP":
              return "<img src='assets/images/asins/B07KQPSPJP.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Walnut Adjustable";
            case "B0BLHVZ4H7":
              return "<img src='assets/images/asins/B0BLHVZ4H7.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> White All-in-One";
            case "B0B8K58948":
              return "<img src='assets/images/asins/B0B8K58948.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Fjord Blue";
            case "B09VVNZYNL":
              return "<img src='assets/images/asins/B09VVNZYNL.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Black Natural";
            case "B09QH4G6QF":
              return "<img src='assets/images/asins/B09QH4G6QF.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Fjord Blue All-in-One";
            case "B07KQPRS54":
              return "<img src='assets/images/asins/B07KQPRS54.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> White Adjustable";
            case "B0B2FKCZKJ":
              return "<img src='assets/images/asins/B0B2FKCZKJ.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Cushion Black";
            case "B0C28TJFMV":
              return "<img src='assets/images/asins/B0C28TJFMV.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Cushion Natural";
            case "B07641R1F3":
              return "<img src='assets/images/asins/B07641R1F3.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> Tray, Storm Grey";
            case "B07JLZPPQY":
              return "<img src='assets/images/asins/B07JLZPPQY.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'> BedBox, Pink Lemonade";
            default:
              return label.value;
          }
        }
      }
    },
    yAxis: {
      min: 0,
      max: 1800000,
      opposite: true,
      tickPixelInterval: 150,
      title: {
        text: null
      }
    },
    tooltip: {
      useHTML: true,
      style: {
        backgroundColor: 'red',  // Cambia el color del texto de la etiqueta
        fontSize: '14px'  // Cambia el tamaño de fuente
      },
      formatter: function() {
        return `
          <img src='assets/images/asins/${this.key}.jpg' style='height: 35px;' class='img-fluid rounded-normal light-logo' alt='logo'>
          ${this.key}<br>${getDateFromDayOfYear(2023, this.series.name)}: <b>${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(this.y)}</b>
        `
      }
    },
    plotOptions: {
      series: {
        animation: false,
        groupPadding: 0,
        pointPadding: 0.1,
        borderWidth: 0,
        colorByPoint: true,
        dataSorting: {
          enabled: true,
          matchByName: true
        },
        type: 'bar',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [
      {
        type: 'bar',
        name: startYear,
        data: getData(startYear)[1],
        /*dataLabels: {
          enabled: true,
          useHTML: true,
          formatter: function() {
            //return `<div class="bar-label"><img src='assets/images/asins/${this.key}.jpg' alt="Imagen" /></div>`;
            return `<img src='assets/images/asins/${this.key}.jpg' style='height: 35px;width: 45px;'> ${this.y}`;
          }
        }*/
      }
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 550
        },
        chartOptions: {
          xAxis: {
            visible: false
          },
          subtitle: {
            x: 0
          },
          plotOptions: {
            series: {
              dataLabels: [{
                enabled: true,
                y: 8
              }, {
                enabled: true,
                format: '{point.name}',
                y: -8,
                style: {
                  fontWeight: 'normal',
                  opacity: 0.7
                }
              }]
            }
          }
        }
      }]
    }
  });
})();

/*
 * Pause the timeline, either when the range is ended, or when clicking the pause button.
 * Pausing stops the timer and resets the button to play mode.
 */
function pause(button) {
  button.title = 'play';
  button.className = 'fa fa-play';
  clearTimeout(chart.sequenceTimer);
  chart.sequenceTimer = undefined;
}

/*
 * Update the chart. This happens either on updating (moving) the range input,
 * or from a timer when the timeline is playing.
 */
function update(increment) {
  if (increment) {
    input.value = parseInt(input.value, 10) + increment;
  }
  if (input.value >= endYear) {
    // Auto-pause
    pause(btn);
  }

  chart.update(
    {
      subtitle: {
        text: getSubtitle()
      }
    },
    false,
    false,
    false
  );

  chart.series[0].update({
    name: input.value,
    data: getData(input.value)[1]
  });
}

/*
 * Play the timeline.
 */
function play(button) {
  button.title = 'pause';
  button.className = 'fa fa-pause';
  chart.sequenceTimer = setInterval(function () {
    update(1);
  }, 100);
}

btn.addEventListener('click', function (idx) {
  /*if(Number(input.value) == 10) {
    input.value = 1;
    update();
    return;
  }*/
  if (chart.sequenceTimer) {
    pause(this);
  } else {
    play(this);
  }
});
/*
 * Trigger the update on the range bar click.
 */
input.addEventListener('click', function () {
  update();
});

update();


})(jQuery);


