# cumulo.js
A customizable, developer-oriented tagcloud solution.

## Installation
Install as you would any other jQuery plugin. Bower support is coming soon™.

## Use
```javascript
// This creates a tagcloud for all links in the #tagcloud selector, using sensible defaults.
$('#tagcloud a').cumulo(); 

// This creates a tagcloud for all links in the #tagcloud selector, with some passed parameters.
$('#tagcloud a').cumulo({min:50, attr:'data', sort:'asc'}); 
```

## Options and Defaults
* min: 20
  * Minumum font size.
* max: 80
  * Maximum font size.
* attr: 'weight'
  * Attribute source to gather tag weighting from.
* size: linear_map
  * Function to scale link size from smallest to largest; defaults to a linear mapping.
* sort: unchanged
  * Function to order elements; defaults to unchanged. 'asc' and 'desc' are included.
* position: position
  * Function to position elements on page; unimplemented. Looking into masonry-style layout.
* mouse_in: maximize,
  * Function to determine action to take on mouse hover. Defaults to maximizing size.
* mouse_out: size reset
  * Function to determine action to take on mouse exit. Defaults to reseting size.
* unit: 'px'
  * Size to scale elements by.



