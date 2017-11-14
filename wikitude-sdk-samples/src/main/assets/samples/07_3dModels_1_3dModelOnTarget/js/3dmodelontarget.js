var World = {
	loaded: false,
	rotating: false,
    resourcesLoaded: false,

	init: function initFn() {
		this.createOverlays();
	},

	createOverlays: function createOverlaysFn() {
		/*
			First an AR.ImageTracker needs to be created in order to start the recognition engine. It is initialized with a AR.TargetCollectionResource specific to the target collection that should be used. Optional parameters are passed as object in the last argument. In this case a callback function for the onTargetsLoaded trigger is set. Once the tracker loaded all its target images, the function worldLoaded() is called.

			Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
			Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
		*/
		this.targetCollectionResource = new AR.TargetCollectionResource("assets/fuku.wtc", {
			onLoaded: function () {
				World.resourcesLoaded = true;
				this.loadingStep;
			},
            onError: function(errorMessage) {
            	alert(errorMessage);
            }
		});

		this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
			onTargetsLoaded: this.loadingStep,
            onError: function(errorMessage) {
            	alert(errorMessage);
            }
		});

		/*
			3D content within Wikitude can only be loaded from Wikitude 3D Format files (.wt3). This is a compressed binary format for describing 3D content which is optimized for fast loading and handling of 3D content on a mobile device. You still can use 3D models from your favorite 3D modeling tools (Autodesk® Maya® or Blender) but you'll need to convert them into the wt3 file format. The Wikitude 3D Encoder desktop application (Windows and Mac) encodes your 3D source file. You can download it from our website. The Encoder can handle Autodesk® FBX® files (.fbx) and the open standard Collada (.dae) file formats for encoding to .wt3. 

			Create an AR.Model and pass the URL to the actual .wt3 file of the model. Additional options allow for scaling, rotating and positioning the model in the scene.

			A function is attached to the onLoaded trigger to receive a notification once the 3D model is fully loaded. Depending on the size of the model and where it is stored (locally or remotely) it might take some time to completely load and it is recommended to inform the user about the loading time.
		*/
		this.modelCar = new AR.Model("assets/shoeMike.wt3", {
			onLoaded: this.loadingStep,
			/*
				The drawables are made clickable by setting their onClick triggers. Click triggers can be set in the options of the drawable when the drawable is created. Thus, when the 3D model onClick: this.toggleAnimateModel is set in the options it is then passed to the AR.Model constructor. Similar the button's onClick: this.toggleAnimateModel trigger is set in the options passed to the AR.ImageDrawable constructor. toggleAnimateModel() is therefore called when the 3D model or the button is clicked.

				Inside the toggleAnimateModel() function, it is checked if the animation is running and decided if it should be started, resumed or paused.
			*/
			onClick: this.toggleAnimateModel,
			scale: {
				x: 0.01,
                y: 0.01,
                z: 0.01
			}
		});


//		this.modelCar.onClick = function( drawable, model_part ) {
//                 var json = {
//                            name: "markerselected",
//                            id: 1
//                            title: "foo",
//                            description: "bar"
//                        };
//                        AR.platform.sendJSONObject(markerSelectedJSON);
//        }


//		// instantiate the model animation with the animation id
//        var animation = new AR.ModelAnimation(model, "Cube Left|Rotate Left_Cube Left_animation");
//
//        // start the animation
//        animation.start();



		/*
			Similar to 2D content the 3D model is added to the drawables.cam property of an AR.ImageTrackable.
		*/
		var trackable = new AR.ImageTrackable(this.tracker, "*", {
			drawables: {
				cam: [this.modelCar]
			},
			onImageRecognized: this.removeLoadingBar
		});
	},

	removeLoadingBar: function() {
		if (!World.loaded && !World.loaded && World.resourcesLoaded && World.modelCar.isLoaded()) {
			var e = document.getElementById('loadingMessage');
			e.parentElement.removeChild(e);
			World.loaded = true;

		}

	},

	loadingStep: function loadingStepFn() {
		if (World.resourcesLoaded && World.modelCar.isLoaded()) {
			var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
			var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
			document.getElementById('loadingMessage').innerHTML =
				"<div" + cssDivLeft + ">Scan CarAd ClientTracker Image:</div>" +
				"<div" + cssDivRight + "><img src='assets/car.png'></img></div>";
		}
	},

		toggleAnimateModel: function toggleAnimateModelFn() {
    		var json = {    name: "markerselected",
                            id: 1,
                            title: "foo",
                            description: "bar"
                        };
                        AR.platform.sendJSONObject(json);

    		return false;
    	}
};

World.init();
