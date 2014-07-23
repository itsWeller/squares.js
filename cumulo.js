(function ($) {

    var weights;
    var options_global;

    $.fn.cumulo = function (options) {

        options_global = options = $.extend({}, $.fn.cumulo.defaults, options);
        weights = this.map(function(){ return $(this).attr(options.attr); }).get().sort();

        return this.each(function () {
            $(this).css("font-size", options.size($(this).attr(options.attr)) + options.unit);})
        .sort(sort_delegate).appendTo(this.parent())
        .hover(options.mouse_in, options.mouse_out);
        
    };

    $.fn.cumulo.defaults = {
        min: 20,
        max: 80,
        attr: 'weight',
        size: linear_map,
        sort: unchanged,
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
