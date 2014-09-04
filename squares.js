(function ($) {

    var weights;
    var options_global;
    var width_remaining;
    var height_remaining;

    $.fn.squares = function (options) {
        this.each(function(index, element){

            height_remaining = width_remaining = 100;

            options_global = options = $.extend({}, $.fn.squares.defaults, options);
            weights = $(this).find('a').map(function(){ return parseInt($(this).attr(options.attr)); }).get().sort(ascending);
       
            weights.total = 0;
            $(this).find('a').map(function(){ weights.total += parseInt($(this).attr(options.attr)) || 0; });

            shuffleArray(options_global.colors);
            $(this).css("height", parseInt($(this).parent().parent().css("width"))/options_global.ratio + "px");

            $(this).find('a')
                .sort(descending).appendTo(this)
                .each(function(index) { 

                    var ratio = parseFloat($(this).attr(options_global.attr) 
                        / weights.total).toFixed(2);

                    weights.total -= $(this).attr(options_global.attr);

                    $(this)
                        .css("font-size", 
                            options.size($(this).attr(options.attr)) + options.unit)
                        .css("background-color", options_global.colors[index % options_global.colors.length])
                        .css("color","white")
                        .css("display","inline-block")
                        .css("float", "left")
                        .css("text-align", "center")
                    ;

                    if (! (index % 2) ) {                        // Should slice horizontal
                        $(this)
                            .css("width",  width_remaining + "%")
                            .css("height", height_remaining * ratio + "%");

                        height_remaining = height_remaining - (height_remaining * ratio) || 100; 

                    } else {                                // Should slice vertical
                        $(this)
                            .css("height",  height_remaining + "%")
                            .css("width",   width_remaining * ratio + "%");

                        width_remaining  = width_remaining - (width_remaining * ratio) || 100; 
                    }

                    $(this).css("line-height",$(this).height()+"px");
                })
            ; 
        });

        return this;
    };

    $.fn.squares.defaults = {
        ratio: 4/3,
        min: 18,
        max: 80,
        attr: 'weight',
        size: linear_map,
        unit: "px",
        colors: [
            "#AF0823",
            "#125FAD",
            "#613B1E",
            "#7BBD30",
            "#CD004A",
            "#1A207C",
            "#E9401F"
        ]
    };

    function linear_map(weight){
        return (weight - weights[0]) * (options_global.max - options_global.min) 
            / (weights[weights.length - 1] - weights[0]) + options_global.min;
    };

    function descending(a,b){
        return b - a;
    };

    function ascending(a,b){
        return a - b;
    };

    /** 
     * TAKEN FROM http://stackoverflow.com/a/12646864 
     *
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

}(jQuery));
