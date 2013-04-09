var gNightly = [];
var gNightlyTotal = 0;
var gAurora = [];
var gAuroraTotal = 0;
var gBeta = [];
var gBetaTotal = 0;

function processData(data)
{
  var re = /\('([^']*)', (\d+)\)\t(\d+)/;
  var lines = data.split('\n');
  $.each(lines, function(i, line) {
    m = re.exec(line);
    if (m == null)
      return;

    var channel = m[1];
    var bucket = parseInt(m[2]);
    var count = parseInt(m[3]);

    switch (channel) {
    case "nightly":
      gNightly.push([bucket, count]);
      gNightlyTotal += count;
      break;
    case "aurora":
      gAurora.push([bucket, count]);
      gAuroraTotal += count;
      break;
    case "beta":
      gBeta.push([bucket, count]);
      gBetaTotal += count;
      break;
    }
  });

  // Normalize to %
  $.each(gNightly, function (i, v) {
    var pct = v[1] / gNightlyTotal;
    v[1] = pct;
  });
  $.each(gAurora, function (i, v) {
    var pct = v[1] / gAuroraTotal;
    v[1] = pct;
  });
  $.each(gBeta, function (i, v) {
    var pct = v[1] / gBetaTotal;
    v[1] = pct;
  });
  $.plot('#chart', [
    {
      data: gBeta,
      bars: { show: true },
      label: "Beta",
    },
    {
      data: gAurora,
      bars: { show: true },
      label: "Aurora",
    },
    {
      data: gNightly,
      bars: { show: true },
      label: "Nightly",
    },
  ], {
    xaxis: {
      min: 0,
      max: 150,
      axisLabel: "telemetry size (kb)"
    },
    yaxis: {
      show: false
    },
  });
}

$.ajax('telemetry-sizedistribution-20130408.txt',
       {
         dataType: 'text',
         error: function() { alert("Error retrieving data"); },
         success: processData,
       });