# squares.js
A bisecting, treemap-like visualization of tags, all wrapped up in a nice jQuery plugin.

## Installation
Install as you would any other jQuery plugin. Bower support is coming soon™.

## Use
```javascript
// This creates a squares widget for all links in the #squares selector, using sensible defaults.
$('#squares').squares(); 

// This creates a squares widget for all links in the #squares selector, with some passed parameters.
$('#squares').squares({
    colors: ["#778899","LightBlue","rgba(81,81,81,1)"],
    min: 25,
    max: 40,
    ratio: 16/9
});
```

## Options and Defaults
* min: 18
  * Minumum font size.
* max: 80
  * Maximum font size.
* attr: 'weight'
  * Attribute source to gather tag weighting from.
* size: linear_map
  * Function to scale link size from smallest to largest; defaults to a linear mapping.
* unit: 'px'
  * Size to scale elements by.
* colors: [ "#AF0823", "#125FAD", "#613B1E", "#7BBD30", "#CD004A", "#1A207C","#E9401F" ]
  * Array of colors to select backgrounds from.



