var json = [
	  {
		tag:"Bart",
		lat:37.892,
		lng: -122.001
	  },
	  {
		tag:"Bart",
		lat:37.994,
		lng: -122.118
	  },
	  {
		tag:"UPS",
		lat:37.794,
		lng: -122.023
	  },
	  {
		tag:"Citibank",
		lat:37.892,
		lng:-122.123
	  }
	  ];
	  /* 
	  Although this can be done, it is not actual JSON, a natural JSON version of this is
	  var json = [
	  {
		"tag": "Bart",
		"lat": 37.892,
		lng: -122.001
	  }
	  ];
	  Afterwards it should be saved on an external link and called from this page using the getJSON command for javascript
	  ex: var json= $.getJSON('INSERT_URL_HERE');
	  */
	  // on document ready function perform these operations
      $(function(){
	  // generate an array for unique checkbox items
		var locs = [];
		for(var i=0; i<json.length; i++){
			var tagVal = json[i].tag;
			if(locs.indexOf(tagVal) === -1){
				locs.push(tagVal);
			}
		}
		// create gmap3 and generate the markers  
        $('#my_map').gmap3({
		  map:{
		  //options for changing the display of the map
            options:{
              zoom: 11,
			  center: [37.8888, -122.1180],
              mapTypeId: google.maps.MapTypeId.ROADMAP,
			  disableDefaultUI: true
            },
			onces: {
              bounds_changed: function(){
                generateMarkers($(this).gmap3("get").getBounds());
              }
            }
          }
        });
		
        // create colors checkbox and associate onChange function 
        $.each(locs, function(i, location){
          $("#checkBox").append("<input type='checkbox' name='"+location+"'checked><label for='"+location+"'>"+location+"</label>");
        });
		// this is the handlers for the checkboxes
        $("#checkBox input[type=checkbox]").change(onChangeChk);
    });
      
      // generate the marker into a list and call gmap3's clustering function
      function generateMarkers(bounds){
        var i, list = [];
           
        // latLng is gmap3's function for locating coordinates
		for(i = 0; i< json.length; i++){
			list.push({
				latLng: [json[i].lat, json[i].lng],
				tag: json[i].tag
				});
		}
		
        //Clustering works when the map is zoomed such that when two locations are within a radius of x miles of each other, they will converge into a cluster point
        $('#my_map').gmap3({
          marker:{
            values: list,
            cluster:{
              radius: 100, 
          		// This style will be used for clusters with more than 0 markers
          		0: {
          		  content: '<div class="cluster cluster-1">CLUSTER_COUNT</div>',
          			width: 53,
          			height: 52
          		},
          		// This style will be used for clusters with more than 20 markers
          		50: {
          		  content: '<div class="cluster cluster-2">CLUSTER_COUNT</div>',
          			width: 56,
          			height: 55
          		},
          		// This style will be used for clusters with more than 50 markers
          		100: {
          		  content: '<div class="cluster cluster-3">CLUSTER_COUNT</div>',
          			width: 66,
          			height: 65
          		}
          	}
          }
        });
      }
      
      function onChangeChk(){
        // first : create an object where keys are colors and values are true (only for checked objects)
        var checkedLocs = {};
		
        $("#checkBox input[type=checkbox]:checked").each(function(i, chk){
          checkedLocs[$(chk).attr("name")] =true;
        });
		
        
        // set a filter function using the closure data "checkedColors"
        $('#my_map').gmap3({get:"clusterer"}).filter(function(data){
          return data.tag in checkedLocs;
        });
		
      }
      