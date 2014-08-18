(function ($) {

    var weights;
    var options_global;
    var width_remaining = 100;
    var height_remaining = 100;
    var remaining_total;

    $.fn.cumulo = function (options) {

        options_global = options = $.extend({}, $.fn.cumulo.defaults, options);
        weights = this.map(function(){ return $(this).attr(options.attr); }).get().sort();
       
        weights.total = 0;
        this.map(function(){ weights.total += parseInt($(this).attr(options.attr)) || 0; });
        remaining_total = weights.total

        return this
            .sort(sort_delegate).appendTo(this.parent())
            //.hover(options.mouse_in, options.mouse_out)
            .each(function(index) { 

                var ratio = parseFloat($(this).attr(options_global.attr) 
                    / weights.total).toFixed(2);

                weights.total -= $(this).attr(options_global.attr);

                $(this)
                    .css("font-size", 
                        options.size($(this).attr(options.attr)) + options.unit)
                    .css("border", "4px solid rgba(255,0,255,1)")
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
            })
        ;
    };

    $.fn.cumulo.defaults = {
        min: 20,
        max: 80,
        attr: 'weight',
        size: linear_map,
        sort: descending,
        position: position,
        mouse_in: maximize,
        mouse_out: size_reset,
        unit: "px"
    };

    function maximize(element){
        $(this).css("font-size", options_global.max * 1 + options_global.unit);
    };

    function size_reset(element){
        $(this).css("font-size", options_global.size($(this).attr(options_global.attr)) 
            + options_global.unit);
    };

    function linear_map(weight){
        return (weight - weights[0]) * (options_global.max - options_global.min) 
            / (weights[weights.length - 1] - weights[0]) + options_global.min;
    };

    function ascending(a,b){
        return $(a).attr(options_global.attr) - $(b).attr(options_global.attr);
    };

    function descending(a,b){
        return $(b).attr(options_global.attr) - $(a).attr(options_global.attr);
    };

    function random(a,b){
        //todo
    };

    /* 
     * Fisher Yates Shuffle co-opted from the javascript guru himself, Mike Bostock 
     * http://bost.ocks.org/
     */
    function shuffle(array) {
        
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            
            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        
        return array;
    };

    function unchanged(){};

    function sort_delegate(a,b){
        switch(options_global.sort) {
            case 'asc':
                return ascending(a,b);
                break;
            case 'desc':
                return descending(a,b);
                break;
            case 'unchanged':
                return;
                break;
            case 'shuffle':
                return shuffle();
                break;
            default:
                return options_global.sort(a,b);
        }
    };

    function position(){console.log("position() called");};

}(jQuery));
