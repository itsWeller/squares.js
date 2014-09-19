(function ($) {

    var weights;
    var options_global;
    var width_remaining;
    var height_remaining;
    //var current_visible_page = 0;

    $.fn.squares = function (options) {
        this.each(function(index, element){
            $(element).css('overflow','hidden');
            $(element).data('current-page',0);
           
            // Custodial business.
            options_global = options = $.extend({}, $.fn.squares.defaults, options);

            // Randomize color orders if desired.
            if (options_global.random_color_order) {
                shuffleArray(options_global.colors);
            }

            // Calculating percentage left of div; should be better way?
            height_remaining = width_remaining = 100;   

            // Set height of primary square container to be some ratio of the parent's width and supplied dimension.
            // Something's busted here. Remember to fix this.
            // $(element).css("height", parseInt($(element).parent().css("width"))/options_global.ratio + "px");
            // $(element).css("height",$(element).parent().css("height"));

            // Rearrange elements in div.
            var sorted_elems = $(this).find('a').sort(weight_descending);
            $(this).find('a').remove();
            $(this).append(sorted_elems);

            // If pagination's desired...
            if (options_global.more_link) {
                var more_index = options_global.page_limit - 2;
                var shift_count = 0;
            
                // Begin insertion of 'More...' elements.
                while (more_index + shift_count < $(element).find('a').length - 1) {
                
                    var insertion_index = more_index + shift_count;

                    // Build 'More' element.
                    $('<a weight=' + parseInt($($(element).find('a')[insertion_index]).attr(options_global.attr)) + 
                            '>More..</a>').insertAfter($($(element).find('a')[insertion_index]));

/*                  Animation is still a WIP.
 *
 *                  ).click(function(){
 *                      //$(element).find('.page-'+current_visible_page++).slideUp();
 *                      $(element).find('.page-'+$(element).data('current-page')).slideUp();
 *                      $(element).data()['current-page']++;
 *                  });
 */
                    more_index += options_global.page_limit - 1;
                    shift_count++;
                }
            }

            // Find weights of elements in div. 
            weights = $(this).find('a').map(function(index){ 
                return parseInt($(this).attr(options.attr)); 
            }).get(); 

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
                    height_remaining = width_remaining = 100;   
                    ++page_index; 
                }

                if (page_index >= options_global.page_count_limit){     // Hack to stop before limit.
                    return false;
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

                if (options_global.more_link){
                   // $(element).data('page', page_index);
                   // $(element).addClass('page-'+page_index);
                }

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

                // TEXT RESIZE HACK: Taken shamelessly from 
                // http://stackoverflow.com/questions/2652372/how-to-get-anchor-text-href-on-click-using-jquery
                var width = $(element).width(),
                    html = '<span style="white-space:nowrap"></span>',
                    line = $( element ).wrapInner( html ).children()[ 0 ],
                    n = options_global.max;

                    $( element ).css( 'font-size', n );

                    while ( $( line ).width() > width ) {
                        $( element ).css( 'font-size', --n );
                    }

                    $( element ).text( $( line ).text() );
                // End shameful content. 

                
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
        page_count_limit: 1,
        squares_height: 180,
        more_link: false,
        random_color_order: false,
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
