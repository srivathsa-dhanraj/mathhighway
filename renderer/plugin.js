Plugin.extend({
    _type: 'org.ekstep.carmath',
    _isContainer: false,
    _render: true,
    _gameManager: undefined,
    _optionGroups: [],
    _optionShapes: [],
    _qTexts: [],
    _secondsLeft: 0,
    _questionOne: undefined,
    _questionTwo: undefined,
    _routeOnestep: undefined,
    _routeTwostep: undefined,
    _gameOver: false,
    initPlugin: function(data) {
        this._routeOnestep = 1;
        this._routeTwostep = 1;
        this._gameManager = GameManager;
        this.initGraphics();
        this._gameManager.generateAllQuestion(data);
        this.startTimer(this._gameManager._totalSeconds);
        this._questionOne = GameManager.getQuestion();
        this._questionTwo = GameManager.getQuestion();
        this.showOptions();
        this.refreshOptions();

        this._self = new createjs.Container();
        var dims = this.relativeDims();
        this._self.x = dims.x;
        this._self.y = dims.y;


        this.startCar("one");
        this.startCar("two");
        Renderer.update = true;
    },
    initGraphics: function() {
        var bushImg = {}; //draw submit button.
        bushImg.id = "bg";
        bushImg.x = "0";
        bushImg.y = "0";
        bushImg.w = "100";
        bushImg.h = "100";
        bushImg.asset = "bg";
        var resultDetails = {
            id: "overlayPopup",
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            visible: false,
            shape: [{
                x: 0,
                y: 0,
                h: 100,
                w: 100,
                type: "rect",
                hitArea: "true",
                fill: "#000",
                opacity: 0.5
            }, {
                id: "detailShape",
                x: 10,
                y: 10,
                h: 80,
                w: 80,
                type: "rect",
                hitArea: "true",
                fill: "orange"
            }],
            text: [
                { x: 10, y: 20, w: 80, h: 10, __text: "GAME OVER", fontsize: 100, weight: "bold", align: "center" },
                { x: 30, y: 40, w: 40, h: 10, __text: "Questions Displayed", fontsize: 60, weight: "bold", align: "left" },
                { id: "shownQuesText", x: 65, y: 40, w: 30, h: 10, __text: "", fontsize: 70, weight: "bold", align: "left" },
                { x: 30, y: 50, w: 40, h: 10, __text: "Right Answers", fontsize: 60, weight: "bold", align: "left" },
                { id: "rightAnsText", x: 65, y: 50, w: 30, h: 10, __text: "", fontsize: 70, weight: "bold", align: "left" },
                { x: 30, y: 60, w: 40, h: 10, __text: "Time Taken", fontsize: 60, weight: "bold", align: "left" },
                { id: "timeText", x: 65, y: 60, w: 30, h: 10, __text: "", fontsize: 70, weight: "bold", align: "left" },
            ]
        }
        resultDetails["z-index"] = 1000;
        PluginManager.invoke("image", bushImg, this._stage, this._stage, this._theme);
        PluginManager.invoke('g', resultDetails, this._stage, this._stage, this._theme);
    },
    startCar: function(routeName) {
        var instance = this;
        var dims = this.relativeDims();
        var carOneProps, carTwoProps, propsOne, propsTwo, carOneShape, carTwoShape, carImg1, carImg2;
        createjs.Ticker.useRAF = true;
        createjs.Ticker.setFPS(60);
        if (routeName == "one" && this._questionOne) {
            // var grpData = {};
            // grpData.id = this._questionOne.qid+"g";
            // grpData.x = "0";
            // grpData.y = "25";
            // grpData.w = "20";
            // grpData.h = "20";
            // PluginManager.invoke("g", grpData, this._stage, this._theme);
            // carOneShape = PluginManager.getPluginObject(this._questionOne.qid+"g");

            var img = {}; //draw submit button.
            img.id = this._questionOne.qid + "img";
            img.x = "0";
            img.y = "15";
            img.w = "20";
            img.h = "20";
            img.asset = "car1";
            PluginManager.invoke("image", img, this._stage, this._stage, this._theme);
            carImg1 = PluginManager.getPluginObject(this._questionOne.qid + "img");


            propsOne = { id: this._questionOne.qid, x: 2, y: 17, w: 20, h: 20, __text: this._questionOne.qText, fontsize: 100, weight: "bold" };
            PluginManager.invoke("text", propsOne, this._stage, this._theme);
            carOneShape = PluginManager.getPluginObject(this._questionOne.qid)._self;
            createjs.Ticker.addEventListener('tick', tickOne);
        } else if (this._questionTwo) {

            var img = {}; //draw submit button.
            img.id = this._questionOne.qid + "img";
            img.x = "-20";
            img.y = "42";
            img.w = "28";
            img.h = "27";
            img.asset = "car2";
            PluginManager.invoke("image", img, this._stage, this._stage, this._theme);
            carImg2 = PluginManager.getPluginObject(this._questionOne.qid + "img");

            propsTwo = { id: this._questionTwo.qid, x: -20, y: 54, w: 28, h: 20, align: "center", __text: this._questionTwo.qText, fontsize: 100, weight: "bold" };
            PluginManager.invoke("text", propsTwo, this._stage, this._stage, this._theme);
            carTwoShape = PluginManager.getPluginObject(this._questionTwo.qid)._self;
            createjs.Ticker.addEventListener('tick', tickTwo);
        }



        function tickOne(evt) {
            var step = instance._routeOnestep;

            carOneShape.x += step;
            carImg1._self.x += step;
            Renderer.update = true;
            if (carOneShape.x > (dims.w + 10)) {
                instance._routeOnestep = 1;
                createjs.Ticker.removeEventListener('tick', tickOne);
                carOneShape.visible = false;
                carImg1.visible = false;
                GameManager.removeCar(propsOne.id);
                instance._questionOne = GameManager.getQuestion();

                if (instance._questionOne && !instance._gameOver) {
                    instance.refreshOptions();
                    instance.startCar("one");
                } else if (!instance._questionOne && !instance._questionTwo) {
                    instance._gameOver = true;
                }
            }
        }

        function tickTwo(evt) {
            var step = instance._routeTwostep;
            carTwoShape.x += step;
            carImg2._self.x += step;
            Renderer.update = true;
            if (carTwoShape.x > (dims.w + 90)) {
                instance._routeTwostep = 1;
                createjs.Ticker.removeEventListener('tick', tickTwo);
                carTwoShape.visible = false;
                carImg2.visible = false;
                GameManager.removeCar(propsTwo.id);
                instance._questionTwo = GameManager.getQuestion();
                if (instance._questionTwo && !instance._gameOver) {
                    instance.refreshOptions();
                    instance.startCar("Two");
                } else if (!instance._questionOne && !instance._questionTwo) {
                    instance._gameOver = true;
                }


            }
        }
    },
    showOptions: function() {

        var instance = this;

        var debugShape = {}; //draw submit button.
        debugShape.id = "bush"
        debugShape.x = "10";
        debugShape.y = "70";
        debugShape.h = "20";
        debugShape.w = "80";
        debugShape.type = "rect";
        debugShape.fill = "#000000";
        //PluginManager.invoke("shape", debugShape, this._stage, this._theme);



        var mainOptionsGroup = {};
        mainOptionsGroup.id = "mainGroup";
        mainOptionsGroup.x = "10";
        mainOptionsGroup.y = "73";
        mainOptionsGroup.w = "90";
        mainOptionsGroup.h = "25";
        PluginManager.invoke("g", mainOptionsGroup, this._stage, this._theme);
        var mainGroup = PluginManager.getPluginObject("mainGroup");

        var totalOptions = this._gameManager._optionsCount;
        var optionValues = this._gameManager.getOptions();
        for (var i = 0; i < totalOptions; i++) {

            var width = 100 / totalOptions;

            var optionGroup = {};
            optionGroup.id = "optionGroup" + i;
            optionGroup.x = i * width;
            optionGroup.y = 0;
            optionGroup.w = width - 5;
            optionGroup.h = 100;
            PluginManager.invoke("g", optionGroup, mainGroup, this._theme);
            var g = PluginManager.getPluginObject("optionGroup" + i);
            this._optionGroups.push(g);


            var bushImg = {}; //draw submit button.
            bushImg.id = "optionShape" + i;
            bushImg.x = "0";
            bushImg.y = "10";
            bushImg.w = "100";
            bushImg.h = "90";
            bushImg.asset = "bush";
            PluginManager.invoke("image", bushImg, g, this._stage, this._theme);

            var shape = PluginManager.getPluginObject("optionShape" + i);
            this._optionShapes.push(shape);

            var txt = {};
            txt.id = "opTxt" + i;
            txt.x = "0";
            txt.y = "0";
            txt.w = "100";
            txt.h = "100";
            txt.__text = optionValues[i];
            txt.fill = "#ffffff";
            txt.align = "center";
            txt.valign = "middle";
            txt.fontsize = "2em";
            PluginManager.invoke("text", txt, g, this._theme);

            this._optionShapes[i]._self.cursor = 'pointer';
            this._optionShapes[i]._self.on("click", function() { //When submit button is clicked. Do eval.
                //console.log("boom ",this._optionGroups[i]._self.children[1].text);
                var ans = this.parent.children[1].text;
                var obj = instance._gameManager.evaluateAnswer(ans);
                if (obj != undefined) {
                    if (instance._questionOne && obj.qid == instance._questionOne.qid)
                        instance._routeOnestep = 15;
                    else if (instance._questionTwo && obj.qid == instance._questionTwo.qid)
                        instance._routeTwostep = 15;
                }
            });

        }
        Renderer.update = true;

    },

    refreshOptions: function() {
        var mainGroup = PluginManager.getPluginObject("mainGroup");
        var allOptions = mainGroup._self.children;
        var optionValues = this._gameManager.getOptions();
        for (var i = 0; i < allOptions.length; i++) {
            allOptions[i].children[1].text = optionValues[i];
        }
        this.animateOptions();
        Renderer.update = true;
        //console.log("mainGroup ",mainGroup._self.children["0"].children[1]);
    },
    animateOptions: function() {
        var optionValues = this
            ._gameManager.getOptions();
        for (var i = 0; i < optionValues.length; i++) {
            var sp = PluginManager.getPluginObject("optionGroup" + i);
            var arr = [1, 2, 3, 4];
            var d = _.sample(arr);
            var val = 30;
            switch (d) {
                case 1:
                    createjs.Tween.get(sp._self, { loop: false }).to({ y: sp._self.y - val }, 100).to({ y: sp._self.y - val + 20 }, 200).to({ y: sp._self.y - val + 10 }, 300).to({ y: sp._self.y - val + 30 }, 400);
                    break;
                case 2:
                    createjs.Tween.get(sp._self, { loop: false }).wait(100).to({ y: sp._self.y - val }, 100).to({ y: sp._self.y - val + 20 }, 200).to({ y: sp._self.y - val + 10 }, 300).to({ y: sp._self.y - val + 30 }, 400);
                    break;
                case 3:
                    createjs.Tween.get(sp._self, { loop: false }).wait(200).to({ y: sp._self.y - val }, 100).to({ y: sp._self.y - val + 20 }, 200).to({ y: sp._self.y - val + 10 }, 300).to({ y: sp._self.y - val + 30 }, 400);
                    break;
                case 4:
                    createjs.Tween.get(sp._self, { loop: false }).wait(300).to({ y: sp._self.y - val }, 100).to({ y: sp._self.y - val + 20 }, 200).to({ y: sp._self.y - val + 10 }, 300).to({ y: sp._self.y - val + 30 }, 400);
                    break;
            }
        }

    },
    startTimer: function(totalTime) {
        var instance = this;
        instance._secondsLeft = totalTime;
        var txt = {};
        txt.id = "timeTxt";
        txt.x = "85";
        txt.y = "2";
        txt.w = "20";
        txt.h = "10";
        txt.__text = "00:00";
        txt.fill = "#00ffff";
        txt.align = "center";
        txt.valign = "middle";
        txt.fontsize = "1.4em";
        var p = PluginManager.invoke("text", txt, this._stage, this._theme);

        timeTween = createjs.Tween.get(p, {
            loop: true
        }).to({}, 1000).call(secondCounter);

        function secondCounter() {
            instance._secondsLeft--;
            var t = instance._secondsLeft;


            p._self.text = getMinSec(t);


            if (instance._secondsLeft <= 0) {
                instance._gameOver = true;
            }
            if (instance._gameOver) {
                createjs.Tween.removeTweens(p);

                function showResult() {
                    PluginManager.getPluginObject("overlayPopup")._self.visible = true;
                    PluginManager.getPluginObject("overlayPopup")._self.cursor = "pointer";
                    PluginManager.getPluginObject("shownQuesText")._self.text = GameManager._totalQuestionsShown;
                    PluginManager.getPluginObject("rightAnsText")._self.text = GameManager._totalQuestionsAnswered;
                    PluginManager.getPluginObject("timeText")._self.text = getMinSec(totalTime - t);
                    PluginManager.getPluginObject("overlayPopup")._self.on("click", function() {
                        OverlayManager.skipAndNavigateNext();
                    });
                    Renderer.update = true;
                }
                setTimeout(showResult, 1000)
            }
            Renderer.update = true;
        }

        function getMinSec(t) {
            var seconds = Math.floor(t % 60);
            seconds < 0 ? seconds = 0 : seconds;
            seconds > 9 ? seconds : seconds = '0' + seconds;

            var minutes = Math.floor((t / 60) % 60);
            minutes < 0 ? minutes = 0 : minutes;
            minutes > 9 ? minutes : minutes = '0' + minutes;

            return minutes + ":" + seconds;
        }
    }

});


var GameManager = {
    _prefix: "carmath.q",
    _qidTracker: 0,
    _allQuestions: [],
    _currentQuestions: [],
    _currentOptions: [],
    _optionsCount: 6,
    _iterator: 0,
    _userData: {},
    _totalSeconds: 0,
    _totalQuestionsShown: 0,
    _totalQuestionsAnswered: 0,
    generateAllQuestion: function(data) {
        this._userData = data;
        var range1 = data.n1Range.split("-");
        var range2 = data.n2Range.split("-");
        var allowedOperators = data.operators.split(",");

        for (var i = 0; i < data.qCount; i++) {

            var number1 = this.getRandomNumber(range1);
            var number2 = this.getRandomNumber(range2);
            var operator = allowedOperators[Math.floor(Math.random() * allowedOperators.length)];

            if (number1 < number2 && operator == "-") {
                var temp = number1;
                number1 = number2;
                number2 = temp;
            }

            var questionText = number1 + operator + number2;
            var ans = this.findAnswer(questionText);
            var qid = this._prefix + this._qidTracker;
            this._qidTracker++;

            var obj = {
                qText: questionText,
                ans: ans,
                qid: qid,
                answered: false,
                shown: false
            }
            this._allQuestions.push(obj);

        }

        this._totalSeconds = data.timelimit * 60;

    },

    //Make sure there are two question in the currentQuestions array at all time. 

    getQuestion: function() {
        if (_.find(this._allQuestions, function(ques) {
                return ques.answered == false;
            })) {
            if (this._currentQuestions.length < 2) {

                if (this._iterator >= this._allQuestions.length)
                    return undefined;

                var question;
                for (var i = this._iterator; i < this._allQuestions.length; i++) {
                    if (!this._allQuestions[i].answered) {
                        question = this._allQuestions[i];
                        break;
                    } else {
                        continue;
                    }
                }
                if (question) {
                    this._currentQuestions.push(question);
                    this._iterator++;
                    this.updateOptions();
                    if (!question.shown) {
                        question.shown = true;
                        this._totalQuestionsShown++;
                    }
                    return question;
                } else {
                    return undefined;
                }
            } else {
                return "question buffer full";
            }
        } else {
            return undefined;
        }

    },

    //ensure options array always contains answer to the current questions. 
    updateOptions: function() {
        this._currentOptions = this.findAnswerToCurrent();

        var safety = 0;
        while (this._currentOptions.length < this._optionsCount) {

            //pushing some random crap for now
            var num = this.getRandomNumber([10, 99]);
            if (!this._currentOptions.includes(num)) {
                this._currentOptions.push(num);
            }

            safety++;
            if (safety > 100) {
                break;
            }
        }

        // console.log("Final options ", this._currentOptions);
    },

    getOptions: function() {
        return this.shuffle(this._currentOptions);
    },

    evaluateAnswer: function(value) {
        for (var i = 0; i < this._currentQuestions.length; i++) {
            if (this._currentQuestions[i].ans == value) {
                var correct = this._currentQuestions[i];
                this._currentQuestions.splice(i, 1);
                if (!correct.answered) {
                    this.markAnsweredQuestion(correct);
                }

                return correct;
            }
        }
        return undefined;
    },

    markAnsweredQuestion: function(answeredQues) {
        var instance = this;
        _.each(this._allQuestions, function(question, index) {
            if (answeredQues.qid == question.qid) {
                instance._totalQuestionsAnswered++;
                question.answered = true;


            }

        });
    },


    removeCar: function(qid) {
        for (var i = 0; i < this._currentQuestions.length; i++) {

            if (this._currentQuestions[i].qid == qid) {
                this._currentQuestions.splice(i, 1);
            }
        }
    },

    //expects an array of 2 numbers/string
    getRandomNumber: function(range) {
        var min = parseInt(range[0]);
        var max = parseInt(range[1]);
        return min + Math.floor(Math.random() * (max - min));
    },

    findAnswerToCurrent: function() {
        var answers = [];
        for (var i = 0; i < this._currentQuestions.length; i++) {
            answers.push(this.findAnswer(this._currentQuestions[i].qText));
        }

        return answers;
    },

    findAnswer: function(expression) {
        var nums = expression.split("+");
        if (nums.length > 1) {
            return parseInt(nums[0]) + parseInt(nums[1]);
        }
        nums = expression.split("-");
        if (nums.length > 1) {
            return parseInt(nums[0]) - parseInt(nums[1]);
        }
        nums = expression.split("*");
        if (nums.length > 1) {
            return parseInt(nums[0]) * parseInt(nums[1]);
        }
        nums = expression.split("/");
        if (nums.length > 1) {
            //use Math.floor() ?
            var val = parseInt(nums[0]) / parseInt(nums[1]);
            val = val.toFixed(2);
            console.log("val ", val);
            return val;
        }
    },
    shuffle: function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }




};
