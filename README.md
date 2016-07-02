# React Isotope Component

## Table of contents

1. [Usage](#usage)

  1. [Basic usage](#basic-usage)
  2. [Custom props](#custom-props)
  3. [Accessing Isotope instance](#accessing-isotope-instance)
  4. [Events](#events)

### Introduction:

A React.js Isotope component.

### Usage:

- The component is bundled with Isotope, so no additional dependencies needed!

- To use the component just require the module.

#### Basic usage

`npm install --save react-isotope-component`

```javascript
import React from 'react';
import Isotope from 'react-isotope-component';

const isotopeOptions = {
    transitionDuration: 0
};

export default class Gallery extends React.Component {
    render ( ) {
        const childElements = this.props.elements.map(
          element => (
            <li className="image-element-class">
                <img src={element.src} />
            </li>
          )
        );

        return (
            <Isotope
                className={'my-gallery-class'} // default ''
                elementType={'ul'}             // default 'div'
                options={isotopeOptions}       // default {}
                disableImagesLoaded={false}    // default false
                updateOnEachImageLoad={false}  // default false and works only if disableImagesLoaded is false
            >
                {childElements}
            </Isotope>
        )
    }
}
```

#### Custom props

You can also include your own custom props - EG: inline-style and event handlers.

```javascript
import React from 'react';
import Isotope from 'react-isotope-component';

const isotopeOptions = {
    transitionDuration: 0
};

const style = {
    backgroundColor: 'tomato'
};


export default class Gallery extends React.Component {
    handleClick ( ) { /* ... */ }

    render ( ) {
        return (
            <Isotope
                className={'my-gallery-class'}
                style={style}
                onClick={e => this.handleClick()}
            >
                {...}
            </Isotope>
        )
    }
}
```

#### Accessing Isotope instance

Should you need to access the instance of Isotope (for example to listen to isotope events) you can do so by using `refs`.

```javascript
 import React from 'react';
 import Isotope from 'react-isotope-component';

 export default class Gallery extends React.Component {
     handleLayoutComplete ( ) { }

     componentDidMount ( ) {
         this.isotope.on( 'layoutComplete', this.handleLayoutComplete );
     }

     componentWillUnmount ( ) {
         this.isotope.off( 'layoutComplete', this.handleLayoutComplete );
     }

     render ( ) {
         return (
             <Isotope
                 ref={c => this.isotope = c.isotope}
             >
                 {...}
             </Isotope>
         )
     }
 }
```

#### Events

- `onImagesLoaded` - triggered when all images are loaded or after each image is loaded when `updateOnEachImageLoad` is set to `true`

```jsx
export default class Gallery extends React.Component {
    componentDidMount ( ) {
        this.hide();
    }

    handleImagesLoaded ( imagesLoadedInstance ) {
        this.show();
    }

    render ( ) {
        return (
            <Isotope
                onImagesLoaded={this.handleImagesLoaded}
            >
                {...}
            </Isotope>
        )
    }
}
```
