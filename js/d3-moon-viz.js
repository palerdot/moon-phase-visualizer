( function () {

	// moon phase visualizer
	var moonViz = {

		stars: [], // holds the co-ordinates of the background stars

		render: function () {

			drawMainView(); // draws the big left visual
			drawAlternateView(); // draws the small right visual
			starShow(); // manages the background stars in the left visual
		}

	};

	// add a warning if the browser does not support svg (or any other necessary features)
	if (!Modernizr.svg) {
		
		// svg was not detected by the modernizr; add a warning.
		var warning = d3.select("#no-svg");
		var w_text  = "Your browser does not seem to support svg. Please use any modern browser like Chrome or Firefox.";
		warning.text(w_text).attr("class", "no-svg");

	} else {

		// svg is present; hopefully demo will work; proceed with the Moon Phase Visualizer

		moonViz.render();

		moonViz.animate = function () {

			requestAnimationFrame( moonViz.animate );
			// updates the phase view in left main visual and top right visual
			moonViz.updateMoonPhaseView();
			// updates the eclipse view in bottom right visual
			moonViz.updateEclipseView();

		};

		requestAnimationFrame( moonViz.animate );

		// animates the background stars (adds and removes few random stars)
		setInterval( starShow, 10000 );

	}	

	// **************************************************************************************************************************

	function drawMainView() {

		
		// this module draws the main left visual
		// shows the Moon's position during different phases
		
		// draw the svg canvas
		// svg dimensions
		var width = 880,
			height = 500;

		var svg = d3.select("body")
					.select("#moon-viz")
					.attr("width", width)
					.attr("height", height);
		
		svg.append("g").attr("id", "moon-viz-grouping");

		// draw the earth which is an circle
		// define earth co-ordinates and dimensions
		var ex = width/2,
			ey = height/2,
			esize = 75;


		var earth = d3.select("#moon-viz")
						.select("g#moon-viz-grouping")
						.append("g")
						.attr("id", "earth")
						.append("circle")
						.attr("cx", ex)
						.attr("cy", ey)
						.attr("r", esize);

		// draw continent like random goofy structures
		var co_ords = [ { x: ex, y: ey } ];
		co_ords.push( { x: +ex + 3, y: +ey + 3 } );
		co_ords.push( { x: +ex + 5, y: +ey + 6 } );
		co_ords.push( { x: +ex + 7, y: +ey + 6 } );
		co_ords.push( { x: +ex + 9, y: +ey + 16 } );
		co_ords.push( { x: +ex - 3, y: +ey + 16 } );
		co_ords.push( { x: +ex - 5, y: +ey + 6 } );
		co_ords.push( { x: +ex - 7, y: +ey + 6 } );
		co_ords.push( { x: +ex - 9, y: +ey + 6 } );

		co_ords.push( { x: +ex + 3, y: +ey + 3 - 50 } );
		co_ords.push( { x: +ex + 5, y: +ey + 6 - 50 } );
		co_ords.push( { x: +ex + 7, y: +ey + 6 - 50 } );
		co_ords.push( { x: +ex + 9, y: +ey + 16 - 50 } );
		co_ords.push( { x: +ex - 3, y: +ey + 16 - 50 } );
		co_ords.push( { x: +ex - 5, y: +ey + 6 - 50 } );

		co_ords.push( { x: +ex - 3 - 45, y: +ey + 16 + 30 } );
		co_ords.push( { x: +ex - 5 - 45, y: +ey + 6 + 30 } );

		co_ords.push( { x: +ex + 3 - 55, y: +ey + 3 - 15 } );
		co_ords.push( { x: +ex + 5 - 55, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex + 7 - 55, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex + 9 - 5, y: +ey + 16 - 15 } );
		co_ords.push( { x: +ex - 3 - 55, y: +ey + 3 - 15 } );
		co_ords.push( { x: +ex - 5 - 55, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex - 7 - 55, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex - 9 - 55, y: +ey + 16 - 15 } );

		co_ords.push( { x: +ex + 5 + 35, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex + 7 + 41, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex - 9 + 1, y: +ey + 16 - 15 } );
		co_ords.push( { x: +ex - 3 + 55, y: +ey + 3 - 15 } );
		co_ords.push( { x: +ex - 5 + 55, y: +ey + 6 - 15 } );

		co_ords.push( { x: +ex + 5 + 5, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex + 7 + 1, y: +ey + 6 - 15 } );
		co_ords.push( { x: +ex - 9 + 1, y: +ey + 16 - 15 } );
		co_ords.push( { x: +ex - 3 + 5, y: +ey + 3 - 15 } );
		co_ords.push( { x: +ex - 5 + 5, y: +ey + 6 - 15 } );


		// for each co-ordinate construct a template path when combined giving a continent like structure
		d3.select("#earth")
			.selectAll("path")
			.data( co_ords )
			.enter() // we are adding the 'continent' paths newly
			.append("path")
			.attr("class", "continent")
			.attr("d", function(d) {
				// we have an object as data with x and y as co-ordinates
				var x = d.x, y = d.y;

				return "M "+x+" "+y+" c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0 -8 -4 -11 -10z"
			});

		// earth day and night masks as semicircles
		// left semicircle is the night mask, right semicircle is day mask
		// they provide a transparent overlay with day & night colors over the earth circle to show day & night

		// calculate the earth mask co-ordinates for both night and day mask
		// night and day masks are almost same as they form left and right semicircles
		// only the sweep flag parameter for svg arc commands needs to be changed

		var em_x1 = ex, // start x for earth mask
			em_y1 = ey - esize, // start y
			em_x2 = ex, // end x
			em_y2 = ey + esize, // end y
			em_night = 1, // night
			em_day = 0; // day


		var night_mask = d3.select("#moon-viz")
								.append("path")
								// draw the left semicircle using SVG arc
								.attr("d", "M "+em_x1+" "+em_y1+" L "+em_x2+" "+em_y2+" A "+esize+" "+esize+" 0 0 "+em_night+" "+em_x1+" "+em_y1+"")
								.style("fill", "black")
								.style("fill-opacity", "0.1");

		var day_mask = d3.select("#moon-viz")
								.append("path")
								// draw the right semicircle using SVG arc
								.attr("d", "M "+em_x1+" "+em_y1+" L "+em_x2+" "+em_y2+" A "+esize+" "+esize+" 0 0 "+em_day+" "+em_x1+" "+em_y1+"")
								.style("fill", "#FFFF00")
								.style("fill-opacity", "0.64");

		// draw the moon path which is an ellipse
		var mp_rx = 250, // rx for moon path
			mp_ry = 150; // ry for moon path


		var moon_path = d3.select("#moon-viz")
							.select("g#moon-viz-grouping")
							.append("ellipse")
							.attr("cx", width/2)
							.attr("cy", height/2)
							.attr("rx", mp_rx)
							.attr("ry", mp_ry)
							.style("fill", "none")
							.style("stroke", "#dedede");

		// moon is a circle; calculate its dimensions
		var mx = width/2 + mp_rx, // x for moon
			my = height/2, // y for moon
			msize = 25; // size of moon


		var moon = d3.select("#moon-viz")
						.select("g#moon-viz-grouping")
						// add a 'g' elem for moon
						.append("g")
						.attr("id", "moon")
						.append("g")
						.append("circle")
						.attr("cx", mx)
						.attr("cy", my)
						.attr("r", msize)
						.style("fill", "white");

		// co-ordinates for the mask indicating the dark side of the moon (left semicircle)
		var mm_x1 = mx, // start x for moon mask
			mm_y1 = my - msize, // start y
			mm_x2 = mx, // end x
			mm_y2 = my + msize; // end y

		// draw a semicircle mask for moon to show the lighted half of the moon
		var moon_mask = d3.select("#moon-viz")
							.select("#moon")
							.append("path")
							// draw the left semicircle which is the dark side of the moon using SVG arc
							.attr("d", "M "+mm_x1+" "+mm_y1+" L "+mm_x2+" "+mm_y2+" A "+msize+" "+msize+" 0 0 1 "+mm_x1+" "+mm_y1+"")
							.style("fill", "black")
							.style("fill-opacity", "0.8");

		// append a semicircle to moon
		d3.select("#moon").select("g")
			.append("path")
			.attr("d", "M "+mm_x1+" "+mm_y1+" L "+mm_x2+" "+mm_y2+" A "+msize+" "+msize+" 0 0 1 "+mm_x1+" "+mm_y1+"")
			.style("fill", "none")
			.style("stroke", "#404040")
			.style("stroke-width", "2.5")
			.style("stroke-dasharray", "3, 3");

		var start = {
			moon: 180, // start in the full moon position; left end
			earth: 0
		}; // start positions 

		// AXIS rotation speeds of moon and earth
		var speed = {};
		speed.moon = +0.4;
		// make earth rotation visible faster than the moon. actually earth is 29.5 times faster than moon in axis rotation;
		// but it is scaled down to 15 to make it visibly better to understand
		speed.earth = speed.moon * 15;

		// get a reference for 'updateMoonPosition' which animates moon's position in left and top right visual
		// Through closures, we will able to access all the variables and data from this scope.
		// This reference is later called outside of this scope for animating. 
		moonViz.updateMoonPhaseView = updateMoonPosition;

		// updates the left main visual and top right visual
		function updateMoonPosition () {

			var moon = d3.select("#moon-viz").select("#moon");

			var angle = start.moon%360;
			var radian = (angle/360)*(2*Math.PI);

			// the basic ellipse co-ordinates is given by x*cos(t), y*sin(t) where x, y are ellipse x and y radii

			// if just the 'moon' circle element has to be moved, the following co-ordinates work, but
			//var x = (width/2) + mp_rx * Math.cos(radian);
			//var y = (height/2) - mp_ry * Math.sin(radian);
			//moon.attr("cx", x).attr("cy", y);

			// we are dealing with a 'g' element holding the moon. g element needs a translate position
			var x = mp_rx * Math.cos(radian) - (width/2 - mp_rx + 2*msize);
			var y = -mp_ry * Math.sin(radian);
			
			// moon is rotated around its orbit
			moon.attr("transform", "translate("+x+","+y+")");

			// angle to rotate the moon
			var to_rotate = start.moon%360;

			// the base co-ordinate to rotate with; it will fall in the co-ordinate (mp_rx, 0) in the right end of x-axis of ellipse
			var nx = +(width/2) + mp_rx, 
				ny = +(height/2);

			// moon is rotated around its axis
			moon.select("g")
				.attr("transform", "rotate(-"+to_rotate+", "+nx+", "+ny+")");
			
			// 'fine' factor, controls the speed of moon revolution
			// Also this same angle is used for moon's rotation around its orbit and axis, thus simulating 'tidal locking'
			start.moon += speed.moon; 

			// update the moon phase view in the sidebar
			var proxy_moon = {
				el: d3.select("#top-proxy-moon"),
				radius: 50,
				position: +d3.select("#top-moon").attr("cx")
			};

			// for the first 180 deg Moon is waxing, the next 180 deg Moon is waning.
			var proxy_pos = (angle - 180)/180 * ( 2*proxy_moon.radius ),
				ref_pos;  

			if (proxy_pos < 0) {
				ref_pos = proxy_moon.position - 2*proxy_moon.radius;
			} else {
				ref_pos = proxy_moon.position + 2*proxy_moon.radius;
			}
								
			proxy_moon.el.attr("cx", ref_pos - proxy_pos);

			// update the phase timer; actual moon orbit time is 29.5 days; tweak that info to the timer
			var phase_time = (p_time = +Math.ceil(29.5 - ((360-angle)/360)*29.5)) == 30 ? 29.5 : p_time; 

			d3.selectAll(".phase.timer")
				.text("Day " + phase_time);

			// rotate the earth around its axis; 

			var to_rotate = start.earth%360;

			//rotate the earth slightly faster than the moon
			d3.select("#earth")
				.attr("transform", "rotate(-"+to_rotate+", "+ex+","+ey+" )");

			
			start.earth += speed.earth;

		}

		// finally draw the sun
		var sun = d3.select("#moon-viz")
					.append("ellipse")
					.attr("id", "sun")
					.attr("cx", width)
					.attr("cy", height/2)
					.attr("rx", 50)
					.attr("ry", height/2)
					.style("fill", "#FFDB00");


	} // end of drawMoonOrbit module

	// -------------------------------------------------------------------------


	// draw the alternate view, the narrow right visual.
	function drawAlternateView () {

		// alternate view has two parts divided equally
		// top part shows the Moon's shape during different phases
		// bottom part shows a high level overview of eclipses

		var width = 400, // width of this view is common
			height = 500; // each view will share half of this height

		// tracks the x,y co-ordinates of moon and earth shadow which are triangles
		// the co-ordinate we will need is (x3,y3) which is the end that will touch the 'line of nodes'
		var eclipse_points = {

			moon: {
				x1: 0, y1: 0,
				x2: 0, y2: 0,
				x3: 0, y3: 0
			},

			earth: {
				x1: 0, y1: 0,
				x2: 0, y2: 0,
				x3: 0, y3: 0	
			}

		};

		var top_view = d3.select("#alternate-view")
							.append("g")
							.attr("id", "top-view");

		// draw the 'horizontal' seperation line
		d3.select("#alternate-view")
			.append("line")
			.attr("x1", 0).attr("y1", height/2)
			.attr("x2", width).attr("y2", height/2)
			.style("stroke", "grey");

		// 'vertical' seperation line - line of nodes
		var lon = d3.select("#alternate-view")
			.append("line")
			.attr("x1", width/2).attr("y1", height/2)
			.attr("x2", width/2).attr("y2", height)
			.style("stroke", "tomato");

		// we have two sets of moons in this view; this is the top moon

		var topMoon = {

			// size of the moon
			size: 50,

			// main visible moon
			main: '',

			// proxy moon which overlaps the main moon to give the phase view
			proxy: ''
		
		};

		// this is the main visible moon 
		topMoon.main = top_view.append("circle")
										.attr("id", "top-moon")
										.attr("cx", width/2 ) 
										.attr("cy", 0.5*(height/2) ) // middle of the upper half
										.attr("r", topMoon.size)
										.style("fill", "white");



		// proxy moon -> this will overlap the main moon to give the Moon phase visuals
		// inital proxy moon position will be to the right of the moon, revealing it completely
		
		var proxy_pos = 2*topMoon.size; 
		var initial_pos = width/2;

		topMoon.proxy = top_view.append("circle")
										.attr("id", "top-proxy-moon")
										.attr("cx", initial_pos + proxy_pos ) // initial position will not hide the moon 
										.attr("cy", 0.5*(height/2) ) // middle of the bottom half
										.attr("r", topMoon.size)
										.style("fill", "black");

		// ----------------------------------------------------
		// bottom half contains the side view with earth, moon and sun

		var bottom_view = d3.select("#alternate-view")
							.append("g")
							.attr("id", "bottom-view");

		// the centre reference plane
		var bottom_ref_line = bottom_view.append("line")
											.attr("x1", 0).attr("y1", 1.5*(height/2))
											.attr("x2", width).attr("y2", 1.5*(height/2)) // middle of bottom half
											.style("stroke", "grey");

		// add a 'g' element to group earth and moon components
		bottom_view.append("g")
					.attr("id", "earth-moon-plane");

		// contains earth and its shadow
		bottom_view.select("#earth-moon-plane")
					.append("g")
					.attr("id", "earth-plane");

		// contains moon, its shadow and its orbit
		bottom_view.select("#earth-moon-plane")
					.append("g")
					.attr("id", "moon-plane");

		// bottom moon orbit; 
		// an ellipse which will vary in its x radius to simulate the oscillation of moon's ecliptic plane

		var earth = {
			
			size: 10,

			orbit: {
				x: width/3,
				y: 80
			},

			angle: 180, // start angle 

			co_ords: {},

			el: '',

			shadow: 43

		};

		earth.co_ords.x = width/2,
		earth.co_ords.y = 1.5*(height/2) - earth.orbit.y;

		var earth_orbit = bottom_view.append("ellipse")
									.attr("cx", width/2)
									.attr("cy", 1.5*(height/2))
									.attr("rx", earth.orbit.x)
									.attr("ry", earth.orbit.y)
									.style("fill", "none")
									.style("stroke", "grey"); 

		earth.el = bottom_view.select("#earth-plane")
							.append("circle")
							.attr("id", "bottom-earth")
							.attr("class", "bottom earth")
							.attr("cx", earth.co_ords.x)
							.attr("cy", earth.co_ords.y)
							.attr("r", earth.size)
							.style("fill", "steelblue");

		// this is the bottom moon in the eclipse view
		var moon = {

			size: 5,

			orbit: {
				x: 35,
				y: 20
			},

			angle: 180,

			co_ords: {},

			el: '',

			shadow: 13,

			// orbital speed of the moon
			speed: 3

		};
		
		var moon_orbit = bottom_view.select("#moon-plane")
									.append("ellipse")
									.attr("rx", moon.orbit.x)
									.attr("ry", moon.orbit.y)
									.style("fill", "none")
									.style("stroke", "grey")
									.attr("transform", "rotate(-15)");

		// draw two points and a connection line to indicate full moon and new moon positions in the moon orbit
		bottom_view.select("#moon-plane")
					.append("g")
					.attr("id", "bottom-moon-orbit-points")
					.attr("transform", "rotate(-15)");

		bottom_view.select("#moon-plane").select("#bottom-moon-orbit-points")
					.append("line")
					.attr("x1", -moon.orbit.x).attr("y1", moon.orbit.y/2 - 2*moon.size)
					.attr("x2", moon.orbit.x).attr("y2", moon.orbit.y/2 - 2*moon.size)
					.style("stroke", "#505050");

		moon.el = bottom_view.select("#moon-plane")
								.append("circle")
								.attr("cx", moon.orbit.x)
								.attr("cy", 0)
								.attr("r", moon.size)
								.style("fill", "silver");

		var sun = bottom_view.append("circle")
								.attr("id", "bottom-sun")
								.attr("class", "bottom sun")
								.attr("cx", width/2)
								.attr("cy", 1.5*(height/2))
								.attr("r", 30)
								.style("fill", "yellow")
								.style("fill-opacity", 1);

		// get a reference for 'revolveEarth' which animates bottom right visual
		// Through closures, we will able to access all the variables and data from this scope.
		// This function reference is later called outside of this scope for animating.
		moonViz.updateEclipseView = revolveEarth;

		function revolveEarth () {

			var angle = earth.angle%360; 
			var radian = (angle/360)*(2*Math.PI);

			// redefine height for the bottom view part
			var b_height = 1.5*(height/2);

			// the basic ellipse co-ordinates is given by x*cos(t), y*sin(t) where x, y are ellipse x and y radii

			// co-ordinates to move the earth around its orbit
			var x = (width/2) + earth.orbit.x * Math.cos(radian);
			var y = b_height - earth.orbit.y * Math.sin(radian);

			// rotate the earth
			earth.el.attr("cx", x).attr("cy", y).attr("transform", "rotate("+earth.angle+", "+x+", "+y+")");

			// actual moon orbit tilt is 5.1 deg, but to visibly show the tilt we are using 15 deg
			d3.select("#moon-plane").attr("transform", "rotate(-0, "+x+", "+y+") translate("+x+","+y+")");

			var shadow_angle = +270 - earth.angle;

			// plot the shadow points
			eclipse_points.earth = {
				// absolute position
				x1 : x - earth.size,
				y1 : y,

				// relative position
				x2 : 2*earth.size,
				y2 : 0,

				// relative position
				x3 : -earth.size,
				y3 : earth.shadow 
			};

			// draw the earth shadow; 
			var earth_shadow = d3.select("#earth-shadow")
									.attr("d", function(){
										
										var x1, y1, x2, y2, x3, y3;

										// absolute position
										x1 = eclipse_points.earth.x1;
										y1 = eclipse_points.earth.y1;

										// relative position
										x2 = eclipse_points.earth.x2;
										y2 = eclipse_points.earth.y2;

										// relative position
										x3 = eclipse_points.earth.x3;
										y3 = eclipse_points.earth.y3;

										var path = "M "+x1+" "+y1+" l "+x2+" "+y2+" l "+x3+" "+y3+" "+" L "+x1+" "+y1+" ";

										return path;
									})
									.attr("transform", "rotate("+shadow_angle+", "+x+", "+y+")")
									.style("fill", "#404040");

			earth.angle += moon.speed/12.41; // one orbital rotation of earth is 12 times that of a moon

			// revolve the moon around the earth too when earth is revolving around the sun
			revolveMoon();

			// update the timer in the eclipse view; normalization to start the month count from 180 deg
			var eclipse_time = (e_time = +Math.ceil(((angle-180)/360)*12)) <= 0 ? (12 + e_time) : e_time;

			d3.select("#eclipse-timer")
				.text("Month " + eclipse_time);

		} // end of revolveEarth module

		function revolveMoon () {

			var angle = moon.angle%360;
			var radian = (angle/360)*(2*Math.PI);

			// the basic ellipse co-ordinates is given by x*cos(t), y*sin(t) where x, y are ellipse x and y radii
			// here the moon position is relative to earth; so just the ellipse co-ordinates will work
			var x = +moon.orbit.x * Math.cos(radian);
			var y = -moon.orbit.y * Math.sin(radian);

			moon.el.attr("cx", x).attr("cy", y);

			var shadow_angle = Math.ceil(+270 - (earth.angle%360)); 

			var earth_x = +earth.el.attr("cx");
			var earth_y = +earth.el.attr("cy");

			var moon_x = +moon.el.attr("cx");
			var moon_y = +moon.el.attr("cy");

			var shadow_x = +x + earth_x;
			var shadow_y = +y + earth_y;

			// plot the moon shadow points
			eclipse_points.moon = {
				// absolute position
				x1 : shadow_x - moon.size,
				y1 : shadow_y,

				// relative position
				x2 : 2*moon.size,
				y2 : 0,

				// relative position
				x3 : -moon.size,
				y3 : moon.shadow
			};

			// draw the earth shadow; 
			var moon_shadow = d3.select("#moon-shadow")
									.attr("d", function(){
										
										var x1, y1, x2, y2, x3, y3;

										// absolute position
										x1 = eclipse_points.moon.x1;
										y1 = eclipse_points.moon.y1;

										// relative position
										x2 = eclipse_points.moon.x2;
										y2 = eclipse_points.moon.y2;

										// relative position
										x3 = eclipse_points.moon.x3;
										y3 = eclipse_points.moon.y3;

										var path = "M "+x1+" "+y1+" l "+x2+" "+y2+" l "+x3+" "+y3+" "+" L "+x1+" "+y1+" ";

										// moon passes through the line of nodes
										if (shadow_angle == 0 || shadow_angle == 180) {
											
											// get the ceiled co-ordinates at line of nodes
											var ceiled = {
												moon: Math.ceil(x1 - x3),
												earth: Math.ceil(eclipse_points.earth.x1 - eclipse_points.earth.x3)
											} ;

											if (ceiled.moon >= (ceiled.earth - moon.size) && ceiled.moon <= (ceiled.earth + moon.size) ) {
												//console.log("eclipse point? " + new Date());
												// make the line of nodes as a visible green line
												lon.style("stroke", "green").style("stroke-width", "3")
													.transition().style("stroke", "tomato").style("stroke-width", "1").duration(4000);
											}

										} 

										return path;
									})
									.attr("transform", "rotate("+shadow_angle+", "+shadow_x+", "+shadow_y+")")
									.style("fill", "#404040");

			moon.angle += moon.speed;

		} // end of revolveMoon module

	} // end of drawAlternateView module

	// ---------------------------------------

	// for every few seconds after the first time removes and adds random sets of stars
	function starShow () {

		// an array that contains the co-ordinates of the stars
		var starData = moonViz.stars;
		// the holder which will contain stars
		var canvas = d3.select("#starCanvas");

		// dimensions of the canvas
		var width = 880, 
			height = 500;

		if ( starData.length == 0 ) {
			// this is the first time; there are no stars; add them
			var count = 0,
				limit = 150; // total stars to be present

			// add new stars
			while ( count++ < limit ) {

				starData.push({
								x: Math.ceil( Math.random()*width ),
								y: Math.ceil( Math.random()*height ),
								// one third of the stars is shown dim
								class: (Math.ceil( Math.random()*3 ))%3 == 0 ? 'star dim' : 'star'
							});
			}

			var new_stars = canvas.selectAll("circle") // circle as star in svg
									.data( starData )
									.enter() // stars are newly added for the first time
									.append("circle")
									.attr("class", function (d) { return d.class; } )
									.attr("cx", function (d) { return d.x; } )
									.attr("cy", function (d) { return d.y; } )
									.attr("r", 1);
		} else {

			// create new stars
			count = 0; 
			limit = 50;

			starData = starData.slice( 0, starData.length - limit );

			// there are stars already; destroy and create 10 stars
			var old_stars = canvas.selectAll("circle") // circle as star in svg
									.data( starData ) // remove first 10 stars
									.exit()
									.attr("class", "star old")
									.transition()
									.duration(2000)
									.remove();
			// add new stars
			while ( count++ < limit ) {

				starData.push({
								x: Math.ceil( Math.random()*width ),
								y: Math.ceil( Math.random()*height ),
								// one third of the stars to be dim
								class: (Math.ceil( Math.random()*3 ))%3 == 0 ? 'star dim' : 'star'
							});
			}

			new_stars = canvas.selectAll("circle") // circle as star in svg
								.data( starData )
								.enter() // stars are newly added
								.append("circle")
								.attr("class", function (d) { return d.class; } )
								.attr("cx", function (d) { return d.x; } )
								.attr("cy", function (d) { return d.y; } )
								.attr("r", 1)
								.transition()
								.duration(2000)
								.attr("class", "star new")
								.transition()
								.duration(2000)
								.attr("class", function (d) { return d.class; } );

		}

	} // end of starShow module
 
	// ***************************************************************************************************************************

} )();
 
// requestAnimationFrame polyfill for browsers that doesn't support
// ref: https://gist.github.com/paulirish/1579671 
(function() {
	 
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel	 
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
