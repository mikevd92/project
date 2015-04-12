var myApp = angular.module('myApp', []);

/*
 $compile scope worth mentioning and pretty cool
  Big test for commit
 */

// donut link function
var link = function donutLink()
{
    function link(scope, el, attr)
    {

        var color = d3.scale.category20();
        var width = scope.h;
        var height = scope.w;
        var min = Math.min(width, height);
        var r = min / 2;
        var labelr = r + 30;
        var svg = d3.select(el[0]).append('svg');
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
                .outerRadius(min / 2 * 0.9)
                .innerRadius(min / 2 * 0.5);

        svg.attr({width: width + 150, height: height + 150});
        // group for arcs
        var arc_group = svg.append('g')
                .attr("class", "arc_group")
                .attr('transform', 'translate(' + (width / 2 + 100) + ',' + (height / 2 + 100) + ')');
        // group for labels
        var label_group = svg.append("g")
                .attr("class", "label_group")
                .attr("transform", "translate(" + (width / 2 + 100) + "," + (height / 2 + 100) + ")");
        var paths = arc_group.selectAll('path');
        var texts = label_group.selectAll('text');


        scope.$watch('data', function (data) {
            if (!data) {
                return;
            }

            paths = paths.data(pie(data));
            texts = texts.data(pie(data));

            paths.exit().remove();
            texts.exit().remove();

            paths.enter().append("path")
                    .attr("d", arc)
                    .on("mouseover", function (d) {
                        d3.select(this).transition().duration(100).style("fill-opacity", .5);
                    })
                    .on("mouseout", function (d) {
                        d3.select(this).transition().duration(100).style("fill-opacity", 1);
                    }).attr("pointer-events", "none")
                    .transition().duration(300).ease("circle")
                    .attrTween('d', function (d) {
                        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .each("end", function () {
                        d3.select(this).attr("pointer-events", null);
                    });
            texts.enter().append("text")
                    .attr("transform", function (d) {
                        return "translate(" + arc.centroid(d) + ")";
                    })
                    .attr("dy", ".35em")
                    .attr("class", "norm")
                    .style("text-anchor", "middle")
                    .text(function (d) {
                        if (d.data != 0)
                            return " " + d.data + " ";
                    });

            paths.attr("d", arc)
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .on("mouseover", function (d) {
                        d3.select(this).transition().duration(100).style("fill-opacity", .5);
                    })
                    .on("mouseout", function (d) {
                        d3.select(this).transition().duration(100).style("fill-opacity", 1);
                    })
                    .attr("pointer-events", "none")
                    .transition().duration(300)
                    .ease("circle")
                    .attrTween('d', function (d) {
                        var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                        return function (t) {
                            d.endAngle = i(t);
                            return arc(d);
                        }
                    })
                    .each("end", function () {
                        d3.select(this).attr("pointer-events", null);
                    });

            texts
                    .attr("class", "norm")
                    .attr("transform", function (d) {
                        var c = arc.centroid(d),
                                x = c[0],
                                y = c[1],
                                // pythagorean theorem for hypotenuse
                                h = Math.sqrt(x * (x+ 10) + y *y);
                        return "translate(" + (x / h * labelr) + ',' +
                                (y / h * labelr) + ")";
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", function (d) {
                        return (d.endAngle + d.startAngle) / 2 > 3 * Math.PI ?
                                "end" : "start";
                    })
                    .text(function (d) {
                        if (d.data != 0)
                            return " " + d.data + " ";
                    });
        },
                true);
    }
    return {
        link: link,
        restrict: 'E',
        scope: {data: '=', h: '=', w: '='}
    };
}
// legend link function
var legend = function legendLink()
{
    function link(scope, el, attr)
    {
        width = 400;
        height = 400;

        var color = d3.scale.category20();
        var svg = d3.select(el[0]).append('svg').attr("id","legend");

        // group for rects
        var rect_group = svg.append('g')
                .attr("class", "arc_group");
        // group for labels
        var label_group = svg.append("g")
                .attr("class", "label_group");

        var rects = rect_group.selectAll("rect");
        var texts = label_group.selectAll("text");

        scope.$watch('data', function (data) {
            if (!data) {
                return;
            }

            height = data.length * 20;
            width = d3.max(data, function (d) {
                return d.length;
            }) * 10 + 60;
            svg.attr({width: width, height: height});
            rects = rects.data(data);
            texts = texts.data(data);

            rects.exit().remove();
            texts.exit().remove();

            rects.enter().append("rect")
                    .attr("x", width - 18)
                    .attr("width", 21)
                    .attr("height", 30)
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

            texts.enter().append("text")
                    .attr("x", width)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    })
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

            rects.attr("x", width - 18)
                    .attr("width", 21)
                    .attr("height", 30)
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

            texts.attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    })
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

        },
                true);
    }
    return {
        link: link,
        restrict: 'E',
        scope: {data: '='}
    };
}

// map link function

var map = function mapLink()
{
    function link(scope, el, attr)
    {
        var width = 500,
                height = 500;
        var clicked = false;

        var linearColorScale = d3.scale.linear()
                .domain([0.0, 100.0])
                .range(["white", "red"]);

        var svg = d3.select(el[0]).append("svg")
                .attr("width", width - 103)
                .attr("height", height);
        // Setup the map projection for a good depiction of The Netherlands. The
        // projection is centered on the geographical center of the country, which
        // happens to be the city of Lunteren.
        var projection = d3.geo.albers()
                .rotate([0, 0])
                .center([5.6, 52.1])
                .parallels([50, 52.5])
                .scale(9000)
                .translate([width / 2, height / 2]);
        var blueRegion;
        var path = d3.geo.path().projection(projection);

        var g = svg.append("g");
        var paths = g.selectAll("path");
        var mapData;

        scope.$watch('datacities', function (data) {
            if (!data) {
                return;
            }

            var cityData = d3.map();
            data.array.forEach(function (element, index, array) {
                cityData.set(element.code, +element.data);
            });
            var maxValue = d3.max(cityData.values());
            /*console.log("The maximum value is " + maxValue);*/
            linearColorScale.domain([0.0, maxValue]);
            if (typeof mapData !== null) {
                mapData = scope.mapdata;
                paths = paths.data(mapData.features);

                paths.enter()
                        .append("path")
                        .attr("class", "map")
                        .attr("id", function (d) {
                            return d.gm_code;
                            console.log(d);
                        })
                        .attr("d", path)
                        .on("click", function () {
                            if (clicked === false) {
                                paths.on("mouseenter", null);
                                clicked = true;
                            } else {
                                paths.style("fill", function (d) {
                                    return linearColorScale(cityData.get(d.gm_code));
                                });
                                blueRegion = d3.select(this);
                                blueRegion.transition().ease("circle").duration(1).style("fill", "blue");

                                scope.$parent.$apply(function () {
                                    scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                        return el.code === d.gm_code;
                                    })[0];
                                    scope.$parent.selectCity();
                                });
                                paths.on('mouseenter', function (d) {
                                    paths.style("fill", function (d) {
                                        return linearColorScale(cityData.get(d.gm_code));
                                    });
                                    blueRegion = d3.select(this);
                                    blueRegion.transition().ease("circle").duration(1).style("fill", "blue");

                                    scope.$parent.$apply(function () {
                                        scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                            return el.code === d.gm_code;
                                        })[0];
                                        scope.$parent.selectCity();
                                    });
                                });
                                clicked = false;
                            }
                        })
                        .on('mouseenter', function (d) {
                            paths.transition().style("fill", function (d) {
                                return linearColorScale(cityData.get(d.gm_code));
                            });
                            blueRegion = d3.select(this);
                            blueRegion.transition().ease("circle").duration(1).style("fill", "blue");
                            scope.$parent.$apply(function () {
                                scope.$parent.city = scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                    return el.code === d.gm_code;
                                })[0];
                                scope.$parent.selectCity();
                            });
                        })
                        .style("fill", function (d) {
                            return linearColorScale(cityData.get(d.gm_code));
                        })
                        .append("title").text(function (d) {
                    return d.gm_naam + ", " +
                            cityData.get(d.gm_code);
                });
            }

            paths
                    .attr("d", path)
                    .on("click", function (d) {
                        if (clicked === false) {
                            paths.on("mouseenter", null);
                            clicked = true;
                        } else {
                            paths.transition().style("fill", function (d) {
                                return linearColorScale(cityData.get(d.gm_code));
                            });
                            blueRegion = d3.select(this);
                            blueRegion.transition().ease("circle").duration(1).style("fill", "blue");

                            scope.$parent.$apply(function () {
                                scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                    return el.code === d.gm_code;
                                })[0];
                                scope.$parent.selectCity();
                            });
                            paths.on('mouseenter', function (d) {
                                paths.style("fill", function (d) {
                                    return linearColorScale(cityData.get(d.gm_code));
                                });
                                blueRegion = d3.select(this);
                                blueRegion.transition().ease("circle").duration(1).style("fill", "blue");

                                scope.$parent.$apply(function () {
                                    scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                        return el.code === d.gm_code;
                                    })[0];
                                    scope.$parent.selectCity();
                                });
                            });
                            clicked = false;
                        }
                    })
                    .on('mouseenter', function (d) {
                        paths.style("fill", function (d) {

                            return linearColorScale(cityData.get(d.gm_code));
                        });
                        blueRegion = d3.select(this);
                        blueRegion.transition().ease("circle").duration(1).style("fill", "blue");

                        scope.$parent.$apply(function () {
                            scope.$parent.city = scope.$parent.optionsCity.filter(function (el, index, array) {
                                return el.code === d.gm_code;
                            })[0];
                            scope.$parent.selectCity();
                        });
                    })
                    .attr("class", "map")
                    .attr("id", function (d) {
                        return d.gm_code;
                    })
                    .style("fill", function (d) {
                        return linearColorScale(cityData.get(d.gm_code));
                    });
            paths.on("mouseenter", null);
            clicked = true;
            if (typeof scope.region !== 'undefined')
                blueRegion = scope.region;
            if (typeof blueRegion !== 'undefined')
                blueRegion.transition().ease("circle").duration(1).style("fill", "blue");
        }, true);
    }
    return {
        link: link,
        restrict: 'E',
        scope: {datacities: '=', mapdata: '=', region: '='}
    };
}

var scatter = function scatterLink()
{
    function link(scope, el, attr)
    {

        var margin = {
            top: 20,
            right: 60, //20
            bottom: 30,
            left: 90
        },
        width = 1025 - margin.left - margin.right,
                height = 1000 - margin.top - margin.bottom;

        var variableX = "X";
        var variableY = "Y";

        //x scale
        var x = d3.scale.linear()
                .range([0, width]);
        //y scale
        var y = d3.scale.linear()
                .range([height, 0]);
        //有关颜色
        var color = d3.scale.category10();
        //fisheye 
        // var fisheye = d3.fisheye.circular().radius(120);
        //axi
        var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
        //axi
        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
        //new a svg
        var svg = d3.select(el[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "main")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "chartArea");

        svg.append("g")
                .attr("class", "x_axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("number of " + variableX);

        var xGroup = svg.select('.x_axis');
        var xLabel = xGroup.select('.label');

        svg.append("g")
                .attr("class", "y_axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("number of " + variableY);

        var yGroup = svg.select('.y_axis');
        var yLabel = yGroup.select('.label');

        var fisheye = d3.fisheye.circular().radius(200).distortion(7);
        var chartArea = d3.select(".chartArea");

        var circles = d3.select(".main").selectAll("circle");

        scope.$watch('data', function (data) {

            if (!data) {
                return;
            }

            variableX = data.xName;
            variableY = data.yName;

            x.domain(d3.extent(data.scatter, function (d) {
                return d.x;
            })).nice();
            // console.log(d3.extent(data,function(d){ return d.OPP_TOT;}));
            y.domain(d3.extent(data.scatter, function (d) {
                return d.y;
            })).nice();
            var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
            //axis
            var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");
            xGroup.call(xAxis);
            yGroup.call(yAxis);
            xLabel.text("number of " + variableX);
            yLabel.text("number of " + variableY);

            circles = circles.data(data.scatter);
            //console.log("in scatter");

            circles
                    .enter()
                    .append("circle")
                    .attr("r", function (d) {
                        var rv = ((-1) * (d.STED) + 5) * 2;
                        return rv;
                    })
                    .datum(function (d) {
                        return {
                            STED: d.STED,
                            key: d.Naam,
                            x: x(d.x),
                            y: y(d.y)
                        }
                    })
                    .attr("cx", function (d) {
                        return d.x
                    })
                    .attr("cy", function (d) {
                        return d.y
                    })
                    .style("fill", function (d) {
                        return color(d.STED);
                    })
                    //鼠标放上去的效果
                    .on("mouseover", function (d, i) {
                        var str = d.key + " :Number of " + variableX + " is " + d.x.toFixed(2) + " Number of " + variableY + " is " + d.y.toFixed(2);
                        d3.select(".information").text(str);
                        d3.select(this)
                                .style("fill", "red")
                                .style("opacity", 1)
                    })
                    //鼠标移开的效果
                    .on("mouseout", function (d, i) {
                        d3.select(this)
                                .style("fill", function (d) {
                                    return color(d.STED);
                                })
                                .style("opacity", 0.1)
                    });
            //console.log(circles);
            circles = circles.data(data.scatter);
            circles.attr("r", function (d) {
                var rv = ((-1) * (d.STED) + 5) * 2;
                return rv;
            })
                    .datum(function (d) {
                        return {
                            key: d.Naam,
                            x: x(d.x),
                            y: y(d.y)
                        }
                    })
                    .attr("cx", function (d) {
                        return d.x
                    })
                    .attr("cy", function (d) {
                        return d.y
                    })
                    .style("fill", function (d) {
                        return color(d.STED);
                    })
                    //鼠标放上去的效果
                    .on("mouseover", function (d, i) {
                        var str = d.key + " :Number of " + variableX + " is " + d.x.toFixed(2) + " Number of " + variableY + " is " + d.y.toFixed(2);
                        d3.select(".information").text(str);
                        d3.select(this)
                                .style("fill", "red")
                                .style("opacity", 1)
                    })
                    //鼠标移开的效果
                    .on("mouseout", function (d, i) {
                        d3.select(this)
                                .style("fill", function (d) {
                                    return color(d.STED);
                                })
                                .style("opacity", 0.1)
                    });

            //     var fisheyeCircle = svg.selectAll("circle")
            //     .data(data)
            //     .enter()
            // // fish eye
            chartArea.on("mousemove", function () {

                fisheye.focus(d3.mouse(this));

                circles.each(function (d) {
                    d.fisheye = fisheye(d);
                })
                        .attr("cx", function (d) {
                            return d.fisheye.x;
                        })
                        .attr("cy", function (d) {
                            return d.fisheye.y;
                        });

            });
            //lengend means 图示！
            var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

            // legend.append("rect")
            //     .attr("x", width - 18)
            //     .attr("width", 18)
            //     .attr("height", 18)
            //     .style("fill", color);

            legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text("")
                    .classed("information", true);

        }, true);
    }
    return {
        link: link,
        restrict: 'E',
        scope: {data: '='}
    };
}

//d3 directives
myApp.directive('donutChart', link);
myApp.directive('legendChart', legend);
myApp.directive('mapChart', map);

myApp.directive('scatterChart', scatter);

// ng-controller
myApp.controller('MainCtrl', function ($scope, myFactory) {

    var range95 = [
        "age between 0 and 4",
        "age between 5 and 9",
        "age between 10 and 14",
        "age between 15 and 19",
        "age between 20 and 25",
        "age between 25 and 29",
        "age between 30 and 34",
        "age between 35 and 39",
        "age between 40 and 44",
        "age between 45 and 49",
        "age between 50 and 54",
        "age between 55 and 59",
        "age between 60 and 65",
        "age greater or equal then 65 ",
    ];
    var range65 = [
        "age between 0 and 14",
        "age between 15 and 24",
        "age between 25 and 44",
        "age between 45 and 64",
        "age greater or equal then 65"
    ];
    var rangeForeigner = [
        "from Europe, North-America, Oceania, Indonesia, and Japan",
        "not from Europe, North-America, Oceania, Indonesia, and Japan",
        "from Morocco, Ifni, Spanish Sahara, and Western Sahara",
        "from the Dutch Antilles and Aruba",
        "from Surinam",
        "from Turkey",
        "from other countries",
        "native"
    ];
    var rangeMarital = [
        "unmarried people",
        "married people",
        "divorced people",
        "widows and widowers"
    ];
    var rangeHouse = [
        "single households",
        "households without children",
        "households with children"
    ];

    var percentageData65 = [];
    var percentageData95 = [];
    var percentageDataMarital = [];
    var percentageDataForeigner = [];
    var percentageDataHouse = [];
    var citiesData = [];
    var codes = [];
    var percentageSum = 0;

    //The official name of the municipality.
    var t = d3.select("#cool")[0][0];
    var t1 = d3.select("#cool1")[0][0];
    var child;
    var option;
    var code;
    var stedNameData;

    $scope.options = [{name: "small"}, {name: "large"}];
    $scope.optionsCity = [];

    $scope.selectCity = function () {

        index = $scope.city.id;
        code = $scope.city.code;

        if ($scope.option.name === 'large')
            $scope.donutDataAge = percentageData65[index];
        else
            $scope.donutDataAge = percentageData95[index];

        $scope.donutDataForeigner = percentageDataForeigner[index];
        $scope.donutDataHouse = percentageDataHouse[index];
        $scope.donutDataMarital = percentageDataMarital[index];

        if ((typeof $scope.blueRegion !== 'undefined') && (typeof oldStyle !== 'undefined'))
            $scope.blueRegion.transition().ease("linear").duration(1).style("fill", oldStyle);

        $scope.blueRegion = d3.select("path#" + code);

        oldStyle = $scope.blueRegion.attr("style").split("fill: ")[1].split(";")[0];
        $scope.blueRegion.transition().ease("linear").duration(1).style("fill", "blue");

        if ((option === "age") || (typeof option === 'undefined')) {
            $scope.bigData = $scope.donutDataAge;
            $scope.bigLegend = $scope.legendDataAge;
            
        } else if (option === "foreigner") {
            $scope.bigData = $scope.donutDataForeigner;
            $scope.bigLegend = $scope.legendDataForeigner;
             
        } else if (option === "house") {
            $scope.bigData = $scope.donutDataHouse;
            $scope.bigLegend = $scope.legendDataHouse;
             
        } else if (option === "marital") {
            $scope.bigData = $scope.donutDataMarital;
            $scope.bigLegend = $scope.legendDataMarital;
             
        }

    }
    $scope.changeScatter = function () {

        $scope.scatterData = {xName: $scope.optionScatter1.name, yName: $scope.optionScatter2.name,
            scatter: $scope.optionScatter1.array.map(function (node, i) {
                return {x: node, y: $scope.optionScatter2.array[i], STED: stedNameData[i][1], Naam: stedNameData[i][0]};
            })};
    }
    $scope.displayAge = function () {

        $scope.bigData = $scope.donutDataAge;
        $scope.bigLegend = $scope.legendDataAge;
        option = "age";  
        $scope.title = "Age statistics";
    };
    $scope.displayForeigner = function () {

        $scope.bigData = $scope.donutDataForeigner;
        $scope.bigLegend = $scope.legendDataForeigner;
        option = "foreigner";
        $scope.title = "Foreigner statistics";
    };
    $scope.displayHouse = function () {

        $scope.bigData = $scope.donutDataHouse;
        $scope.bigLegend = $scope.legendDataHouse;
        option = "house";
        $scope.title = "House statistics";
    }
    $scope.displayMarital = function () {

        $scope.bigData = $scope.donutDataMarital;
        $scope.bigLegend = $scope.legendDataMarital;
        option = "marital";
        $scope.title = "Marital statistics";
    }
    $scope.selectAgeGroups = function () {

        if ($scope.option.name === 'small') {
            $scope.donutDataAge = percentageData95[index];
            $scope.legendDataAge = range95;
            if ((option === "age") || (typeof option === 'undefined')) {
                $scope.bigData = $scope.donutDataAge;
                $scope.bigLegend = $scope.legendDataAge;
            }
        } else if ($scope.option.name === 'large') {
            $scope.donutDataAge = percentageData65[index];
            $scope.legendDataAge = range65;
            if ((option === "age") || (typeof option === 'undefined')) {
                $scope.bigData = $scope.donutDataAge;
                $scope.bigLegend = $scope.legendDataAge;
            }
        }
    }
   
    myFactory.await(function (err, mapData, data) {
        if (err) {
            throw err;
        }
        data.pop();

        mapData.features = mapData.features.filter(function (el, index, array) {
            return el.gm_code !== "GM0366" && el.gm_code !== "GM0412" && el.gm_code !== "GM0462" && el.gm_code !== "GM0463";
        });
        var kroon = data.filter(function (el, index, array) {
            return el.Code === "GM1911";
        })[0];

        var kroonObject = {
            type: "Feature",
            gm_naam: kroon.GM_NAAM,
            gm_code: kroon.GM_CODE,
            geometry: {type: "MultiPolygon", coordinates: [[[[4.810434570139061, 52.911402640876965], [4.816415637793847, 52.908735398074924], [4.843293421109192, 52.89897558376759], [4.855236465234257, 52.89453608720412], [4.867177083102685, 52.89009538727591], [4.874626874632309, 52.888330280894465], [4.876666537972743, 52.88752037537653], [4.879104822946141, 52.88655210046796], [4.879104822946146, 52.886552100467966], [4.876666537972724, 52.88752037537659], [4.87462687463229, 52.888330280894486], [4.883530603646167, 52.88926683209356], [4.90725271704058, 52.8938578297515], [4.919081935999267, 52.89929672150512], [4.933905261411133, 52.90294852022543], [4.93398241501696, 52.90297221268367], [4.939831604344771, 52.90476817117886], [4.954578383906904, 52.91650494670012], [4.957498609727978, 52.92190737222554], [4.957592828203788, 52.92214104732301], [4.95895017414033, 52.92550716980494], [4.967828764993036, 52.93003188803111], [4.986506604082346, 52.93183388545478], [4.987144836319877, 52.93189540647998], [4.997531049413515, 52.93462565299672], [5.003472259195905, 52.93554351962537], [5.012411565717394, 52.93377460748275], [5.014859408332971, 52.933782259502216], [5.015386068109577, 52.933783899296714], [5.021327541095855, 52.934700878311325], [5.024287158354388, 52.93650718312359], [5.027247020814647, 52.93831341388377], [5.036178704049291, 52.9374413417619], [5.041353345188814, 52.934861457009255], [5.045138215228504, 52.93297412398577], [5.052615705184257, 52.92760345086821], [5.051149420429558, 52.92490341195435], [5.04964856571145, 52.92669646481266], [5.048147587468701, 52.92848949778675], [5.042170866570783, 52.93206695339063], [5.039203641494137, 52.931159708951824], [5.037781243091722, 52.923067782236714], [5.037788437686978, 52.9221691603358], [5.039282460036, 52.92127487697351], [5.043721730093543, 52.92398364928982], [5.048175514203079, 52.92489501118307], [5.049662467152103, 52.92489922082487], [5.04818249506166, 52.92399638895302], [5.073679680945446, 52.89351207859292], [5.076657843734275, 52.89262121047188], [5.079648537872116, 52.88993300161075], [5.079667514778249, 52.88723710071983], [5.102128533088642, 52.860333244248416], [5.105121244316614, 52.85674572742385], [5.111110863747479, 52.84867181142396], [5.114102038333162, 52.84508405676558], [5.104171497565113, 52.77406610797427], [5.099731877050128, 52.77315680704774], [5.093972846002194, 52.769635848433424], [5.093828705219215, 52.769547712723345], [5.090865337386157, 52.76954038217917], [5.090446757604848, 52.76953934078809], [5.083456922833382, 52.76952173332331], [5.083440723944898, 52.7695195066573], [5.070134792448582, 52.7676896798971], [5.061803226368794, 52.760888484575645], [5.061298520292467, 52.76047639782392], [5.05687470620934, 52.757768170753685], [5.046540641118499, 52.75324565841722], [5.033816679420137, 52.75235031689483], [5.033217757017871, 52.75230813837999], [5.021376507692253, 52.75137368493185], [4.996190507913109, 52.752192377623764], [4.987445297374888, 52.7521633562761], [4.987304002350238, 52.752162882110895], [4.956192513566705, 52.75295308271313], [4.954684823188845, 52.75564368329302], [4.945815744886255, 52.75381378005869], [4.945815744886246, 52.75381378005863], [4.945423434340241, 52.75357282480598], [4.94434368655234, 52.75290962849985], [4.939927875801828, 52.75019706379116], [4.932532149548287, 52.74927037739514], [4.932486871734259, 52.749038752567714], [4.931125920022273, 52.74207547087579], [4.927039968568907, 52.7370360752754], [4.926740308972333, 52.736666439790426], [4.900783824599827, 52.70911034844148], [4.900399504275115, 52.70870204033229], [4.898939884284505, 52.7068986589824], [4.878163852623198, 52.71220385028719], [4.872202831445177, 52.71577302231327], [4.861779467624478, 52.72111969040017], [4.858797806689283, 52.72290389823924], [4.852877516259816, 52.72287747899712], [4.846990411417301, 52.72015480966952], [4.848426273981986, 52.72375612299073], [4.849636100134818, 52.72525295619353], [4.849884373937646, 52.725560113805095], [4.844128337514044, 52.73242026152864], [4.843874738810273, 52.73272244887643], [4.839411099891215, 52.7344994004605], [4.831872324158743, 52.74524887226308], [4.831619949602548, 52.74547482259947], [4.816888869957811, 52.758658530553596], [4.816740971188366, 52.75880543236484], [4.812386153609179, 52.763130367683544], [4.807894392775462, 52.76670339165244], [4.806368545275988, 52.77028293245841], [4.806378059789241, 52.7702923451064], [4.813761790533049, 52.771225239595175], [4.816736879626418, 52.77034082646866], [4.821193486847949, 52.7694633855667], [4.819653672838515, 52.77394952273209], [4.820117111094181, 52.77399863546666], [4.828532965980604, 52.774890170507405], [4.826936264127916, 52.78386957377203], [4.831241909257664, 52.78388973516185], [4.831382646675308, 52.78389039154546], [4.832671425241074, 52.799174067364724], [4.832691037528683, 52.79930291644549], [4.834040568094434, 52.80816726423465], [4.812961069620398, 52.83233199884689], [4.812841296930147, 52.83250924572431], [4.809934256828409, 52.83681077815186], [4.8098351562605, 52.83688163412823], [4.802662889042644, 52.842008904661796], [4.794949121081409, 52.847521446070076], [4.783025262637874, 52.85105636567725], [4.759316063177434, 52.84913775415683], [4.759300832901432, 52.849136520113795], [4.770757373565977, 52.878852483674805], [4.777684589713664, 52.887414274682236], [4.778058773829192, 52.887876645569], [4.782178917994345, 52.89469553544654], [4.782416171366551, 52.895088123405415], [4.788200194757513, 52.902231633705846], [4.788261142374794, 52.90230689258079], [4.795557889945122, 52.91222853404956], [4.79704436798173, 52.912235888116655], [4.797307863618394, 52.912173678193675], [4.804500759372845, 52.910475179865024], [4.808912401583367, 52.914091255752375], [4.811897335564356, 52.91320701218009], [4.810422695971634, 52.91230124203643], [4.810434570139061, 52.911402640876965]], [[5.031892216288125, 52.91586126315693], [5.034763119747904, 52.92204922162608], [5.034814721268011, 52.92216042703444], [5.034763119747904, 52.92204922162613], [5.031892216288125, 52.91586126315693]], [[4.876165120169445, 52.883843571333266], [4.876165120169429, 52.88384357133325], [4.880250137123177, 52.882017234237644], [4.876165120169445, 52.883843571333266]], [[4.893396877894014, 52.876380171529306], [4.90300429490545, 52.87496882965698], [4.906874335937882, 52.87358497316276], [4.903004294905432, 52.87496882965699], [4.893396877894014, 52.876380171529306]], [[4.926639599589289, 52.779911636635575], [4.935225552062875, 52.77534255796491], [4.935225552062859, 52.77534255796494], [4.926639599589289, 52.779911636635575]], [[4.936147131715621, 52.77370001712792], [4.938244497699091, 52.769961860292845], [4.947197704280764, 52.76370445413359], [4.947197704280768, 52.763704454133624], [4.938244497699073, 52.76996186029289], [4.936147131715621, 52.77370001712792]]], [[[5.05402727723556, 52.93749243172289], [5.048077747524356, 52.93747569804304], [5.049544262999945, 52.94017576511282], [5.058442022521985, 52.943795119229414], [5.165266383705513, 52.99975596827793], [5.16676045384326, 52.998860111435626], [5.05993636383116, 52.94290058332694], [5.05402727723556, 52.93749243172289]]]]},
            properties: {gm_naam: kroon.GM_NAAM}
        };
        mapData.features.push(kroonObject);
        $scope.mapData = mapData;

        while (percentageData65.push([]) < data.length)
            ;
        while (percentageData95.push([]) < data.length)
            ;
        while (percentageDataMarital.push([]) < data.length)
            ;
        while (percentageDataForeigner.push([]) < data.length)
            ;
        while (percentageDataHouse.push([]) < data.length)
            ;

        var length = data.length;
        for (i = 0; i < length; i++) {
            $scope.optionsCity.push({name: data[i].GM_NAAM, code: data[i].GM_CODE, id: i});
        }
        $scope.optionsMap = [
            {name: 'Average number of addresses per km2', array: data.map(function (node) {
                    return {code: node.Code, data: node.OAD};
                })},
            {name: 'Number of inhabitants', array: data.map(function (node) {
                    return {code: node.Code, data: node.AANT_INW};
                })},
            {name: 'Number of Men', array: data.map(function (node) {
                    return {code: node.Code, data: node.AANT_MAN};
                })},
            {name: 'Number of Women', array: data.map(function (node) {
                    return {code: node.Code, data: node.AANT_VROUW};
                })},
            {name: 'Number of inhabitants per km2', array: data.map(function (node) {
                    return {code: node.Code, data: node.BEV_DICHTH};
                })},
            {name: 'Number of households', array: data.map(function (node) {
                    return {code: node.Code, data: node.AANTAL_HH};
                })},
            {name: 'Number of cars', array: data.map(function (node) {
                    return {code: node.Code, data: node.AUTO_TOT};
                })},
            {name: 'Average number of people in all households', array: data.map(function (node) {
                    return {code: node.Code, data: node.GEM_HH_GR};
                })},
            {name: 'Number of cars per household', array: data.map(function (node) {
                    return {code: node.Code, data: node.AUTO_HH};
                })},
            {name: 'Number of cars per km2', array: data.map(function (node) {
                    return {code: node.Code, data: node.AUTO_LAND};
                })},
            {name: 'Number of company cars', array: data.map(function (node) {
                    return {code: node.Code, data: node.BEDR_AUTO};
                })},
            {name: 'Number of motorcycles', array: data.map(function (node) {
                    return {code: node.Code, data: node.MOTOR_2W};
                })},
            {name: 'Total land and water area in hectares', array: data.map(function (node) {
                    return {code: node.Code, data: node.OPP_TOT};
                })},
            {name: 'Land area in hectares', array: data.map(function (node) {
                    return {code: node.Code, data: node.OPP_LAND};
                })},
            {name: 'Water area in hectares', array: data.map(function (node) {
                    return {code: node.Code, data: node.OPP_WATER};
                })}
        ];

        stedNameData = data.map(function (node) {
            return [node.Naam, parseInt(node.STED)];
        });

        $scope.optionsScatter = [
            {name: 'Average number of addresses per km2', array: data.map(function (node) {
                    return +node.OAD;
                })},
            {name: 'Number of inhabitants', array: data.map(function (node) {
                    return +node.AANT_INW;
                })},
            {name: 'Number of Men', array: data.map(function (node) {
                    return +node.AANT_MAN;
                })},
            {name: 'Number of Women', array: data.map(function (node) {
                    return +node.AANT_VROUW;
                })},
            {name: 'Number of inhabitants per square kilometer', array: data.map(function (node) {
                    return +node.BEV_DICHTH;
                })},
            {name: 'Number of households', array: data.map(function (node) {
                    return +node.AANTAL_HH;
                })},
            {name: 'Number of cars', array: data.map(function (node) {
                    return +node.AUTO_TOT;
                })},
            {name: 'Average number of people in all households', array: data.map(function (node) {
                    return +node.GEM_HH_GR;
                })},
            {name: 'Number of cars per household', array: data.map(function (node) {
                    return +node.AUTO_HH;
                })},
            {name: 'Number of cars per km2', array: data.map(function (node) {
                    return +node.AUTO_LAND;
                })},
            {name: 'Number of company cars', array: data.map(function (node) {
                    return +node.BEDR_AUTO;
                })},
            {name: 'Number of motorcycles', array: data.map(function (node) {
                    return +node.MOTOR_2W;
                })},
            {name: 'Land water area', array: data.map(function (node) {
                    return +node.OPP_TOT;
                })},
            {name: 'Land area in hectares', array: data.map(function (node) {
                    return +node.OPP_LAND;
                })},
            {name: 'Water area in hectares', array: data.map(function (node) {
                    return +node.OPP_WATER;
                })}
        ];

        $scope.citiesData = $scope.optionsMap[0];

        $scope.optionsCity.sort(function (a, b) {
            return d3.ascending(a.name, b.name);
        });

        $scope.city = $scope.optionsCity[136];
        index = $scope.city.id;

        for (i = 0; i < data.length - 1; i++) {

            percentageData95[i][0] = parseFloat(data[i].P_00_04_JR);
            percentageData95[i][1] = parseFloat(data[i].P_05_09_JR);
            percentageData95[i][2] = parseFloat(data[i].P_10_14_JR);
            percentageData95[i][3] = parseFloat(data[i].P_15_19_JR);
            percentageData95[i][4] = parseFloat(data[i].P_20_24_JR);
            percentageData95[i][5] = parseFloat(data[i].P_25_29_JR);
            percentageData95[i][6] = parseFloat(data[i].P_30_34_JR);
            percentageData95[i][7] = parseFloat(data[i].P_35_39_JR);
            percentageData95[i][8] = parseFloat(data[i].P_40_44_JR);
            percentageData95[i][9] = parseFloat(data[i].P_45_49_JR);
            percentageData95[i][10] = parseFloat(data[i].P_50_54_JR);
            percentageData95[i][11] = parseFloat(data[i].P_55_59_JR);
            percentageData95[i][12] = parseFloat(data[i].P_60_65_JR);
            percentageData95[i][13] = parseFloat((parseFloat(data[i].P_65_69_JR)
                    + parseFloat(data[i].P_70_74_JR)
                    + parseFloat(data[i].P_75_79_JR)
                    + parseFloat(data[i].P_80_84_JR)
                    + parseFloat(data[i].P_85_89_JR)
                    + parseFloat(data[i].P_90_94_JR)
                    + parseFloat(data[i].P_95_EO_JR)).toFixed(1));

            percentageData65[i][0] = parseFloat(data[i].P_00_14_JR);
            percentageData65[i][1] = parseFloat(data[i].P_15_24_JR);
            percentageData65[i][2] = parseFloat(data[i].P_25_44_JR);
            percentageData65[i][3] = parseFloat(data[i].P_45_64_JR);
            percentageData65[i][4] = parseFloat(data[i].P_65_EO_JR);

            percentageDataForeigner[i][0] = parseFloat(data[i].P_WEST_AL);
            percentageSum += percentageDataForeigner[i][0];
            percentageDataForeigner[i][1] = parseFloat(data[i].P_N_W_AL);
            percentageSum += percentageDataForeigner[i][1];
            percentageDataForeigner[i][2] = parseFloat(data[i].P_MAROKKO);
            percentageSum += percentageDataForeigner[i][2];
            percentageDataForeigner[i][3] = parseFloat(data[i].P_ANT_ARU);
            percentageSum += percentageDataForeigner[i][3];
            percentageDataForeigner[i][4] = parseFloat(data[i].P_SURINAM);
            percentageSum += percentageDataForeigner[i][4];
            percentageDataForeigner[i][5] = parseFloat(data[i].P_TURKIJE);
            percentageSum += percentageDataForeigner[i][5];
            percentageDataForeigner[i][6] = parseFloat(data[i].P_OVER_NW);
            percentageSum += percentageDataForeigner[i][6];
            percentageDataForeigner[i][7] = parseFloat(100 - percentageSum);
            percentageSum = 0;

            percentageDataHouse[i][0] = parseFloat(data[i].P_EENP_HH);
            percentageDataHouse[i][1] = parseFloat(data[i].P_HH_Z_K);
            percentageDataHouse[i][2] = parseFloat(data[i].P_HH_M_K);

            percentageDataMarital[i][0] = parseFloat(data[i].P_ONGEHUWD);
            percentageDataMarital[i][1] = parseFloat(data[i].P_GEHUWD);
            percentageDataMarital[i][2] = parseFloat(data[i].P_GESCHEID);
            percentageDataMarital[i][3] = parseFloat(data[i].P_VERWEDUW);

        }

        $scope.donutDataAge = percentageData65[index];
        $scope.legendDataAge = range65;
        $scope.donutDataForeigner = percentageDataForeigner[index];
        $scope.legendDataForeigner = rangeForeigner;
        $scope.donutDataHouse = percentageDataHouse[index];
        $scope.legendDataHouse = rangeHouse;
        $scope.donutDataMarital = percentageDataMarital[index];
        $scope.legendDataMarital = rangeMarital;
        $scope.bigData = $scope.donutDataAge;
        $scope.bigLegend = $scope.legendDataAge;
        $scope.option = $scope.options[1];
        
        $scope.optionScatter1 = $scope.optionsScatter[0];
        $scope.optionScatter2 = $scope.optionsScatter[0];

        $scope.scatterData = {xName: $scope.optionScatter1.name, yName: $scope.optionScatter2.name,
            scatter: $scope.optionScatter1.array.map(function (node, i) {
                return {x: node, y: $scope.optionScatter2.array[i], STED: stedNameData[i][1], Naam: stedNameData[i][0]};
            })};
        $scope.title = "Age statistics";
        $scope.$apply();

    });
});
myApp.factory('myFactory', function () {
    return queue()
            .defer(d3.json, 'json/cities-geometry.json')
            .defer(d3.tsv, 'txt/cities-data.txt');
});
