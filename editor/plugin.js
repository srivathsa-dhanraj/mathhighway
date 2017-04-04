EkstepEditor.basePlugin.extend({
    initialize: function() {},
    newInstance: function() {
        delete this.configManifest;
        var shapeConfig = { 
            "x": 0,
            "y": 0,
            "w": 100,
            "h":100,
            "fill": "#cccccc",
            "type": "rect"
        };
        
        var shapeProps = this.convertToFabric(shapeConfig);
        var shapeText = EkstepEditorAPI.instantiatePlugin('org.ekstep.shape', shapeProps, this);

        this.editorObj = shapeText.editorObj;

        this.loadImage();
    },
    onConfigChange: function(key, value) {
        var instance = this;
        var editorObj = instance.editorObj

        switch (key) {
            case "n1Range":

                instance.attributes.n1Range = value;
                break;

            case "n2Range":

                instance.attributes.n2Range = value;
                break;

            case "timelimit":

                instance.attributes.timelimit = value;
                break;

            case "qCount":

                instance.attributes.qCount = value;
                break;

            case "operators":

                instance.attributes.operators = value;
                break;
        }
        EkstepEditorAPI.render();
        EkstepEditorAPI.dispatchEvent('object:modified', { target: EkstepEditorAPI.getEditorObject() });
    },

    getConfig: function() {

        var config = this._super();

        config.n1Range = this.attributes.n1Range;
        config.n2Range = this.attributes.n2Range;
        config.timelimit = this.attributes.timelimit;
        config.qCount = this.attributes.qCount;
        config.operators = this.attributes.operators;

        return config;
    },
    loadImage: function() {
        this.addMedia({
            id: "bush",
            src: this.relativeURL("assets/bush.png"),
            assetId: "bush",
            "type": "image",
            "preload": true
        });
        this.addMedia({
            id: "car1",
            src: this.relativeURL("assets/car1.png"),
            assetId: "car1",
            "type": "image",
            "preload": true
        });
        this.addMedia({
            id: "car2",
            src: this.relativeURL("assets/car2.png"),
            assetId: "car2",
            "type": "image",
            "preload": true
        });
        this.addMedia({
            id: "bg",
            src: this.relativeURL("assets/bg.png"),
            assetId: "bg",
            "type": "image",
            "preload": true
        });
    }
});
