var xValues = [0];
var yValues = [0];
const myChart = document.getElementById('myChart');

function updateChartTitle(newTitle) {
    chart.options.title.text = newTitle;
    chart.update();
    saveChartTitleToLocalStorage(newTitle);
}

function saveChartTitleToLocalStorage(chartTitle) {
    localStorage.setItem('chartTitle', chartTitle);
}

function loadChartTitleFromLocalStorage() {
    return localStorage.getItem('chartTitle') || "titulo";
}

function initializeChart() {
    const chartTitle = loadChartTitleFromLocalStorage();

    const chart = new Chart("myChart", {
      type: "line",
      data: {
          labels: xValues,
          datasets: [{
              fill: true,
              lineTension: 0,
              backgroundColor: "rgb(0, 91, 65)",
              borderColor: "rgb(0, 129, 112)",
              data: yValues
          }]
      },
      options: {
          legend: { display: false },
          title: {
              display: true,
              text: chartTitle,
              fontSize: 16,
              fontColor: "rgb(0, 129, 112)"
          },
          scales: {
              xAxes: [{
                  ticks: {
                      fontColor: "rgb(0, 129, 112)"
                  },
                  gridLines: {
                      color: "rgb(35, 45, 63)"
                  }
              }],
              yAxes: [{
                  ticks: {
                      fontColor: "rgb(0, 129, 112)"
                  },
                  gridLines: {
                      color: "rgb(35, 45, 63)"
                  }
              }]
          }
      }
  });
    return chart;
}

const chart = initializeChart();

function addData() {
    const newY = parseFloat(document.getElementById("dataInput").value) + yValues[yValues.length - 1];
    if (!isNaN(newY)) {
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const formattedDate = `${currentDay}/${currentMonth}/${currentYear}`;
        xValues.push(formattedDate);
        yValues.push(newY);

        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.update();
        document.getElementById("dataInput").value = '';
    } else {
        alert("Please enter a valid number for Y value.");
    }
}

function removeLastData() {
    xValues.pop();
    yValues.pop();

    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues;
    chart.update();
}

function resetData() {
    const confirmed = window.confirm("Are you sure you want to reset the graph?");
    if (confirmed === true) {
        xValues.length = 1;
        yValues.length = 1;
        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.update();
        updateChartTitle("titulo");
    }
}

function resizeGraph() {
    const sizeSelect = document.getElementById('sizeSelect');
    const size = sizeSelect.value;
    let width, height;
    switch (size) {
        case 'extrasmall':
            width = 200;
            height = 150;
            break;
        case 'small':
            width = 300;
            height = 200;
            break;
        case 'normal':
            width = 400;
            height = 300;
            break;
        case 'large':
            width = 600;
            height = 500;
            break;
        case 'extralarge':
            width = 800;
            height = 650;
            break;
        default:
            width = 400;
            height = 300;
    }
    myChart.style.width = width + 'px';
    myChart.style.height = height + 'px';
    chart.resize();
    localStorage.setItem('chartSize', size);
}

window.addEventListener('beforeunload', function() {
    localStorage.setItem('xValues', JSON.stringify(xValues));
    localStorage.setItem('yValues', JSON.stringify(yValues));
});

window.addEventListener('load', function() {
    const storedXValues = localStorage.getItem('xValues');
    const storedYValues = localStorage.getItem('yValues');
    if (storedXValues && storedYValues) {
        xValues = JSON.parse(storedXValues);
        yValues = JSON.parse(storedYValues);
        chart.data.labels = xValues;
        chart.data.datasets[0].data = yValues;
        chart.update();
    }
    const chartSize = localStorage.getItem('chartSize');
    if (chartSize) {
        document.getElementById('sizeSelect').value = chartSize;
        resizeGraph();
    }
});

document.getElementById('sizeSelect').addEventListener('change', resizeGraph);
document.getElementById('addData').addEventListener('click', addData);
document.getElementById('resetData').addEventListener('click', resetData);
document.getElementById('removeLastData').addEventListener('click', removeLastData);

document.getElementById('graphTitle').addEventListener('input', function(event) {
    const newTitle = event.target.value;
    updateChartTitle(newTitle);
    saveChartTitleToLocalStorage(newTitle);
});

