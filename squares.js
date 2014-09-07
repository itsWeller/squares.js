(function ($) {

    var weights;
    var options_global;
    var width_remaining;
    var height_remaining;

    $.fn.squares = function (options) {
        this.each(function(index, element){
           
            // Custodial business.
            options_global = options = $.extend({}, $.fn.squares.defaults, options);
            shuffleArray(options_global.colors);

            // Calculating percentage left of div; should be better way?
            height_remaining = width_remaining = 100;   

            // Set height of primary square container to be some ratio of the parent's width and supplied dimension.
            $(this).css("height", parseInt($(this).parent().css("width"))/options_global.ratio + "px");

            // Rearrange elements in div.
            var sorted_elems = $(this).find('a').sort(weight_descending);
            $(this).find('a').remove();
            $(this).append(sorted_elems);

            // Find weights of elements in div. 
            weights = $(this).find('a').map(function(){ return parseInt($(this).attr(options.attr)); }).get(); 
            console.log(weights);
            
            // Weight calculations.
            var page_index = 0;
            weights.total = 0;
            weights.total_for_page = [0];

            // Determine weight totals per-page.
            $(weights).each(function(index){
                var current_weight = parseInt(this);

                // Time to move on to next page.
                while (index >= options_global.page_limit * (page_index + 1)) { 
                    weights.total_for_page.push(0);
                    ++page_index; 
                }

                // Update totals.
                weights.total_for_page[page_index] += current_weight;
                weights.total += current_weight;
            });

            // Arrange weights for font size sorting.
            weights = weights.sort(ascending);
            page_index = 0;

            // Begin sub-square calculations.
            $(this).find('a').each(function(index, element) { 

                // Once again, time to jump pages.
                while (index >= options_global.page_limit * (page_index + 1)) { 
                    // ADD IN 'MORE...' ELEMENT
                    height_remaining = width_remaining = 100;   
                    ++page_index; 
                }

                // Determine size of sub-square in relation to rest. Percision errors here.
                var ratio = parseFloat($(this).attr(options_global.attr) 
                    / weights.total_for_page[page_index]).toFixed(2);

                weights.total -= $(this).attr(options_global.attr);
                weights.total_for_page[page_index] -= $(this).attr(options_global.attr);

                $(this)
                    // If on other page, make hidden?
                    .css("font-size", 
                        options.size($(this).attr(options.attr)) + options.unit)    // Call sizing function with specified attr and append unit.
                    .css("background-color", options_global.colors[index % options_global.colors.length])
                    .css("color","white")
                    .css("display","inline-block")
                    .css("float", "left")
                    .css("text-align", "center")
                ;

                // Slice should be horizontal.
                if (! (index % 2) ) {        
                    $(this)
                        .css("width",  width_remaining + "%")
                        .css("height", height_remaining * ratio + "%");

                    height_remaining = height_remaining - (height_remaining * ratio) || 100; 

                // Slice should be vertical.
                } else {                    
                    $(this)
                        .css("height",  height_remaining + "%")
                        .css("width",   width_remaining * ratio + "%");

                    width_remaining  = width_remaining - (width_remaining * ratio) || 100; 
                }
                
                // Center text vertically in sub-square.
                $(this).css("line-height", $(this).height()+"px");  
            });
        });

        // Return called elements, because jQuery's made for chaining.
        return this;
    };

    $.fn.squares.defaults = {
        ratio: 4/3,
        min: 18,
        max: 80,
        attr: 'weight',
        size: linear_map,
        unit: "px",
        page_limit: 5,
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

    function weight_descending(a,b){
        return $(b).attr(options_global.attr) - $(a).attr(options_global.attr);
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
