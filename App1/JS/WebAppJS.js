require(["esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/layers/MapImageLayer",
    "esri/widgets/Popup",
    "esri/PopupTemplate",
    "esri/tasks/IdentifyTask",
    "esri/tasks/support/IdentifyParameters",
    "dojo/domReady!", ],
    function (Map,
        MapView,
        FeatureLayer,
        Legend,
        LayerList,
        Search,
        Locator,
        MapImageLayer,
        Popup,
        PopupTemplate,
        IdentifyTask, 
        IdentifyParameters) {

        //code starts

        //choose basemap
        var mapConfig = {
            basemap: "gray",
            layers:[]
        };

        //create a new map and map view
        var myMap = new Map(mapConfig);

        var mapView = new MapView({
            map: myMap,
            container: "viewDiv",
            center: [-111.94, 33.43],
            zoom: 12,
        });

        //define symbols to be used by the renders
        var freewaySymbol = {
            type: "simple-line",
            style: "short-dash-dot-dot",
            join: "round",
            miterLimit: 12,
            width: 7,
            color: [0, 175, 0, 1]
        };

        var highwaySymbol = {
            type: "simple-line",
            style: "long-dash",
            cap: "round",
            width: 6,
            color: [175, 175, 0, 1]
        };

        var autoSymbol = {
            type: "simple-line",
            style: "dash-dot",
            cap: "round",
            width: 5,
            color: [0, 175, 175, 1]
        };

        //define the renders
        var hwyRenderer = {
            type: "unique-value", // autocasts as new UniqueValueRenderer()
            defaultSymbol: autoSymbol,
            defaultLabel: "Other major roads",
            field: "CLASS",
            uniqueValueInfos: [
                { value: "I", symbol: freewaySymbol, label: "Interstates" },
                { value: "U", symbol: highwaySymbol, label: "Highway" }
            ]
        };


        hwyRenderer.legendOptions = { title: "Road Types" };

        var popup1 = {
            title: "Name: {ROUTE_NUM}",
            content: "This section of the {ROUTE_NUM} is {DIST_MILES} miles long."
        };

        var popup2 = {
            title: "{OBJECTID}",
        };

        var myFeatureLayer = new FeatureLayer({
            url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_Freeway_System/FeatureServer/2",
            renderer: hwyRenderer,
            popupTemplate: popup1
        });
    
        myMap.add(myFeatureLayer);

       //*************************************************************
        var service = new MapImageLayer({
            url: "https://gis.tempe.gov/arcgis/rest/services/Transportation/Traffic_Count_Public/MapServer",
            sublayers: [{
                id: 0,
                popupTemplate: {
                    title: "{ON_ST}",
                    content: "<p>{Count1} cars going {Dir1}</p>" + "<p>{Count2} cars going {Dir2}</p>"
                }
            }],
            });

        myMap.add(service);
       //*************************************************************

       
        var legend = new Legend({
            view: mapView,
            layerInfos: [{ layer: myFeatureLayer, title: "Highways" }, { layer: service, title: "Traffic Counts" }]
        });

        mapView.ui.add(legend, "top-right");

        var layerList = new LayerList({
            view: mapView
        });
        
        // Adds widget below other elements in the top left corner of the view
        mapView.ui.add(layerList, { position: "bottom-right" });

        var searchWidget = new Search({
            view: mapView,
            sources: [{
                locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                singleLineFieldName: "SingleLine",
                name: "Custom Geocoding Service",
                localSearchOptions: {
                    minScale: 300000,
                    distance: 50000
                },
                placeholder: "Search Geocoder",
                maxResults: 3,
                maxSuggestions: 6,
                suggestionsEnabled: false,
                minSuggestCharacters: 0
            }, {
                featureLayer: myFeatureLayer,
                searchFields: ["ROUTE_NUM"],
                displayField: "ROUTE_NUM",
                exactMatch: false,
                outFields: ["*"],
                name: "Route Search",
                placeholder: "example: C18",
                maxResults: 6,
                maxSuggestions: 6,
                suggestionsEnabled: true,
                minSuggestCharacters: 0
            }]
        });
        // Adds the search widget below other elements in
        // the top left corner of the view
        mapView.ui.add(searchWidget, {
            position: "top-left",
            index: 2
        });
        //test to see if working



//code ends
});